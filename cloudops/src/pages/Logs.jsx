import { useLogs } from "../context/LogContext"
import { useResources } from "../context/ResourceContext"
import {
  Activity,
  Trash2,
  Server,
  User,
  Clock
} from "lucide-react"

export default function Logs() {
  const { logs, clearLogs } = useLogs()
  const { resources } = useResources()

  const resourceLogs = logs.filter(log =>
    log.action.toLowerCase().includes("resource")
  ).length

  const authLogs = logs.filter(log =>
    log.action.toLowerCase().includes("login") ||
    log.action.toLowerCase().includes("logout")
  ).length

  const todayLogs = logs.filter(log => {
    const today = new Date().toLocaleDateString()
    return log.timestamp.includes(today)
  }).length

  return (
    <div className="flex flex-col gap-8 p-5 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Activity Logs
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Track system and user activities
          </p>
        </div>

        <button
          onClick={clearLogs}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
        >
          <Trash2 size={16} />
          Clear Logs
        </button>
      </div>

      {/* Metrics */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Log metrics
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Total Logs</p>
            <p className="text-2xl font-bold text-blue-500">
              {logs.length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Resource Activities</p>
            <p className="text-2xl font-bold text-green-500">
              {resourceLogs}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Today's Logs</p>
            <p className="text-2xl font-bold text-violet-500">
              {todayLogs}
            </p>
          </div>

        </div>
      </section>

      {/* Activity Timeline */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Recent activity
        </p>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">

          {logs.length === 0 ? (
            <div className="text-center py-10">
              <Activity
                size={40}
                className="mx-auto text-gray-300 mb-3"
              />
              <p className="text-sm text-gray-400">
                No activity logs found
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {logs.slice(0, 15).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <Server
                        size={16}
                        className="text-blue-500"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {log.action}
                      </p>

                      <div className="flex gap-4 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {log.user}
                        </span>

                        <span>
                          {log.resourceName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}