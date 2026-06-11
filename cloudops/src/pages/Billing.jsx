import { useResources } from "../context/ResourceContext"
import {
  CreditCard, Receipt, Wallet, TrendingUp,
  ArrowUpRight, ArrowDownRight, Download, Clock
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts"

export default function Billing() {
  const { resources } = useResources()

  const currentBill = resources.reduce((sum, r) => sum + (r.cost || 0), 0)
  const runningBill = resources.filter((r) => r.status === "running").reduce((sum, r) => sum + (r.cost || 0), 0)
  const stoppedBill = resources.filter((r) => r.status === "stopped").reduce((sum, r) => sum + (r.cost || 0), 0)
  const tax = Math.round(currentBill * 0.18)
  const totalPayable = currentBill + tax

  const highestCost = resources.reduce(
    (max, r) => (!max || (r.cost || 0) > (max.cost || 0) ? r : max), null
  )

  const nextBilling = new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  })

  // Spending trend (last 6 months simulated from current)
  const trendData = [
    { month: "Nov", amount: Math.round(currentBill * 0.72) },
    { month: "Dec", amount: Math.round(currentBill * 0.80) },
    { month: "Jan", amount: Math.round(currentBill * 0.85) },
    { month: "Feb", amount: Math.round(currentBill * 0.91) },
    { month: "Mar", amount: Math.round(currentBill * 0.96) },
    { month: "Apr", amount: currentBill },
  ]

  const invoices = [
    { month: "March 2025", amount: Math.round(currentBill * 0.96), status: "Paid", date: "Apr 1, 2025" },
    { month: "February 2025", amount: Math.round(currentBill * 0.91), status: "Paid", date: "Mar 1, 2025" },
    { month: "January 2025", amount: Math.round(currentBill * 0.85), status: "Paid", date: "Feb 1, 2025" },
    { month: "December 2024", amount: Math.round(currentBill * 0.80), status: "Paid", date: "Jan 1, 2025" },
  ]

  // Resource cost breakdown (top 5)
  const topResources = [...resources]
    .sort((a, b) => (b.cost || 0) - (a.cost || 0))
    .slice(0, 5)

  const maxCost = topResources[0]?.cost || 1

  return (
    <div className="flex flex-col gap-8 p-5 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Billing</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage infrastructure billing and payments</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
          <Clock size={11} />
          Billing cycle: Monthly
        </div>
      </div>

      {/* Top summary — big card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

          {/* Total payable — hero number */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Total payable this month</p>
            <p className="text-5xl font-bold text-gray-800 dark:text-gray-100 mt-1">${totalPayable}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                Base <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">${currentBill}</span>
              </span>
              <span className="text-gray-200 dark:text-gray-700">+</span>
              <span className="flex items-center gap-1">
                Tax 18% <span className="font-medium text-red-400 ml-1">+${tax}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1 text-xs text-amber-500 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                <Clock size={10} />
                Due {nextBilling}
              </div>
            </div>
          </div>

          {/* Split breakdown */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Charge breakdown</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Running resources</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">${runningBill}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentBill ? (runningBill / currentBill) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Stopped resources</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">${stoppedBill}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${currentBill ? (stoppedBill / currentBill) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Tax (18%)</span>
                    <span className="font-medium text-red-400">${tax}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${totalPayable ? (tax / totalPayable) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Payment info</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Wallet size={16} className="text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Auto Payment</p>
                  <p className="text-[10px] text-emerald-500 mt-0.5">● Enabled</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <CreditCard size={16} className="text-violet-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Next billing date</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{nextBilling}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <TrendingUp size={16} className="text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Top spender</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{highestCost?.name || "—"} · ${highestCost?.cost || 0}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Spending trend + Resource breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Spending trend chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">Spending trend</p>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <ArrowUpRight size={12} />
              +{currentBill && trendData[0].amount ? Math.round(((currentBill - trendData[0].amount) / trendData[0].amount) * 100) : 0}% vs 6mo ago
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="billingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "0.5px solid #e5e7eb", background: "white" }}
                  formatter={(v) => [`$${v}`, "Spending"]}
                />
                <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} fill="url(#billingGrad)" dot={{ r: 3, fill: "#8b5cf6" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource cost breakdown */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">Top spending resources</p>
          {topResources.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">No resources found</p>
          ) : (
            <div className="flex flex-col gap-3 mt-1">
              {topResources.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{r.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">${r.cost || 0}/mo</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${((r.cost || 0) / maxCost) * 100}%`,
                          background: i === 0 ? "#8b5cf6" : i === 1 ? "#3b82f6" : i === 2 ? "#10b981" : i === 3 ? "#f59e0b" : "#6b7280"
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Invoice history */}
      <section>
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">Invoice history</p>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-medium">Invoice</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Receipt size={14} className="text-violet-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">{inv.month}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{inv.date}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300">${inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      inv.status === "Paid"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-500 transition-colors ml-auto">
                      <Download size={11} />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}