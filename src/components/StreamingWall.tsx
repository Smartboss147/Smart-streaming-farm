import React, { useState } from "react";
import { VirtualDevice } from "../types";
import { 
  Youtube, Music, Monitor, X, Play, Volume2, Shield, Settings, ExternalLink, RefreshCw 
} from "lucide-react";

interface StreamingWallProps {
  devices: VirtualDevice[];
  pinnedIds: number[];
  onTogglePin: (id: number) => void;
  onSelectDevice: (device: VirtualDevice) => void;
  onUpdateDevice: (device: VirtualDevice) => void;
  onAddLog: (msg: string, type: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL") => void;
}

export const StreamingWall: React.FC<StreamingWallProps> = ({
  devices,
  pinnedIds,
  onTogglePin,
  onSelectDevice,
  onUpdateDevice,
  onAddLog,
}) => {
  const pinnedDevices = devices.slice(0, 15);
  const [activeMediaTab, setActiveMediaTab] = useState<Record<number, "youtube" | "spotify" | "appleMusic">>({});

  // States to hold manual URLs for editing per device on the fly
  const [editingUrls, setEditingUrls] = useState<Record<number, string>>({});

  const getMediaTab = (deviceId: number): "youtube" | "spotify" | "appleMusic" => {
    return activeMediaTab[deviceId] || "youtube";
  };

  const setMediaTab = (deviceId: number, tab: "youtube" | "spotify" | "appleMusic") => {
    setActiveMediaTab((prev) => ({ ...prev, [deviceId]: tab }));
  };

  const handleUpdateStreamId = (deviceId: number, type: "youtube" | "spotify" | "appleMusic", value: string) => {
    console.log("Binding device:", deviceId, type, value);
    const device = devices.find((d) => d.id === deviceId);
    if (!device) {
      console.error("Device not found:", deviceId);
      return;
    }

    let updatedValue = value.trim();
    if (!updatedValue) {
      console.warn("Empty value for binding");
      return;
    }
    
    // Auto-extract ID from full YouTube or Spotify URLs if pasted
    if (type === "youtube") {
      if (updatedValue.includes("youtube.com/watch?v=")) {
        const urlParams = new URLSearchParams(updatedValue.split("?")[1]);
        updatedValue = urlParams.get("v") || updatedValue;
      } else if (updatedValue.includes("youtu.be/")) {
        updatedValue = updatedValue.split("youtu.be/")[1].split("?")[0] || updatedValue;
      }
    } else if (type === "spotify") {
      if (updatedValue.includes("spotify.com/track/")) {
        updatedValue = updatedValue.split("spotify.com/track/")[1].split("?")[0] || updatedValue;
      }
    }

    const updated: VirtualDevice = {
      ...device,
      youtubeId: type === "youtube" ? updatedValue : device.youtubeId,
      spotifyId: type === "spotify" ? updatedValue : device.spotifyId,
      appleMusicId: type === "appleMusic" ? updatedValue : device.appleMusicId,
    };

    onUpdateDevice(updated);
    onAddLog(
      `Updated ${type.toUpperCase()} stream target for [${device.name}] to ID: ${updatedValue}. Loaded live feed!`,
      "SUCCESS"
    );
  };

  return (
    <div id="streaming-wall" className="bg-[#0b100d] border border-emerald-500/25 rounded-lg p-4 select-none">
      <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-display text-xs font-black text-white tracking-wider uppercase">
            📡 REAL-TIME MULTIMEDIA STREAMING WALL (LIVE GLOBAL BROADCASTS)
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[9px]">
          <span className="text-emerald-500/50">PROJECTIONS ACTIVE:</span>
          <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold rounded">
            {pinnedIds.length} / 15 Devices
          </span>
        </div>
      </div>

      {pinnedDevices.length === 0 ? (
        <div className="border border-dashed border-emerald-500/10 rounded-lg py-8 text-center flex flex-col items-center justify-center bg-[#050906]/40">
          <Play className="w-7 h-7 text-emerald-500/20 mb-2 animate-bounce" />
          <span className="text-[11px] font-mono font-bold text-emerald-400">MONITOR WALL STANDBY</span>
          <p className="text-[9px] font-mono text-emerald-500/40 max-w-sm mt-1">
            No devices currently projected. Select any device in the grid or list and click the "PROJECT TO MONITOR WALL" option to spawn live video and audio streams.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {pinnedDevices.map((dev) => {
            const currentTab = getMediaTab(dev.id);
            const editingVal = editingUrls[dev.id] !== undefined ? editingUrls[dev.id] : "";

            return (
              <div 
                key={dev.id} 
                className="bg-[#050906] border border-emerald-500/20 rounded-lg p-3 flex flex-col gap-2.5 relative transition-all duration-300 hover:border-emerald-500/40 shadow-[0_0_15px_-5px_rgba(16,185,129,0.1)]"
              >
                {/* Device Titlebar */}
                <div className="flex justify-between items-center bg-emerald-950/20 px-2 py-1 rounded border border-emerald-500/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-display text-[11px] font-black text-white tracking-wide">
                      {dev.name}
                    </span>
                    <span className="font-mono text-[8px] bg-emerald-900/40 border border-emerald-500/20 px-1 py-0.5 rounded text-emerald-300">
                      {dev.proxyIp.split(":")[0]} ({dev.proxyCountryCode})
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectDevice(dev)}
                      className="p-1 hover:bg-emerald-900/40 text-emerald-400 hover:text-white rounded transition-all cursor-pointer"
                      title="Setup credentials & diagnostics"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onTogglePin(dev.id)}
                      className="p-1 hover:bg-red-950/40 text-emerald-500/50 hover:text-red-400 rounded transition-all cursor-pointer"
                      title="Unproject stream"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Device Account context */}
                <div className="grid grid-cols-3 gap-1 text-[8px] font-mono text-emerald-500/60 pb-1 border-b border-emerald-500/5">
                  <div className="truncate">
                    <span className="opacity-40 uppercase block">YouTube Account:</span>
                    <span className={dev.youtube.isLoggedIn ? "text-emerald-400 font-bold" : "text-amber-500"}>
                      {dev.youtube.isLoggedIn ? dev.youtube.username.split("@")[0] : "❌ OFF"}{" "}
                      {dev.youtube.isLoggedIn && dev.youtube.isSubscribed && (
                        <span className="text-red-400 font-bold" title="Subscribed">🔔</span>
                      )}
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="opacity-40 uppercase block">Spotify Account:</span>
                    <span className={dev.spotify.isLoggedIn ? "text-emerald-400 font-bold" : "text-amber-500"}>
                      {dev.spotify.isLoggedIn ? dev.spotify.username.split("@")[0] : "❌ OFF"}{" "}
                      {dev.spotify.isLoggedIn && dev.spotify.isSubscribed && (
                        <span className="text-green-400 font-bold" title="Following">✓</span>
                      )}
                    </span>
                  </div>
                  <div className="truncate">
                    <span className="opacity-40 uppercase block">Target Track:</span>
                    <span className="text-emerald-300 font-medium truncate block">
                      {dev.youtubeId ? "Live Feed" : "Synthwave"}
                    </span>
                  </div>
                </div>

                {/* Real Embed Platform Container */}
                <div className="bg-black/90 border border-emerald-500/10 rounded-md overflow-hidden relative group">
                  {currentTab === "youtube" && (
                    <div className="w-full aspect-video bg-[#0c0d0e]">
                      <iframe
                        src={`https://www.youtube.com/embed/${dev.youtubeId || "jfKfPfyJRdk"}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0&iv_load_policy=3&theme=dark`}
                        title={`YouTube stream for ${dev.name}`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {currentTab === "spotify" && (
                    <div className="w-full h-[80px] bg-[#0c0d0e] flex items-center justify-center p-1">
                      <iframe
                        src={`https://open.spotify.com/embed/track/${dev.spotifyId || "0VjIjW4GlUZAMY0vU6S6I6"}?utm_source=generator&theme=0`}
                        title={`Spotify player for ${dev.name}`}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-md"
                      />
                    </div>
                  )}

                  {currentTab === "appleMusic" && (
                    <div className="w-full h-[80px] bg-[#0c0d0e] flex items-center justify-center p-1">
                      <iframe
                        allow="autoplay *; encrypted-media *; fullscreen *"
                        frameBorder="0"
                        height="80"
                        style={{ width: "100%", maxWidth: "100%", overflow: "hidden", borderRadius: "10px", background: "transparent" }}
                        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                        src={`https://embed.music.apple.com/${dev.appleMusicId || "us/album/starboy-feat-daft-punk/1156434450"}`}
                        title={`Apple Music player for ${dev.name}`}
                      />
                    </div>
                  )}

                  {/* Holographic Signal overlay */}
                  <div className="absolute top-1 right-2 pointer-events-none flex gap-1 items-center bg-black/70 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[7px] font-mono text-emerald-400">
                    <Volume2 className="w-2.5 h-2.5 text-emerald-400 animate-bounce" />
                    <span>REAL STREAM</span>
                  </div>
                </div>

                {/* Subscriptions Hub Integration */}
                <div className="bg-[#09100c] border border-emerald-500/10 rounded-md p-2 flex justify-between items-center text-[10px] font-mono">
                  <div className="flex flex-col truncate max-w-[65%]">
                    <span className="text-[8px] text-emerald-500/40 uppercase">Channel / Artist Stream</span>
                    <span className="text-emerald-300 font-bold truncate">
                      {currentTab === "youtube" 
                        ? `YouTube: Live Feed` 
                        : currentTab === "spotify" 
                        ? `Spotify Artist` 
                        : `Apple Music Artist`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const updatedDev = { ...dev };
                      const isSub = currentTab === "youtube" 
                        ? !!dev.youtube.isSubscribed 
                        : currentTab === "spotify" 
                        ? !!dev.spotify.isSubscribed 
                        : !!dev.appleMusic.isSubscribed;
                      
                      const newSub = !isSub;

                      if (currentTab === "youtube") {
                        if (!dev.youtube.isLoggedIn) {
                          onAddLog(`[${dev.name}] Cannot subscribe. YouTube account is not logged in!`, "WARNING");
                          return;
                        }
                        updatedDev.youtube = { ...dev.youtube, isSubscribed: newSub };
                      } else if (currentTab === "spotify") {
                        if (!dev.spotify.isLoggedIn) {
                          onAddLog(`[${dev.name}] Cannot follow. Spotify account is not logged in!`, "WARNING");
                          return;
                        }
                        updatedDev.spotify = { ...dev.spotify, isSubscribed: newSub };
                      } else {
                        if (!dev.appleMusic.isLoggedIn) {
                          onAddLog(`[${dev.name}] Cannot follow. Apple Music account is not logged in!`, "WARNING");
                          return;
                        }
                        updatedDev.appleMusic = { ...dev.appleMusic, isSubscribed: newSub };
                      }

                      onUpdateDevice(updatedDev);
                      
                      const platform = currentTab === "youtube" ? "YouTube" : currentTab === "spotify" ? "Spotify" : "Apple Music";
                      const actionWord = newSub ? "SUBSCRIBED TO" : "UNSUBSCRIBED FROM";
                      onAddLog(
                        `[${dev.name}] [IP: ${dev.proxyIp}] successfully ${actionWord} the channel/artist on ${platform}.`,
                        newSub ? "SUCCESS" : "INFO"
                      );
                    }}
                    className={`px-2 py-0.5 rounded text-[8px] font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                      (currentTab === "youtube" ? dev.youtube.isSubscribed : currentTab === "spotify" ? dev.spotify.isSubscribed : dev.appleMusic.isSubscribed)
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900"
                        : currentTab === "youtube"
                        ? "bg-red-600 hover:bg-red-700 text-white border border-red-500/30"
                        : currentTab === "spotify"
                        ? "bg-green-600 hover:bg-green-700 text-white border border-green-500/30"
                        : "bg-fuchsia-600 hover:bg-fuchsia-700 text-white border border-fuchsia-500/30"
                    }`}
                  >
                    {(currentTab === "youtube" ? dev.youtube.isSubscribed : currentTab === "spotify" ? dev.spotify.isSubscribed : dev.appleMusic.isSubscribed)
                      ? "SUBSCRIBED ✓" 
                      : currentTab === "youtube"
                      ? "SUBSCRIBE"
                      : "FOLLOW"}
                  </button>
                </div>

                {/* Tab select and dynamic stream binding inputs */}
                <div className="space-y-2">
                  <div className="flex gap-1 justify-between">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setMediaTab(dev.id, "youtube"); }}
                        className={`px-2 py-1 text-[8px] font-mono font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          currentTab === "youtube"
                            ? "bg-red-950/40 text-red-400 border border-red-500/30"
                            : "bg-[#0b100d] text-emerald-500/40 hover:bg-emerald-950 hover:text-emerald-400 border border-transparent"
                        }`}
                      >
                        <Youtube className="w-2.5 h-2.5" />
                        YOUTUBE VIDEO
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setMediaTab(dev.id, "spotify"); }}
                        className={`px-2 py-1 text-[8px] font-mono font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          currentTab === "spotify"
                            ? "bg-green-950/40 text-green-400 border border-green-500/30"
                            : "bg-[#0b100d] text-emerald-500/40 hover:bg-emerald-950 hover:text-emerald-400 border border-transparent"
                        }`}
                      >
                        <Music className="w-2.5 h-2.5" />
                        SPOTIFY MUSIC
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setMediaTab(dev.id, "appleMusic"); }}
                        className={`px-2 py-1 text-[8px] font-mono font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          currentTab === "appleMusic"
                            ? "bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-500/30"
                            : "bg-[#0b100d] text-emerald-500/40 hover:bg-emerald-950 hover:text-emerald-400 border border-transparent"
                        }`}
                      >
                        <Music className="w-2.5 h-2.5" />
                        APPLE MUSIC
                      </button>
                    </div>

                    <span className="text-[7px] font-mono text-emerald-500/30 flex items-center gap-0.5">
                      <Shield className="w-2 h-2 text-emerald-400/40" /> SECURED BY PROXY
                    </span>
                  </div>

                  {/* Input box to target custom stream URLs or IDs */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder={
                        currentTab === "youtube"
                          ? "Paste YouTube Video ID or URL (e.g. jfKfPfyJRdk)"
                          : currentTab === "spotify"
                          ? "Paste Spotify Track ID or URL"
                          : "Paste Apple Music album embed URL path"
                      }
                      value={editingVal}
                      onChange={(e) => setEditingUrls((prev) => ({ ...prev, [dev.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleUpdateStreamId(dev.id, currentTab, editingVal);
                          setEditingUrls((prev) => ({ ...prev, [dev.id]: "" }));
                        }
                      }}
                      className="flex-1 bg-[#090d0b] border border-emerald-500/20 hover:border-emerald-500/30 rounded px-2 py-1 text-[9px] text-white placeholder-emerald-500/20 font-mono focus:outline-none focus:border-emerald-500/60"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpdateStreamId(dev.id, currentTab, editingVal);
                        setEditingUrls((prev) => ({ ...prev, [dev.id]: "" }));
                      }}
                      disabled={!editingVal}
                      className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-400/40 hover:border-emerald-400 hover:bg-emerald-900 rounded font-mono text-[9px] font-bold text-emerald-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      BIND
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
