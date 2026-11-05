import React, { useState } from "react";
import { Key, Cpu, ExternalLink, Copy, Check, Sparkles, BookOpen, GitBranch } from "lucide-react";
import { openUrl } from "@tauri-apps/plugin-opener";

export const DevToolbelt: React.FC = () => {
  const [tokenCopied, setTokenCopied] = useState(false);
  const [mockToken, setMockToken] = useState<string>(
    "definitely_dev_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sabre_local_sandbox"
  );

  const handleGenerateToken = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const newToken = `definitely_dev_jwt_${Date.now()}_${randomSuffix}`;
    setMockToken(newToken);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(mockToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleOpenLink = async (url: string) => {
    try {
      await openUrl(url);
    } catch {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      {/* Dev Token & Sandbox Widget */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-sm text-white">Local Dev Token</h3>
            </div>
            <button
              onClick={handleGenerateToken}
              className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Generate New
            </button>
          </div>
          <p className="text-xs text-neutral-400 mb-3">
            Temporary sandbox JWT for testing local API calls against prefly or meet backends.
          </p>
          <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 break-all select-all flex items-center justify-between gap-2">
            <span className="truncate">{mockToken}</span>
            <button
              onClick={handleCopyToken}
              className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-850 shrink-0 cursor-pointer"
            >
              {tokenCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-neutral-500">
          Valid for local testing • Environment: <span className="text-neutral-400">development</span>
        </div>
      </div>

      {/* Local Environment Diagnostics */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm text-white">Runtime Environment</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500">Tauri Core Engine</span>
              <span className="font-mono text-neutral-300">v2.12.5 (Rust)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500">Frontend Stack</span>
              <span className="font-mono text-neutral-300">React 19 + Vite + TS</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Identity Authority</span>
              <span className="font-mono text-neutral-300">accounts.definitely.live</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Local Engine Operational</span>
        </div>
      </div>

      {/* Quick Documentation & Org Links */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm text-white">Ecosystem Links</h3>
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            Official resources, developer documentation, and Definitely engineering repositories.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleOpenLink("https://github.com/Definitely-Platform")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub Organization</span>
              </div>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </button>
            <button
              onClick={() => handleOpenLink("https://definitely.live")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Definitely.live Portal</span>
              </div>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
