import { useState } from "react"
import { useResources } from "../../context/ResourceContext"
import ResourceCard from "./ResourceCard"
import ResourceForm from "./ResourceForm"
import { Plus, Search, SlidersHorizontal, X } from "lucide-react"

export default function ResourceList() {

  const { resources, addResource, deleteResource, updateResource } = useResources()

  const [editingResource, setEditingResource] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredResources = resources
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    .filter((r) => typeFilter === "all" ? true : r.type === typeFilter)
    .filter((r) => statusFilter === "all" ? true : r.status === statusFilter)

  const openAdd = () => {
    setEditingResource(null)
    setIsDrawerOpen(true)
  }

  const openEdit = (resource) => {
    setEditingResource(resource)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditingResource(null)
  }

  const hasActiveFilters = typeFilter !== "all" || statusFilter !== "all" || search !== ""

  return (
    <div className="flex flex-col gap-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

        {/* Search */}
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 gap-2 flex-1 min-w-0">
          <Search size={14} className="text-gray-400 shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search resources"
            className="outline-none bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 w-full"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal size={14} className="text-gray-400" aria-hidden="true" />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by type"
            className="border border-gray-200 dark:border-gray-700 px-2 py-2 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All types</option>
            <option value="server">Server</option>
            <option value="database">Database</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="border border-gray-200 dark:border-gray-700 px-2 py-2 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All status</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => { setSearch(""); setTypeFilter("all"); setStatusFilter("all") }}
              className="text-xs text-blue-500 hover:text-blue-700 underline"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={openAdd}
          aria-label="Add new resource"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus size={15} aria-hidden="true" />
          Add Resource
        </button>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500" aria-live="polite" aria-atomic="true">
          {filteredResources.length === resources.length
            ? `${resources.length} resource${resources.length !== 1 ? "s" : ""}`
            : `${filteredResources.length} of ${resources.length} resources`}
        </p>
      </div>

      {/* Resource Cards */}
      <div
        role="list"
        aria-label="Resource list"
        className="flex flex-col gap-3 max-h-[560px] overflow-y-auto pr-1"
      >
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-600">
            <p className="text-sm">No resources match your filters.</p>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearch(""); setTypeFilter("all"); setStatusFilter("all") }}
                className="text-xs text-blue-500 hover:underline mt-2"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div role="listitem" key={resource.id}>
              <ResourceCard
                resource={resource}
                onDelete={deleteResource}
                onEdit={openEdit}
              />
            </div>
          ))
        )}
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <ResourceForm
          onAdd={addResource}
          editingResource={editingResource}
          onUpdate={updateResource}
          onClose={closeDrawer}
        />
      )}

    </div>
  )
}