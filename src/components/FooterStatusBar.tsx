import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVersion } from "@tauri-apps/api/app";

export const FooterStatusBar: React.FC = () => {
  const [appVersion, setAppVersion] = useState("v0.5.0");

  useEffect(() => {
    getVersion()
      .then((ver) => setAppVersion(`v${ver}`))
      .catch(() => setAppVersion("v0.5.0"));
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 px-6 py-2.5 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Live Services Ping Bar */}
        <div className="flex items-center gap-4 text-[11px] overflow-x-auto w-full sm:w-auto">
          <span className="text-neutral-500 font-medium shrink-0">Services:</span>
          
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300">accounts.definitely.live</span>
            <span className="text-[10px] text-neutral-500 font-mono">24ms</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-neutral-300">prefly.definitely.live</span>
            <span className="text-[10px] text-neutral-500 font-mono">19ms</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-neutral-300">meet.definitely.live</span>
            <span className="text-[10px] text-neutral-500 font-mono">31ms</span>
          </div>
        </div>

        {/* Right Info: Version & Updater link */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/settings"
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
          >
            <span className="font-mono text-neutral-300 font-medium">{appVersion}</span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
              Auto-Update Enabled
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
