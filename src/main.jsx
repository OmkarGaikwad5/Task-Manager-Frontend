import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "../src/styles.css"
import { ThemeProvider } from "@/components/theme-provider"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
          <div className="container mx-auto px-4 py-6">
            <App />
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
