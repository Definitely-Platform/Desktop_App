export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'company' | 'admin' | 'superadmin' | string;
  avatarUrl?: string;
  status?: string;
  tokenVersion?: number;
  organization?: {
    id: string;
    name: string;
    plan?: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthState {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
