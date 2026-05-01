import { useState, useEffect } from "react"
import { useResources } from "../../context/ResourceContext"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function CostChart() {
  const { resources } = useResources()
  const [prevTotal, setPrevTotal] = useState(null)
  const [flash, setFlash] = useState(false)

  const serverCost = resources
    .filter((r) => r.type === "server")
    .reduce((sum, r) => sum + (r.cost || 0), 0)

  const databaseCost = resources
    .filter((r) => r.type === "database")
    .reduce((sum, r) => sum + (r.cost || 0), 0)

  const runningCost = resources
    .filter((r) => r.status === "running")
    .reduce((sum, r) => sum + (r.cost || 0), 0)

  const stoppedCost = resources
    .filter((r) => r.status === "stopped")
    .reduce((sum, r) => sum + (r.cost || 0), 0)

  const total = serverCost + databaseCost

  useEffect(() => {
    if (prevTotal !== null && prevTotal !== total) {
      setFlash(true)
      setTimeout(() => setFlash(false), 800)
    }
    setPrevTotal(total)
  }, [total])

  const data = [
    { name: "Servers", cost: serverCost, fill: "#3b82f6" },
    { name: "Databases", cost: databaseCost, fill: "#8b5cf6" },
    { name: "Running", cost: runningCost, fill: "#10b981" },
    { name: "Stopped", cost: stoppedCost, fill: "#f59e0b" }
  ]

  const serverPct = total ? ((serverCost / total) * 100).toFixed(0) : 0
  const dbPct = total ? ((databaseCost / total) * 100).toFixed(0) : 0
  const trend = total > 0

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-5 flex flex-col gap-3 w-full min-w-0 overflow-hidden">

      {/* Header */}
      <div className="flex items-start justify-between h-22">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost breakdown</p>
          <p className="text-xs text-gray-400 mt-0.5">Based on current resources</p>
        </div>
        <div className={`flex items-baseline gap-1 transition-all duration-300 ${flash ? "scale-105" : ""}`}>
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">${total}</span>
          <span className="text-xs text-gray-400">/mo</span>
        </div>
      </div>

      {/* Mini stat pills */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Servers {serverPct}%
        </div>
        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          Databases {dbPct}%
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <TrendingUp size={12} />
          ${runningCost} active
        </div>
      </div>

      {/* Chart */}
      <div className="h-50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "0.5px solid #e5e7eb",
                background: "white"
              }}
              formatter={(v) => [`$${v}`, "Cost"]}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar dataKey="cost" radius={[4, 4, 0, 0]} isAnimationActive={true}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}