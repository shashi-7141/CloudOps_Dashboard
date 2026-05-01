import { NavLink } from "react-router-dom"
import { LayoutDashboard, Server, Menu, Cloud, Settings, CreditCard } from "lucide-react"
import { useResources } from "../../context/ResourceContext"
import { useState } from "react"

export default function Sidebar() {
  const { resources } = useResources()
  const [isOpen, setIsOpen] = useState(true)

  const running = resources.filter((r) => r.status === "running").length
  const stopped = resources.filter((r) => r.status === "stopped").length

  return (
    <aside
      className={`shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 flex flex-col transition-all duration-300 ${
        isOpen ? "w-52" : "w-14"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200 dark:border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <Cloud size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">CloudOps</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 py-3 overflow-y-auto">

        {isOpen && (
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 px-2 pt-1 pb-1">
            Overview
          </p>
        )}

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium border-r-2 border-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`
          }
        >
          <LayoutDashboard size={15} />
          {isOpen && "Dashboard"}
        </NavLink>

        <NavLink
          to="/resources"
          className={({ isActive }) =>
            `flex items-center justify-between px-2 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium border-r-2 border-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <Server size={15} />
            {isOpen && "Resources"}
          </div>
          {isOpen && (
            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
              {resources.length}
            </span>
          )}
        </NavLink>

        {isOpen && (
          <>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 px-2 pt-4 pb-1">
              Monitor
            </p>

            <div className="px-2 py-2 rounded-md text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
              Alerts
            </div>

            <div className="px-2 py-2 rounded-md text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              Logs
            </div>

            <div className="px-2 py-2 rounded-md text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              Cost Explorer
            </div>
          </>
        )}

        {/* Resource status summary */}
        {isOpen && (
          <div className="mt-4 mx-1 p-2.5 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide">Resource Status</p>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">{running} running</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">{stopped} stopped</span>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom */}
      {isOpen && (
        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Account</p>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-1">
              <Settings size={13} /> Settings
            </button>
            <button className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-1">
              <CreditCard size={13} /> Billing
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}