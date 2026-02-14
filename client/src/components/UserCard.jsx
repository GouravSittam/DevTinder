import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import {
  Heart,
  X,
  MapPin,
  Briefcase,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const UserCard = ({ user, onAction }) => {
  const {
    _id,
    firstName,
    lastName,
    age,
    gender,
    photoURL,
    about,
    skills = [],
  } = user;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async (status, userId) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
      if (onAction) onAction(status);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const displaySkills = skills.slice(0, 4);
  const remainingSkills = skills.length > 4 ? skills.length - 4 : 0;

  if (isLoading) {
    return (
      <div className="feed-card flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-card group">
      {/* Profile Image Section */}
      <div className="relative feed-card-image">
        {photoURL ? (
          <img
            src={photoURL}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center">
            <div className="text-white text-8xl font-bold opacity-40">
              {firstName?.charAt(0)}
              {lastName?.charAt(0)}
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="feed-card-gradient" />

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          {/* Status & Role Badges */}
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 backdrop-blur-md rounded-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                Full-Stack Dev
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/10 border border-white/5 backdrop-blur-md rounded-md">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-[10px] font-medium text-green-200">
                Active
              </span>
            </div>
          </div>

          {/* Name & Location */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-1">
                {firstName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                {age && <span>{age}</span>}
                {age && gender && (
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                )}
                {gender && (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>San Francisco, CA</span>
                  </>
                )}
              </div>
            </div>

            {/* LinkedIn Badge */}
            <div className="p-2 bg-white/10 border border-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-colors cursor-pointer">
              <svg
                className="w-3.5 h-3.5 text-blue-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-2 bg-black/60 border border-white/10 backdrop-blur-md rounded-full">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">
            Verified
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="feed-card-content">
        {/* About Section */}
        <div className="mb-6">
          <div className="relative mb-4">
            <span className="absolute -left-3 -top-2 text-4xl text-purple-500/20 font-serif">
              "
            </span>
            <p className="text-[15px] leading-relaxed text-gray-300 pl-2">
              {about ||
                "Passionate about building scalable web applications and clean UI. I love open source and spending my weekends hiking."}
            </p>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-700" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
              Tech Stack
            </span>
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          <div className="flex flex-wrap gap-2">
            {displaySkills.map((skill, index) => {
              const techColors = {
                React: "border-blue-400/20 text-blue-400",
                Node: "border-green-400/20 text-green-400",
                TypeScript: "border-yellow-400/20 text-yellow-400",
                Python: "border-pink-400/20 text-pink-400",
              };
              const colorClass =
                techColors[skill] || "border-white/5 text-gray-300";

              return (
                <div key={index} className={`tech-badge ${colorClass}`}>
                  <div className="w-3.5 h-3.5 rounded bg-current opacity-20"></div>
                  <span>{skill}</span>
                </div>
              );
            })}
            {remainingSkills > 0 && (
              <div className="tech-badge border-white/5 text-gray-500 border-dashed opacity-50">
                <span>+{remainingSkills}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            className="action-btn-skip hover:scale-105 transition-transform"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => handleSendRequest("interested", _id)}
            className="action-btn-interested hover:scale-105 transition-transform"
            disabled={isLoading}
          >
            <Heart className="w-5 h-5 text-pink-200 fill-pink-200" />
            <span className="text-base font-semibold tracking-wide">
              Interested
            </span>
          </button>
        </div>
      </div>

      {/* Floating Tech Icons (Decorative) */}
      <div className="absolute right-[70.22%] top-[32.7%] w-16 h-16 bg-gray-800/60 border border-white/5 backdrop-blur-[2px] rounded-2xl flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity -rotate-12">
        <div
          className="w-8 h-8 bg-blue-400/80 rounded"
          style={{
            maskImage:
              "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDdWMTdMMTIgMjJMMjAgMTdWN0wxMiAyWiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
          }}
        ></div>
      </div>
      <div className="absolute right-[24.54%] top-[68.51%] w-14 h-14 bg-gray-800/60 border border-white/5 backdrop-blur-[2px] rounded-2xl flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity rotate-12">
        <div
          className="w-8 h-8 bg-pink-400/80 rounded"
          style={{
            maskImage:
              "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L3N2Zz4=)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
          }}
        ></div>
      </div>
    </div>
  );
};

export default UserCard;
