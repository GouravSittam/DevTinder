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
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-1.5 rounded">
                <Code className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                DevConnects
              </span>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/")
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Home className="h-4 w-4" />
                      <span>Feed</span>
                    </div>
                  </Link>

                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/profile")
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </Link>

                  <Link
                    to="/connections"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/connections")
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>Connections</span>
                    </div>
                  </Link>

                  {/* <Link
                    to="/requests"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/requests")
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Bell className="h-4 w-4" />
                      <span>Requests</span>
                    </div>
                  </Link> */}

                  <Link
                    to="/requests"
                    onClick={() => {
                      setNewRequestsCount(0); // Clear the notification count when "Requests" is clicked
                    }}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/requests")
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Bell className="h-4 w-4" />
                      <span>Requests</span>
                      {newRequestsCount > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                          {newRequestsCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>

                <div className="flex items-center ml-4 space-x-2">
                  {/* Theme toggle button */}
                  {/* <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={
                      theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button> */}

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Hi, {user?.firstName}
                  </span>
                  {/* <div className="relative group">
                    <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                      <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL || "/placeholder.svg"}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {user.firstName?.charAt(0)}
                              {user.lastName?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block transition-colors duration-200">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>



                  </div> */}

                  <div className="relative">
                    <details className="dropdown">
                      <summary className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 list-none cursor-pointer">
                        <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL || "/placeholder.svg"}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {user.firstName?.charAt(0)}
                                {user.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </summary>

                      <ul
                        tabIndex={0}
                        className="menu menu-sm absolute right-0 mt-3 w-52 p-2 shadow bg-base-100 rounded-box z-50"
                      >
                        <li>
                          <button
                            onClick={handleLogout}
                            className="text-left w-full"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden items-center space-x-2">
                {/* Theme toggle button */}
                {/* <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button> */}

                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors duration-200"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && user && (
        <div className="md:hidden">
          <div className="absolute top-16 left-0 w-full min-h-screen px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 dark:bg-gray-800 shadow-lg rounded-b-lg z-40 transition-colors duration-200">
            <div className="flex items-center px-3 py-2 mb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL || "/placeholder.svg"}
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
              <div>
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {user.emailId}
                </div>
              </div>
            </div>

            <Link
              to="/"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
            >
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5" />
                <span>Feed</span>
              </div>
            </Link>

            <Link
              to="/profile"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/profile")
                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </div>
            </Link>

            <Link
              to="/connections"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/connections")
                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span>Connections</span>
              </div>
            </Link>

            <Link
              to="/requests"
              onClick={() => {
                setNewRequestsCount(0); // Clear notification count
                closeMenu(); // Close menu on mobile
              }}
              className="relative flex items-center gap-3 px-2.5 py-2 text-base font-medium transition-colors hover:bg-gray-700 rounded-md"
            >
              <Bell className="h-5 w-5" />
              <span>Requests</span>
              {newRequestsCount > 0 && (
                <span className="absolute right-3 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {newRequestsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
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
