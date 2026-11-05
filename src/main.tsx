import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, createDesktopAdapter } from "@sabrealam/platform-sdk";
import { openUrl } from "@tauri-apps/plugin-opener";
import { invoke } from "@tauri-apps/api/core";
import App from "./App";
import "./index.css";

const isDev = Boolean(import.meta.env.DEV);

const redirectUri =
  (import.meta.env.VITE_REDIRECT_URI as string) ||
  (isDev ? "http://localhost:1420/auth/callback" : "done://auth/callback");

const authUiHost =
  (import.meta.env.VITE_ACCOUNTS_URL as string) ||
  (import.meta.env.VITE_AUTH_UI_URL as string) ||
  (isDev ? "http://localhost:5174" : "https://accounts.definitely.live");

const authApiHost =
  (import.meta.env.VITE_AUTH_API_URL as string) ||
  (isDev ? "http://localhost:8081" : "https://api.accounts.definitely.live");

const desktopAdapter = createDesktopAdapter({
  platformName: "desktop",
  redirectUri,
  openBrowser: async (url) => {
    try {
      await openUrl(url);
    } catch {
      window.open(url, "_blank");
    }
  },
  focusWindow: async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const appWindow = getCurrentWindow();
      await appWindow.unminimize();
      await appWindow.show();
      await appWindow.setFocus();
    } catch {
      // ignore
    }
    try {
      await invoke("focus_window");
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      window.focus();
    }
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider
      adapter={desktopAdapter}
      config={{
        isDev,
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
