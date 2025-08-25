"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addRequests, removeRequests } from "../utils/requestSlices"
import { Bell, Check, X, Loader2, User } from "lucide-react"

const Requests = () => {
  const requests = useSelector((store) => store.requests)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState([])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(BASE_URL + "/user/request/received", { withCredentials: true })
      dispatch(addRequests(res?.data?.data))
    } catch (err) {
      console.log("Error in show Requests:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const reviewRequest = async (status, _id) => {
    try {
      setProcessingIds((prev) => [...prev, _id])
      const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, { withCredentials: true })
      dispatch(removeRequests(_id))
    } catch (err) {
      console.log("Error in reviewRequest: " + err)
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== _id))
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full">
        <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin mb-4 transition-colors duration-200" />
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Loading requests...
        </h2>
      </div>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center transition-colors duration-200">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 transition-colors duration-200">
            <Bell className="h-8 w-8 text-purple-600 dark:text-purple-400 transition-colors duration-200" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200">
            No Connection Requests
          </h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            You don't have any pending connection requests at the moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg mr-3">
          <Bell className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Connection Requests
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoURL, age, gender, about } = request?.fromUserId
          const isProcessing = processingIds.includes(request._id)

          return (
            <div
              key={request?._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <div className="h-16 w-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  {photoURL ? (
                    <img
                      src={photoURL || "/placeholder.svg"}
                      alt={`${firstName} ${lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {firstName?.charAt(0)}
                        {lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                    {firstName} {lastName}
                  </h2>
                  {age && gender && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300 transition-colors duration-200">
                        {age} years
                      </span>
                      <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300 transition-colors duration-200">
                        {gender}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-2 mb-4">
                  <User className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0 transition-colors duration-200" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200">
                    {about || "No bio available"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-md hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-70"
                    onClick={() => reviewRequest("accepted", request?._id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Accept
                      </>
                    )}
                  </button>

                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-70"
                    onClick={() => reviewRequest("rejected", request?._id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        Decline
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Requests

