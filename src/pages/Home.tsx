import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Done
        </h1>
        <p className="text-lg text-neutral-400 max-w-md">
          Definitely One — Your ecosystem platform.
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
      <p className="absolute bottom-6 text-sm text-neutral-600">
        v0.1.0
      </p>
    </div>
  );
}

export default Home;
