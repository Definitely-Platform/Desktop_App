import React, { useState, useEffect } from 'react';
import {
  Shield,
  ExternalLink,
  LogOut,
  User,
  Key,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../store/authStore';
import { openUrl } from '@tauri-apps/plugin-opener';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, openSsoLogin, logout, loginWithTokens } = useAuth();
  const [waitingInBrowser, setWaitingInBrowser] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  useEffect(() => {
    if (waitingInBrowser && isAuthenticated) {
      const timer = setTimeout(() => {
        setWaitingInBrowser(false);
        onClose();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [waitingInBrowser, isAuthenticated, onClose]);

  if (!isOpen) return null;

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;

    setManualLoading(true);
    setManualError(null);

    const ok = await loginWithTokens(manualToken.trim());
    setManualLoading(false);

    if (ok) {
      setManualToken('');
      setShowManualInput(false);
      onClose();
    } else {
      setManualError('Failed to validate token. Check if the JWT is valid and not expired.');
    }
  };

  const handleOpenAccountSettings = async () => {
    const url = 'https://accounts.definitely.live/account';
    try {
      await openUrl(url);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {isAuthenticated ? 'Definitely One Account' : 'Sign in to Definitely One'}
              </h3>
              <p className="text-[11px] text-neutral-400">Universal Ecosystem SSO</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isAuthenticated && user ? (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                  {user.name ? user.name[0]?.toUpperCase() : <User className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white truncate text-base">{user.name}</h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Single Sign-On Active</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleOpenAccountSettings}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-sm font-medium text-neutral-200 transition-all cursor-pointer border border-neutral-700/60"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" />
                    Manage Account
                  </span>
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-sm font-medium text-rose-400 transition-all cursor-pointer border border-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Ecosystem
                </button>
              </div>
            </div>
          ) : waitingInBrowser ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Signing in via Browser...</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Complete authentication in your browser window. This app will update and close automatically.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setWaitingInBrowser(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/10">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <h4 className="font-bold text-lg text-white">One Account, Every Platform</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Sign in once to unlock seamless access across Prefly, Meet, API Studio, and ecosystem telemetry.
                </p>
              </div>

              {/* Primary Browser SSO Action */}
              <button
                onClick={() => {
                  setWaitingInBrowser(true);
                  openSsoLogin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                Sign in with Definitely SSO
              </button>

              {/* Manual Token Developer Tool */}
              <div className="pt-2 border-t border-neutral-800">
                <button
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-[11px] text-neutral-400 hover:text-neutral-300 flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{showManualInput ? 'Hide developer token input' : 'Developer token quick connect'}</span>
                </button>

                {showManualInput && (
                  <form onSubmit={handleManualLogin} className="mt-3 space-y-2 animate-in fade-in duration-150">
                    <input
                      type="password"
                      placeholder="Paste Bearer JWT token..."
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    {manualError && (
                      <p className="text-[11px] text-rose-400">{manualError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={manualLoading || !manualToken.trim()}
                      className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-xs font-medium rounded-lg text-white transition-all cursor-pointer"
                    >
                      {manualLoading ? 'Verifying...' : 'Connect with Token'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
