import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface SoundwaveVisualizerProps {
  activeCount: number;
  isMuted: boolean;
  farmStatus: "ACTIVE" | "IDLE" | "SHUTDOWN" | "ALERT";
}

export const SoundwaveVisualizer: React.FC<SoundwaveVisualizerProps> = ({
  activeCount,
  isMuted,
  farmStatus,
}) => {
  const [frequencies, setFrequencies] = useState<number[]>(Array(36).fill(5));

  // Periodically update frequencies to simulate live sound telemetry
  useEffect(() => {
    if (farmStatus === "SHUTDOWN" || activeCount === 0 || isMuted) {
      // flatline or tiny ambient noise
      const interval = setInterval(() => {
        setFrequencies((prev) => prev.map(() => Math.random() * 3 + 2));
      }, 500);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      // Dynamic range scales with the number of active streaming devices
      const scalar = Math.min(activeCount / 50, 1) * 35 + 8;
      
      setFrequencies((prev) =>
        prev.map(() => {
          const r = Math.random();
          // generate random heights mimicking high-tech audio frequency bars
          return Math.floor(r * scalar) + 3;
        })
      );
    }, 150);

    return () => clearInterval(interval);
  }, [activeCount, isMuted, farmStatus]);

  // Determine colour based on state
  const getGlowColor = () => {
    if (farmStatus === "SHUTDOWN") return "bg-zinc-800 shadow-zinc-800/50";
    if (farmStatus === "ALERT") return "bg-red-500 shadow-red-500/50 animate-pulse";
    if (isMuted) return "bg-amber-500/50 shadow-amber-500/20";
    return "bg-emerald-400 shadow-emerald-400/50";
  };

  const getWaveColor = () => {
    if (farmStatus === "SHUTDOWN") return "stroke-zinc-700";
    if (farmStatus === "ALERT") return "stroke-red-500";
    if (isMuted) return "stroke-amber-500/60";
    return "stroke-emerald-400";
  };

  return (
    <div id="soundwave-telemetry" className="bg-[#0b100d] border border-emerald-500/20 rounded-lg p-3 flex flex-col justify-between h-32 relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none" />

      {/* Header telemetry info */}
      <div className="flex justify-between items-center text-[10px] font-mono text-emerald-500/70 select-none z-10">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className={`inline-block w-2 h-2 rounded-full ${getGlowColor()} shadow-sm`} />
          AGGREGATE AUDIO STREAM TELEMETRY
        </span>
        <span className="text-[9px] tracking-widest text-emerald-500/40">
          BANDWIDTH: {isMuted ? "0.00" : (activeCount * 256).toLocaleString()} KBPS
        </span>
      </div>

      {/* Soundwave bars */}
      <div className="flex items-end justify-between h-14 px-1 gap-[3px] select-none z-10">
        {frequencies.map((height, i) => {
          const delay = i * 0.015;
          const heightPercent = `${Math.min(height * 2, 100)}%`;
          
          return (
            <motion.div
              key={`bar-${i}`}
              className={`w-[6px] rounded-t-sm transition-all duration-150 ${
                farmStatus === "SHUTDOWN"
                  ? "bg-zinc-800"
                  : farmStatus === "ALERT"
                  ? "bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  : isMuted
                  ? "bg-amber-500/40"
                  : "bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              }`}
              style={{ height: heightPercent }}
              initial={{ scaleY: 0.2 }}
              animate={{ scaleY: 1 }}
              transition={{ delay, duration: 0.1 }}
            />
          );
        })}
      </div>

      {/* Sine curve decorative line under */}
      <div className="h-5 relative select-none pointer-events-none opacity-40 z-10">
        <svg viewBox="0 0 300 20" className="w-full h-full">
          <motion.path
            d={`M 0 10 Q 37.5 ${activeCount > 0 && !isMuted ? "3" : "10"}, 75 10 T 150 10 T 225 10 T 300 10`}
            fill="none"
            className={getWaveColor()}
            strokeWidth="1.5"
            animate={{
              d: activeCount > 0 && !isMuted 
                ? [
                    "M 0 10 Q 37.5 2, 75 10 T 150 10 T 225 10 T 300 10",
                    "M 0 10 Q 37.5 18, 75 10 T 150 10 T 225 10 T 300 10",
                    "M 0 10 Q 37.5 2, 75 10 T 150 10 T 225 10 T 300 10",
                  ]
                : "M 0 10 Q 37.5 10, 75 10 T 150 10 T 225 10 T 300 10",
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    </div>
  );
};
