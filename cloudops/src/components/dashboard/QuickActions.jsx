import { useResources } from "../../context/ResourceContext"
import { useState } from "react"
import { Server, Database, X, Zap } from "lucide-react"

export default function QuickActions() {
  const { addResource } = useResources()

  const [open, setOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const [name, setName] = useState("")
  const [cost, setCost] = useState("")
  const [region, setRegion] = useState("us-east")
  const [error, setError] = useState("")

  const actions = [
    {
      label: "Launch Server",
      type: "server",
      defaultCost: 50,
      icon: Server,
      accent: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-500",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      desc: "Spin up a new compute instance"
    },
    {
      label: "Launch Database",
      type: "database",
      defaultCost: 30,
      icon: Database,
      accent: "bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800",
      iconColor: "text-violet-500",
      btnColor: "bg-violet-600 hover:bg-violet-700",
      desc: "Provision a new database resource"
    }
  ]

  const handleOpen = (action) => {
    setSelectedAction(action)
    setName("")
    setCost(action.defaultCost)
    setRegion("us-east")
    setError("")
    setOpen(true)
  }

  const handleCreate = () => {
    if (!name.trim()) return setError("Resource name is required.")
    if (!cost || Number(cost) < 0) return setError("Enter a valid cost.")

    addResource({
      name: name.trim(),
      type: selectedAction.type,
      region,
      cost: Number(cost),
      tags: ["manual"],
      health: "healthy"
    })

    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
    setError("")
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-full min-h-[320px]">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Zap size={14} className="text-amber-400" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick actions</p>
      </div>

      {/* Action cards */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <button
              key={i}
              onClick={() => handleOpen(action)}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${action.accent}`}
            >
              <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex-shrink-0`}>
                <Icon size={15} className={action.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{action.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{action.desc}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">
                from ${action.defaultCost}/mo
              </span>
            </button>
          )
        })}

        {/* Divider hint */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            More actions available in Resources
          </p>
        </div>
      </div>

      {/* Modal */}
      {open && selectedAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onClick={handleClose}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <selectedAction.icon size={14} className={selectedAction.iconColor} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    Create {selectedAction.type}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Fill in the details below</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-4 flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Resource name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder={`e.g. prod-${selectedAction.type}-01`}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError("") }}
                  className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="us-east">US-East</option>
                    <option value="us-west">US-West</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Cost ($/mo)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={cost}
                    onChange={(e) => { setCost(e.target.value); setError("") }}
                    className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex gap-2 justify-end px-5 py-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className={`px-4 py-2 text-sm rounded-lg text-white font-medium transition-colors ${selectedAction.btnColor}`}
              >
                Create {selectedAction.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}