import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-neutral-950 text-white">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Updated to v0.5.0 Successfully!
        </div>
        <p className="text-lg text-neutral-400 max-w-md mx-auto">
          Definitely One — You are now running the latest 5 live update!
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Link
            to="/settings"
            className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
      <p className="absolute bottom-6 text-sm text-neutral-500">
        Current Version: <span className="font-mono text-neutral-300">v0.4.0</span>
      </p>
    </div>
  );
}

export default Home;
