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
  const pinnedDevices = devices;
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
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    let updatedValue = value.trim();
    
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
            {pinnedIds.length} / 6 Devices
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pinnedDevices.map((dev) => (
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
                </div>
              </div>
              {/* Simulated Device Account context */}
              <div className="grid grid-cols-3 gap-1 text-[8px] font-mono text-emerald-500/60 pb-1 border-b border-emerald-500/5">
                <div className="truncate">
                  <span className="opacity-40 uppercase block">YouTube Account:</span>
                  <span className={dev.youtube.isLoggedIn ? "text-emerald-400 font-bold" : "text-amber-500"}>
                    {dev.youtube.isLoggedIn ? dev.youtube.username.split("@")[0] : "❌ OFF"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
