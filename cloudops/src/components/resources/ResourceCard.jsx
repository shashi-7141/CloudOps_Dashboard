import { Server, Database, HardDrive, Trash2, Edit } from "lucide-react" 
import { useResources } from "../../context/ResourceContext"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function ResourceCard({ resource, onDelete, onEdit }) {

  const { toggleStatus } = useResources()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

const Icon = resource.type === "server" ? Server : resource.type === "database" ? Database : HardDrive

  const statusColor =
    resource.status === "running"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600"

  return (
    <div
      onClick={() => navigate(`/resources/${resource.id}`)}
      className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex justify-between items-center transition transform hover:-translate-y-1 hover:shadow-lg cursor-pointer font-sans"
    >

      <div className="flex items-center gap-3">

        <Icon className="text-blue-500" size={22} />

        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{resource.name}</h3>

          <div className="flex items-center gap-2 mt-1">

              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  resource.health === "healthy"
                    ? "bg-green-100 text-green-600"
                    : resource.health === "warning"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {resource.health || "healthy"}
              </span>

              <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}>
                {resource.status || "running"}
              </span>

              <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                {resource.region || "unknown"}
              </span>

          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {resource.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}   

          <p className="text-xs text-gray-400 mt-1">
            Created: {resource.createdAt ? new Date(resource.createdAt).toLocaleString() : "just now"}
          </p>

          <p className="text-xs font-medium text-green-500 mt-1">
            Cost: ${resource.cost || 0} / month
          </p>
          {resource.type === "storage" && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-blue-500 font-medium">
                Storage Type: {resource.storageType || "N/A"}
              </p>

              <p className="text-xs text-purple-500 font-medium">
                Capacity: {resource.capacity || 0} {resource.storageUnit || ""}
              </p>
            </div>
        )}

        </div>

      </div>

      <div className="flex gap-2">

        <button
          onClick={(e) => {
            e.stopPropagation()

            if (isAdmin) {
              toggleStatus(
                resource.docId,
                resource.status === "running" ? "stopped" : "running"
              )
            }
          }}
          disabled={!isAdmin}
          className={`text-xs font-medium px-2 py-1 rounded ${
            isAdmin
              ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {resource.status === "running" ? "Stop" : "Start"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(resource)
          }}
          disabled={!isAdmin}
          className={`p-2 hover:bg-gray-100 rounded ${
            isAdmin
              ? "text-gray-600 dark:text-gray-400"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <Edit size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(resource.docId)
          }}
          className="p-2 hover:bg-red-100 rounded text-red-500"
        >
          <Trash2 size={16} />
        </button>

      </div>

    </div>
  )
}