import StatsCards from "../components/dashboard/StatsCards"
import UsageChart from "../components/dashboard/UsageChart"
import { useResources } from "../context/ResourceContext"
import ActivityLogs from "../components/dashboard/ActivityLogs"
import CostChart from "../components/dashboard/CostChart"
import RegionChart from "../components/dashboard/RegionChart"
import HealthChart from "../components/dashboard/HealthChart"
import QuickActions from "../components/dashboard/QuickActions"
import CostForecastChart from "../components/dashboard/CostForecastChart"

export default function Dashboard() {
  const { resources } = useResources()

  const highestCost = resources.reduce(
    (max, r) => (!max || (r.cost || 0) > (max.cost || 0) ? r : max),
    null
  )
  const running = resources.filter((r) => r.status === "running").length

  return (
    <div className="flex flex-col gap-8 p-5 max-w-7xl mx-auto w-full">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Overview of your cloud infrastructure
          </p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 mt-1">
          Last 24h
        </span>
      </div>

      {/* Key metrics */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Key metrics
        </p>
        <StatsCards resources={resources} />
      </section>

      {/* Resource analytics — left: charts, right: forecast + insights */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Resource analytics
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left — usage + cost charts */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <UsageChart />
            <CostChart />
          </div>

          {/* Right — forecast + quick insights stacked */}
          <div className="flex flex-col gap-4">
            <CostForecastChart />

            {/* Quick insights */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">
                Quick insights
              </p>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-l-[3px] border-l-blue-500 px-4 py-3 rounded-r-lg">
                <p className="text-xs text-gray-400 mb-1">Highest cost resource</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {highestCost ? `${highestCost.name} ($${highestCost.cost})` : "—"}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-l-[3px] border-l-emerald-500 px-4 py-3 rounded-r-lg">
                <p className="text-xs text-gray-400 mb-1">Most used day</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Friday</p>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-l-[3px] border-l-violet-500 px-4 py-3 rounded-r-lg">
                <p className="text-xs text-gray-400 mb-1">Active resources</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {running} Running
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Infrastructure health */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Infrastructure health
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RegionChart />
          <HealthChart />
        </div>
      </section>

      {/* Actions & activity */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
          Actions & activity
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <QuickActions />
          <ActivityLogs />
        </div>
      </section>

    </div>
  )
}