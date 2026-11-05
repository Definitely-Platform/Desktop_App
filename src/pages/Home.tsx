import { useState, useMemo, useEffect } from "react";
import { Header } from "../components/Header";
import { AppCard } from "../components/AppCard";
import { DevToolbelt } from "../components/DevToolbelt";
import { FooterStatusBar } from "../components/FooterStatusBar";
import { DEFINITELY_APPS } from "../data/apps";
import { Sparkles, Terminal, Layers, SearchX } from "lucide-react";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Keyboard shortcut listener: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      } else if (e.key === "Escape") {
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter apps based on search query and category
  const filteredApps = useMemo(() => {
    return DEFINITELY_APPS.filter((app) => {
      const matchesCategory =
        selectedCategory === "all" || app.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col pb-16 selection:bg-neutral-800">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Hero Section */}
        <div className="relative mb-10 p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900/40 border border-neutral-800/80 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Definitely Ecosystem Command Center</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              One runtime for all your tools.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6">
              Launch <strong className="text-neutral-200">Prefly</strong> previews, start <strong className="text-neutral-200">Meet</strong> developer huddles, inspect API tokens, and monitor your cloud services — directly from your desktop.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800/80 text-left">
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">6</p>
                <p className="text-xs text-neutral-500">Suite Tools</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400 tracking-tight">100%</p>
                <p className="text-xs text-neutral-500">Local Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-300 tracking-tight">Unified</p>
                <p className="text-xs text-neutral-500">Single Sign-On</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-400" />
            <h2 className="font-bold text-lg text-white">
              {selectedCategory === "all"
                ? "Ecosystem Suite"
                : selectedCategory === "flagship"
                ? "Flagship Platforms"
                : selectedCategory === "devtools"
                ? "Developer Tools"
                : "Ecosystem & Identity"}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-850 text-neutral-400">
              {filteredApps.length}
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl bg-neutral-900/30 border border-neutral-800/60 my-6">
            <SearchX className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="font-semibold text-neutral-300 mb-1">No tools matched "{searchQuery}"</h3>
            <p className="text-xs text-neutral-500 mb-4">Try checking your spelling or search for another keyword.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Developer Utilities Panel */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-neutral-400" />
            <h2 className="font-bold text-lg text-white">Developer Toolbelt</h2>
          </div>
          <p className="text-xs text-neutral-500 mb-4">
            Quick utilities for debugging, inspecting sandbox tokens, and ecosystem shortcuts.
          </p>

          <DevToolbelt />
        </div>
      </main>

      {/* Fixed Live Footer Status Bar */}
      <FooterStatusBar />
    </div>
  );
}

export default Home;
