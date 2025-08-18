"use client"

import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { Code, Mail, Lock, User, ArrowRight, Loader2, Moon, Sun, Eye, EyeOff } from "lucide-react"
import { useTheme } from "../utils/theme-context"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

const Login = () => {
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignUp = async () => {
    if (!firstName || !lastName || !emailId || !password) {
      setError("All fields are required")
      return
    }

    if (!validateEmail(emailId)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      const response = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true },
      )
       // Fetch full profile after signup
      const profileRes = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
      dispatch(addUser(profileRes.data));
      // dispatch(addUser(response.data))
      navigate("/profile")
    } catch (err) {
      setError(err?.response?.data || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!emailId || !password) {
      setError("Email and password are required")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      const response = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true },
      )
      dispatch(addUser(response.data))
      navigate("/")
    } catch (err) {
      setError(err?.response?.data || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <div className="h-screen flex flex-col -my-8 justify-center items-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg pb-0">
          <CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg mb-2">
              <Code className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-0.5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-foreground">
                {isLoginForm ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-muted-foreground">
                {isLoginForm ? "Sign in to continue." : "Welcome! Create an account to get started."}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            {!isLoginForm && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder={isLoginForm ? "••••••••" : "6+ characters"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm transition-colors duration-200">
                {error}
              </div>
            )}

            <Button className="w-full" onClick={isLoginForm ? handleLogin : handleSignUp} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLoginForm ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t !py-4">
            <p className="text-center text-sm text-muted-foreground">
              {isLoginForm ? "New to DevConnect?" : "Already have an account?"}
              <button
                className="ml-1 text-primary hover:underline"
                onClick={() => {
                  setIsLoginForm(!isLoginForm)
                  setError("")
                }}
              >
                {isLoginForm ? "Create an account" : "Sign in"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Login

