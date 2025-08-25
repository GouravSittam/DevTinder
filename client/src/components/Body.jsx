"use client"

import React, { useEffect } from "react"
import Navbar from "./Navbar"
import { Outlet, useNavigate } from "react-router-dom"
import Footer from "./Footer"
import { BASE_URL } from "../utils/constants"
import { addUser } from "../utils/userSlice"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { ThemeProvider } from "../utils/theme-context"

const Body = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((store) => store.user)
  const [isLoading, setIsLoading] = React.useState(!userData)

  useEffect(() => {
    if (!userData) {
      fetchUser()
    }

    
  }, [])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      })
      dispatch(addUser(response.data))
    } catch (err) {
      if (err.status == 401) {
        navigate("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col transition-colors duration-200 dark:bg-gray-900">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin mb-4" />
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading...</h2>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <main className="flex-grow w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default Body

