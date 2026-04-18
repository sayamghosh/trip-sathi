import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router"
import { GoogleOAuthProvider } from "@react-oauth/google"

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

const rootElement = document.getElementById("root")
if (!rootElement) {
  console.error("Root element not found")
} else if (!GOOGLE_CLIENT_ID) {
  console.error("Missing VITE_GOOGLE_CLIENT_ID in admin/.env")
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider defaultTheme="light" storageKey="travelie-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </StrictMode>
  )
}
