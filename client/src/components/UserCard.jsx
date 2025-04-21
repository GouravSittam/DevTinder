import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { removeUserFromFeed } from "../utils/feedSlice"
import { Heart, X, User, Code2 } from "lucide-react"

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, age, gender, photoURL, about } = user
  const dispatch = useDispatch()

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, { withCredentials: true })
      dispatch(removeUserFromFeed(userId))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
      <div className="card bg-base-100 dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <figure className="relative h-80">
          {photoURL ? (
            <img
              src={photoURL || "/placeholder.svg"}
              alt={`${firstName} ${lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <User className="h-24 w-24 text-white opacity-50" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <h2 className="text-2xl font-bold">{firstName + " " + lastName}</h2>
            {age && gender && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full">{age} years</span>
                <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full">{gender}</span>
              </div>
            )}
          </div>
        </figure>
        <div className="card-body p-5 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="flex items-start gap-2 mb-3">
            <Code2 className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0 transition-colors duration-200" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
              {about || "No bio available"}
            </p>
          </div>

          <div className="card-actions flex justify-between gap-3 mt-4">
            <button
              className="flex-1 btn bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-none hover:opacity-90 transition-all duration-200"
              onClick={() => handleSendRequest("interested", _id)}
            >
              <Heart className="h-5 w-5 mr-1" />
              Connect
            </button>
            <button
              className="flex-1 btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none transition-all duration-200"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              <X className="h-5 w-5 mr-1" />
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCard

