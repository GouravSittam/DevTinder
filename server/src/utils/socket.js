const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const onlineUsers = new Map();

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    // listen for user online event
    socket.on("userOnline", ({ userId }) => {
      onlineUsers.set(userId, socket.id);
      io.emit("updateUserStatus", Array.from(onlineUsers.keys()));
    });

    // Listen for user offline event (on disconnect)
    socket.on("userOffline", ({ userId }) => {
      onlineUsers.delete(userId);
      io.emit("updateUserStatus", Array.from(onlineUsers.keys()));
    });

    // Listen for typing event
    socket.on("typing", ({ userId, isTyping }) => {
      socket.broadcast.emit("userTyping", { userId, isTyping });
    });

    // Handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId({ userId, targetUserId });
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save message to the database
        try {
          const roomId = getSecretRoomId({ userId, targetUserId });
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            timestamp: new Date(),
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initilizeSocket;
