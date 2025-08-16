import React, { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addConnections } from "../utils/connectionSlice";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = user?._id;
  const targetUser = connections?.find((conn) => conn._id === targetUserId);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const lastMessageRef = useRef(null);

  const fetchChatMessages = async (req, res) => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text, createdAt } = msg;
      const timeAgo = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
      });
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text: text,
        timeAgo,
      };
    });

    setMessages(chatMessages);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!connections || connections.length === 0) {
        await axios
          .get(BASE_URL + "/user/connections", { withCredentials: true })
          .then((res) => {
            dispatch(addConnections(res?.data?.data));
          });
      }
      await fetchChatMessages();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();

    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    // Listen for Typing event
    socket.on("userTyping", ({ userId, isTyping }) => {
      if (userId === targetUserId) {
        setIsTyping(isTyping);
      }
    });

    // Disconnect the socket  after use / Don't leave without disconnecting
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
    socket.emit("typing", { userId, isTyping: false });
  };

  // Scroll to the last message when new message is added
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
  };

  if (isLoading || !targetUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full">
        <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin mb-4 transition-colors duration-200" />
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Loading chat...
        </h2>
      </div>
    );
  }

  const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
    </div>
  );
};

  return (
    <div className="w-9/10 sm:w-1/2 h-[70vh] mx-auto m-7 border rounded-sm border-gray-600 flex flex-col ">
      {/* Header */}
      <div className="bg-gray-800 flex flex-col sm:flex-row items-center sm:items-center sm:justify-start justify-center text-white rounded-t-sm border-b border-gray-600 px-4 py-3 gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-700 flex items-center justify-center">
          {targetUser?.photoURL ? (
            <img
              src={targetUser.photoURL}
              alt={`${targetUser?.firstName} ${targetUser?.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm sm:text-lg md:text-xl font-bold">
              {targetUser?.firstName?.charAt(0)}
              {targetUser?.lastName?.charAt(0)}
            </span>
          )}
        </div>

        {/* Name + Status */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center w-full text-center sm:text-left">
          <h3 className="text-sm sm:text-xl md:text-2xl font-bold truncate">
            {targetUser?.firstName + " " + targetUser?.lastName}
          </h3>
          <div
            className="flex items-center justify-center sm:justify-start sm:ml-2 mt-1 sm:mt-0"
            title={onlineUsers.includes(targetUserId) ? "Online" : "Offline"}
          >
            <span
              className={
                "inline-block w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full " +
                (onlineUsers.includes(targetUserId)
                  ? "bg-green-400"
                  : "bg-gray-400")
              }
            ></span>
            <span className="ml-1 text-xs sm:text-sm text-gray-400">
              {onlineUsers.includes(targetUserId) ? "Online" : "Offline"}
            </span>
          </div>
        </div> */}
        {/* Name + Status */}
<div className="flex flex-col sm:flex-row sm:items-center w-full text-center sm:text-left">
  <h3 className="text-sm sm:text-xl md:text-2xl font-bold truncate">
    {targetUser?.firstName + " " + targetUser?.lastName}
  </h3>
  <div
    className="flex items-center justify-center sm:justify-start sm:ml-2 mt-1 sm:mt-0"
    title={onlineUsers.includes(targetUserId) ? "Online" : "Offline"}
  >
    <span
      className={
        "inline-block w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full " +
        (onlineUsers.includes(targetUserId)
          ? "bg-green-400"
          : "bg-gray-400")
      }
    ></span>
    <span className="ml-1 text-xs sm:text-sm text-gray-400">
      {onlineUsers.includes(targetUserId) ? "Online" : "Offline"}
    </span>
    {isTyping && (
      <span className="ml-2">
        <TypingIndicator />
      </span>
    )}
  </div>
</div>
      </div>

      <div className="flex-1 overflow-y-scroll">
        {/* display messages */}
        {messages.map((msg, index) => {
          const isLatest = index === messages.length - 1;
          return (
            <div key={index} ref={isLatest ? lastMessageRef : null}>
              <div
                className={
                  "chat " +
                  (user?.firstName == msg?.firstName
                    ? "chat-end"
                    : "chat-start")
                }
              >
                <div className="chat-header">
                  {`${msg?.firstName} ${msg?.lastName}`}
                  <time className="text-xs opacity-50">{msg?.timeAgo}</time>
                </div>
                <div className="chat-bubble">{msg?.text}</div>
                <div className="chat-footer opacity-50">Seen</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full p-5 border-t justify-center items-center gap-3 border-gray-600 flex ">
        <input
          className="input w-full border border-gray-600"
          value={newMessage}
          onChange={(e) => {
            const socket = createSocketConnection();
            setNewMessage(e.target.value);
            socket.emit("typing", { userId, isTyping: true });
            // emit false if input is cleared
            if(e.target.value === "") {
              socket.emit("typing", { userId, isTyping: false });
            }
          }}
        />
        <button onClick={sendMessage} className="btn bg-primary p-5">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
