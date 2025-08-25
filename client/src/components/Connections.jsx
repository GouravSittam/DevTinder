"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import {
  Users,
  User,
  Loader2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [isLoading, setIsLoading] = useState(true);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.log(err?.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();

  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full">
        <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin mb-4 transition-colors duration-200" />
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Loading connections...
        </h2>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center transition-colors duration-200">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 transition-colors duration-200">
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 transition-colors duration-200" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200">
            No Connections Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-200">
            Start browsing the feed and connect with developers who match your
            interests.
          </p>
          <a
            href="/feed"
            className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            <ExternalLink className="h-4 w-4" />
            Browse Developers
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg mr-3">
          <Users className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          My Connections
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoURL, age, gender, about } =
            connection;
          return (
            <div
              key={_id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <div className="h-16 w-16 rounded-full overflow-hidden mr-4 flex-shrink-0 relative">
                  {photoURL ? (
                    <img
                      src={photoURL || "/placeholder.svg"}
                      alt={`${firstName} ${lastName}`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {firstName?.charAt(0)}
                        {lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Online/Offline Dot */}
                  <span
                    className={
                      "absolute bottom-2 right-2 w-3 h-3 rounded-full border-2 border-white " +
                      (onlineUsers.includes(_id)
                        ? "bg-green-400"
                        : "bg-gray-400")
                    }
                    title={onlineUsers.includes(_id) ? "Online" : "Offline"}
                  ></span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                    {firstName} {lastName}
                  </h2>
                  {age && gender && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300 transition-colors duration-200">
                        {age} years
                      </span>
                      <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300 transition-colors duration-200">
                        {gender}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-2 mb-4">
                  <User className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0 transition-colors duration-200" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200">
                    {about || "No bio available"}
                  </p>
                </div>

                <Link to={"/chat/" + _id}>
                  <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
