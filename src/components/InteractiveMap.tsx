import React, { useMemo } from "react";
import { motion } from "motion/react";
import { VirtualDevice } from "../types";

interface InteractiveMapProps {
  devices: VirtualDevice[];
  selectedDevice: VirtualDevice | null;
  onSelectDevice: (device: VirtualDevice) => void;
}

// Map city name to visual coordinates on our SVG map (800x340)
export const CITY_COORDS: Record<string, { x: number; y: number; label: string }> = {
  "Chiba Sector": { x: 700, y: 140, label: "Neo-Tokyo" },
  "Undercity Zone B": { x: 420, y: 110, label: "New Berlin" },
  "Baoan Hub-09": { x: 640, y: 175, label: "Shenzhen" },
  "Mapo Tunnel v12": { x: 685, y: 135, label: "Neo-Seoul" },
  "Krasnoyarsk-26": { x: 580, y: 90, label: "Siberia Bunker" },
  "Fjord Hub Alpha": { x: 410, y: 75, label: "Oslo" },
  "Solar Sector 3": { x: 360, y: 180, label: "Casablanca" },
  "Westminster Sub": { x: 385, y: 105, label: "London Sewers" },
  "Sector-E4 Motor": { x: 210, y: 125, label: "Detroit" },
  "Hekla Vault-3": { x: 345, y: 65, label: "Reykjavik" },
  "Keppel Marina Sub": { x: 635, y: 220, label: "Singapore" },
  "Arrondissement 21": { x: 395, y: 120, label: "Neo-Paris" },
};

