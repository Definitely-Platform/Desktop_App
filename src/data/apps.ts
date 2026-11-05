export interface DefinitelyApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "flagship" | "devtools" | "ecosystem";
  url: string;
  status: "live" | "beta" | "internal";
  iconName: "rocket" | "video" | "shield" | "code" | "activity" | "terminal" | "box" | "layers";
  badgeColor: string;
  accentGradient: string;
  stats?: string;
  primaryAction: string;
}

export const DEFINITELY_APPS: DefinitelyApp[] = [
  {
    id: "prefly",
    name: "Prefly",
    tagline: "Instant Preview & Deployment Engine",
    description: "Stage pull requests, test live micro-previews, and automate zero-downtime production releases across edge clusters.",
    category: "flagship",
    url: "https://prefly.definitely.live",
    status: "live",
    iconName: "rocket",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accentGradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    stats: "99.98% uptime",
    primaryAction: "Launch Prefly",
  },
  {
    id: "meet",
    name: "Meet",
    tagline: "Real-time Developer Video & Huddles",
    description: "Ultra-low-latency developer rooms with 4K screen sharing, collaborative terminals, and crystal-clear team audio.",
    category: "flagship",
    url: "https://meet.definitely.live",
    status: "live",
    iconName: "video",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accentGradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    stats: "HD WebRTC Active",
    primaryAction: "Join Huddle",
  },
  {
    id: "accounts",
    name: "Accounts & SSO",
    tagline: "Central Identity & Access Management",
    description: "Universal single sign-on, OAuth2 client management, API keys, and team permission controls for the entire ecosystem.",
    category: "ecosystem",
    url: "https://accounts.definitely.live",
    status: "live",
    iconName: "shield",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    accentGradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    stats: "OAuth 2.0 PKCE",
    primaryAction: "Manage Security",
  },
  {
    id: "api-studio",
    name: "API Studio",
    tagline: "Interactive Sandbox & Request Builder",
    description: "Inspect Definitely GraphQL & REST endpoints, test live webhooks, and mock payload schemas in real time.",
    category: "devtools",
    url: "https://definitely.live/docs/api",
    status: "beta",
    iconName: "code",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    accentGradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    stats: "v2.4 Spec",
    primaryAction: "Open Studio",
  },
  {
    id: "telemetry",
    name: "Ecosystem Pulse",
    tagline: "Global Cluster & Health Telemetry",
    description: "Live health checks, latency heatmaps, and edge node routing status for prefly.definitely.live and meet.definitely.live.",
    category: "devtools",
    url: "https://definitely.live",
    status: "live",
    iconName: "activity",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    accentGradient: "from-teal-500/20 via-teal-500/5 to-transparent",
    stats: "All Systems 🟢",
    primaryAction: "View Telemetry",
  },
  {
    id: "registry",
    name: "App Registry",
    tagline: "Extensions & Developer Plugins",
    description: "Install community and official Definitely tools directly into your Done desktop runtime.",
    category: "ecosystem",
    url: "https://github.com/Definitely-Platform",
    status: "internal",
    iconName: "layers",
    badgeColor: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    accentGradient: "from-neutral-500/20 via-neutral-500/5 to-transparent",
    stats: "8 Plugins Available",
    primaryAction: "Browse Registry",
  },
];
