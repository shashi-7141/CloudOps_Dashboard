import { useState, useEffect } from "react"
import { useResources } from "../../context/ResourceContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const HEALTH_CONFIG = {
  healthy: { color: "#10b981", bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400", label: "Healthy" },
  warning: { color: "#f59e0b", bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-400", label: "Warning" },
  critical: { color: "#ef4444", bg: "bg-red-50 dark:bg-red-950", text: "text-red-600 dark:text-red-400", label: "Critical" }
}

export default function HealthChart() {
  const { resources } = useResources()
  const [tick, setTick] = useState(0)
  const [simulated, setSimulated] = useState({})

  // Simulate health fluctuation on running resources
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {}
      resources
        .filter((r) => r.status === "running")
        .forEach((r) => {
          const roll = Math.random()
          updated[r.id] = roll > 0.85 ? "critical" : roll > 0.7 ? "warning" : "healthy"
        })
      setSimulated(updated)
      setTick((t) => t + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [resources])

  const getHealth = (r) =>
    r.status === "running" ? (simulated[r.id] || r.health || "healthy") : "healthy"

  const healthy = resources.filter((r) => getHealth(r) === "healthy").length
  const warning = resources.filter((r) => getHealth(r) === "warning").length
  const critical = resources.filter((r) => getHealth(r) === "critical").length
  const total = resources.length

  const data = [
    { name: "Healthy", value: healthy || 0, ...HEALTH_CONFIG.healthy },
    { name: "Warning", value: warning || 0, ...HEALTH_CONFIG.warning },
    { name: "Critical", value: critical || 0, ...HEALTH_CONFIG.critical }
  ].filter((d) => d.value > 0)

  const overallStatus = critical > 0 ? "critical" : warning > 0 ? "warning" : "healthy"
  const cfg = HEALTH_CONFIG[overallStatus]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Resource health</p>
          <p className="text-xs text-gray-400 mt-0.5">Updates every 3s</p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} border-current border-opacity-20`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse`} style={{ background: cfg.color }} />
          {cfg.label}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        {/* Donut */}
        <div className="flex-shrink-0 relative" style={{ width: 144, height: 144 }}>
          <ResponsiveContainer width={144} height={144}>
            <PieChart>
              <Pie
                data={data.length ? data : [{ value: 1, color: "#e5e7eb" }]}
                dataKey="value"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={data.length > 1 ? 3 : 0}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
              >
                {(data.length ? data : [{ color: "#e5e7eb" }]).map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "0.5px solid #e5e7eb",
                  background: "white"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">{total}</span>
            <span className="text-[10px] text-gray-400">total</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 flex flex-col gap-2.5">
          {Object.entries(HEALTH_CONFIG).map(([key, config]) => {
            const count = key === "healthy" ? healthy : key === "warning" ? warning : critical
            const pct = total ? Math.round((count / total) * 100) : 0
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: config.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{count}</span>
                    <span className="text-[10px] text-gray-400">{pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: config.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}