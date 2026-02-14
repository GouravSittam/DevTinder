import { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, appendFeed, removeUserFromFeed } from "../utils/feedSlice";
import axios from "axios";
import UserCard from "./UserCard";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  Heart,
  X,
} from "lucide-react";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Function to send connection request
  const handleSendRequest = async (status, userId) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
      // Don't increment currentIndex, as removing the user will shift the array
    } catch (err) {
      console.log(err?.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Memoized function to fetch users for a specific page
  const fetchFeed = useCallback(
    async (pageNum) => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/feed?page=${pageNum}`, {
          withCredentials: true,
        });

        const newUsers = response?.data?.data;

        if (newUsers && newUsers.length > 0) {
          if (pageNum === 1) {
            dispatch(addFeed(newUsers));
          } else {
            dispatch(appendFeed(newUsers));
          }
          setPage(pageNum + 1);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.log(err?.response?.data || "Something went wrong");
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, isLoading, hasMore],
  );

  // ✅ Effect for the initial data load
  useEffect(() => {
    dispatch(removeUserFromFeed());
    fetchFeed(1);

    return () => {
      dispatch(removeUserFromFeed());
    };
  }, [dispatch, fetchFeed]);

  // ✅ Effect to trigger fetching more data
  useEffect(() => {
    const shouldFetchMore = currentIndex >= feed.length - 5;
    if (shouldFetchMore && hasMore && !isLoading) {
      fetchFeed(page);
    }
  }, [currentIndex, feed.length, hasMore, isLoading, page, fetchFeed]);

  // Initial loading state
  if (feed.length === 0 && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-3xl animate-pulse"></div>
          <Loader2 className="h-16 w-16 text-purple-500 animate-spin relative z-10" />
        </div>
        <h2 className="text-xl font-semibold text-white mt-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Discovering amazing developers...
        </h2>
      </div>
    );
  }

  // State when no users are found at all
  if (feed.length === 0 && !hasMore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full px-4 animate-fade-in">
        <div className="max-w-md text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">
            No New Developers Found!
          </h2>
          <p className="text-gray-400">
            We're currently looking for more developers that match your profile.
            Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
      style={{ background: "#0F0518" }}
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[768px] h-[614px] -translate-x-32 -translate-y-52 bg-purple-800/30 blur-[60px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[640px] h-[512px] translate-x-32 translate-y-26 bg-indigo-800/30 blur-[50px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 w-[512px] h-[410px] bg-pink-900/10 blur-[65px] rounded-full pointer-events-none"></div>

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center animate-fade-in">
        {/* Card Stack Container */}
        <div className="relative w-full h-[700px] mb-12">
          {/* Background Cards (Stacked Effect) */}
          <div
            className="absolute left-[21px] right-[21px] top-[83px] bottom-[-13px] bg-white/[0.02] border border-white/5 backdrop-blur-[2px] rounded-[32px]"
            style={{ zIndex: 0 }}
          ></div>
          <div
            className="absolute left-[10.5px] right-[10.5px] top-[41.5px] bottom-[-6.5px] bg-white/[0.04] border border-white/5 backdrop-blur-[2px] rounded-[32px]"
            style={{ zIndex: 1 }}
          ></div>

          {/* Action Buttons - Left Side (Skip) */}
          <div
            className="absolute left-[-96px] top-[43.79%] flex flex-col items-start gap-4 opacity-30 hover:opacity-100 transition-opacity duration-300"
            style={{ zIndex: 2 }}
          >
            <button
              onClick={() =>
                handleSendRequest("ignored", feed[currentIndex]?._id)
              }
              disabled={isLoading}
              className="w-14 h-14 flex items-center justify-center bg-black/20 border-2 border-gray-600 backdrop-blur-[2px] rounded-full hover:border-gray-500 transition-all"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 text-center w-14">
              Skip
            </span>
          </div>

          {/* Action Buttons - Right Side (Like) */}
          <div
            className="absolute right-[-96px] top-[43.79%] flex flex-col items-start gap-4 opacity-30 hover:opacity-100 transition-opacity duration-300"
            style={{ zIndex: 3 }}
          >
            <button
              onClick={() =>
                handleSendRequest("interested", feed[currentIndex]?._id)
              }
              disabled={isLoading}
              className="w-14 h-14 flex items-center justify-center bg-purple-500/10 border-2 border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] backdrop-blur-[2px] rounded-full hover:bg-purple-500/20 transition-all"
            >
              <Heart className="w-4 h-4 text-purple-300" />
            </button>
            <span className="text-[10px] font-bold tracking-wider uppercase text-purple-300 text-center w-14">
              Like
            </span>
          </div>

          {/* Main UserCard */}
          <div className="absolute inset-0" style={{ zIndex: 4 }}>
            {feed.length > 0 && (
              <div className="transition-opacity duration-300">
                <UserCard
                  user={feed[currentIndex]}
                  onAction={(action) => {
                    handleSendRequest(action, feed[currentIndex]?._id);
                    if (currentIndex < feed.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Hint */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            Use arrow keys
            <kbd className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-gray-400">
              ←
            </kbd>
            <kbd className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-gray-400">
              →
            </kbd>
            to navigate
          </span>
        </div>
      </div>
    </div>
  );
};

export default Feed;
