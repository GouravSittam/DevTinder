import { createContext, useRef, useState } from "react";
import { useDispatch } from "react-redux";

const socketContext = createContext(null);

const socketProvider = ({ userId, children }) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  // creating UserState to store Avi data who is a caller and this is sam side who is a Reciever
  const [recievingCall, setRecievingCall] = useState(false);
  const [callerDetails, setCallerDetails] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();

    // Notify server this user is online
    socket.emit("userOnline", { userId });

    // Listen for user status update
    socket.on("updateUserStatus", (users) => {
      dispatch(setOnlineUsers(users)); // Store the array in Redux
    });

    // Receiving a call from another user who is calling
    socket.on(
      "incomingCall",
      ({ signalData, from, name, email, profilepic }) => {
        setRecievingCall(true);
        setCallerDetails({ from, name, email, profilepic });
        setCallerSignal(signalData);
      }
    );

    // Emit offline on tab close/refresh
    const handleOffline = () => {
      socket.emit("userOffline", { userId });
    };
    window.addEventListener("beforeunload", handleOffline);

    // Disconnect the socket  after use / Don't leave without disconnecting
    return () => {
      window.removeEventListener("beforeunload", handleOffline);
      socket.emit("userOffline", { userId }); // Tell server you're offline
      socket.disconnect();
    };
  }, [userId, dispatch]);

  return (
    <socketContext.Provider value={socketRef}>
      {children}
    </socketContext.Provider>
  );
};

export default socketProvider;
