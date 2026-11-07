import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, createDesktopAdapter } from "@sabrealam/platform-sdk";
import { openUrl } from "@tauri-apps/plugin-opener";
import App from "./App";
import "./index.css";

const isDev = Boolean(import.meta.env.DEV);
const useProdAuth = import.meta.env.VITE_USE_PROD_AUTH === "true";

const redirectUri =
  (import.meta.env.VITE_REDIRECT_URI as string) || "done://auth/callback";

// In local dev, default to local auth service (5174/8081); in production build or when VITE_USE_PROD_AUTH=true, use canonical accounts.definitely.live
const authUiHost =
  (import.meta.env.VITE_ACCOUNTS_URL as string) ||
  (import.meta.env.VITE_AUTH_UI_URL as string) ||
  (isDev && !useProdAuth ? "http://localhost:5174" : "https://accounts.definitely.live");

const authApiHost =
  (import.meta.env.VITE_AUTH_API_URL as string) ||
  (isDev && !useProdAuth ? "http://localhost:8081" : "https://api.accounts.definitely.live");

const desktopAdapter = createDesktopAdapter({
  platformName: "desktop",
  redirectUri,
  openBrowser: async (url: string) => {
    try {
      await openUrl(url);
    } catch {
      window.open(url, "_blank");
    }
  },
  // Keep background session sync silent so the browser stays in view for the "Open in App" prompt
  focusWindow: async () => {},
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider
      adapter={desktopAdapter}
      config={{
        isDev: isDev && !useProdAuth,
        authUiHost,
        authApiHost,
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
