"use client"
import { useTheme } from "../utils/theme-context"

const ThemeDebugger = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Current theme: <strong>{theme}</strong>
      </div>
      <button onClick={toggleTheme} className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">
        Toggle Theme
      </button>
    </div>
  )
}

export default ThemeDebugger

