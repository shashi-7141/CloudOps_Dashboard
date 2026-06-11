import { createContext, useContext, useState, useEffect } from "react"
import { useLogs } from "./LogContext"
import { useAuth } from "./AuthContext"

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where
} from "firebase/firestore"

import { db } from "../firebase"

export const ResourceContext = createContext()

export function ResourceProvider({ children }) {
  const { addLog } = useLogs()
  const { user, isAdmin } = useAuth()

  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchResources = async () => {
    if (!user) return

    try {
      setLoading(true)

      let q

      if (isAdmin) {
        q = collection(db, "resources")
      } else {
        q = query(
          collection(db, "resources"),
          where("ownerId", "==", user.uid)
        )
      }

      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data()
      }))

      setResources(data)
      setError(null)
    } catch (err) {
      console.log(err)
      setError("Failed to load resources")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [user, isAdmin])

  const addResource = async (data) => {
    try {
      const newResource = {
        id:
          data.type === "server"
            ? `srv-${Math.floor(Math.random() * 10000)}`
            : `db-${Math.floor(Math.random() * 10000)}`,
        ...data,
        tags: data.tags || [],
        status: "running",
        health: "healthy",
        ownerId: user.uid,
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, "resources"), newResource)

      addLog(`Resource ${data.name} created`)
      fetchResources()
    } catch (err) {
      console.log(err)
    }
  }

  const deleteResource = async (docId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    )
    if (!confirmDelete) return

    const resource = resources.find((r) => r.docId === docId)

    await deleteDoc(doc(db, "resources", docId))

    addLog(`Resource ${resource.name} deleted`)
    fetchResources()
  }

  const updateResource = async (updated) => {
    const resourceRef = doc(db, "resources", updated.docId)

    await updateDoc(resourceRef, updated)

    addLog(`Resource ${updated.name} updated`)
    fetchResources()
  }

  const toggleStatus = async (docId) => {
    const resource = resources.find((r) => r.docId === docId)

    if (!resource) return

    const newStatus =
      resource.status === "running" ? "stopped" : "running"

    await updateDoc(doc(db, "resources", docId), {
      status: newStatus
    })

    addLog(`Resource ${resource.name} ${newStatus}`)
    fetchResources()
  }

  return (
    <ResourceContext.Provider
      value={{
        resources,
        addResource,
        deleteResource,
        updateResource,
        toggleStatus,
        loading,
        error
      }}
    >
      {children}
    </ResourceContext.Provider>
  )
}

export function useResources() {
  return useContext(ResourceContext)
}