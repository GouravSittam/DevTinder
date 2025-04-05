import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import { connection } from "mongoose";

const connections = () => {
  const connections = useSelector((state) => state.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addConnections(res?.data?.data));
    } catch (e) {
      console.error("Error fetching connections:", e.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);
  if (!connections) return null;
  if (connections?.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <h1 className="text-bold text-2xl">No Connections Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <h1 className="text-4xl font-extrabold text-center text-gradient bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-12">
        🌐 Your Network of Connections
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {connections?.map((connection) => {
          const { firstName, lastName, emailID, photoURL, age, gender, about } =
            connection;
          return (
            <div
              key={emailID}
              className="group relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-300"
            >
              <div className="absolute top-4 right-4 text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full capitalize">
                {gender}
              </div>

              <div className="flex flex-col items-center text-center">
                <img
                  src={photoURL}
                  alt={`${firstName} ${lastName}`}
                  className="w-24 h-24 rounded-full border-4 border-indigo-400 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {firstName} {lastName}
                </h2>
                <p className="text-sm text-gray-500">{emailID}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Age:</span> {age}
                </p>
              </div>

              <p className="mt-4 text-gray-700 text-sm italic line-clamp-3">
                "{about}"
              </p>

              <div className="mt-6 flex justify-center gap-4">
                <button className="bg-indigo-600 text-white px-4 py-1.5 text-sm rounded-full hover:bg-indigo-700 shadow-sm transition">
                  Connect
                </button>
                <button className="bg-white text-indigo-600 border border-indigo-600 px-4 py-1.5 text-sm rounded-full hover:bg-indigo-50 transition">
                  Message
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default connections;
