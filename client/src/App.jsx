import { useEffect } from "react";
import { useLocation, BrowserRouter, Route, Routes } from "react-router-dom";
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
  }, [userId]);

  return (
    <>
      <BrowserRouter basename="/">
        <GoogleAnalytics />
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path='/feed' element={<Feed />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
