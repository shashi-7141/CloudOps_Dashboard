import { createContext, useContext, useState, useEffect } from "react"

const LogContext = createContext()

export function LogProvider({ children }) {

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("activityLogs")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("activityLogs", JSON.stringify(logs))
  }, [logs])

  // Updated log function
  const addLog = (
    action,
    resourceId = null,
    resourceName = "-",
    user = "Admin"
  ) => {

    const newLog = {
      id: Date.now(),
      action,
      resourceId,
      resourceName,
      user,
      timestamp: new Date().toLocaleString()
    }

    setLogs((prev) => [newLog, ...prev])
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  )
}

function useLogs() {
  return useContext(LogContext)
}

export { useLogs }