import { useLogs } from "../../context/LogContext"

export default function ResourceActivity({ resourceId }) {

  const { logs } = useLogs()

  const resourceLogs = logs.filter((log) => log.resourceId === resourceId)

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Recent activity
      </h2>
    </div>
  )
}