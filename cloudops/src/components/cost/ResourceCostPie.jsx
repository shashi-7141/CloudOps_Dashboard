import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { useResources } from "../../context/ResourceContext"

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]

export default function ResourceCostPie() {
  const { resources } = useResources()

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 h-[320px] min-w-0 overflow-hidden">

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Resource cost distribution
        </p>
        <p className="text-xs text-gray-400">
          Spending by resource
        </p>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={resources}
              dataKey="cost"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
            >
              {resources.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}