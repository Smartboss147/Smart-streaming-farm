import React, { useState, useEffect } from "react";
import { VirtualDevice, Track } from "../types";
import { TRACK_PLAYLIST, PROXY_LOCATIONS, generateRandomIp } from "../data";
import { 
  Cpu, RotateCw, RefreshCw, Power, BatteryCharging, 
  MapPin, ShieldAlert, Radio, HelpCircle, HardDrive, Timer,
  Youtube, Twitter, Music, CheckCircle2, XCircle, LogIn, Lock, Mail, Smartphone, Laptop, Monitor
} from "lucide-react";

interface DeviceDetailPanelProps {
  device: VirtualDevice | null;
  devices?: VirtualDevice[];
  pinnedIds?: number[];
  onTogglePin?: (id: number) => void;
  onUpdateDevice: (device: VirtualDevice) => void;
  onAddLog: (message: string, type: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL" | "ROTATION" | "REWARD", deviceId?: number) => void;
}

export const DeviceDetailPanel: React.FC<DeviceDetailPanelProps> = ({
  device,
  devices = [],
  pinnedIds = [],
  onTogglePin,
  onUpdateDevice,
  onAddLog,
}) => {
  const [isPingRefreshed, setIsPingRefreshed] = useState(false);
  const [selectedApp, setSelectedApp] = useState<"youtube" | "spotify" | "appleMusic" | "twitter" | null>(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [isSavingLogin, setIsSavingLogin] = useState(false);
  const [targetDeviceId, setTargetDeviceId] = useState<number>(1);

  // Sync target device ID when the active diagnostic device changes
  useEffect(() => {
    if (device) {
      setTargetDeviceId(device.id);
    }
  }, [device?.id]);

  // Find the target device we are currently configuring credentials for
  const targetDevice = devices.find((d) => d.id === targetDeviceId) || device;

  // Sync login inputs when selecting a different app, target device, or diagnostic focus
  useEffect(() => {
    if (targetDevice && selectedApp) {
      setLoginUser(targetDevice[selectedApp]?.username || "");
      setLoginPass(targetDevice[selectedApp]?.isLoggedIn ? "••••••••••••" : "");
    }
  }, [selectedApp, targetDeviceId, targetDevice]);

  if (!device) {
    return (
      <div id="device-no-selection" className="bg-[#0b100d] border border-emerald-500/20 rounded-lg p-5 flex flex-col items-center justify-center h-full text-center relative scanline-effect">
        <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
        <HelpCircle className="w-10 h-10 text-emerald-500/30 mb-2 animate-pulse" />
        <h3 className="font-display font-semibold text-emerald-400 text-sm tracking-wide">NO VIRTUAL TERMINAL LINKED</h3>
        <p className="text-[10px] font-mono text-emerald-500/40 max-w-xs mt-1">
          Select any virtual device node from the grid or interactive map above to hook up its local streaming session and rotate IP packets.
        </p>
      </div>
    );
  }

  const currentSong = TRACK_PLAYLIST.find((t) => t.id === device.trackId);

  // Manual Trigger: Rotate Proxy for this device
  const handleRotateProxy = () => {
    const randomLocation = PROXY_LOCATIONS[Math.floor(Math.random() * PROXY_LOCATIONS.length)];
    const newIp = generateRandomIp();
    const newType = ["SOCKS5", "HTTPS", "HTTP"][Math.floor(Math.random() * 3)] as "SOCKS5" | "HTTPS" | "HTTP";
    const newLatency = Math.floor(Math.random() * 100) + 15;

    const updated: VirtualDevice = {
      ...device,
      status: "ROTATING",
      proxyIp: newIp,
      proxyType: newType,
      proxyCountry: randomLocation.country,
      proxyCountryCode: randomLocation.code || "JP",
      proxyCity: randomLocation.city,
      latency: newLatency,
    };

    onUpdateDevice(updated);
    onAddLog(
      `Forced manual IP proxy rotation. SOCKS5 tunneling redirected to [${randomLocation.country} - ${randomLocation.city}] under stealth node [${newIp}]`,
      "ROTATION",
      device.id
    );

    // Simulate returning to streaming state after a minor delay
    setTimeout(() => {
      onUpdateDevice({
        ...updated,
        status: "STREAMING",
        streamRate: [192, 256, 320][Math.floor(Math.random() * 3)],
      });
      onAddLog(
        `Socket proxy handshake complete. Device resumed audio traffic streaming on '${currentSong?.title}'`,
        "SUCCESS",
        device.id
      );
    }, 1200);
  };

  // Manual Trigger: Refresh latency / ping test
  const handlePingRefresh = () => {
    setIsPingRefreshed(true);
    const updatedPing = Math.floor(Math.random() * 80) + 20; // 20-100ms
    const updatedBattery = Math.max(device.battery - 1, 3); // minor drain
    
    setTimeout(() => {
      onUpdateDevice({
        ...device,
        latency: device.status === "OFFLINE" ? 0 : updatedPing,
        battery: updatedBattery,
      });
      setIsPingRefreshed(false);
      onAddLog(
        `Diagnostic ping test returned response from ${device.proxyIp}: ${device.status === "OFFLINE" ? "Timeout" : `${updatedPing}ms`}`,
        device.status === "OFFLINE" ? "WARNING" : "INFO",
        device.id
      );
    }, 500);
  };

  // Change individual track
  const handleChangeTrack = (trackId: string) => {
    const selectedTrack = TRACK_PLAYLIST.find((t) => t.id === trackId);
    if (!selectedTrack) return;

    onUpdateDevice({
      ...device,
      trackId: trackId,
      streamProgress: 0,
      sessionDuration: 0,
    });

    onAddLog(
      `Command issued: Session stream track changed to '${selectedTrack.title}' by ${selectedTrack.artist}`,
      "INFO",
      device.id
    );
  };

  // Save manual app account login credentials
  const handleSaveLogin = () => {
    if (!selectedApp || !targetDevice) return;
    setIsSavingLogin(true);

    const now = new Date();
    const loginTime = now.toISOString().replace("T", " ").substring(0, 16);

    setTimeout(() => {
      const updatedAppConfig = {
        username: loginUser || "anonymous_rebel",
        isLoggedIn: true,
        lastLogin: loginTime,
        streamCount: targetDevice[selectedApp]?.streamCount || 0,
      };

      const updated: VirtualDevice = {
        ...targetDevice,
        [selectedApp]: updatedAppConfig,
      };

      onUpdateDevice(updated);
      setIsSavingLogin(false);
      onAddLog(
        `Manual login bypass executed: Successfully signed in to app '${selectedApp.toUpperCase()}' for [${targetDevice.name}] with proxy signature [${targetDevice.proxyIp}]`,
        "SUCCESS",
        targetDevice.id
      );
    }, 600);
  };

  // Perform manual app account sign-out
  const handleLogout = () => {
    if (!selectedApp || !targetDevice) return;
    
    const updatedAppConfig = {
      username: "",
      isLoggedIn: false,
      lastLogin: "Never",
      streamCount: targetDevice[selectedApp]?.streamCount || 0,
    };

    const updated: VirtualDevice = {
      ...targetDevice,
      [selectedApp]: updatedAppConfig,
    };

    onUpdateDevice(updated);
    setLoginUser("");
    setLoginPass("");
    onAddLog(
      `Manual account logoff: Swiped out account profile from app '${selectedApp.toUpperCase()}' on [${targetDevice.name}]`,
      "WARNING",
      targetDevice.id
    );
  };

  // Toggle power state (Streaming, Paused, Offline)
  const handleToggleState = (newState: VirtualDevice["status"]) => {
    let newRate = device.streamRate;
    if (newState === "STREAMING") {
      newRate = device.streamRate || 256;
    } else {
      newRate = 0;
    }

    onUpdateDevice({
      ...device,
      status: newState,
      streamRate: newRate,
    });

    onAddLog(
      `Status toggled: State set to [${newState}] on node controller.`,
      newState === "OFFLINE" ? "CRITICAL" : newState === "PAUSED" ? "WARNING" : "SUCCESS",
      device.id
    );
  };

  // Duration formatting (e.g. 1h 23m)
  const formatUptime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div id="device-diagnostics-panel" className="bg-[#0b100d] border border-emerald-500/20 rounded-lg p-4 flex flex-col justify-between h-full relative select-none">
      {/* Decorative cyber grid accent */}
      <div className="absolute top-0 right-0 p-1 font-mono text-[8px] text-emerald-500/30">
        SYS_NODE_LOC_{device.id.toString().padStart(2, "0")}
      </div>

      <div className="flex flex-col gap-3">
        {/* Device Name and Status Headers */}
        <div className="pb-3 border-b border-emerald-500/10">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-sm text-emerald-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              {device.name.toUpperCase()} DIAGNOSTICS
            </h3>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-widest ${
              device.status === "STREAMING" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/20" :
              device.status === "ROTATING" ? "bg-sky-950/50 text-sky-400 border border-sky-500/20" :
              device.status === "PAUSED" ? "bg-amber-950/50 text-amber-400 border border-amber-500/20" :
              "bg-red-950/50 text-red-400 border border-red-500/20"
            }`}>
              {device.status}
            </span>
          </div>
          <p className="text-[10px] font-mono text-emerald-500/40 mt-1 uppercase">
            Model: {device.model}
          </p>
        </div>

        {/* Proxy Connectivity Segment */}
        <div className="bg-[#080d0a] border border-emerald-500/10 rounded p-2.5 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-emerald-500/70 border-b border-emerald-500/5 pb-1">
            <MapPin className="w-3 h-3" />
            VPN PROXY PROFILE
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-mono">
            <div>
              <span className="text-emerald-500/40 block text-[8px]">STEALTH IP</span>
              <span className="text-emerald-200 font-bold">{device.proxyIp}</span>
            </div>
            <div>
              <span className="text-emerald-500/40 block text-[8px]">TUNNEL TYPE</span>
              <span className="text-emerald-300 font-semibold">{device.proxyType} SOCKET</span>
            </div>
            <div>
              <span className="text-emerald-500/40 block text-[8px]">LOCATION ZONE</span>
              <span className="text-emerald-200 font-bold truncate block">{device.proxyCity}, {device.proxyCountry}</span>
            </div>
            <div>
              <span className="text-emerald-500/40 block text-[8px]">PACKET LATENCY</span>
              <span className={`font-bold ${device.latency > 100 ? "text-amber-400" : "text-emerald-400"}`}>
                {device.latency === 0 ? "TIMEOUT" : `${device.latency} MS`}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Telemetry segment */}
        <div className="bg-[#080d0a] border border-emerald-500/10 rounded p-2.5 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-emerald-500/70 border-b border-emerald-500/5 pb-1">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            ACTIVE AUDIO METRICS
          </div>
          {device.status === "STREAMING" && currentSong ? (
            <div className="flex flex-col gap-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-emerald-500/40">CURRENT STREAM</span>
                <span className="text-emerald-200 font-bold truncate max-w-[120px]">{currentSong.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-500/40">GENRE / FORMAT</span>
                <span className="text-emerald-300">{currentSong.genre} @ {device.streamRate}Kbps</span>
              </div>
              <div>
                <div className="flex justify-between text-[8px] text-emerald-500/50 mb-0.5">
                  <span>PROGRESS</span>
                  <span>{device.streamProgress}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-emerald-500/10">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${device.streamProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-[9px] font-mono text-emerald-500/30">
              AUDIO STREAM INACTIVE / SEEDER STANDBY
            </div>
          )}
        </div>

        {/* Technical Stats */}
        <div className="grid grid-cols-3 gap-1.5 border-b border-emerald-500/10 pb-3">
          <div className="bg-[#080d0a] border border-emerald-500/5 rounded p-1.5 text-center">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-500/60 mx-auto mb-0.5" />
            <span className="text-emerald-500/40 font-mono text-[8px] block">BATTERY</span>
            <span className="font-mono text-[10px] text-emerald-300 font-bold">{device.battery}%</span>
          </div>
          <div className="bg-[#080d0a] border border-emerald-500/5 rounded p-1.5 text-center">
            <Timer className="w-3.5 h-3.5 text-emerald-500/60 mx-auto mb-0.5" />
            <span className="text-emerald-500/40 font-mono text-[8px] block">UPTIME</span>
            <span className="font-mono text-[10px] text-emerald-300 font-semibold">{formatUptime(device.uptime)}</span>
          </div>
          <div className="bg-[#080d0a] border border-emerald-500/5 rounded p-1.5 text-center">
            <HardDrive className="w-3.5 h-3.5 text-emerald-500/60 mx-auto mb-0.5" />
            <span className="text-emerald-500/40 font-mono text-[8px] block">STREAMS</span>
            <span className="font-mono text-[10px] text-emerald-300 font-bold">{device.lifetimeStreams}</span>
          </div>
        </div>

        {/* 1-by-1 Virtual OS App Terminal Sandbox */}
        <div className="bg-[#060a08] border border-emerald-500/20 rounded-lg overflow-hidden flex flex-col relative">
          <div className="bg-emerald-950/40 px-2 py-1.5 border-b border-emerald-500/10 flex items-center justify-between font-mono text-[9px] text-emerald-400">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              PORTABLE SANDBOX OS (DEVICE SCREEN)
            </span>
            <span className="text-[8px] opacity-40">STEALTH MODE RUNNING</span>
          </div>

          {/* Device Screen Area */}
          <div className="p-3 bg-[#030604] min-h-[190px] flex flex-col justify-between relative">
            {/* Holographic scanner effect line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/30 animate-pulse pointer-events-none" />

            {!selectedApp ? (
              <div className="flex-1 flex flex-col justify-center items-center py-4 text-center">
                <Laptop className="w-8 h-8 text-emerald-500/25 mb-1.5" />
                <span className="text-[10px] font-mono text-emerald-400/80 font-bold uppercase tracking-wider">
                  Select App to Log In
                </span>
                <span className="text-[9px] font-mono text-emerald-500/45 max-w-[220px] mt-0.5">
                  Access 1-by-1 sandboxed system apps below to configure manual credentials.
                </span>

                {/* Grid of the 4 Apps */}
                <div className="grid grid-cols-4 gap-2.5 w-full mt-4 max-w-[260px]">
                  <button
                    onClick={() => setSelectedApp("youtube")}
                    className="p-1.5 bg-[#120808] hover:bg-[#1a0c0c] border border-red-500/20 hover:border-red-500/50 rounded flex flex-col items-center gap-1 transition-all"
                  >
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span className="text-[8px] font-mono text-red-400">YouTube</span>
                  </button>
                  <button
                    onClick={() => setSelectedApp("spotify")}
                    className="p-1.5 bg-[#081208] hover:bg-[#0c1c0c] border border-green-500/20 hover:border-green-500/50 rounded flex flex-col items-center gap-1 transition-all"
                  >
                    <Music className="w-4 h-4 text-green-500" />
                    <span className="text-[8px] font-mono text-green-400">Spotify</span>
                  </button>
                  <button
                    onClick={() => setSelectedApp("appleMusic")}
                    className="p-1.5 bg-[#120812] hover:bg-[#1c0c1c] border border-fuchsia-500/20 hover:border-fuchsia-500/50 rounded flex flex-col items-center gap-1 transition-all"
                  >
                    <Music className="w-4 h-4 text-fuchsia-500" />
                    <span className="text-[8px] font-mono text-fuchsia-400">Apple</span>
                  </button>
                  <button
                    onClick={() => setSelectedApp("twitter")}
                    className="p-1.5 bg-[#081218] hover:bg-[#0c1c24] border border-sky-500/20 hover:border-sky-500/50 rounded flex flex-col items-center gap-1 transition-all"
                  >
                    <Twitter className="w-4 h-4 text-sky-400" />
                    <span className="text-[8px] font-mono text-sky-400">Twitter</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                {/* Simulated App Header */}
                <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10 mb-2">
                  <div className="flex items-center gap-1.5">
                    {selectedApp === "youtube" && <Youtube className="w-3.5 h-3.5 text-red-500" />}
                    {selectedApp === "spotify" && <Music className="w-3.5 h-3.5 text-green-500" />}
                    {selectedApp === "appleMusic" && <Music className="w-3.5 h-3.5 text-fuchsia-500" />}
                    {selectedApp === "twitter" && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                    <span className="text-[10px] font-mono font-bold uppercase text-white tracking-widest">
                      {selectedApp === "appleMusic" ? "Apple Music" : selectedApp} Portal
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-[8px] font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/20 text-emerald-400 hover:bg-emerald-900 transition-all cursor-pointer"
                  >
                    ← Back OS
                  </button>
                </div>

                {/* Login override form */}
                <div className="space-y-2 font-mono text-[9px] flex-1 flex flex-col justify-center">
                  
                  {/* Target setup selector option */}
                  <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 rounded p-1.5 gap-1">
                    <span className="text-emerald-500/60 uppercase text-[8px] font-bold">SETUP TARGET:</span>
                    <select
                      value={targetDeviceId}
                      onChange={(e) => setTargetDeviceId(Number(e.target.value))}
                      className="bg-[#050906] border border-emerald-500/35 rounded px-1.5 py-0.5 text-[9px] text-emerald-300 font-bold focus:outline-none focus:border-emerald-500/60 cursor-pointer flex-1 text-right max-w-[130px]"
                    >
                      {devices.map((d) => (
                        <option key={d.id} value={d.id} className="bg-[#0b100d] text-emerald-300 text-[9px]">
                          {d.name} {d[selectedApp]?.isLoggedIn ? "✅" : "❌"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between bg-emerald-950/10 p-1.5 rounded border border-emerald-500/10">
                    <span className="text-emerald-500/40">Status:</span>
                    <span className="flex items-center gap-1 font-bold text-white">
                      {targetDevice?.[selectedApp]?.isLoggedIn ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">LOGGED IN</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-red-400 font-bold">LOG OUT / UNLINKED</span>
                        </>
                      )}
                    </span>
                  </div>

                  {targetDevice?.[selectedApp]?.isLoggedIn && (selectedApp === "youtube" || selectedApp === "spotify" || selectedApp === "appleMusic") && (
                    <div className="flex items-center justify-between bg-emerald-950/20 p-1.5 rounded border border-emerald-500/15">
                      <span className="text-emerald-500/40 font-bold">Channel Sync:</span>
                      <button
                        onClick={() => {
                          const currentSubStatus = !!targetDevice[selectedApp].isSubscribed;
                          const updatedAppAccount = {
                            ...targetDevice[selectedApp],
                            isSubscribed: !currentSubStatus
                          };
                          const updatedDevice = {
                            ...targetDevice,
                            [selectedApp]: updatedAppAccount
                          };
                          onUpdateDevice(updatedDevice);
                          
                          const targetName = selectedApp === "youtube" ? "Lofi Girl (Live Feed)" : selectedApp === "spotify" ? "The Weeknd (Artist)" : "Apple Starboy Curator";
                          onAddLog(
                            `[${targetDevice.name}] ${!currentSubStatus ? "Subscribed to" : "Unsubscribed from"} ${targetName} via proxy tunnel.`,
                            !currentSubStatus ? "SUCCESS" : "INFO",
                            targetDevice.id
                          );
                        }}
                        className={`px-2 py-0.5 rounded text-[8px] font-black transition-all cursor-pointer ${
                          targetDevice[selectedApp].isSubscribed
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900"
                            : selectedApp === "youtube"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : selectedApp === "spotify"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                        }`}
                      >
                        {targetDevice[selectedApp].isSubscribed 
                          ? "SUBSCRIBED ✓" 
                          : selectedApp === "youtube" 
                          ? "SUBSCRIBE NOW" 
                          : "FOLLOW ARTIST"}
                      </button>
                    </div>
                  )}

                  {targetDevice?.[selectedApp]?.isLoggedIn && selectedApp === "twitter" && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between bg-emerald-950/20 p-1.5 rounded border border-emerald-500/15">
                           <span className="text-emerald-500/40 font-bold">Impressions ({targetDevice.twitter.impressions}):</span>
                           <button
                             onClick={() => {
                                const updatedTwitter = { ...targetDevice.twitter, impressions: targetDevice.twitter.impressions + 100 };
                                const updatedDevice = { ...targetDevice, twitter: updatedTwitter };
                                onUpdateDevice(updatedDevice);
                                onAddLog(`[${targetDevice.name}] Added 100 impressions to Twitter.`, "SUCCESS", targetDevice.id);
                             }}
                             className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 rounded text-white text-[8px] font-bold"
                           >
                             +100 IMP
                           </button>
                        </div>
                        <div className="flex items-center justify-between bg-emerald-950/20 p-1.5 rounded border border-emerald-500/15">
                           <span className="text-emerald-500/40 font-bold">Likes ({targetDevice.twitter.likes}):</span>
                           <button
                             onClick={() => {
                                const updatedTwitter = { ...targetDevice.twitter, likes: targetDevice.twitter.likes + 1 };
                                const updatedDevice = { ...targetDevice, twitter: updatedTwitter };
                                onUpdateDevice(updatedDevice);
                                onAddLog(`[${targetDevice.name}] Added 1 like to Twitter.`, "SUCCESS", targetDevice.id);
                             }}
                             className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 rounded text-white text-[8px] font-bold"
                           >
                             +1 LIKE
                           </button>
                        </div>
                    </div>
                  )}

                  {/* Input Credentials */}
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Mail className="absolute left-1.5 top-1.5 w-3.5 h-3.5 text-emerald-500/40" />
                      <input
                        type="text"
                        placeholder="Login ID or Email"
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        className="w-full bg-[#080d0a] border border-emerald-500/25 rounded pl-6 pr-1.5 py-1 text-[9px] text-white focus:outline-none focus:border-emerald-500/60"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-1.5 top-1.5 w-3.5 h-3.5 text-emerald-500/40" />
                      <input
                        type="password"
                        placeholder="Security Token Pass"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full bg-[#080d0a] border border-emerald-500/25 rounded pl-6 pr-1.5 py-1 text-[9px] text-white focus:outline-none focus:border-emerald-500/60"
                      />
                    </div>
                  </div>

                  {/* Manual Bypass login CTA */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={handleSaveLogin}
                      disabled={isSavingLogin}
                      className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 rounded text-emerald-300 font-mono text-[9px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40 cursor-pointer"
                    >
                      <LogIn className="w-3 h-3" />
                      {isSavingLogin ? "HOOKING..." : "MANUAL LOGIN"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-2 py-1 bg-red-950/30 hover:bg-red-950/60 border border-red-500/20 hover:border-red-500/40 rounded text-red-400 font-mono text-[9px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3 h-3" />
                      SIGN OUT
                    </button>
                  </div>
                </div>

                {/* Metadata App stats info */}
                <div className="mt-2 pt-2 border-t border-emerald-500/10 flex justify-between text-[8px] font-mono text-emerald-500/45">
                  <span>LAST ACTIVE: {targetDevice?.[selectedApp]?.lastLogin || "Never"}</span>
                  <span className="text-emerald-400">STREAMS: {targetDevice?.[selectedApp]?.streamCount || 0} cycles</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Virtual App Navigation Quickbar (bottom of OS screen) */}
          <div className="bg-[#080d0a] px-2 py-1.5 border-t border-emerald-500/15 flex items-center justify-around">
            <button
              onClick={() => setSelectedApp("youtube")}
              className={`p-1 rounded-md transition-all ${selectedApp === "youtube" ? "bg-red-500/20 border border-red-500/30" : "hover:bg-emerald-950/20"}`}
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
            </button>
            <button
              onClick={() => setSelectedApp("spotify")}
              className={`p-1 rounded-md transition-all ${selectedApp === "spotify" ? "bg-green-500/20 border border-green-500/30" : "hover:bg-emerald-950/20"}`}
            >
              <Music className="w-3.5 h-3.5 text-green-500" />
            </button>
            <button
              onClick={() => setSelectedApp("appleMusic")}
              className={`p-1 rounded-md transition-all ${selectedApp === "appleMusic" ? "bg-fuchsia-500/20 border border-fuchsia-500/30" : "hover:bg-emerald-950/20"}`}
            >
              <Music className="w-3.5 h-3.5 text-fuchsia-400" />
            </button>
            <button
              onClick={() => setSelectedApp("twitter")}
              className={`p-1 rounded-md transition-all ${selectedApp === "twitter" ? "bg-sky-500/20 border border-sky-500/30" : "hover:bg-emerald-950/20"}`}
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Commands Console */}
      <div className="mt-4 pt-3 border-t border-emerald-500/10 flex flex-col gap-2">
        <span className="font-mono text-[9px] font-bold text-emerald-400">REMOTE TELE-COMMANDS:</span>
        
        {/* Toggle Tracks */}
        <div className="flex gap-1.5 items-center">
          <span className="font-mono text-[8px] text-emerald-500/50 w-11 shrink-0">SONG FEED:</span>
          <select
            id="change-device-track"
            value={device.trackId}
            onChange={(e) => handleChangeTrack(e.target.value)}
            disabled={device.status === "OFFLINE"}
            className="flex-1 bg-[#080d0a] border border-emerald-500/20 rounded px-2 py-1 text-[10px] font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {TRACK_PLAYLIST.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={handleRotateProxy}
            className="px-2 py-1.5 border border-sky-500/30 hover:border-sky-400 bg-sky-950/10 hover:bg-sky-950/30 rounded text-sky-400 font-mono text-[9px] flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCw className="w-3 h-3" />
            ROTATE PROXY
          </button>

          <button
            onClick={handlePingRefresh}
            disabled={isPingRefreshed}
            className="px-2 py-1.5 border border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/30 rounded text-emerald-400 font-mono text-[9px] flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${isPingRefreshed ? "animate-spin" : ""}`} />
            REFRESH PING
          </button>

          {onTogglePin && (
            <button
              onClick={() => onTogglePin(device.id)}
              className={`col-span-2 px-2 py-1.5 border rounded font-mono text-[9px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                pinnedIds.includes(device.id)
                  ? "border-red-500/30 hover:border-red-400 bg-red-950/10 hover:bg-red-950/25 text-red-400 font-bold"
                  : "border-purple-500/35 hover:border-purple-400 bg-purple-950/10 hover:bg-purple-950/25 text-purple-400 font-bold"
              }`}
            >
              <Monitor className="w-3 h-3 animate-pulse" />
              {pinnedIds.includes(device.id) ? "REMOVE FROM MONITOR WALL" : "PROJECT TO STREAMING MONITOR WALL"}
            </button>
          )}
        </div>

        {/* State Toggles (Mute / Power) */}
        <div className="grid grid-cols-3 gap-1 mt-1 font-mono text-[9px]">
          <button
            onClick={() => handleToggleState("STREAMING")}
            className={`py-1 rounded border transition-all flex items-center justify-center gap-1 ${
              device.status === "STREAMING"
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                : "border-emerald-500/10 text-emerald-500/50 hover:bg-emerald-500/5"
            }`}
          >
            <Power className="w-2.5 h-2.5 text-emerald-400" />
            STREAM
          </button>
          
          <button
            onClick={() => handleToggleState("PAUSED")}
            className={`py-1 rounded border transition-all flex items-center justify-center gap-1 ${
              device.status === "PAUSED"
                ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold"
                : "border-emerald-500/10 text-emerald-500/50 hover:bg-emerald-500/5"
            }`}
          >
            PAUSE
          </button>

          <button
            onClick={() => handleToggleState("OFFLINE")}
            className={`py-1 rounded border transition-all flex items-center justify-center gap-1 ${
              device.status === "OFFLINE"
                ? "bg-red-500/20 border-red-400 text-red-300 font-bold"
                : "border-emerald-500/10 text-emerald-500/50 hover:bg-emerald-500/5"
            }`}
          >
            DISCONNECT
          </button>
        </div>
      </div>
    </div>
  );
};
