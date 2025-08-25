"use client"

import { useEffect, useState } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addFeed } from "../utils/feedSlice"
import axios from "axios"
import UserCard from "./UserCard"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { jaccardSimilarity } from "../utils/constants"

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);           // Tracks current page number
const [hasMore, setHasMore] = useState(true);  // Tracks if more users are available
const PAGE_LIMIT = 20;                         // Number of users per page

  useEffect(() => {
      getFeed()

  }, [])

  const getFeed = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      })
      dispatch(addFeed(response?.data?.data))
    } catch (err) {
      console.log(err?.response?.data || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  };

  // Sort feed by Jaccard similarity to current user
  const sortedFeed = feed
    ? [...feed].sort((a, b) => {
        const simA = jaccardSimilarity(currentUser?.skills || [], a.skills || [])
        const simB = jaccardSimilarity(currentUser?.skills || [], b.skills || [])
        return simB - simA // descending order
      })
    : []

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (feed && currentIndex < feed.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full">
        <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin mb-4 transition-colors duration-200" />
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Finding developers...
        </h2>
      </div>
    )
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full p-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">No New Developers Found!</h2>
          <p className="text-white/80">
            We're currently looking for more developers that match your profile. Check back soon!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Discover Developers
      </h1>

      <div className="relative w-full max-w-md">
        {feed.length > 1 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 hidden md:block">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors duration-200" />
            </button>
          </div>
        )}

        {sortedFeed.map((user, index) => (
          <div
            key={user?._id || user?.emailId}
            className={`transition-all duration-500 ease-in-out ${
              index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"
            }`}
          >
            <UserCard user={user} />
          </div>
        ))}

        {feed.length > 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 hidden md:block">
            <button
              onClick={handleNext}
              disabled={currentIndex === feed.length - 1}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors duration-200" />
            </button>
          </div>
        )}
      </div>

      {feed.length > 1 && (
        <div className="flex gap-2 mt-6 md:hidden">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors duration-200" />
          </button>
          <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200">
            {currentIndex + 1} / {feed.length}
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex === feed.length - 1}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors duration-200" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Feed

