import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"
import Dashboard from "./pages/Dashboard"
import Resources from "./pages/Resources"
import ResourceDetails from "./pages/ResourceDetails"

export default function App() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-950 transition-colors">

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">

        <Header />

        <main className="flex-1 p-4 md:p-6 text-gray-800 dark:text-gray-200 overflow-y-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:id" element={<ResourceDetails />} />
          </Routes>
        </main>

      </div>

    </div>
  )
}