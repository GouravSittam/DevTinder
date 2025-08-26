import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addConnections } from "../utils/connectionSlice";
import { Calculator, Loader2, Signal } from "lucide-react";
import { formatDistanceToNow, set } from "date-fns";
import {
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaMicrophone,
  FaVideo,
  FaVideoSlash,
  FaMicrophoneSlash,
  FaPhoneSlash,
} from "react-icons/fa";
import Peer from "simple-peer";
import SocketContext from "../utils/SocketContext";


const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = user?._id;
  const targetUser = connections?.find((conn) => conn._id === targetUserId);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const lastMessageRef = useRef(null);
  const socket = useContext(SocketContext);

  // ✅ Use a ref for the stream to avoid stale closures
  const streamRef = useRef(null); 

  // You can keep a state just to know IF a stream exists, to trigger UI updates
  const [hasStream, setHasStream] = useState(false); 

  const myVideo = useRef(null);
  // const [me, setMe] = useState("");
  const connectionRef = useRef(); // current user peer ref

  // creating UserState to store Avi data who is a caller and this is sam side who is a Reciever
  // const [recieveCall, setRecieveCall] = useState(false);
  // const [callerDetails, setCallerDetails] = useState(null);
  // const [callerSignal, setCallerSignal] = useState(null);
  // const [callAccepted, setCallAccepted] = useState(false);

  const receiverVideo = useRef(null); // receiver video ref

  // Rejected call state
  const [callRejectedPopUp, setCallRejectedPopUp] = useState(false);
  const [callRejectedUser, setCallRejectedUser] = useState(null);

  // Call accepted state for receiving the receiver video
  const [callAccepted, setCallAccepted] = useState(false);
  const [callerDetails, setCallerDetails] = useState(null);


  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

    // ✅ This effect will correctly attach the stream AFTER the component re-renders
  useEffect(() => {
    if (hasStream && myVideo.current && streamRef.current) {
      myVideo.current.srcObject = streamRef.current;
    }
  }, [hasStream]); // This runs whenever `hasStream` changes

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     if (!connections || connections.length === 0) {
  //       await axios
  //         .get(BASE_URL + "/user/connections", { withCredentials: true })
  //         .then((res) => {
  //           dispatch(addConnections(res?.data?.data));
  //         });
  //     }
  //     await fetchChatMessages();
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // ✅ Always fetch the latest connections data when the chat opens
        const connectionsResponse = await axios.get(
          BASE_URL + "/user/connections",
          { withCredentials: true }
        );
        if (connectionsResponse.data.data) {
          dispatch(addConnections(connectionsResponse.data.data));
        }

        // Then fetch the chat messages for this user
        await fetchChatMessages();
      } catch (error) {
        console.error("Failed to fetch chat data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (targetUserId) {
      fetchData();
    }
    // ✅ Re-run this effect whenever the user you are chatting with changes
  }, [targetUserId, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (!socket) return;

    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId,
    });

    // socket.on("me", (socketId) => {
    //   setMe(socketId);
    // });

    const handleMessageReceived = ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    };
    socket.on("messageReceived", handleMessageReceived);

    const handleUserTyping = ({ userId, isTyping }) => {
      if (userId === targetUserId) {
        setIsTyping(isTyping);
      }
    };
    socket.on("userTyping", handleUserTyping);

    // Disconnect the socket  after use / Don't leave without disconnecting
    return () => {
      socket.off("messageReceived", handleMessageReceived);
      socket.off("userTyping", handleUserTyping);
    };
  }, [userId, targetUserId, socket]);

  // ✅ This effect handles attaching the stream to the video element
  // useEffect(() => {
  //   if (stream && myVideo.current) {
  //     myVideo.current.srcObject = stream;
  //   }
  // }, [stream]); // This dependency ensures the effect runs only when the stream state changes

  // ✅ Centralize all socket listeners here
  useEffect(() => {
    if (!socket) return;

    // Listener for when the other user accepts the call
    const handleCallAccepted = (data) => {
      setCallRejectedPopUp(false);
      setCallAccepted(true);
      setCallerDetails(data.from);
      if (connectionRef.current) {
        connectionRef.current.signal(data.signalData);
      }
    };

    // Listener for when the other user rejects the call
    const handleCallRejected = ({ name, profilepic }) => {
      // You might want to clean up the stream here as well
      setStream(null);
      setCallRejectedPopUp(true);
      setCallRejectedUser({ name, profilepic });
    };

    socket.on("callAccepted", handleCallAccepted);
    socket.on("callRejected", handleCallRejected);

    // ✅ Add the listener for when the other user ends the call
    const handleCallEnded = () => {
      // We call the same cleanup function used by the hang-up button
      endCallCleanup();
    };

    socket.on("callEnded", handleCallEnded);

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      socket.off("callAccepted", handleCallAccepted);
      socket.off("callRejected", handleCallRejected);
      socket.off("callEnded", handleCallEnded);
    };
  }, [socket]); // Dependency on socket ensures this runs when the socket is ready

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  const sendMessage = () => {
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

  const startCall = async () => {
    try {
      const currStream = await navigator.mediaDevices.getUserMedia({
        // audio: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: true,
      });
      // setStream(currStream);

      streamRef.current = currStream;
      setHasStream(true);

      if (myVideo.current) {
        myVideo.current.srcObject = currStream;
        myVideo.current.muted = true; // Mute the local video by default
        myVideo.current.volume = 0; // Set volume to 0
      }

      currStream.getAudioTracks().forEach((track) => {
        track.enabled = true; // Enable audio track
      });

      if (currStream) {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: currStream,
        });

        // ✅ Handle the "signal" event (this occurs when the WebRTC handshake is initiated)
        peer.on("signal", (data) => {
          socket.emit("callToUser", {
            callToUserId: targetUserId, // ✅ ID of the user being called
            signalData: data, // ✅ WebRTC signal data required for establishing connection
            from: socket.id, // ✅ socket ID of the caller
            name: user.firstName + " " + user.lastName, // ✅ Caller’s name
            email: user.emailId, // ✅ Caller’s email
            profilepic: user.photoURL, // ✅ Caller’s profile picture
          });
        });

        // // Rejected call
        // socket.on("callRejected", ({ name, profilepic }) => {
        //   setCallRejectedPopUp(true);
        //   setCallRejectedUser({ name, profilepic });
        // });

        // listening for incoming video stream from server to receiver
        peer.on("stream", (remoteStream) => {
          if (receiverVideo.current) {
            receiverVideo.current.srcObject = remoteStream; // Set the receiver video stream
            receiverVideo.current.muted = false; // Unmute the receiver video
            receiverVideo.current.volume = 1.0; // Set volume to 1
          }
        });

        // ✅ Store the peer connection reference to manage later (like ending the call)
        connectionRef.current = peer; // Store the peer connection for later use
        // setCallRejectedPopUp(false);
      } else {
        alert(
          "Unable to access camera and microphone. Please check your permissions."
        );
      }
    } catch (error) {
      alert(
        "Error accessing media devices. Please allow camera and microphone permissions."
      );
      console.log("error accessing media devices", error);
    }
  };

  // ✅ End call cleanup logic
