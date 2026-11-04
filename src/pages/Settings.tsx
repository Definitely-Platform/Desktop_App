import { useState } from "react";
import { Link } from "react-router-dom";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

function Settings() {
  const [checking, setChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [availableUpdate, setAvailableUpdate] = useState<any>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const handleCheckUpdate = async () => {
    setChecking(true);
    setUpdateStatus("Checking for updates...");
    try {
      const update = await check();
      if (update) {
        setAvailableUpdate(update);
        setUpdateStatus(`Version ${update.version} is available!`);
      } else {
        setAvailableUpdate(null);
        setUpdateStatus("You are on the latest version.");
      }
    } catch (err: any) {
      console.error(err);
      setUpdateStatus(`Error checking updates: ${err?.message || err}`);
    } finally {
      setChecking(false);
    }
  };

  const handleInstallUpdate = async () => {
    if (!availableUpdate) return;
    try {
      setUpdateStatus("Downloading update...");
      let downloaded = 0;
      let total = 0;

      await availableUpdate.downloadAndInstall((event: any) => {
        if (event.event === "Started") {
          total = event.data.contentLength ?? 0;
        } else if (event.event === "Progress") {
          downloaded += event.data.chunkLength;
          if (total > 0) {
            setDownloadProgress(Math.round((downloaded / total) * 100));
          }
        } else if (event.event === "Finished") {
          setUpdateStatus("Installing and relaunching...");
        }
      });

      await relaunch();
    } catch (err: any) {
      console.error(err);
      setUpdateStatus(`Failed to install update: ${err?.message || err}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-neutral-950 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Link
            to="/"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            ← Back
          </Link>
        </div>
        <div className="space-y-4">
          <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800">
            <h2 className="font-semibold text-lg mb-1">General</h2>
            <p className="text-sm text-neutral-400">
              App configuration and workspace preferences.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg mb-1">Software Updates</h2>
                <p className="text-sm text-neutral-400">
                  Current version: <span className="font-mono text-neutral-200">v0.1.0</span>
                </p>
              </div>
              <button
                onClick={handleCheckUpdate}
                disabled={checking}
                className="px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors"
              >
                {checking ? "Checking..." : "Check for Updates"}
              </button>
            </div>

            {updateStatus && (
              <div className="mt-4 pt-4 border-t border-neutral-800 text-sm">
                <p className="text-neutral-300 mb-2">{updateStatus}</p>

                {downloadProgress !== null && (
                  <div className="w-full bg-neutral-800 rounded-full h-2 my-2 overflow-hidden">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                )}

                {availableUpdate && (
                  <button
                    onClick={handleInstallUpdate}
                    className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm rounded-lg transition-colors"
                  >
                    Install & Restart
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800">
            <h2 className="font-semibold text-lg mb-1">About</h2>
            <p className="text-sm text-neutral-400">
              Done — Definitely One ecosystem platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
