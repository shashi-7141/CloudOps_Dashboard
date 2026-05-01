import { useState, useEffect, useRef } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"
import { useResources } from "../../context/ResourceContext"

function generatePoint() {
  return {
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    cpu: Math.floor(30 + Math.random() * 50),
    memory: Math.floor(40 + Math.random() * 45),
    network: Math.floor(10 + Math.random() * 60)
  }
}

const INITIAL_DATA = Array.from({ length: 10 }, (_, i) => ({
  time: new Date(Date.now() - (9 - i) * 3000).toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  }),
  cpu: Math.floor(30 + Math.random() * 50),
  memory: Math.floor(40 + Math.random() * 45),
  network: Math.floor(10 + Math.random() * 60)
}))

const METRICS = [
  { key: "cpu", label: "CPU", color: "#3b82f6" },
  { key: "memory", label: "Memory", color: "#8b5cf6" },
  { key: "network", label: "Network", color: "#10b981" }
]

export default function UsageChart() {
  const { resources } = useResources()
  const [data, setData] = useState(INITIAL_DATA)
  const [active, setActive] = useState("cpu")
  const [live, setLive] = useState(true)
  const intervalRef = useRef(null)

  const running = resources.filter((r) => r.status === "running").length
  const latest = data[data.length - 1]
  const prev = data[data.length - 2]
  const trend = latest && prev ? latest[active] - prev[active] : 0

  useEffect(() => {
    if (live) {
      intervalRef.current = setInterval(() => {
        setData((prev) => [...prev.slice(-19), generatePoint()])
      }, 2000)
    }
    return () => clearInterval(intervalRef.current)
  }, [live])

  const metric = METRICS.find((m) => m.key === active)

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-5 flex flex-col gap-3 w-full min-w-0 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Resource usage</p>
          <p className="text-xs text-gray-400 mt-0.5">{running} instances reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLive((v) => !v)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
              live
                ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
                : "bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
            {live ? "Live" : "Paused"}
          </button>
        </div>
      </div>

      {/* Metric selector + live value */}
      <div className="flex items-center gap-2">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors ${
              active === m.key
                ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
            {m.label}
          </button>
        ))}
        <div className="ml-auto flex items-baseline gap-1">
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {latest?.[active] ?? "—"}
          </span>
          <span className="text-xs text-gray-400">%</span>
          {trend !== 0 && (
            <span className={`text-xs ml-1 ${trend > 0 ? "text-red-400" : "text-emerald-500"}`}>
              {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${active}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "0.5px solid #e5e7eb",
                background: "white"
              }}
              formatter={(v) => [`${v}%`, metric.label]}
              labelStyle={{ color: "#6b7280", fontSize: 11 }}
            />
            <Area
              type="monotone"
              dataKey={active}
              stroke={metric.color}
              strokeWidth={2}
              fill={`url(#grad-${active})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}