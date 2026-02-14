"use client";

import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import {
  Code,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../utils/theme-context";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!firstName || !lastName || !emailId || !password) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(emailId)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true },
      );
      // Fetch full profile after signup
      const profileRes = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(profileRes.data));
      // dispatch(addUser(response.data))
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!emailId || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(response.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="login-container">
      {/* Left Side - 3D Abstract Background */}
      <div className="login-left">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl">
                <Code className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white tracking-tight">
                DevTinder
              </div>
              <div className="text-sm text-gray-400 tracking-wider">
                WHERE DEVELOPERS CONNECT
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Development Partner
            </span>
          </h1>

          <p className="text-lg text-gray-400 leading-relaxed mb-12 max-w-lg">
            Connect with developers who share your passion for building amazing
            things. Collaborate, learn, and grow together.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-semibold">Match by Skills</div>
                <div className="text-sm text-gray-500">
                  Find developers with complementary expertise
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <Code className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-semibold">Build Together</div>
                <div className="text-sm text-gray-500">
                  Collaborate on exciting projects
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-semibold">
                  Grow Your Network
                </div>
                <div className="text-sm text-gray-500">
                  Expand your professional connections
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          {/* Form Card */}
          <div className="login-form-card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-2">
                {isLoginForm ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-400">
                {isLoginForm
                  ? "Sign in to continue your journey"
                  : "Join the developer community"}
              </p>
            </div>

            {/* Google Sign In */}
            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setIsLoading(true);
                  setError("");
                  try {
                    const response = await axios.post(
                      BASE_URL + "/auth/google",
                      { idToken: credentialResponse.credential },
                      { withCredentials: true },
                    );
                    const loggedInUser = response.data.data;
                    if (loggedInUser) {
                      dispatch(addUser(loggedInUser));
                      if (
                        Array.isArray(loggedInUser.skills) &&
                        loggedInUser.skills.length === 0
                      ) {
                        navigate("/profile");
                      } else {
                        navigate("/");
                      }
                    } else {
                      throw new Error(
                        "Login failed: Invalid response from server.",
                      );
                    }
                  } catch (err) {
                    setError(err?.response?.data || "Google login failed");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onError={() => setError("Google login failed")}
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/50 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {!isLoginForm && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
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
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
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
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="login-input"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isLoginForm ? "••••••••" : "6+ characters"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              <button
                className="btn-primary w-full justify-center gap-2 text-base py-3.5"
                onClick={isLoginForm ? handleLogin : handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isLoginForm ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Toggle Form */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                {isLoginForm
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  className="ml-2 font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  onClick={() => {
                    setIsLoginForm(!isLoginForm);
                    setError("");
                  }}
                >
                  {isLoginForm ? "Create account" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-gray-600">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
