import React from "react";
import { Track } from "../types";
import { TRACK_PLAYLIST } from "../data";
import { Play, RotateCw, Shield, VolumeX, Volume2, Flame, ShieldAlert, WifiOff } from "lucide-react";

interface StreamControlsProps {
  farmStatus: "ACTIVE" | "IDLE" | "SHUTDOWN" | "ALERT";
  isMuted: boolean;
  rotationRate: number;
  onSetRotationRate: (rate: number) => void;
  onMassCastTrack: (trackId: string) => void;
  onForceAllRotation: () => void;
  onBootAll: () => void;
  onToggleMute: () => void;
  onToggleBlackout: () => void;
  isConstantIpMode: boolean;
  onToggleConstantIpMode: () => void;
}

export const StreamControls: React.FC<StreamControlsProps> = ({
  farmStatus,
  isMuted,
  rotationRate,
  onSetRotationRate,
  onMassCastTrack,
  onForceAllRotation,
  onBootAll,
  onToggleMute,
  onToggleBlackout,
  isConstantIpMode,
  onToggleConstantIpMode,
}) => {
  return (
    <div id="master-controls" className="bg-[#0b100d] border border-emerald-500/20 rounded-lg p-4 flex flex-col h-full relative select-none">
      
      {/* Visual cyber tag */}
      <div className="absolute top-1 right-2 font-mono text-[8px] text-emerald-500/30">
        SYS_MASTER_OVERRIDE_V4
      </div>

      <div className="space-y-4">
        {/* Farm Status Banner */}
        <div className="border-b border-emerald-500/10 pb-3">
          <span className="font-mono text-[9px] font-bold text-emerald-500/50 block mb-1">
            MASTER FARM CONTROLLER STATUS
          </span>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-display font-black tracking-widest uppercase flex items-center gap-1.5 ${
              farmStatus === "ACTIVE" ? "text-emerald-400 glow-green" :
              farmStatus === "ALERT" ? "text-red-500 glow-red" :
              farmStatus === "IDLE" ? "text-amber-400 glow-amber" : "text-zinc-500"
            }`}>
              {farmStatus === "ACTIVE" && <Flame className="w-4.5 h-4.5 animate-bounce" />}
              {farmStatus === "ALERT" && <ShieldAlert className="w-4.5 h-4.5 animate-ping" />}
              {farmStatus === "IDLE" && <VolumeX className="w-4.5 h-4.5" />}
              {farmStatus === "SHUTDOWN" && <WifiOff className="w-4.5 h-4.5" />}
              {farmStatus === "IDLE" ? "STEALTH STANDBY" : farmStatus === "SHUTDOWN" ? "BLACKOUT LOCKDOWN" : `FARM ${farmStatus}`}
            </span>

            {/* Quick stats indicators */}
            <div className="text-[10px] font-mono text-emerald-300 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">
              STEALTH VALUE: {farmStatus === "SHUTDOWN" ? "0%" : farmStatus === "ALERT" ? "21% [CRITICAL]" : isMuted ? "94% [SECURE]" : "82% [STABLE]"}
            </div>
          </div>
        </div>

        {/* Global IP Policy Mode Card */}
        <div className={`p-2.5 rounded border transition-all ${
          isConstantIpMode 
            ? "bg-[#091510] border-emerald-500/30 text-emerald-300"
            : "bg-[#18110b] border-amber-500/20 text-amber-300"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[8px] opacity-50 uppercase block">PROXY FLOW CONTROL</span>
              <span className="font-display text-[10px] font-bold tracking-wide">
                {isConstantIpMode ? "🛡️ STATIC ENCRYPTED TUNNELS (ENFORCED)" : "🌀 AUTO-ROTATE IP PACETS (ACTIVE)"}
              </span>
            </div>
            <button
              onClick={onToggleConstantIpMode}
              className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded border transition-all cursor-pointer ${
                isConstantIpMode
                  ? "bg-emerald-950/40 border-emerald-400 hover:bg-emerald-900/50 text-emerald-300"
                  : "bg-amber-950/40 border-amber-400 hover:bg-amber-900/50 text-amber-300"
              }`}
            >
              {isConstantIpMode ? "LOCK ON" : "UNLOCK"}
            </button>
          </div>
          <p className="text-[9px] font-mono opacity-60 mt-1 leading-relaxed">
            {isConstantIpMode 
              ? "Underground directive active: Device IP addresses are constant across reloads. No periodic proxy switching."
              : "Warning: Dynamic cycle mode will automatically rotate random VPN proxies every cycle rate interval."}
          </p>
        </div>

        {/* Global Song Mass Casting */}
        <div>
          <span className="font-mono text-[9px] font-bold text-emerald-500/60 block mb-2">
            🚀 MANUAL STREAM BINDING
          </span>
          <div className="flex gap-1.5 mb-2">
            <input
              type="text"
              placeholder="Enter Music/Video URL or ID"
              className="flex-1 bg-[#080d0a] border border-emerald-500/20 hover:border-emerald-500/40 rounded px-2 py-1 text-[9px] text-white placeholder-emerald-500/30 font-mono focus:outline-none focus:border-emerald-500/60"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    onMassCastTrack(val.trim());
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input.value.trim()) {
                  onMassCastTrack(input.value.trim());
                  input.value = "";
                }
              }}
              className="px-3 bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-emerald-300 rounded font-bold text-[9px] cursor-pointer"
            >
              BIND
            </button>
          </div>
          <div className="font-mono text-[8px] text-emerald-500/40 italic">
            Enter YouTube video ID or Spotify/Apple Music track ID to multicast to active nodes.
          </div>
        </div>

        {/* Automated Proxy Rotation Config */}
        <div className={`border rounded p-3 transition-all ${
          isConstantIpMode 
            ? "bg-[#050706] border-emerald-500/5 opacity-40" 
            : "bg-[#080d0a] border-emerald-500/10"
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-[9px] font-bold text-emerald-400">
              🌀 ROTATION CYCLE RATE {isConstantIpMode && "[STATIC LOCKED]"}
            </span>
            <span className="font-mono text-[10px] text-emerald-300 font-bold">
              {isConstantIpMode ? "INACTIVE" : `EVERY ${rotationRate} SECONDS`}
            </span>
          </div>
          
          {/* Custom Slider */}
          <input
            id="proxy-rotation-rate"
            type="range"
            min="10"
            max="120"
            step="5"
            value={rotationRate}
            onChange={(e) => onSetRotationRate(Number(e.target.value))}
            disabled={farmStatus === "SHUTDOWN" || isConstantIpMode}
            className="w-full h-1 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 disabled:opacity-40"
          />
          <div className="flex justify-between text-[8px] font-mono text-emerald-500/35 mt-1">
            <span>FAST (10s)</span>
            <span>STEALTH (120s)</span>
          </div>
        </div>

        {/* Master Action Grid */}
        <div className="space-y-2">
          <span className="font-mono text-[9px] font-bold text-emerald-500/60 block">
            ⚠️ SYSTEM OVERRIDE OVERLAYS
          </span>
          <div className="grid grid-cols-2 gap-2">
            {/* Force rotate all */}
            <button
              onClick={onForceAllRotation}
              disabled={farmStatus === "SHUTDOWN"}
              className="px-2 py-2 border border-sky-500/30 hover:border-sky-400 bg-sky-950/10 hover:bg-sky-950/20 text-sky-400 rounded font-mono text-[9px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            >
              <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
              FORCE 50x IP ROTATE
            </button>

            {/* Boot all devices */}
            <button
              onClick={onBootAll}
              disabled={farmStatus === "SHUTDOWN"}
              className="px-2 py-2 border border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-400 rounded font-mono text-[9px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5" />
              BOOT ALL STREAMERS
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Master Mute Stealth */}
            <button
              onClick={onToggleMute}
              disabled={farmStatus === "SHUTDOWN"}
              className={`px-2 py-2 border rounded font-mono text-[9px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isMuted
                  ? "border-amber-400 bg-amber-950/20 text-amber-300"
                  : "border-amber-500/20 hover:border-amber-400 bg-amber-950/5 text-amber-500/70"
              } disabled:opacity-40`}
            >
              {isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {isMuted ? "DISABLE STEALTH MUTE" : "STEALTH MUTE FARM"}
            </button>

            {/* Blackout protocol */}
            <button
              onClick={onToggleBlackout}
              className={`px-2 py-2 border rounded font-mono text-[9px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                farmStatus === "SHUTDOWN"
                  ? "border-red-500 bg-red-950/40 text-red-400 animate-pulse"
                  : "border-red-500/30 hover:border-red-400 bg-red-950/10 text-red-500/70"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {farmStatus === "SHUTDOWN" ? "CANCEL BLACKOUT" : "BLACKOUT PROTOCOL"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
