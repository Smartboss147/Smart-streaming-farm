import React, { useEffect, useRef, useState } from "react";
import { LogEntry } from "../types";
import { Terminal, Trash2, ShieldAlert, ArrowDown } from "lucide-react";

interface LogConsoleProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const LogConsole: React.FC<LogConsoleProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState<string>("ALL");
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto Scroll logic
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (filter === "ALL") return true;
    if (filter === "ALERTS") return log.type === "WARNING" || log.type === "CRITICAL";
    if (filter === "ROTATIONS") return log.type === "ROTATION";
    if (filter === "REWARDS") return log.type === "REWARD";
    return true;
  });

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "SUCCESS":
        return "text-emerald-400 font-medium";
      case "INFO":
        return "text-cyan-400";
      case "ROTATION":
        return "text-sky-400 font-semibold";
      case "WARNING":
        return "text-amber-400 font-semibold";
      case "CRITICAL":
        return "text-red-500 font-bold animate-pulse";
      case "REWARD":
        return "text-yellow-400 font-bold shadow-[0_0_10px_rgba(234,179,8,0.1)]";
    }
  };

  return (
    <div id="logs-console-card" className="bg-[#050906] border border-emerald-500/25 rounded-lg p-3 flex flex-col h-64 relative font-mono select-none">
      
      {/* Scanline Overlay to give retro terminal look */}
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.08] pointer-events-none" />

      {/* Header panel */}
      <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10 z-10 mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 tracking-wider">NEONFARM CENTRAL GRID LOGGER</span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 text-[8px]">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-1.5 py-0.5 rounded transition-all ${
              filter === "ALL" ? "bg-emerald-500/20 text-emerald-300" : "text-emerald-500/40 hover:text-emerald-400"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter("ROTATIONS")}
            className={`px-1.5 py-0.5 rounded transition-all ${
              filter === "ROTATIONS" ? "bg-sky-500/20 text-sky-300" : "text-emerald-500/40 hover:text-emerald-400"
            }`}
          >
            ROTATIONS
          </button>
          <button
            onClick={() => setFilter("ALERTS")}
            className={`px-1.5 py-0.5 rounded transition-all ${
              filter === "ALERTS" ? "bg-red-500/20 text-red-300" : "text-emerald-500/40 hover:text-emerald-400"
            }`}
          >
            ALERTS
          </button>
          <button
            onClick={() => setFilter("REWARDS")}
            className={`px-1.5 py-0.5 rounded transition-all ${
              filter === "REWARDS" ? "bg-yellow-500/20 text-yellow-300" : "text-emerald-500/40 hover:text-emerald-400"
            }`}
          >
            CREDITS
          </button>
          
          <div className="h-3 w-[1px] bg-emerald-500/10 mx-1" />

          {/* Autoscroll checkbox */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            title="Toggle Auto-Scroll"
            className={`p-0.5 rounded transition-all ${autoScroll ? "text-emerald-400" : "text-emerald-500/30"}`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Clear Logs */}
          <button
            onClick={onClearLogs}
            title="Clear Logs Console"
            className="p-0.5 rounded text-emerald-500/40 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal lines wrapper */}
      <div
        ref={scrollRef}
        id="terminal-lines"
        className="flex-1 overflow-y-auto pr-1 text-[10px] space-y-1.5 scrollbar-thin z-10"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-emerald-500/30 text-[9px] gap-1 select-none">
            <ShieldAlert className="w-5 h-5 opacity-40 animate-pulse" />
            NO RECORDS REPORTED IN THE CURRENT BUFFER
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-1.5 hover:bg-emerald-500/5 px-1 py-0.5 rounded transition-colors">
              {/* Timestamp */}
              <span className="text-emerald-500/45 shrink-0 select-none">[{log.timestamp}]</span>
              
              {/* Optional device ID tag */}
              {log.deviceId && (
                <span className="text-sky-500/70 shrink-0 select-none bg-sky-950/20 px-0.5 rounded border border-sky-500/10">
                  DEV_{log.deviceId.toString().padStart(2, "0")}
                </span>
              )}

              {/* Log type label */}
              <span className={`text-[8px] px-1 rounded uppercase font-bold tracking-tight shrink-0 select-none ${
                log.type === "SUCCESS" ? "bg-emerald-950/30 text-emerald-400" :
                log.type === "INFO" ? "bg-cyan-950/30 text-cyan-400" :
                log.type === "ROTATION" ? "bg-sky-950/30 text-sky-400" :
                log.type === "WARNING" ? "bg-amber-950/30 text-amber-400" :
                log.type === "CRITICAL" ? "bg-red-950/30 text-red-400" : "bg-yellow-950/30 text-yellow-400"
              }`}>
                {log.type}
              </span>

              {/* Log text message */}
              <span className={`flex-1 break-words ${getLogColor(log.type)}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
