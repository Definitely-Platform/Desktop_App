import { useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import AuthCallback from "./pages/AuthCallback";

function App() {
  const navigate = useNavigate();
  const lastHandledUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function initDeepLink() {
      try {
        const { onOpenUrl, getCurrent } = await import("@tauri-apps/plugin-deep-link");

        const handleIncomingUrl = async (urlStr: string) => {
          if (!urlStr || urlStr === lastHandledUrlRef.current) return;
          lastHandledUrlRef.current = urlStr;

          // Promote the Tauri window to the front
          try {
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

          try {
            // Examples: "done://auth/callback?sso_token=..." or "done://auth/callback#token=..."
            const parsed = new URL(urlStr);
            const path = parsed.pathname || parsed.host;
            const search = parsed.search || "";
            const hash = parsed.hash || "";

            if (
              urlStr.includes("auth/callback") ||
              path.includes("auth") ||
              path.includes("callback")
            ) {
              navigate(`/auth/callback${search}${hash}`, { replace: true });
            }
          } catch {
            const queryIdx = urlStr.indexOf("?");
            const hashIdx = urlStr.indexOf("#");
            const targetIdx = queryIdx !== -1 ? queryIdx : hashIdx;
            const extra = targetIdx !== -1 ? urlStr.substring(targetIdx) : "";
            navigate(`/auth/callback${extra}`, { replace: true });
          }
        };

        // 1. App cold start from deep link (only once per unique URL)
        if (!lastHandledUrlRef.current) {
          const currentUrls = await getCurrent();
          if (currentUrls && currentUrls.length > 0 && currentUrls[0]) {
            handleIncomingUrl(currentUrls[0]);
          }
        }

        // 2. Dynamic event when app is already running
        unlisten = await onOpenUrl((urls) => {
          if (urls && urls.length > 0 && urls[0]) {
            handleIncomingUrl(urls[0]);
          }
        });
      } catch {
        // Fallback when running in browser or plugin unavailable
      }
    }

    initDeepLink();

    return () => {
      if (unlisten) unlisten();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </div>
  );
}

export default App;
