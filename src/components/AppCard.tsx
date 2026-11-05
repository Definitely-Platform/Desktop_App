import React, { useState } from "react";
import { DefinitelyApp } from "../data/apps";
import {
  Rocket,
  Video,
  Shield,
  Code2,
  Activity,
  Terminal,
  Box,
  Layers,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useAuth } from "../store/authStore";

interface AppCardProps {
  app: DefinitelyApp;
}

const iconMap: Record<string, React.ReactNode> = {
  rocket: <Rocket className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  code: <Code2 className="w-5 h-5" />,
  activity: <Activity className="w-5 h-5" />,
  terminal: <Terminal className="w-5 h-5" />,
  box: <Box className="w-5 h-5" />,
  layers: <Layers className="w-5 h-5" />,
};

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleLaunch = async () => {
    try {
      await openUrl(app.url);
    } catch {
      window.open(app.url, "_blank");
    }
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(app.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700/80 hover:bg-neutral-900 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-neutral-950/50">
      {/* Background Accent Glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${app.accentGradient} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
      />

      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-neutral-800/90 border border-neutral-700/60 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              {iconMap[app.iconName] || <Rocket className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white group-hover:text-neutral-100 transition-colors">
                  {app.name}
                </h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${app.badgeColor}`}
                >
                  {app.status}
                </span>
                {isAuthenticated && (app.category === "flagship" || app.id === "accounts") && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                    SSO
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-medium">{app.tagline}</p>
            </div>
          </div>

          {/* Quick Copy Link */}
          <button
            onClick={handleCopyUrl}
            title="Copy URL"
            className="text-neutral-500 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-400 leading-relaxed mb-6 line-clamp-3">
          {app.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
        {app.stats ? (
          <span className="text-[11px] font-mono text-neutral-500 bg-neutral-950/60 px-2.5 py-1 rounded-md border border-neutral-800">
            {app.stats}
          </span>
        ) : (
          <div />
        )}

        <button
          onClick={handleLaunch}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-md group-hover:shadow-white/10 cursor-pointer"
        >
          <span>{app.primaryAction}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
