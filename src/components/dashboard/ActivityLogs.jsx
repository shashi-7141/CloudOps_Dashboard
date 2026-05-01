import { useLogs } from "../../context/LogContext"
import { useResources } from "../../context/ResourceContext"
import { Server, Database, Trash2, Activity } from "lucide-react"

export default function ActivityLogs() {
  const { logs, clearLogs } = useLogs()
  const { resources } = useResources()

  const getBadge = (message = "", action = "") => {
    const m = (message + action).toLowerCase()
    if (m.includes("delet") || m.includes("error") || m.includes("fail"))
      return { label: "Error", cls: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" }
    if (m.includes("stop") || m.includes("warn"))
      return { label: "Warn", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400" }
    if (m.includes("start") || m.includes("creat") || m.includes("add") || m.includes("updat"))
      return { label: "OK", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" }
    return { label: "Info", cls: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" }
  }

  const getResource = (log) => {
    if (!log.resourceId) return null
    return resources.find((r) => r.id === log.resourceId) || null
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-full min-h-[320px]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-gray-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity logs</p>
          {logs.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {logs.length}
            </span>
          )}
        </div>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          >
            <Trash2 size={11} />
            Clear
          </button>
        )}
      </div>

      {/* Empty state */}
      {logs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
          <Activity size={24} className="text-gray-200 dark:text-gray-700" />
          <p className="text-xs text-gray-400 dark:text-gray-600">No activity yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 max-h-72 scroll-smooth">
          {logs.map((log) => {
            const badge = getBadge(log.message, log.action)
            const resource = getResource(log)
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Badge */}
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold shrink-0 mt-0.5 tracking-wide ${badge.cls}`}>
                  {badge.label}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug truncate">
                    {log.message || log.action}
                  </p>

                  {/* Resource chip */}
                  {resource && (
                    <div className="flex items-center gap-1 mt-1">
                      {resource.type === "server"
                        ? <Server size={10} className="text-blue-400" />
                        : <Database size={10} className="text-violet-400" />
                      }
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">
                        {resource.name}
                      </span>
                      <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                      <span className={`text-[10px] ${resource.status === "running" ? "text-emerald-500" : "text-amber-500"}`}>
                        {resource.status}
                      </span>
                      <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {resource.region || "unknown"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Time */}
                <span className="text-[10px] text-gray-400 dark:text-gray-600 shrink-0 mt-0.5">
                  {log.time}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}