import ResourceList from "../components/resources/ResourceList"
import { useResources } from "../context/ResourceContext"

export default function Resources() {

  const { resources, loading, error } = useResources()

  if (loading) {
  return <p className="text-center mt-10">Loading resources...</p>
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>
  }
  return (
    <div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Resources</h1>

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