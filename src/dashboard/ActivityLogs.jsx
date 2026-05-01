import { useLogs } from "../../context/LogContext"

export default function ActivityLogs() {
  const { logs, clearLogs } = useLogs()

  const getBadge = (message = "") => {
    const m = message.toLowerCase()
    if (m.includes("delet") || m.includes("error") || m.includes("fail"))
      return { label: "Error", cls: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" }
    if (m.includes("stop") || m.includes("warn"))
      return { label: "Warn", cls: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" }
    if (m.includes("start") || m.includes("creat") || m.includes("add"))
      return { label: "OK", cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" }
    return { label: "Info", cls: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">
          Activity logs
        </p>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Log list */}
      {logs.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-600 py-4 text-center">
          No activity yet
        </p>
      ) : (
        <div className="flex flex-col gap-0 max-h-64 overflow-y-auto pr-1">
          {logs.map((log) => {
            const badge = getBadge(log.message || log.action)
            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 mt-0.5 ${badge.cls}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
                  {log.message || log.action}
                </span>
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