import React, { useState, useMemo } from "react";
import { VirtualDevice, Track } from "../types";
import { Search, Filter, ShieldAlert, Wifi, Activity, Battery, SlidersHorizontal } from "lucide-react";
import { TRACK_PLAYLIST } from "../data";

interface DeviceGridProps {
  devices: VirtualDevice[];
  selectedDevice: VirtualDevice | null;
  onSelectDevice: (device: VirtualDevice) => void;
}

export const DeviceGrid: React.FC<DeviceGridProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [trackFilter, setTrackFilter] = useState<string>("ALL");

  // Filter devices based on search query, status filter, and track filter
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.proxyIp.includes(searchQuery) ||
        device.proxyCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.proxyCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.model.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || device.status === statusFilter;

      const matchesTrack =
        trackFilter === "ALL" || device.trackId === trackFilter;

      return matchesSearch && matchesStatus && matchesTrack;
    });
  }, [devices, searchQuery, statusFilter, trackFilter]);

  // Color mappings for different states
  const getStatusConfig = (status: VirtualDevice["status"]) => {
    switch (status) {
      case "STREAMING":
        return {
          bg: "bg-emerald-950/40",
          border: "border-emerald-500/40 hover:border-emerald-400",
          glow: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
          text: "text-emerald-400",
        };
      case "ROTATING":
        return {
          bg: "bg-sky-950/40",
          border: "border-sky-500/40 hover:border-sky-400",
          glow: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-spin",
          text: "text-sky-400",
        };
      case "PAUSED":
        return {
          bg: "bg-amber-950/30",
          border: "border-amber-500/30 hover:border-amber-400",
          glow: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
          text: "text-amber-400",
        };
      case "OFFLINE":
        return {
          bg: "bg-zinc-900/50",
          border: "border-zinc-700/50 hover:border-zinc-500",
          glow: "bg-zinc-600",
          text: "text-zinc-500",
        };
      case "ERROR":
        return {
          bg: "bg-red-950/30",
          border: "border-red-500/30 hover:border-red-400",
          glow: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse",
          text: "text-red-500",
        };
    }
  };

  return (
    <div id="device-matrix-grid" className="bg-[#0b100d] border border-emerald-500/20 rounded-lg p-4 flex flex-col h-full relative">
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-500/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-500/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-emerald-500/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-500/50" />

      {/* Header with quick stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-emerald-500/10">
        <div>
          <h2 className="font-display text-base font-bold text-emerald-400 tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            DEVICE CONTROLLER MATRIX
          </h2>
          <p className="text-[10px] font-mono text-emerald-500/50">
            SHOWING {filteredDevices.length} / 50 NODES DEPLOYED IN THE STEALTH SUBNET
          </p>
        </div>

        {/* Legend status toggles */}
        <div className="flex flex-wrap gap-1.5 text-[9px] font-mono">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-2 py-0.5 rounded border transition-all ${
              statusFilter === "ALL"
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "border-emerald-500/10 hover:bg-emerald-500/5 text-emerald-500/60"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setStatusFilter("STREAMING")}
            className={`px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
              statusFilter === "STREAMING"
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "border-emerald-500/10 hover:bg-emerald-500/5 text-emerald-500/60"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
            STREAMING ({devices.filter(d => d.status === "STREAMING").length})
          </button>
          <button
            onClick={() => setStatusFilter("ROTATING")}
            className={`px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
              statusFilter === "ROTATING"
                ? "bg-sky-500/20 border-sky-400 text-sky-300"
                : "border-emerald-500/10 hover:bg-emerald-500/5 text-emerald-500/60"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-spin" />
            ROTATING ({devices.filter(d => d.status === "ROTATING").length})
          </button>
          <button
            onClick={() => setStatusFilter("PAUSED")}
            className={`px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
              statusFilter === "PAUSED"
                ? "bg-amber-500/20 border-amber-400 text-amber-300"
                : "border-emerald-500/10 hover:bg-emerald-500/5 text-emerald-500/60"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            PAUSED ({devices.filter(d => d.status === "PAUSED").length})
          </button>
          <button
            onClick={() => setStatusFilter("ERROR")}
            className={`px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
              statusFilter === "ERROR"
                ? "bg-red-500/20 border-red-400 text-red-300"
                : "border-emerald-500/10 hover:bg-emerald-500/5 text-emerald-500/60"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            ALERT ({devices.filter(d => d.status === "ERROR" || d.status === "OFFLINE").length})
          </button>
        </div>
      </div>

      {/* Control Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b border-emerald-500/10 select-none z-10">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500/50" />
          <input
            id="search-devices"
            type="text"
            placeholder="Search IP, Model, Proxy City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080d0a] border border-emerald-500/15 rounded px-2.5 py-1.5 pl-8 text-xs font-mono text-emerald-300 placeholder-emerald-500/30 focus:outline-none focus:border-emerald-500/40"
          />
        </div>

        {/* Track filter dropdown */}
        <div className="relative">
          <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500/50" />
          <select
            id="filter-by-track"
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="w-full bg-[#080d0a] border border-emerald-500/15 rounded px-2.5 py-1.5 pl-8 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/40 appearance-none cursor-pointer"
          >
            <option value="ALL">FILTER BY PLAYLIST: ALL</option>
            {TRACK_PLAYLIST.map((t) => (
              <option key={t.id} value={t.id}>
                STREAMING: {t.title} ({t.artist})
              </option>
            ))}
          </select>
        </div>

        {/* Status display counts */}
        <div className="flex items-center justify-end text-[10px] font-mono text-emerald-500/40 gap-3 px-1">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-emerald-500/75" />
            SOCKS5: {devices.filter(d => d.proxyType === "SOCKS5").length}
          </span>
          <span className="flex items-center gap-1">
            <Battery className="w-3 h-3 text-emerald-500/75" />
            AVG BATTERY: {Math.floor(devices.reduce((acc, d) => acc + d.battery, 0) / 50)}%
          </span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 py-4 scrollbar-thin select-none z-10">
        {filteredDevices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-emerald-500/10 rounded-lg bg-[#080c09]">
            <ShieldAlert className="w-8 h-8 text-emerald-500/30 mb-2 animate-bounce" />
            <p className="font-mono text-xs text-emerald-500/50">NO DETECTED VIRTUAL DEVICES MATCH CRITERIA</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setTrackFilter("ALL");
              }}
              className="mt-3 px-3 py-1 font-mono text-[10px] border border-emerald-500/25 rounded hover:bg-emerald-500/10 text-emerald-400 transition-all"
            >
              RESET GRID TERMINAL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-2">
            {filteredDevices.map((device) => {
              const isSelected = selectedDevice?.id === device.id;
              const config = getStatusConfig(device.status);
              const song = TRACK_PLAYLIST.find((t) => t.id === device.trackId);

              return (
                <div
                  key={`device-${device.id}`}
                  onClick={() => onSelectDevice(device)}
                  className={`group relative rounded-md border ${config.border} ${config.bg} p-2 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-[0_0_8px_rgba(16,185,129,0.05)] ${
                    isSelected ? "ring-2 ring-emerald-500/75 bg-emerald-950/20" : ""
                  }`}
                >
                  {/* Glowing corner indicator */}
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-white/90 group-hover:text-emerald-300 transition-colors">
                      #{device.id.toString().padStart(2, "0")}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${config.glow}`} />
                  </div>

                  {/* Device location acronym & IP */}
                  <div className="font-mono text-[8px] text-emerald-500/40 text-left truncate leading-tight group-hover:text-emerald-500/60">
                    <span className="font-bold text-emerald-500/70 mr-0.5">IP:</span>
                    {device.proxyIp.split(":")[0]}
                  </div>
                  <div className="font-mono text-[8px] text-emerald-500/40 text-left truncate leading-tight mt-0.5">
                    <span className="font-bold text-emerald-500/70 mr-0.5">LOC:</span>
                    {device.proxyCountry}
                  </div>

                  {/* Mini animated audio progress bar (if streaming) */}
                  <div className="mt-2 w-full bg-zinc-900/80 h-1.5 rounded-full overflow-hidden border border-emerald-500/5">
                    {device.status === "STREAMING" ? (
                      <div
                        className="bg-emerald-400 h-full rounded-full animate-pulse transition-all duration-300"
                        style={{ width: `${device.streamProgress}%` }}
                      />
                    ) : device.status === "ROTATING" ? (
                      <div className="bg-sky-400 h-full rounded-full animate-ping w-full opacity-60" />
                    ) : device.status === "PAUSED" ? (
                      <div className="bg-amber-400 h-full rounded-full w-1/3" />
                    ) : (
                      <div className="bg-zinc-700 h-full rounded-full w-0" />
                    )}
                  </div>

                  {/* Hover absolute tooltip box */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#090e0c] border border-emerald-400/40 text-[9px] font-mono text-emerald-300 rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 w-36 shadow-lg shadow-black/80">
                    <div className="font-bold text-white pb-0.5 border-b border-emerald-500/10 truncate mb-1">
                      {device.name}
                    </div>
                    <div>Model: {device.model.split(" ")[0]}</div>
                    <div>Proxy: {device.proxyType}</div>
                    <div className="text-emerald-400">Ping: {device.latency}ms</div>
                    {device.status === "STREAMING" && (
                      <div className="text-emerald-400/80 truncate">
                        🎵 {song?.title}
                      </div>
                    )}
                    <div className="mt-1 pt-1 border-t border-emerald-500/10 text-right font-bold capitalize text-[8px]">
                      Status: {device.status.toLowerCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
