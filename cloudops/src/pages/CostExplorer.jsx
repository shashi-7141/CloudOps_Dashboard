import { useResources } from "../context/ResourceContext"
import CostTrendChart from "../components/cost/CostTrendChart"
import ResourceCostPie from "../components/cost/ResourceCostPie"
import RegionCostChart from "../components/cost/RegionCostChart"

export default function CostExplorer() {
  const { resources } = useResources()

  const totalCost = resources.reduce(
    (sum, r) => sum + (r.cost || 0),
    0
  )

  const highestCost = resources.reduce(
    (max, r) =>
      !max || (r.cost || 0) > (max.cost || 0)
        ? r
        : max,
    null
  )

  const forecastCost = Math.round(totalCost * 1.15)

  const budgetLimit = 5000
  const exceeded = totalCost > budgetLimit

  return (
    <div className="flex flex-col gap-8 p-5 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Cost Explorer
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Track infrastructure spending insights
        </p>
      </div>

      {/* Cost metrics */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Cost metrics
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Total Monthly Cost</p>
            <p className="text-xl font-semibold text-blue-500">
              ${totalCost}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Highest Cost Resource</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {highestCost?.name || "—"}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400">Forecast Cost</p>
            <p className="text-xl font-semibold text-violet-500">
              ${forecastCost}
            </p>
          </div>

          <div className={`rounded-lg p-4 border ${
            exceeded
              ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
              : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
          }`}>
            <p className="text-xs text-gray-400">Budget Status</p>
            <p className="text-sm font-semibold">
              {exceeded ? "Budget Exceeded" : "Within Budget"}
            </p>
          </div>

        </div>
      </section>

      {/* Analytics */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Cost analytics
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CostTrendChart />
          <ResourceCostPie />
        </div>
      </section>

      {/* Region breakdown */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Regional spending
        </p>

        <RegionCostChart />
      </section>

    </div>
  )
}