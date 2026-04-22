import { createContext, useContext, useState, useEffect } from "react"
import { useLogs } from "./LogContext"
import {
  getResources,
  createResource,
  updateResourceAPI,
  deleteResourceAPI
} from "../services/api"

export const ResourceContext = createContext()

export function ResourceProvider({ children }) {
  const { addLog } = useLogs()

  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)

    getResources()
      .then((data) => {
        setResources(data)
        setError(null)
      })
      .catch(() => {
        setError("Failed to load resources")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources))
  }, [resources])

  const addResource = (data) => {
    const newResource = {
      id:
        data.type === "server"
          ? `srv-${Math.floor(Math.random() * 10000)}`
          : `db-${Math.floor(Math.random() * 10000)}`,
      ...data,
      tags: data.tags || [],
      status: "running",
      health: "healthy",
      createdAt: new Date().toISOString()
    }
    setResources([...resources, newResource])
    addLog(`Resource ${data.name} created`, newResource.id)

  }

  const deleteResource = (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this resource?")
    if (!confirmDelete) return

    const resource = resources.find((r) => r.id === id)

    addLog(`Resource ${resource.name} deleted`, resource.id)

    setResources(resources.filter((r) => r.id !== id))
  }
  const deleteAllResources = () => {
    setResources([])
    addLog("All resources deleted")
  }


  const updateResource = (updated) => {

    const oldResource = resources.find((r) => r.id === updated.id)

    setResources(
      resources.map((r) =>
        r.id === updated.id ? updated : r
      )
    )

    if (oldResource.cost !== updated.cost) {
      addLog(`Cost updated for ${updated.name}`, updated.id)
    } else {
      addLog(`Resource ${updated.name} updated`, updated.id)
    }

  }

  const toggleStatus = (id) => {
    setResources(
      resources.map((r) => {
        if (r.id === id) {

          const newStatus = r.status === "running" ? "stopped" : "running"

          addLog(`Resource ${r.name} ${newStatus}`,r.id)

          return { ...r, status: newStatus }
        }

        return r
      })
    )
  }

  return (
    <ResourceContext.Provider
      value={{ resources, addResource, deleteResource, updateResource,loading, error, toggleStatus }}
    >
      {children}
    </ResourceContext.Provider>
  )
}

export function useResources() {
  return useContext(ResourceContext)
}