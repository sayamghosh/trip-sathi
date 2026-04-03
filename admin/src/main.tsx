import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router"
import { GoogleOAuthProvider } from "@react-oauth/google"

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "868218151901-dudv5hns1427j9m9s9i9i6c31u5f60tq.apps.googleusercontent.com"

const rootElement = document.getElementById("root")
if (!rootElement) {
  console.error("Root element not found")
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
