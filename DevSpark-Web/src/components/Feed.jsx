import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed); // Access feed from Redux store
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return; // Prevent fetching if feed already exists
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data?.data)); // Add feed data to Redux store
    } catch (e) {
      console.error("Error fetching feed:", e);
    }
  };

  useEffect(() => {
    getFeed();
  }, [feed, dispatch]); // Add dependencies to avoid unnecessary re-renders

  return (
    <div className="flex flex-wrap justify-center my-10 gap-4">
      {feed && feed.length > 0 ? (
        feed.map((user, index) => (
          <UserCard key={index} user={user} /> // Pass each user to UserCard
        ))
      ) : (
        <p>No users available in the feed.</p> // Fallback message if feed is empty
      )}
    </div>
  );
};

export default Feed;