// Central Secret Bunker location (source of the streaming farm traffic)
const BUNKER_COORD = { x: 480, y: 265, label: "GRID-BUNKER" };

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
}) => {
  // Aggregate devices by their current city
  const cityStats = useMemo(() => {
    const stats: Record<string, { count: number; active: number; deviceIds: number[] }> = {};
    
    // Initialize all known cities
    Object.keys(CITY_COORDS).forEach(city => {
      stats[city] = { count: 0, active: 0, deviceIds: [] };
    });

    devices.forEach(dev => {
      const city = dev.proxyCity;
      if (stats[city]) {
        stats[city].count++;
        if (dev.status === "STREAMING") {
          stats[city].active++;
        }
        stats[city].deviceIds.push(dev.id);
      }
    });

    return stats;
  }, [devices]);

  return (
    <div id="interactive-map-container" className="relative h-72 md:h-80 w-full bg-[#0a0f0d] border border-emerald-500/30 rounded-lg p-3 overflow-hidden scanline-effect">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-40 pointer-events-none" />
      
      {/* Compass / Dystopian branding overlay */}
      <div className="absolute top-2 left-3 z-10 font-mono text-[10px] text-emerald-500/60 flex flex-col pointer-events-none select-none">
        <span>ANTIGRAVITY TELEMETRY SYSTEMS</span>
        <span>SAT-LINK: SECURE-SOCKS5.VPN // ENCRYPTED</span>
      </div>
      
      <div className="absolute bottom-2 right-3 z-10 font-mono text-[9px] text-emerald-500/40 text-right pointer-events-none select-none">
        <span>LATENCY OPTIMIZER STATUS: ACTIVE</span>
        <br />
        <span>NODE DENSITY: 50/50 VERIFIED</span>
      </div>

      {/* Map SVG Canvas */}
      <svg
        viewBox="0 0 800 320"
        className="w-full h-full select-none"
        style={{ background: "transparent" }}
      >
        {/* Abstract World Grid Outline (Dystopian style lines) */}
        <path
          d="M 50,120 L 750,120 M 50,180 L 750,180 M 50,240 L 750,240 M 150,50 L 150,280 M 300,50 L 300,280 M 450,50 L 450,280 M 600,50 L 600,280"
          stroke="rgba(16, 185, 129, 0.05)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />

        {/* Abstract continental contours (Minimalist nodes for UI aesthetics) */}
        <g stroke="rgba(16, 185, 129, 0.06)" fill="none" strokeWidth="1">
          {/* North America */}
          <path d="M 120,80 Q 210,70 250,120 T 180,180 T 100,110 Z" />
          {/* South America */}
          <path d="M 190,190 Q 240,220 220,290 T 180,250 Z" />
          {/* Eurasia & Africa */}
          <path d="M 340,60 Q 420,50 550,60 T 730,120 T 650,240 T 400,160 T 310,130 Z" />
          <path d="M 350,160 Q 430,180 440,260 T 360,250 Z" />
          {/* Australia */}
          <path d="M 680,220 Q 730,230 710,280 T 650,260 Z" />
        </g>

        {/* Central Hub (GRID-BUNKER) */}
        <g>
          {/* Pulse ring */}
          <circle
            cx={BUNKER_COORD.x}
            cy={BUNKER_COORD.y}
            r="16"
            fill="none"
            stroke="#10b981"
            strokeWidth="1"
            className="animate-ping"
            style={{ transformOrigin: `${BUNKER_COORD.x}px ${BUNKER_COORD.y}px`, animationDuration: "3s" }}
            opacity="0.3"
          />
          <circle
            cx={BUNKER_COORD.x}
            cy={BUNKER_COORD.y}
            r="6"
            fill="#064e3b"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          {/* Core glow */}
          <circle
            cx={BUNKER_COORD.x}
            cy={BUNKER_COORD.y}
            r="2"
            fill="#34d399"
          />
          <text
            x={BUNKER_COORD.x}
            y={BUNKER_COORD.y + 15}
            fill="#34d399"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
            className="font-bold tracking-widest"
          >
            🛰️ FARM-BUNKER
          </text>
        </g>

        {/* Connection Lines from Bunker to Active Cities */}
        {Object.entries(CITY_COORDS).map(([cityName, coord]) => {
          const stats = cityStats[cityName];
          const hasActive = stats && stats.active > 0;
          const isSelected = selectedDevice && selectedDevice.proxyCity === cityName;
          
          let strokeColor = "rgba(16, 185, 129, 0.15)";
          let strokeWidth = 1;
          let dashArray: string | undefined = "3,3";
          
          if (isSelected) {
            strokeColor = "#34d399";
            strokeWidth = 2.5;
            dashArray = undefined;
          } else if (hasActive) {
            strokeColor = "rgba(16, 185, 129, 0.4)";
            strokeWidth = 1.5;
            dashArray = "4,2";
          }

          return (
            <g key={`line-${cityName}`}>
              {/* Pulsing travel beam */}
              {hasActive && (
                <motion.path
                  d={`M ${BUNKER_COORD.x},${BUNKER_COORD.y} L ${coord.x},${coord.y}`}
                  fill="none"
                  stroke={isSelected ? "#10b981" : "#34d399"}
                  strokeWidth={strokeWidth}
                  initial={{ strokeDasharray: "10, 100", strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: isSelected ? 1.5 : 2.5,
                    ease: "linear",
                  }}
                  opacity="0.75"
                />
              )}
              {/* Static support line */}
              <path
                d={`M ${BUNKER_COORD.x},${BUNKER_COORD.y} L ${coord.x},${coord.y}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                opacity={isSelected ? 1 : 0.6}
              />
            </g>
          );
        })}

        {/* City Nodes */}
        {Object.entries(CITY_COORDS).map(([cityName, coord]) => {
          const stats = cityStats[cityName] || { count: 0, active: 0, deviceIds: [] };
          const isSelected = selectedDevice && selectedDevice.proxyCity === cityName;
          const hasDevices = stats.count > 0;
          const hasActive = stats.active > 0;

          return (
            <g
              key={`node-${cityName}`}
              className="cursor-pointer group"
              onClick={() => {
                if (hasDevices && stats.deviceIds.length > 0) {
                  // Find first device in this city to select
                  const firstDev = devices.find(d => d.proxyCity === cityName);
                  if (firstDev) onSelectDevice(firstDev);
                }
              }}
            >
              {/* Node Outer Glow / Rings */}
              {hasActive && (
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isSelected ? "11" : "8"}
                  fill="none"
                  stroke={isSelected ? "#34d399" : "#10b981"}
                  strokeWidth="1"
                  className="animate-pulse"
                  opacity="0.4"
                />
              )}
              
              {/* Node Circle */}
              <circle
                cx={coord.x}
                cy={coord.y}
                r={isSelected ? "6" : "4.5"}
                fill={isSelected ? "#34d399" : hasActive ? "#10b981" : hasDevices ? "#064e3b" : "#1f2937"}
                stroke={isSelected ? "#fff" : hasActive ? "#34d399" : "#4b5563"}
                strokeWidth={isSelected ? "1.5" : "1"}
                className="transition-all duration-300 group-hover:scale-125"
              />

              {/* Tooltip & Text details */}
              <text
                x={coord.x}
                y={coord.y - 10}
                fill={isSelected ? "#34d399" : hasActive ? "rgba(52, 211, 153, 0.8)" : "rgba(110, 231, 183, 0.4)"}
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
                className="font-semibold pointer-events-none tracking-tight select-none"
              >
                {coord.label}
              </text>

              {/* Mini devices indicator */}
              {hasDevices && (
                <text
                  x={coord.x}
                  y={coord.y + 11}
                  fill="rgba(110, 231, 183, 0.6)"
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none select-none font-bold"
                >
                  {stats.active}/{stats.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
