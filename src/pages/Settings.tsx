import { Link } from "react-router-dom";

function Settings() {
  return (
    <div className="min-h-screen p-8">
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
          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
            <h2 className="font-medium mb-1">General</h2>
            <p className="text-sm text-neutral-400">
              App configuration and preferences.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
            <h2 className="font-medium mb-1">Updates</h2>
            <p className="text-sm text-neutral-400">
              Check for updates and manage auto-update settings.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
            <h2 className="font-medium mb-1">About</h2>
            <p className="text-sm text-neutral-400">
              Done v0.1.0 — Definitely One ecosystem platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
