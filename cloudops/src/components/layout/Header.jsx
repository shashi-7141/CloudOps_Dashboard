import { Search, Bell, Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { useLogs } from "../../context/LogContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { logs } = useLogs()
  const navigate = useNavigate()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "U"

  const unread = logs.slice(0, 5)

  return (
    <header className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 py-2.5 flex items-center gap-3">

      {/* Status pill */}
      <div className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        All systems operational
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Region: us-east-1</div>

      {/* Search */}
      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 ml-2">
        <Search size={13} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none ml-2 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 w-28 sm:w-36"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }}
            className="relative p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            <Bell size={16} />
            {logs.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-9 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Notifications</p>
              </div>
              {unread.length === 0 ? (
                <p className="text-sm text-gray-400 p-3">No notifications</p>
              ) : (
                unread.map((log) => (
                  <div key={log.id} className="text-xs px-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    {log.action || log.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Avatar + profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }}
            className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-medium flex items-center justify-center"
          >
            {initials}
          </button>
          {showProfile && (
            <div className="absolute right-0 top-9 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {user?.displayName || "User"}
                </p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}