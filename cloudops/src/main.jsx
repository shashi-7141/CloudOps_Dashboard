import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import { ResourceProvider } from "./context/ResourceContext"
import { ThemeProvider } from "./context/ThemeContext"
import { LogProvider } from "./context/LogContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LogProvider>
          <ResourceProvider>
            <App />
          </ResourceProvider>
        </LogProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)