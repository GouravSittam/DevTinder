"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import {
  Menu,
  X,
  Code,
  LogOut,
  User,
  Users,
  Bell,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../utils/theme-context";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [newRequestsCount, setNewRequestsCount] = useState(0); // Track new requests count
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

  // Fetch requests periodically
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(BASE_URL + "/user/request/received", {
          withCredentials: true,
        });
        const requests = response.data?.data || [];
        setNewRequestsCount(requests.length); // Set the count of new requests
      } catch (err) {
        console.log("Error fetching requests:", err);
      }
    };

    fetchRequests();

    // Poll for new requests every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleRequestsClick = () => {
    setNewRequestsCount(0); // Clear the notification count when "Requests" is clicked
  };

  return (
    <nav className="nav-container">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg">
                <Code className="h-6 w-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                DevTinder
              </span>
              <span className="text-[10px] font-medium text-gray-500 -mt-1 tracking-wider uppercase">
                Connect • Build • Grow
              </span>
            </div>
          </Link>

          {user && (
            <>
              {/* Desktop menu */}
              <div className="hidden md:flex items-center gap-8">
                {/* Navigation Links */}
                <div className="flex items-center gap-2">
                  <Link
                    to="/"
                    className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Feed</span>
                  </Link>

                  <Link
                    to="/connections"
                    className={`nav-link ${isActive("/connections") ? "nav-link-active" : ""}`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Connections</span>
                  </Link>

                  <Link
                    to="/requests"
                    onClick={() => setNewRequestsCount(0)}
                    className={`nav-link ${isActive("/requests") ? "nav-link-active" : ""}`}
                  >
                    <Bell className="h-4 w-4" />
                    <span>Requests</span>
                    {newRequestsCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-pink-500 to-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-gray-900 shadow-lg animate-pulse">
                        {newRequestsCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/profile"
                    className={`nav-link ${isActive("/profile") ? "nav-link-active" : ""}`}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </div>

                {/* User Section */}
                <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                  <span className="text-sm font-medium text-gray-400">
                    {user?.firstName}
                  </span>

                  <div className="relative">
                    <details className="dropdown">
                      <summary className="flex items-center cursor-pointer list-none group">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                          <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  {user.firstName?.charAt(0)}
                                  {user.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </summary>

                      <ul className="menu absolute right-0 mt-3 w-52 p-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
                        <li>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                          </button>
                        </li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden items-center">
                <button
                  onClick={toggleMenu}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && user && (
        <div className="md:hidden absolute top-20 left-0 right-0 mx-4 mb-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-40 animate-fadeIn">
          {/* User Profile Header */}
          <div className="flex items-center gap-4 p-6 border-b border-white/5 bg-gradient-to-br from-purple-500/10 to-indigo-600/10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur opacity-40"></div>
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-white truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-400 truncate">
                {user.emailId}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-2">
            <Link
              to="/"
              onClick={closeMenu}
              className={`nav-link ${isActive("/") ? "nav-link-active" : ""} w-full justify-start`}
            >
              <Home className="h-5 w-5" />
              <span>Feed</span>
            </Link>

            <Link
              to="/connections"
              onClick={closeMenu}
              className={`nav-link ${isActive("/connections") ? "nav-link-active" : ""} w-full justify-start`}
            >
              <Users className="h-5 w-5" />
              <span>Connections</span>
            </Link>

            <Link
              to="/requests"
              onClick={() => {
                setNewRequestsCount(0);
                closeMenu();
              }}
              className={`nav-link ${isActive("/requests") ? "nav-link-active" : ""} w-full justify-start`}
            >
              <Bell className="h-5 w-5" />
              <span>Requests</span>
              {newRequestsCount > 0 && (
                <span className="ml-auto h-6 w-6 bg-gradient-to-br from-pink-500 to-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-lg">
                  {newRequestsCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              onClick={closeMenu}
              className={`nav-link ${isActive("/profile") ? "nav-link-active" : ""} w-full justify-start`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
