export interface AppAccount {
  username: string;
  isLoggedIn: boolean;
  lastLogin: string;
  streamCount: number;
  isSubscribed?: boolean;
}

export interface TwitterAccount extends AppAccount {
  impressions: number;
  likes: number;
}

export interface VirtualDevice {
  id: number;
  name: string;
  model: string;
  proxyIp: string;
  proxyType: "SOCKS5" | "HTTPS" | "HTTP";
  proxyCountry: string;
  proxyCountryCode: string;
  proxyCity: string;
  latency: number; // in ms
  streamRate: number; // in kbps (e.g., 256, 320)
  trackId: string;
  status: "STREAMING" | "ROTATING" | "PAUSED" | "OFFLINE" | "ERROR";
  streamProgress: number; // 0 - 100
  uptime: number; // in seconds
  lifetimeStreams: number;
  battery: number; // simulated physical status
  sessionDuration: number; // current song play duration in seconds
  
  // App credentials & setup
  youtube: AppAccount;
  spotify: AppAccount;
  appleMusic: AppAccount;
  twitter: TwitterAccount;

  // Real world global stream targets
  youtubeId?: string;
  spotifyId?: string;
  appleMusicId?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  genre: string;
  color: string;
  streamCount: number; // overall count
}

export interface LogEntry {
  id: string;
  timestamp: string;
  deviceId?: number;
  type: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL" | "ROTATION" | "REWARD";
  message: string;
}

export interface ProxyConfig {
  ip: string;
  port: number;
  type: "SOCKS5" | "HTTPS" | "HTTP";
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  reputation: "EXCELLENT" | "STABLE" | "FLAGGED" | "BLOCKED";
}

export interface StreamFarmStats {
  activeStreamsCount: number;
  totalDevicesCount: number;
  proxyRotationRate: number; // seconds
  totalBandwidthKbps: number;
  cumulativeCredits: number; // simulated credits earned (e.g. Soma-Coins or Stream-credits)
  avgLatency: number;
  securityLevel: "SAFE" | "ATTENTION" | "ALERT" | "LOCKDOWN";
}
