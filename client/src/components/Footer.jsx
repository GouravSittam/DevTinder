import { Code, Github, Twitter, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"


const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 px-4 shadow-sm mt-auto transition-colors duration-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-1.5 rounded mr-2">
              <Code className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              DevConnect
            </span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0 text-center md:text-left transition-colors duration-200">
            &copy; {new Date().getFullYear()} DevConnect. All rights reserved.
          </div>

          <div className="flex space-x-4">
            <Link
              to="https://github.com/Abhinandan-Sah"
              className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              to="https://x.com/I_AbhinandanSah"
              className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              to="https://www.linkedin.com/in/abhinandan-sah/"
              className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

