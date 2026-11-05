import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Settings, Shield, User as UserIcon } from "lucide-react";
import { useAuth } from "@sabrealam/platform-sdk";
import { AuthModal } from "./AuthModal";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <header className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Workspace */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-neutral-300 flex items-center justify-center shadow-lg shadow-white/5">
                <span className="text-black font-extrabold text-xl tracking-tighter">D</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-white tracking-tight">Done</h1>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                    Ecosystem Hub
                  </span>
                </div>
                <p className="text-xs text-neutral-400">Definitely One Developer Platform</p>
              </div>
            </div>

            {/* Mobile auth & settings buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                title="Account"
              >
                {isAuthenticated ? (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.name ? user.name[0]?.toUpperCase() : 'U'}
                  </div>
                ) : (
                  <Shield className="w-4 h-4 text-indigo-400" />
                )}
              </button>
              <Link
                to="/settings"
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search tools, apps, endpoints... (Press ⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-10 pr-12 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all shadow-inner"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 bg-neutral-800 border border-neutral-700 rounded">
              ⌘K
            </kbd>
          </div>

          {/* Status Pill, Auth & Settings Nav */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>definitely.live online</span>
            </div>

            {/* SSO Account Profile Button */}
            {isAuthenticated && user ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-xs text-white transition-all cursor-pointer shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold">
                  {user.name ? user.name[0]?.toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-neutral-200 leading-tight truncate max-w-[100px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase font-mono">{user.role}</div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-500/30 text-xs font-medium text-white transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <Link
              to="/settings"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-sm font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
            >
              <Settings className="w-4 h-4 text-neutral-400" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Categories Filter Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4 pt-3 border-t border-neutral-900 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "All Suite" },
            { id: "flagship", label: "Flagship Platforms" },
            { id: "devtools", label: "Developer Tools" },
            { id: "ecosystem", label: "Ecosystem & Identity" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === tab.id
                  ? "bg-white text-black shadow-md shadow-white/10"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>
    </>
  );
};
