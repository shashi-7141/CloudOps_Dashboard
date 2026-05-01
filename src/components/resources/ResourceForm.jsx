import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { X } from "lucide-react"

export default function ResourceForm({ onAdd, editingResource, onUpdate, onClose }) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (editingResource) {
      reset({
        ...editingResource,
        tags: Array.isArray(editingResource.tags)
          ? editingResource.tags.join(", ")
          : editingResource.tags || ""
      })
    } else {
      reset()
    }
  }, [editingResource, reset])

  const onSubmit = (data) => {
    const formattedTags = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : []

    if (editingResource) {
      onUpdate({ ...editingResource, ...data, tags: formattedTags, cost: Number(data.cost) || 0 })
    } else {
      onAdd({ ...data, cost: Number(data.cost) || 0, tags: formattedTags })
    }

    reset()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={editingResource ? "Update Resource" : "Add New Resource"}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              {editingResource ? "Update Resource" : "Add New Resource"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {editingResource ? "Edit the details below" : "Fill in the details to add a new resource"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close form"
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5"
          noValidate
        >

          {/* Resource Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Resource Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              {...register("name", { required: "Resource name is required" })}
              placeholder="e.g. prod-server-01"
              className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && (
              <p role="alert" className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="type"
              className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Type
            </label>
            <select
              id="type"
              {...register("type")}
              className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="server">Server</option>
              <option value="database">Database</option>
            </select>
          </div>

          {/* Region */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="region"
              className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Region
            </label>
            <select
              id="region"
              {...register("region")}
              className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="us-east">US-East</option>
              <option value="us-west">US-West</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
            </select>
          </div>

          {/* Cost */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="cost"
              className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Monthly Cost ($)
            </label>
            <input
              id="cost"
              type="number"
              min="0"
              {...register("cost", {
                min: { value: 0, message: "Cost cannot be negative" }
              })}
              placeholder="0"
              className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.cost && (
              <p role="alert" className="text-xs text-red-500 mt-0.5">{errors.cost.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="tags"
              className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Tags
            </label>
            <input
              id="tags"
              {...register("tags")}
              placeholder="prod, critical, frontend"
              className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">Separate tags with commas</p>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="resource-form"
            onClick={handleSubmit(onSubmit)}
            className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            {editingResource ? "Update Resource" : "Add Resource"}
          </button>
        </div>
      </div>
    </>
  )
}