const endCallCleanup = () => {
  // 1. Stop all media tracks (camera + mic)
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
  }

  // 2. Destroy peer connection
  if (connectionRef.current) {
    connectionRef.current.destroy();
  }

    // Reset state
  setHasStream(false);
  streamRef.current = null;
  setCallAccepted(false);
  setCallerDetails(null);
  connectionRef.current = null;

};

  // ✅ New function for the user clicking the hang-up button
  const hangUpCall = () => {
    // First, notify the other user that the call is ending
    if (callerDetails) { // callerDetails holds the callee's socket ID
      socket.emit("endCall", { to: callerDetails });
    }
    // Then, perform the local cleanup
    endCallCleanup();
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
        <span
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></span>
        <span
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></span>
        <span
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></span>
      </div>
    );
  };

  return (
    <div className="w-9/10 sm:w-1/2 h-[70vh] mx-auto m-7 border rounded-sm border-gray-600 flex flex-col ">
      {/* Header */}
      <div className="bg-gray-800 flex  items-center justify-between text-white rounded-t-sm border-b border-gray-600 px-4 py-3 gap-3 sm:gap-2 w-full">
        {/* Avatar */}
        <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-700 flex items-center justify-center">
          {targetUser?.photoURL ? (
            <img
              src={targetUser?.photoURL}
              alt={`${targetUser?.firstName} ${targetUser?.lastName}`}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-sm sm:text-lg md:text-xl font-bold">
              {targetUser?.firstName?.charAt(0)}
              {targetUser?.lastName?.charAt(0)}
            </span>
          )}
        </div>

        {/* Name + Status */}
        <div className="flex flex-col sm:flex-row sm:items-center w-full text-center sm:text-left">
          <h3 className="text-sm sm:text-xl lg:text-2xl font-bold truncate">
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
        {/* WebRTC Calls Buttons */}
        <div className="flex items-center space-x-2 mt-2 sm:mt-0 ml-auto flex-shrink-0">
          <button
            className="p-2 lg:p-4 cursor-pointer rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={startCall}
          >
            <FaVideo className="text-white" />
          </button>
          {/* <button className="p-2 lg:p-4 cursor-pointer rounded-full bg-gray-700 hover:bg-gray-600">
            <FaVideo className="text-white" />
          </button> */}
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
            setNewMessage(e.target.value);
            socket.emit("typing", { userId, isTyping: true });
            // emit false if input is cleared
            if (e.target.value === "") {
              socket.emit("typing", { userId, isTyping: false });
            }
          }}
        />
        <button onClick={sendMessage} className="btn bg-primary p-5">
          Send
        </button>
      </div>

      {/* --- ADD THE NEW VIDEO CALL OVERLAY HERE --- */}
      {hasStream && (
        <div className="absolute inset-0 bg-black z-100 flex flex-col justify-between text-white">
          {/* Background: Shows blurred user photo before call is accepted */}
          {!callAccepted && (
            <>
              <img
                src={targetUser?.photoURL || "/default-avatar.png"}
                alt="User background"
                className="absolute inset-0 w-full h-full object-contain blur-md z-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/50 z-0"></div>
            </>
          )}

          {/* Remote Video - shows only when call is accepted */}
          {callAccepted && (
            <video
              ref={receiverVideo}
              autoPlay
              playsInline
              className="absolute top-0 left-0 w-full h-full object-contain z-0"
            />
          )}

          {/* UI Overlays for better text visibility */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Header with Target User Info */}
          <div className="relative z-10 p-4 flex items-center space-x-3">
            <img
              src={targetUser?.photoURL || "/default-avatar.png"}
              alt="Target User"
              className="w-10 h-10 rounded-full border-2 border-white"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-bold">
                {targetUser?.firstName} {targetUser?.lastName}
              </h3>
              <p className="text-sm text-gray-300">
                {callAccepted ? "Connected" : "Calling..."}
              </p>
            </div>
          </div>

          {/* Local Video (PiP) - always shows when your stream is active */}
          <div className="absolute top-5 right-5 w-28 h-40 md:w-32 md:h-48 bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-gray-600 z-20">
            <video
              ref={myVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Call Controls at the bottom */}
          <div className="relative z-10 p-4 flex justify-center items-center space-x-6">
            <button
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? (
                <FaMicrophoneSlash size={24} onClick={toggleMute} />
              ) : (
                <FaMicrophone size={24} onClick={toggleMute} />
              )}
            </button>
            <button
              onClick={hangUpCall}
              className="bg-red-600 hover:bg-red-700 p-4 rounded-full text-white transition-all"
              aria-label="Hang up"
            >
              <FaPhoneSlash size={28} />
            </button>
            <button
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
              onClick={toggleVideo}
            >
              {isVideoOff ? (
                <FaVideoSlash size={24} onClick={toggleVideo} />
              ) : (
                <FaVideo size={24} onClick={toggleVideo} />
              )}
            </button>
          </div>
        </div>
      )}

      {callRejectedPopUp && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 transition-colors duration-200">
            <div className="flex flex-col items-center">
              <p className="font-black text-xl mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                Call Rejected From...
              </p>
              <img
                src={callRejectedUser.profilepic || "/default-avatar.png"}
                alt="Caller"
                className="w-20 h-20 rounded-full border-4 border-green-500"
              />
              <h3 className="text-lg font-bold mt-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                {callRejectedUser.name}
              </h3>
              <div className="flex gap-4 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setCallRejectedPopUp(false);
                    setCallRejectedUser(null);
                    startCall();
                  }}
                  className="bg-green-500 text-white px-4 py-1 rounded-lg w-28 flex gap-2 justify-center items-center"
                >
                  Call Again <FaPhoneAlt />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCallRejectedPopUp(false);
                    setCallRejectedUser(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg w-28 flex gap-2 justify-center items-center"
                >
                  Back <FaPhoneSlash />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
