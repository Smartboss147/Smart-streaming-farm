import { Track, VirtualDevice, ProxyConfig, LogEntry } from "./types";

export const TRACK_PLAYLIST: Track[] = [
  {
    id: "track-1",
    title: "Neon Rain over Sector 7",
    artist: "Mona_Liza_3.0",
    album: "Synth-Memories",
    duration: 182,
    genre: "Synthwave",
    color: "#22c55e", // Green
    streamCount: 42109,
  },
  {
    id: "track-2",
    title: "Gridrunner",
    artist: "Laser Core",
    album: "No Future v4.1",
    duration: 215,
    genre: "Darksynth",
    color: "#38bdf8", // Sky Blue
    streamCount: 104840,
  },
  {
    id: "track-3",
    title: "Soma Dreams",
    artist: "Digital Narcotic",
    album: "Chemical Dopamine",
    duration: 240,
    genre: "Cyber Ambient",
    color: "#f59e0b", // Amber
    streamCount: 55431,
  },
  {
    id: "track-4",
    title: "Rebel Frequency v1.02",
    artist: "Undercity Outlaws",
    album: "Grid Hackers",
    duration: 198,
    genre: "Industrial Cyberpunk",
    color: "#ef4444", // Red
    streamCount: 12903,
  },
  {
    id: "track-5",
    title: "Synthetic Soul",
    artist: "Holo-Diva Alpha",
    album: "Artificial Sentience",
    duration: 205,
    genre: "Cyberpop",
    color: "#ec4899", // Pink
    streamCount: 88710,
  },
  {
    id: "track-6",
    title: "Carbon Hearts",
    artist: "Cyberpunk Syndicate",
    album: "Underground Signal",
    duration: 228,
    genre: "EBM / Techno",
    color: "#a855f7", // Purple
    streamCount: 33400,
  },
];

export const DEVICE_MODELS = [
  "SomaLink v2.4 (Modified)",
  "RetroPod Pro Terminal",
  "HoloGrid Pad-8X",
  "SynthPad x86 Hackbox",
  "AeonPhone 9 (Jailbroken)",
  "Cyberdeck Lynx-III",
  "SomaNode-900 (Blackbox)",
  "Chiba GridLink Stick",
];

export const PROXY_LOCATIONS = [
  { country: "Neo-Tokyo", code: "JP", city: "Chiba Sector", isp: "Arasaka Grid-Com" },
  { country: "New Berlin", code: "DE", city: "Undercity Zone B", isp: "Deutsches NetNet" },
  { country: "Shenzhen Core", code: "CN", city: "Baoan Hub-09", isp: "Dragon-Shield ISP" },
  { country: "Neo-Seoul", code: "KR", city: "Mapo Tunnel v12", isp: "Lotte Quantum Comms" },
  { country: "Siberia Bunker", code: "RU", city: "Krasnoyarsk-26", isp: "Goz-Svyaz Secure" },
  { country: "Oslo Chunnel", code: "NO", city: "Fjord Hub Alpha", isp: "Nordic Chunneling" },
  { country: "Casablanca Canopy", code: "MA", city: "Solar Sector 3", isp: "Maghreb Net Link" },
  { country: "London Sewers", code: "GB", city: "Westminster Sub", isp: "VaporNet Rebels" },
  { country: "Detroit Factory", code: "US", city: "Sector-E4 Motor", isp: "Exodus Heavy Net" },
  { country: "Reykjavik Geothermal", code: "IS", city: "Hekla Vault-3", isp: "IceNet Quantum" },
  { country: "Singapore Floating", code: "SG", city: "Keppel Marina Sub", isp: "Temasek FiberLink" },
  { country: "Neo-Paris Grid", code: "FR", city: "Arrondissement 21", isp: "L'Etoile Crypto" },
  { country: "Mumbai Junction", code: "IN", city: "Dharavi Grid", isp: "Reliance Cyber-Mesh" },
  { country: "Sao Paulo Favela", code: "BR", city: "Sector 11 Hub", isp: "Favela-Net Rebel" },
  { country: "Sydney Reef", code: "AU", city: "Darling Hab-4", isp: "Tasman Quantum Comms" },
  { country: "Nairobi Skylink", code: "KE", city: "Kibera Mesh-9", isp: "Safaricom Stealth" },
  { country: "Toronto Dome", code: "CA", city: "Ontario Vault-1", isp: "Rogers Cyberpunk" },
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "01:21:05",
    type: "SUCCESS",
    message: "NeonFarm core initialized. 50 socket connections bootstrapped successfully with static IP signatures.",
  },
  {
    id: "log-2",
    timestamp: "01:21:12",
    type: "INFO",
    message: "Global static proxy pool configured. 50 devices locked on independent encrypted tunnels.",
  },
  {
    id: "log-3",
    timestamp: "01:22:15",
    type: "INFO",
    message: "Manual account configuration interface activated for 1-by-1 login overrides.",
  },
  {
    id: "log-4",
    timestamp: "01:23:01",
    type: "WARNING",
    message: "Anti-fraud firewall update detected at Spotify Sector 4. Manual accounts bypass triggered.",
  },
  {
    id: "log-5",
    timestamp: "01:24:45",
    type: "REWARD",
    message: "Milestone reached: Stream quota met on 'Gridrunner'. Accrued +54.20 Credits.",
  },
];

