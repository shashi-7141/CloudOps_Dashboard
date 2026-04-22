import { useResources } from "../../context/ResourceContext"
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts"

export default function CostForecastChart() {
  const { resources } = useResources()

  const currentCost = resources.reduce((t, r) => t + (r.cost || 0), 0)
  const runningCount = resources.filter((r) => r.status === "running").length
  const growthRate = 1 + (runningCount * 0.02)

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
  const today = new Date().getMonth()

  const data = months.map((month, i) => {
    const offset = i - 3
    const cost = Math.round(currentCost * Math.pow(growthRate, offset))
    const isPast = i < 4
    return {
      month,
      actual: isPast ? cost : null,
      forecast: !isPast ? cost : null,
      cost,
      isPast
    }
  })

  const projectedEnd = data[data.length - 1].cost
  const projectedDelta = projectedEnd - currentCost
  const projectedPct = currentCost > 0
    ? ((projectedDelta / currentCost) * 100).toFixed(0)
    : 0

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-5 flex flex-col gap-3 w-full min-w-0 overflow-hidden">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost forecast</p>
        <p className="text-xs text-gray-400 mt-0.5">Projected based on active resources</p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2">
          <p className="text-[10px] text-gray-400 mb-0.5">Current / mo</p>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-100">${currentCost}</p>
        </div>
        <div className={`rounded-md px-3 py-2 ${projectedDelta > 0 ? "bg-red-50 dark:bg-red-950" : "bg-emerald-50 dark:bg-emerald-950"}`}>
          <p className="text-[10px] text-gray-400 mb-0.5">Projected in 4mo</p>
          <p className={`text-base font-semibold ${projectedDelta > 0 ? "text-red-500" : "text-emerald-500"}`}>
            ${projectedEnd}
            <span className="text-xs font-normal ml-1">
              {projectedDelta > 0 ? "▲" : "▼"} {Math.abs(projectedPct)}%
            </span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[220px] sm:h-[260px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
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
              formatter={(v, name) => [v ? `$${v}` : null, name === "actual" ? "Actual" : "Forecast"]}
            />
            <ReferenceLine x="Apr" stroke="#d1d5db" strokeDasharray="4 2" label={{ value: "today", fontSize: 9, fill: "#9ca3af" }} />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 3"
              fill="url(#forecastGrad)"
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#3b82f6" }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-blue-500 rounded inline-block" />
          Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-red-400 inline-block" />
          Forecast
        </span>
      </div>
    </div>
  )
}