/**
 * Backwards-compatibility re-export module for @sabrealam/platform-sdk universal auth.
 */
export {
  useAuth,
  useUser,
  tokenService,
  createDesktopAdapter,
  createMobileAdapter,
  createWebAdapter,
  AuthProvider,
} from '@sabrealam/platform-sdk';

export type {
  AuthTokens,
  AuthAdapter,
  AuthStorageAdapter,
  DesktopAdapterOptions,
  MobileAdapterOptions,
  WebAdapterOptions,
} from '@sabrealam/platform-sdk';
