import { useResources } from "../../context/ResourceContext"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const REGIONS = [
  { key: "us-east", label: "US East", color: "#3b82f6" },
  { key: "us-west", label: "US West", color: "#8b5cf6" },
  { key: "europe", label: "Europe", color: "#10b981" },
  { key: "asia", label: "Asia", color: "#f59e0b" }
]

const LATENCY = {
  "us-east": () => Math.floor(10 + Math.random() * 15),
  "us-west": () => Math.floor(20 + Math.random() * 20),
  "europe": () => Math.floor(35 + Math.random() * 30),
  "asia": () => Math.floor(70 + Math.random() * 50)
}

export default function RegionChart() {
  const { resources } = useResources()

  const data = REGIONS.map((r) => ({
    ...r,
    value: resources.filter((res) => res.region === r.key).length,
    running: resources.filter((res) => res.region === r.key && res.status === "running").length,
    latency: LATENCY[r.key]()
  })).filter((r) => r.value > 0)

  const total = data.reduce((s, r) => s + r.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{ background: "white", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
        <p style={{ fontWeight: 500, marginBottom: 4 }}>{d.label}</p>
        <p style={{ color: "#6b7280" }}>{d.value} resources · {d.running} running</p>
        <p style={{ color: "#6b7280" }}>~{d.latency}ms latency</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-5 flex flex-col gap-3 w-full min-w-0 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Region distribution</p>
          <p className="text-xs text-gray-400 mt-0.5">{total} resources across {data.length} regions</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Donut */}
        <div className="w-full sm:w-36 h-[200px] sm:h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.length ? data : [{ value: 1, color: "#e5e7eb" }]}
                dataKey="value"
                innerRadius={38}
                outerRadius={45}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
              >
                {(data.length ? data : [{ color: "#e5e7eb" }]).map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend + latency */}
        <div className="flex-1 flex flex-col gap-2">
          {data.length === 0 ? (
            <p className="text-xs text-gray-400">No resources with region data</p>
          ) : (
            data.map((r) => (
              <div key={r.key} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">{r.label}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{r.value}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  r.latency < 40
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                    : r.latency < 80
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                    : "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400"
                }`}>
                  {r.latency}ms
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}