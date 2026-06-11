import { useResources } from "../context/ResourceContext"
import {
  AlertTriangle,
  ServerCrash,
  DollarSign,
  Cpu,
  CheckCircle
} from "lucide-react"

export default function Alerts() {
  const { resources } = useResources()

  const alerts = []

  resources.forEach((r) => {
    // Resource stopped alert
    if (r.status === "stopped") {
      alerts.push({
        id: `${r.id}-status`,
        type: "Resource Down",
        resource: r.name,
        severity: "High",
        message: "Resource is currently stopped"
      })
    }

    // Health critical alert
    if (r.health === "critical") {
      alerts.push({
        id: `${r.id}-health`,
        type: "Critical Health",
        resource: r.name,
        severity: "Critical",
        message: "Resource health is critical"
      })
    }

    // High cost alert
    if (r.cost > 1500) {
      alerts.push({
        id: `${r.id}-cost`,
        type: "High Cost",
        resource: r.name,
        severity: "Medium",
        message: "Monthly cost exceeds threshold"
      })
    }

    // Simulated CPU alert
    const cpuUsage = Math.floor(Math.random() * 100)

    if (cpuUsage > 85) {
      alerts.push({
        id: `${r.id}-cpu`,
        type: "High CPU Usage",
        resource: r.name,
        severity: "High",
        message: `CPU usage at ${cpuUsage}%`
      })
    }
  })

  const criticalAlerts = alerts.filter(
    (a) => a.severity === "Critical"
  ).length

  const highAlerts = alerts.filter(
    (a) => a.severity === "High"
  ).length

  const resolvedAlerts = resources.filter(
    (r) => r.status === "running"
  ).length

  return (
    <div className="flex flex-col gap-8 p-5 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Alerts Center
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Monitor infrastructure issues in real time
        </p>
      </div>

      {/* Alert metrics */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Alert metrics
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Total Alerts</p>
            <p className="text-2xl font-bold text-blue-500">
              {alerts.length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Critical</p>
            <p className="text-2xl font-bold text-red-500">
              {criticalAlerts}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">High Priority</p>
            <p className="text-2xl font-bold text-yellow-500">
              {highAlerts}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Healthy Resources</p>
            <p className="text-2xl font-bold text-green-500">
              {resolvedAlerts}
            </p>
          </div>

        </div>
      </section>

      {/* Active alerts */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Active alerts
        </p>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">

          {alerts.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle
                size={40}
                className="mx-auto text-green-500 mb-3"
              />
              <p className="text-sm text-gray-400">
                No active alerts
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3"
                >
                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                      <AlertTriangle
                        size={16}
                        className="text-red-500"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {alert.type}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {alert.resource}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.severity === "Critical"
                      ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                      : alert.severity === "High"
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}