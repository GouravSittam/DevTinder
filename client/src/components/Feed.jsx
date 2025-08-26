"use client"

import { useEffect, useState, useCallback } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
// ✅ Import the new appendFeed action
import { addFeed, appendFeed, removeUserFromFeed } from "../utils/feedSlice"
import axios from "axios"
import UserCard from "./UserCard"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Memoized function to fetch users for a specific page
  const fetchFeed = useCallback(async (pageNum) => {
    if (isLoading || !hasMore) return; // Prevent multiple simultaneous fetches

    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/feed?page=${pageNum}`, {
        withCredentials: true,
      });
      
      const newUsers = response?.data?.data;

      if (newUsers && newUsers.length > 0) {
        // On the first page, replace the feed. On subsequent pages, append.
        if (pageNum === 1) {
          dispatch(addFeed(newUsers));
        } else {
          dispatch(appendFeed(newUsers));
        }
        setPage(pageNum + 1); // Prepare for the next page
      } else {
        // If the API returns an empty array, we know there are no more users
        setHasMore(false);
      }
    } catch (err) {
      console.log(err?.response?.data || "Something went wrong");
      setHasMore(false); // Stop trying if there's an error
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, isLoading, hasMore]);

  // ✅ Effect for the initial data load and for clearing the feed on unmount
  useEffect(() => {
    // Clear previous feed data and fetch page 1
    dispatch(removeUserFromFeed());
    fetchFeed(1);

    // Cleanup function to clear feed when the component is unmounted
    return () => {
      dispatch(removeUserFromFeed());
    }
  }, [dispatch, fetchFeed]);

  // ✅ Effect to trigger fetching more data as the user gets close to the end
  useEffect(() => {
    const shouldFetchMore = currentIndex >= feed.length - 5;
    if (shouldFetchMore && hasMore && !isLoading) {
      fetchFeed(page);
    }
  }, [currentIndex, feed.length, hasMore, isLoading, page, fetchFeed]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < feed.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Initial loading state
  if (feed.length === 0 && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full">
        <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Finding developers...
        </h2>
      </div>
    );
  }

  // State when no users are found at all
  if (feed.length === 0 && !hasMore) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full p-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">No New Developers Found!</h2>
          <p className="text-white/80">
            We're currently looking for more developers that match your profile. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Discover Developers
      </h1>

      <div className="relative w-full max-w-md h-[500px]"> {/* Give the container a fixed height */}
        {/* ✅ The map now iterates directly over `feed` since it's already sorted */}
        {feed.map((user, index) => (
          <div
            key={user?._id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <UserCard user={user} />
          </div>
        ))}
        
        {/* A subtle loader at the bottom when fetching more users in the background */}
        {/* {isLoading && feed.length > 0 && (
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-2">
             <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
           </div>
        )} */}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3 ">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="px-4 py-2 text-lg font-semibold bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-700 dark:text-gray-300">
          {currentIndex + 1} / {feed.length}
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex === feed.length - 1 && !hasMore}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default Feed;