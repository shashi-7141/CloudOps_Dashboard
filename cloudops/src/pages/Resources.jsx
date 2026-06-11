import ResourceList from "../components/resources/ResourceList"
import { useResources } from "../context/ResourceContext"
import { useAuth } from "../context/AuthContext"

export default function Resources() {
  const { resources, loading, error } = useResources()
  const { isAdmin } = useAuth()

  if (loading) {
  return <p className="text-center mt-10">Loading resources...</p>
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>
  }
  return (
    <div>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Resources</h1>

          {!isAdmin && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
              View Only
            </span>
          )}
        </div>

        <p className="text-gray-500">
          Manage your cloud infrastructure resources
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Total Resources: {resources.length}
        </p>
      </div>

      <ResourceList />

    </div>
  )
}