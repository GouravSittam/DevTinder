import { createContext, useEffect, useRef, useState } from "react";
import {
  useLocation,
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Body from "./components/Body";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
import { setOnlineUsers } from "./utils/onlineUsers";
import { createSocketConnection } from "./utils/socket";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import IncomingCallNotification from "./components/IncomingCallNotification";
// import socketProvider from "./components/socketProvider";
import SocketContext from "./utils/SocketContext";

function GoogleAnalytics() {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-SVFF278VQ9", {
        page_path: location.pathname,
      });
    }
  }, [location]);
  return null;
}

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const [googleClientId, setGoogleClientId] = useState("");
  const [socket, setSocket] = useState();

  // creating UserState to store Avi data who is a caller and this is sam side who is a Reciever
  const [recievingCall, setRecievingCall] = useState(false);
  const [callerDetails, setCallerDetails] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  useEffect(() => {
    const fetchGoogleClientId = async () => {
      try {
        const response = await axios.get(BASE_URL + "/config/google-client-id");
        setGoogleClientId(response.data.clientId);
      } catch (error) {
        console.error("Failed to fetch Google Client ID:", error);
        // Set a default or empty string to allow app to render
        setGoogleClientId("default");
      }
    };
    fetchGoogleClientId();
    if (!userId) {
      return;
    }
    const s = createSocketConnection();
    setSocket(s);

    // Notify server this user is online
    s.emit("userOnline", { userId });

    // Listen for user status update
    s.on("updateUserStatus", (users) => {
      dispatch(setOnlineUsers(users)); // Store the array in Redux
    });

    // Receiving a call from another user who is calling
    s.on("incomingCall", ({ signalData, from, name, email, profilepic }) => {
      setRecievingCall(true);
      setCallerDetails({ from, name, email, profilepic });
      setCallerSignal(signalData);
    });

    // Emit offline on tab close/refresh
    const handleOffline = () => {
      s.emit("userOffline", { userId });
    };
    window.addEventListener("beforeunload", handleOffline);

    // Disconnect the socket  after use / Don't leave without disconnecting
    return () => {
      window.removeEventListener("beforeunload", handleOffline);
      s.emit("userOffline", { userId }); // Tell server you're offline
      s.disconnect();
    };
  }, [userId]);

  // Show loading while fetching Google Client ID
  if (!googleClientId) {
    return (
      <div className="min-h-screen bg-[#0F0518] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter basename="/">
          <GoogleAnalytics />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Body />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
            </Route>
          </Routes>

          {/* This notification can stay here, it depends on its own state */}
          {recievingCall && (
            <IncomingCallNotification
              callerDetails={callerDetails}
              setCallAccepted={setCallAccepted}
              setRecievingCall={setRecievingCall}
              setCallerDetails={setCallerDetails}
              socket={socket}
              callerSignal={callerSignal}
              callAccepted={callAccepted}
            />
          )}
        </BrowserRouter>
      </SocketContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
