import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@sabrealam/platform-sdk';

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithTokens, login, endpoints } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function handleAuth() {
      // 1. Check query parameters for all ecosystem token variants
      let token =
        searchParams.get('sso_token') ||
        searchParams.get('token') ||
        searchParams.get('accessToken') ||
        searchParams.get('jwt');

      let refreshToken =
        searchParams.get('refreshToken') ||
        searchParams.get('refresh_token');

      // 2. Check hash fragment (#sso_token=... or #token=...)
      if (!token && typeof window !== 'undefined' && window.location.hash) {
        const hashClean = window.location.hash.replace(/^#\/?/, '');
        const hashParams = new URLSearchParams(hashClean);
        token =
          hashParams.get('sso_token') ||
          hashParams.get('token') ||
          hashParams.get('accessToken') ||
          hashParams.get('jwt');
        if (!refreshToken) {
          refreshToken = hashParams.get('refreshToken') || hashParams.get('refresh_token');
        }
      }

      // 3. Check if sso_code was provided and query polling endpoint
      const ssoCode =
        searchParams.get('sso_code') ||
        searchParams.get('code') ||
        (typeof window !== 'undefined' && window.location.hash
          ? new URLSearchParams(window.location.hash.replace(/^#\/?/, '')).get('sso_code')
          : null);

      if (!token && ssoCode) {
        try {
          const pollUrl = endpoints.ssoPollUrl(ssoCode);
          const pollRes = await fetch(pollUrl, {
            headers: { Accept: 'application/json' },
          });
          if (pollRes.ok) {
            const pollData = await pollRes.json();
            if (pollData.success && pollData.token) {
              token = pollData.token;
              refreshToken = pollData.refreshToken || refreshToken;
            }
          }
        } catch {
          // ignore network error
        }
      }

      // 4. Fallback: If no token in URL, query auth-service API with cookies to resolve active session
      if (!token) {
        try {
          const res = await fetch(endpoints.meUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.token) {
              token = data.token;
            }
          }
        } catch {
          // ignore network error on fallback
        }
      }

      if (!token) {
        if (active) {
          setStatus('error');
          setErrorMessage('No authentication token detected in the callback URL.');
        }
        return;
      }

      try {
        const ok = await loginWithTokens(token, refreshToken || undefined);
        if (!active) return;

        if (ok) {
          setStatus('success');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 600);
        } else {
          setStatus('error');
          setErrorMessage('Unable to verify token against the Definitely Identity provider.');
        }
      } catch (err: any) {
        if (!active) return;
        setStatus('error');
        setErrorMessage(err.message || 'Authentication exchange failed.');
      }
    }

    handleAuth();

    return () => {
      active = false;
    };
  }, [searchParams, navigate, endpoints, loginWithTokens]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-1">Authenticating with Definitely...</h2>
              <p className="text-sm text-neutral-400">
                Verifying your cross-platform identity credentials with Accounts SSO.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-1">Welcome to Definitely One!</h2>
              <p className="text-sm text-neutral-400">
                Session established. Redirecting to your workspace...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-1">Authentication Incomplete</h2>
              <p className="text-sm text-rose-300/80 mb-6">{errorMessage}</p>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-medium text-white transition-all cursor-pointer"
              >
                Back Home
              </button>
              <button
                onClick={() => login()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
