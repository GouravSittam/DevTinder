"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import {
  User,
  Save,
  Loader2,
  Camera,
  Info,
  Calendar,
  Users,
  Check,
} from "lucide-react";
import Select from "react-select";
import { techSkillsOptions } from "../utils/constants";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [about, setAbout] = useState(user?.about || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [age, setAge] = useState(user?.age || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillSearch, setSkillSearch] = useState("");
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAbout(user.about || "");
      setGender(user.gender || "");
      setAge(user.age || "");
      setPhotoURL(user.photoURL || "");
      setSkills(user.skills || []);
    }
  }, [user]);

  const saveProfile = async () => {
    setError("");
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("about", about);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("skills", JSON.stringify(skills));
      if (selectedPhoto) {
        formData.append("photo", selectedPhoto);
      }

      const response = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(addUser(response?.data?.data));
      // setPhotoURL(response?.data?.data?.photoURL || ""); // <-- update photoURL state here
      setSelectedPhoto(null);
      setShowToast(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      const i = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter skills based on search
  const filteredSkills = techSkillsOptions.filter(
    (opt) =>
      opt.label.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !skills.includes(opt.value),
  );

  return (
    <div className="min-h-screen bg-[#0F0518] py-12 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-white text-center mb-3 tracking-tight">
          Edit Your Profile
        </h1>
        <p className="text-center text-gray-400 text-sm">
          Update your information to help other developers discover you
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Preview Card */}
        <div className="lg:col-span-1">
          <div className="profile-card sticky top-24">
            {/* Banner with Gradient */}
            <div className="relative h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-400 rounded-full blur-3xl"></div>
              </div>
            </div>

            {/* Avatar */}
            <div className="relative -mt-16 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-lg opacity-40"></div>
                <div className="relative w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 shadow-2xl">
                  {photoURL ? (
                    <img
                      src={`${photoURL}?${Date.now()}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                      {firstName?.charAt(0)}
                      {lastName?.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="px-6 pb-6">
              <h2 className="text-2xl font-extrabold text-white text-center mt-4 mb-2 tracking-tight">
                {firstName || "First"} {lastName || "Last"}
              </h2>

              {/* Badges */}
              <div className="flex justify-center gap-2 mb-6">
                {age && (
                  <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300 font-medium">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {age}
                  </div>
                )}
                {gender && (
                  <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-300 font-medium">
                    <Users className="inline h-3 w-3 mr-1" />
                    {gender}
                  </div>
                )}
              </div>

              {/* About Section */}
              <div className="border-t border-white/5 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-2">
                  <Info className="h-3 w-3" />
                  About
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {about ||
                    "No bio available. Add a bio to help others get to know you!"}
                </p>
              </div>

              {/* Skills Preview */}
              {skills.length > 0 && (
                <div className="border-t border-white/5 pt-4 mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3 flex items-center gap-2">
                    <Check className="h-3 w-3" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 6).map((skill) => (
                      <div
                        key={skill}
                        className="tech-badge border-purple-400/20 text-purple-400"
                      >
                        <span>
                          {techSkillsOptions.find((opt) => opt.value === skill)
                            ?.label || skill}
                        </span>
                      </div>
                    ))}
                    {skills.length > 6 && (
                      <div className="tech-badge border-white/5 text-gray-500 border-dashed">
                        <span>+{skills.length - 6}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Section */}
          <div className="profile-card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-purple-400" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  First Name
                </label>
                <input
                  type="text"
                  className="login-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Last Name
                </label>
                <input
                  type="text"
                  className="login-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Age
                </label>
                <input
                  type="number"
                  className="login-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" />
                  Gender
                </label>
                <select
                  className="login-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Photo Section */}
          <div className="profile-card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-400" />
              Profile Photo
            </h3>

            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                className="w-full px-4 py-3 bg-gray-800/40 border border-white/5 rounded-xl text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-semibold hover:file:bg-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setSelectedPhoto(e.target.files[0])}
                accept="image/*"
              />
              <p className="text-xs text-gray-500">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="profile-card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Check className="h-5 w-5 text-purple-400" />
              Technical Skills
            </h3>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300 font-medium flex items-center gap-2 hover:bg-purple-500/20 transition-colors group"
                >
                  {techSkillsOptions.find((opt) => opt.value === skill)
                    ?.label || skill}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-red-400 transition-colors"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    aria-label="Remove skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Search Input */}
            <div className="dropdown w-full">
              <input
                type="text"
                className="login-input"
                placeholder="Search and add skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
              />
              {skillSearch && (
                <ul className="mt-2 p-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-auto">
                  {filteredSkills.length === 0 && (
                    <li className="text-gray-500 px-4 py-2 text-sm">
                      No skills found
                    </li>
                  )}
                  {filteredSkills.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => {
                          setSkills([...skills, opt.value]);
                          setSkillSearch("");
                        }}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="profile-card">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Info className="h-5 w-5 text-purple-400" />
              About You
            </h3>

            <div className="space-y-2">
              <textarea
                rows={6}
                className="login-input resize-none"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell other developers about yourself, your experience, and what you're passionate about..."
              />
              <p className="text-xs text-gray-500">
                {about.length}/500 characters
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Save Button */}
          <button
            className="btn-primary w-full justify-center gap-2 text-base py-4"
            onClick={saveProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-500/20">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
            <span className="font-semibold">Profile saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
