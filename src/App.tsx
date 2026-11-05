import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import AuthCallback from "./pages/AuthCallback";
import { restoreSession } from "./store/authStore";

function App() {
  useEffect(() => {
    restoreSession();
  }, []);

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
