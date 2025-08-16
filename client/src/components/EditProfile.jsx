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
    }
  }, []);

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

      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(addUser(response?.data?.data));
      setPhotoURL(response?.data?.data?.photoURL || ""); // <-- update photoURL state here
      setSelectedPhoto(null);
      setShowToast(true);
      if(fileInputRef.current){
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
  const filteredSkills = techSkillsOptions.filter(opt =>
    opt.label.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !skills.includes(opt.value)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Edit Your Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-24 transition-colors duration-200">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-32 relative">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 transition-colors duration-200">
                  {photoURL ? (
                    <img
                      src={photoURL ? `${photoURL}?${Date.now()}` : "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {firstName?.charAt(0)}
                        {lastName?.charAt(0)}
                      </span>
                    </div>
                  )} 
                </div>
              </div>
            </div>

            <div className="pt-20 p-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white transition-colors duration-200">
                {firstName || "First"} {lastName || "Last"}
              </h2>

              <div className="flex justify-center gap-3 mt-2 mb-4">
                {age && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    <Calendar className="h-3 w-3" />
                    {age} years
                  </span>
                )}

                {gender && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    <Users className="h-3 w-3" />
                    {gender}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-200">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 transition-colors duration-200">
                  <Info className="h-4 w-4" />
                  About
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200">
                  {about || "No bio available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label
                  htmlFor="photoURL"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-200"
                >
                  <Camera className="h-4 w-4" />
                  Profile Photo URL
                </label>
                <input
                  id="photoURL"
                  type="file"
                  ref={fileInputRef}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 file:border file:border-gray-400 file:rounded file:px-2 file:py-1"
                  onChange={(e)=> {setSelectedPhoto(e.target.files[0])
                  }}
                  accept="image/*"
                />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label
                    htmlFor="age"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-200"
                  >
                    <Calendar className="h-4 w-4" />
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="gender"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-200"
                  >
                    <Users className="h-4 w-4" />
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

       {/* Skills Section */}
      <div className="space-y-2 mb-6">
        <label
          htmlFor="skills"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-200"
        >
          Skills
        </label>
        {/* Selected skills with cross to remove */}
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map(skill => (
            <div
              key={skill}
              className="badge badge-primary gap-1 flex items-center"
            >
              {techSkillsOptions.find(opt => opt.value === skill)?.label || skill}
              <button
                type="button"
                className="ml-1 text-xs text-white hover:text-red-200"
                onClick={() => setSkills(skills.filter(s => s !== skill))}
                aria-label="Remove skill"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {/* DaisyUI dropdown with search */}
        <div className="dropdown w-full">
          <input
            type="text"
            className="input input-bordered w-full mb-1  border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="Search skills..."
            value={skillSearch}
            onChange={e => setSkillSearch(e.target.value)}
          />
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 dark:bg-gray-800 rounded-box w-full max-h-48 overflow-auto">
            {filteredSkills.length === 0 && (
              <li className="text-gray-400 px-2 py-1">No skills found</li>
            )}
            {filteredSkills.map(opt => (
              <li key={opt.value}>
                <button
                  type="button"
                  className="w-full text-left px-2 py-1 hover:bg-purple-100 dark:hover:bg-gray-700"
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
        </div>
      </div>

              <div className="space-y-2 mb-6">
                <label
                  htmlFor="about"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-200"
                >
                  <Info className="h-4 w-4" />
                  About
                </label>
                <textarea
                  id="about"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell other developers about yourself, your skills, and interests..."
                ></textarea>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm mb-6 transition-colors duration-200">
                  {error}
                </div>
              )}

              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-md shadow hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
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
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
