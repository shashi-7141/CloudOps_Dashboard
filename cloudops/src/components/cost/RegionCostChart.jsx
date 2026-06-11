import { useResources } from "../../context/ResourceContext"

const REGION_COLORS = {
  "US-East": "bg-blue-500",
  "Asia-South": "bg-emerald-500",
  "Europe": "bg-violet-500",
  "US-West": "bg-amber-500"
}

export default function RegionCostChart() {
  const { resources } = useResources()

  const grouped = {}

  resources.forEach((r) => {
    const region = r.region || "Unknown"
    grouped[region] = (grouped[region] || 0) + (r.cost || 0)
  })

  const data = Object.keys(grouped).map((region) => ({
    region,
    cost: grouped[region]
  }))

  const totalCost = data.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 flex flex-col gap-4">

      {/* Header */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Region-wise spending
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Distribution across cloud regions
        </p>
      </div>

      {/* Region breakdown */}
      <div className="flex flex-col gap-4">
        {data.map((item) => {
          const percentage = totalCost
            ? Math.round((item.cost / totalCost) * 100)
            : 0

          return (
            <div key={item.region}>
              <div className="flex justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      REGION_COLORS[item.region] || "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.region}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    ${item.cost}
                  </p>
                  <p className="text-xs text-gray-400">
                    {percentage}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    REGION_COLORS[item.region] || "bg-gray-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}