// Generate random IP address
export function generateRandomIp(): string {
  const segment1 = Math.floor(Math.random() * 223) + 1;
  const segment2 = Math.floor(Math.random() * 255);
  const segment3 = Math.floor(Math.random() * 255);
  const segment4 = Math.floor(Math.random() * 254) + 1;
  const port = Math.floor(Math.random() * 8000) + 1024;
  return `${segment1}.${segment2}.${segment3}.${segment4}:${port}`;
}

export function generateInitialDevices(): VirtualDevice[] {
  const devices: VirtualDevice[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const model = DEVICE_MODELS[Math.floor(Math.random() * DEVICE_MODELS.length)];
    // Ensure high dispersion of country locations
    const location = PROXY_LOCATIONS[(i - 1) % PROXY_LOCATIONS.length];
    const proxyIp = generateRandomIp();
    const proxyType = ["SOCKS5", "HTTPS", "HTTP"][Math.floor(Math.random() * 3)] as "SOCKS5" | "HTTPS" | "HTTP";
    const latency = Math.floor(Math.random() * 80) + 20; // 20ms - 100ms
    const streamRate = [192, 256, 320][Math.floor(Math.random() * 3)];
    const track = TRACK_PLAYLIST[Math.floor(Math.random() * TRACK_PLAYLIST.length)];
    
    const rState = Math.random();
    let status: "STREAMING" | "ROTATING" | "PAUSED" | "OFFLINE" | "ERROR" = "STREAMING";
    if (rState < 0.05) status = "PAUSED";
    else if (rState < 0.08) status = "OFFLINE";
    else if (rState < 0.1) status = "ERROR";

    // Set default user logins that are initially logged in or can be manually modified/relogged
    const devNumStr = i.toString().padStart(2, "0");
    
    devices.push({
      id: i,
      name: `Dev-${devNumStr}`,
      model,
      proxyIp,
      proxyType,
      proxyCountry: location.country,
      proxyCountryCode: location.code || "JP",
      proxyCity: location.city,
      latency: status === "OFFLINE" ? 0 : latency,
      streamRate: status === "STREAMING" ? streamRate : 0,
      trackId: track.id,
      status,
      streamProgress: Math.floor(Math.random() * 95),
      uptime: Math.floor(Math.random() * 86400) + 3600, // 1 to 25 hours
      lifetimeStreams: Math.floor(Math.random() * 140) + 12,
      battery: Math.floor(Math.random() * 45) + 55, // 55% - 100%
      sessionDuration: Math.floor(Math.random() * 150),
      
      youtube: {
        username: `neon_streamer_${devNumStr}@rednet.net`,
        isLoggedIn: Math.random() > 0.3, // Mostly pre-logged to make it look active, but editable
        lastLogin: "2026-07-18 01:10",
        streamCount: Math.floor(Math.random() * 40) + 10,
      },
      spotify: {
        username: `soma_listener_${devNumStr}@sp-mesh.io`,
        isLoggedIn: Math.random() > 0.2,
        lastLogin: "2026-07-18 01:15",
        streamCount: Math.floor(Math.random() * 90) + 30,
      },
      appleMusic: {
        username: `grid_listener_${devNumStr}@applegrid.com`,
        isLoggedIn: Math.random() > 0.4,
        lastLogin: "2026-07-18 01:18",
        streamCount: Math.floor(Math.random() * 30) + 5,
      },
      twitter: {
        username: `rebel_voice_${devNumStr}`,
        isLoggedIn: Math.random() > 0.3,
        lastLogin: "2026-07-18 01:05",
        streamCount: Math.floor(Math.random() * 15) + 2,
      },
      // Real worldwide popular stream resources for continuous streaming
      youtubeId: [
        "jfKfPfyJRdk", // Lofi Girl Radio Live
        "5qap5aO4i9A", // Synthwave radio
        "4xDzrJKXOOY", // Electronic Mix
        "U4_yP-08Gco", // Cyberpunk Ambient
        "bL6gUoPWhCg", // Retrowave Radio
        "S8ZIn7X7r4E", // Chill Lo-Fi Study Beats
        "dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up
        "9bZkp7q19f0", // PSY - GANGNAM STYLE
      ][(i - 1) % 8],
      spotifyId: [
        "0VjIjW4GlUZAMY0vU6S6I6", // Blinding Lights
        "7MXV7vK0p5gIGuX7gZasgY", // Starboy
        "4D75VjWQLVh7asS96u6gRH", // As It Was
        "2TpxZ7JUBvva4I6ezgZgqY", // Sweater Weather
        "3JvKzy6jSgXg7mEU6mF367", // Another Love
      ][(i - 1) % 5],
      appleMusicId: [
        "us/album/starboy-feat-daft-punk/1156434450",
        "us/album/blinding-lights/1499378197",
        "us/album/as-it-was/1615535352",
        "us/album/bad-guy/1450695739",
      ][(i - 1) % 4]
    });
  }
  
  return devices;
}
