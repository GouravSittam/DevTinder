const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId({ userId, targetUserId });
      console.log(firstName + " Joined Room: " + roomId);
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
          io.to(roomId).emit("messageReceived", { firstName, lastName, text, timestamp: new Date() });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initilizeSocket;
