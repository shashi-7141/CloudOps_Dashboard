import { useResources } from "../../context/ResourceContext"
import { Server, Database } from "lucide-react"

export default function StatsCards() {

  const { resources } = useResources()

  const total = resources.length
  const running = resources.filter((r) => r.status === "running").length
  const servers = resources.filter((r) => r.type === "server").length
  const databases = resources.filter((r) => r.type === "database").length

  const totalCost = resources.reduce((sum, r) => sum + (r.cost || 0), 0)

  const runningCost = resources
    .filter((r) => r.status === "running")
    .reduce((sum, r) => sum + (r.cost || 0), 0)

  const stoppedCost = resources
    .filter((r) => r.status === "stopped")
    .reduce((sum, r) => sum + (r.cost || 0), 0)

  return (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

    {/* Total */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow min-w-0">
      <p className="text-xs sm:text-sm text-gray-400 truncate">Total Resources</p>
      <p className="text-lg sm:text-2xl font-bold break-words">{total}</p>
    </div>

    {/* Running */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow min-w-0">
      <p className="text-xs sm:text-sm text-gray-400 truncate">Running</p>
      <p className="text-lg sm:text-2xl font-bold text-green-500">{running}</p>
    </div>

    {/* Servers */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex items-center gap-2 min-w-0">
      <Server size={18} />
      <div>
        <p className="text-xs sm:text-sm text-gray-400 truncate">Servers</p>
        <p className="text-base sm:text-xl font-bold">{servers}</p>
      </div>
    </div>

    {/* Databases */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex items-center gap-2 min-w-0">
      <Database size={18} />
      <div>
        <p className="text-xs sm:text-sm text-gray-400 truncate">Databases</p>
        <p className="text-base sm:text-xl font-bold">{databases}</p>
      </div>
    </div>

    {/* Running Cost */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow min-w-0">
      <p className="text-xs sm:text-sm text-gray-400 truncate">Running Cost</p>
      <p className="text-lg sm:text-2xl font-bold text-green-500 break-words">
        ${runningCost}
      </p>
    </div>

    {/* Stopped Cost */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow min-w-0">
      <p className="text-xs sm:text-sm text-gray-400 truncate">Stopped Cost</p>
      <p className="text-lg sm:text-2xl font-bold text-yellow-500 break-words">
        ${stoppedCost}
      </p>
    </div>

    {/* Monthly Cost */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow min-w-0">
      <p className="text-xs sm:text-sm text-gray-400 truncate">Monthly Cost</p>
      <p className="text-lg sm:text-2xl font-bold text-blue-500 break-words">
        ${totalCost}
      </p>
    </div>

  </div>
)
}