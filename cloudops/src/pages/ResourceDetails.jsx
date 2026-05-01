import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useResources } from "../context/ResourceContext"
import { Server, Database, ArrowLeft, Activity, Cpu, MemoryStick, Wifi, Trash2, Power, Clock } from "lucide-react"
import { resourceMetrics } from "../data/resourceMetrics"
import { generateMetrics } from "../utils/generateMetrics"
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"
import ResourceActivity from "../components/resources/ResourceActivity"

export default function ResourceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { resources, toggleStatus, deleteResource } = useResources()

  const resource = resources.find((r) => r.id === id)

  const [metrics, setMetrics] = useState(generateMetrics())
  const [history, setHistory] = useState([])
  const [live, setLive] = useState(true)

  useEffect(() => {
    if (!live) return
    const interval = setInterval(() => {
      const newMetrics = generateMetrics()
      setMetrics(newMetrics)
      setHistory((prev) => [
        ...prev.slice(-19),
        {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          cpu: newMetrics.cpu,
          memory: newMetrics.memory,
          network: newMetrics.network
        }
      ])
    }, 3000)
    return () => clearInterval(interval)
  }, [live])

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-sm text-red-500">Resource not found.</p>
        <button onClick={() => navigate("/resources")} className="text-xs text-blue-500 hover:underline">
          ← Back to Resources
        </button>
      </div>
    )
  }

  const Icon = resource.type === "server" ? Server : Database
  const isServer = resource.type === "server"
  const isRunning = resource.status === "running"

  const healthConfig = {
    healthy: { cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400", dot: "bg-emerald-500" },
    warning: { cls: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400", dot: "bg-amber-500" },
    critical: { cls: "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400", dot: "bg-red-500" }
  }
  const health = resource.health || "healthy"
  const hCfg = healthConfig[health] || healthConfig.healthy

  const metricItems = [
    { label: "CPU", value: metrics.cpu, icon: Cpu, color: "#3b82f6", bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400" },
    { label: "Memory", value: metrics.memory, icon: MemoryStick, color: "#8b5cf6", bg: "bg-violet-50 dark:bg-violet-950", text: "text-violet-600 dark:text-violet-400" },
    { label: "Network", value: metrics.network, icon: Wifi, color: "#10b981", bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400" }
  ]

  return (
    <div className="flex flex-col gap-6 p-5 max-w-5xl mx-auto w-full">

      {/* Back */}
      <button
        onClick={() => navigate("/resources")}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        Back to Resources
      </button>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
            isServer
              ? "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
              : "bg-violet-50 border-violet-200 dark:bg-violet-950 dark:border-violet-800"
          }`}>
            <Icon size={18} className={isServer ? "text-blue-500" : "text-violet-500"} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{resource.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Cloud Resource · {resource.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${hCfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hCfg.dot}`} />
            {health.charAt(0).toUpperCase() + health.slice(1)}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${
            isRunning
              ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
              : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
          }`}>
            {resource.status}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${
            isServer
              ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
              : "bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800"
          }`}>
            {resource.type}
          </span>
        </div>
      </div>

      {/* Info grid + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Info card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-4">
            Resource info
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {[
              { label: "Region", value: resource.region || "unknown" },
              { label: "Type", value: resource.type },
              { label: "Health", value: health },
              { label: "Status", value: resource.status },
              { label: "Monthly cost", value: `$${resource.cost || 0} / month`, highlight: true },
              {
                label: "Created",
                value: resource.createdAt
                  ? new Date(resource.createdAt).toLocaleString()
                  : "just now"
              }
            ].map(({ label, value, highlight }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className={`text-sm font-medium capitalize ${highlight ? "text-emerald-500" : "text-gray-800 dark:text-gray-100"}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {resource.tags?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 mb-2">Tags</p>
              <div className="flex gap-1.5 flex-wrap">
                {resource.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">
            Actions
          </p>

          <button
            onClick={() => toggleStatus(resource.id)}
            className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
              isRunning
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
            }`}
          >
            <Power size={14} />
            {isRunning ? "Stop resource" : "Start resource"}
          </button>

          <button
            onClick={() => { deleteResource(resource.id); navigate("/resources") }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg text-sm font-medium border bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:border-red-800 dark:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
            Delete resource
          </button>

          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] text-gray-400 dark:text-gray-600">
              Resource ID
            </p>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5 break-all">
              {resource.id}
            </p>
          </div>
        </div>

      </div>

      {/* Live metrics */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">
            Live metrics
          </p>
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

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-3">
          {metricItems.map(({ label, value, icon: MIcon, color, bg, text }) => (
            <div key={label} className={`${bg} rounded-lg px-3 py-3`}>
              <div className="flex items-center gap-1.5 mb-2">
                <MIcon size={12} className={text} />
                <p className={`text-xs font-medium ${text}`}>{label}</p>
              </div>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{value}<span className="text-sm font-normal text-gray-400 ml-0.5">%</span></p>
              <div className="mt-2 h-1.5 bg-white dark:bg-gray-900 bg-opacity-60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${value}%`, background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CPU History chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">
            CPU usage history
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={11} />
            Rolling 20 points · 3s interval
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} hide />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "0.5px solid #e5e7eb", background: "white" }}
                formatter={(v) => [`${v}%`, "CPU"]}
              />
              <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fill="url(#cpuGrad)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Static usage chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500">
          Resource usage — historical
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={resourceMetrics} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "0.5px solid #e5e7eb", background: "white" }}
                formatter={(v) => [`${v}%`, "Usage"]}
              />
              <Line type="monotone" dataKey="usage" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: "#8b5cf6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity */}
      <ResourceActivity resourceId={resource.id} />

    </div>
  )
}