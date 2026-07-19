import { useState, useEffect, useMemo, useCallback } from "react";
import { VirtualDevice, LogEntry } from "./types";
import { 
  generateInitialDevices, 
  generateRandomIp, 
  PROXY_LOCATIONS, 
  TRACK_PLAYLIST, 
  INITIAL_LOGS 
} from "./data";
import { InteractiveMap } from "./components/InteractiveMap";
import { DeviceGrid } from "./components/DeviceGrid";
import { DeviceDetailPanel } from "./components/DeviceDetailPanel";
import { LogConsole } from "./components/LogConsole";
import { StreamControls } from "./components/StreamControls";
import { SoundwaveVisualizer } from "./components/SoundwaveVisualizer";
import { StreamingWall } from "./components/StreamingWall";
import { 
  Coins, Radio, AlertTriangle, ShieldAlert, Cpu, Network, Timer, Play, EyeOff, LayoutDashboard, MonitorPlay, Twitter
} from "lucide-react";

export default function App() {
  // 1. Core Stateful Parameters
  const [devices, setDevices] = useState<VirtualDevice[]>(() => generateInitialDevices());
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [pinnedDeviceIds, setPinnedDeviceIds] = useState<number[]>([1, 2]); // Pre-pin devices 1 and 2 for initial high fidelity showcase
  const [logs, setLogs] = useState<LogEntry[]>(() => INITIAL_LOGS);
  const [isMuted, setIsMuted] = useState(false);
  const [rotationRate, setRotationRate] = useState(25); // seconds
  const [credits, setCredits] = useState(1482.40);
  const [totalStreams, setTotalStreams] = useState(12845);
  const [blackoutActive, setBlackoutActive] = useState(false);
  const [timeText, setTimeText] = useState("");
  const [isConstantIpMode, setIsConstantIpMode] = useState(true); // Default to true as requested
  const [activeTab, setActiveTab] = useState<'dashboard' | 'streaming' | 'twitter'>('dashboard');

  // Update clock simulating a high-precision terminal timer
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeText(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // 2. Custom Helper to Append Terminal Logs
  const addLog = useCallback((
    message: string, 
    type: LogEntry["type"], 
    deviceId?: number
  ) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(" ")[0];
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp,
      type,
      message,
      deviceId
    };
    setLogs((prev) => [...prev.slice(-99), newLog]); // Cap buffer size to 100 entries
  }, []);

  // 3. Find the selected device object from list
  const selectedDevice = useMemo(() => {
    if (selectedDeviceId === null) return null;
    return devices.find((d) => d.id === selectedDeviceId) || null;
  }, [devices, selectedDeviceId]);

  // Handle individual device selection
  const handleSelectDevice = useCallback((device: VirtualDevice) => {
    setSelectedDeviceId(device.id);
  }, []);

  // Update a single device in the grid state
  const handleUpdateDevice = useCallback((updatedDev: VirtualDevice) => {
    setDevices((prev) => prev.map((d) => (d.id === updatedDev.id ? updatedDev : d)));
  }, []);

  // Toggle projecting device live stream to monitoring wall
  const handleTogglePinDevice = useCallback((deviceId: number) => {
    setPinnedDeviceIds((prev) => {
      if (prev.includes(deviceId)) {
        addLog(`Device Dev-${deviceId.toString().padStart(2, "0")} unprojected from active stream monitor.`, "INFO", deviceId);
        return prev.filter((id) => id !== deviceId);
      } else {
        if (prev.length >= 50) {
          addLog("Maximum streaming monitor wall slots (50) reached. Unproject another stream first.", "WARNING");
          return prev;
        }
        addLog(`Device Dev-${deviceId.toString().padStart(2, "0")} projected to live streaming wall. Streaming worldwide media!`, "SUCCESS", deviceId);
        return [...prev, deviceId];
      }
    });
  }, [addLog]);

  // Compute stats
  const activeStreamsCount = useMemo(() => {
    if (blackoutActive) return 0;
    return devices.filter((d) => d.status === "STREAMING").length;
  }, [devices, blackoutActive]);

  const avgLatency = useMemo(() => {
    if (blackoutActive) return 0;
    const activeDevs = devices.filter((d) => d.status === "STREAMING");
    if (activeDevs.length === 0) return 0;
    return Math.floor(activeDevs.reduce((acc, d) => acc + d.latency, 0) / activeDevs.length);
  }, [devices, blackoutActive]);

  const totalBandwidth = useMemo(() => {
    if (blackoutActive || isMuted) return 0;
    return activeStreamsCount * 256; // assume average 256 kbps stream rate
  }, [activeStreamsCount, blackoutActive, isMuted]);

  const farmStatus = useMemo(() => {
    if (blackoutActive) return "SHUTDOWN";
    if (isMuted) return "IDLE";
    // If more than 5 devices are in warning/error state, set ALERT
    const troubledCount = devices.filter((d) => d.status === "ERROR" || d.status === "OFFLINE").length;
    if (troubledCount > 6) return "ALERT";
    return "ACTIVE";
  }, [devices, blackoutActive, isMuted]);

  // 4. Main Streaming Progress Telemetry Loop
  useEffect(() => {
    if (blackoutActive) return;

    const interval = setInterval(() => {
      setDevices((prevDevices) => {
        return prevDevices.map((dev) => {
          if (dev.status !== "STREAMING") {
            // Slowly recharge battery when offline, minor drain if paused
            let newBat = dev.battery;
            if (dev.status === "OFFLINE" && dev.battery < 100) {
              newBat = Math.min(dev.battery + 1, 100);
            } else if (dev.status === "PAUSED" && dev.battery > 0) {
              newBat = Math.max(dev.battery - 0.1, 0);
            }
            return { ...dev, battery: Math.floor(newBat) };
          }

          // Increment stream progress by 3-9% per cycle
          const progressStep = Math.floor(Math.random() * 7) + 3;
          let newProgress = dev.streamProgress + progressStep;
          let newLifetimeStreams = dev.lifetimeStreams;
          let currentTrackId = dev.trackId;
          let completedCycle = false;

          if (newProgress >= 100) {
            newProgress = 0;
            newLifetimeStreams += 1;
            completedCycle = true;
            // Switch to a different track automatically for continuous streaming loop
            const remainingTracks = TRACK_PLAYLIST.filter((t) => t.id !== dev.trackId);
            const nextTrack = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
            currentTrackId = nextTrack.id;
          }

          // Slow battery usage simulation (drains 0.1% to 0.4% per tick)
          const newBattery = Math.max(dev.battery - (Math.random() * 0.3 + 0.1), 0);

          if (completedCycle) {
            // Tick up total streams and credits
            const gainedCredits = Number((Math.random() * 1.5 + 0.8).toFixed(2));
            setCredits((c) => Number((c + gainedCredits).toFixed(2)));
            setTotalStreams((s) => s + 1);

            const completedSong = TRACK_PLAYLIST.find((t) => t.id === dev.trackId);
            const nextSongObj = TRACK_PLAYLIST.find((t) => t.id === currentTrackId);
            
            // Queue log update outside state updater to avoid React race conditions
            setTimeout(() => {
              addLog(
                `Stream cycle completed on '${completedSong?.title}' [+${gainedCredits} Soma-Credits]. Seamlessly routing to stream feed: '${nextSongObj?.title}'`,
                "REWARD",
                dev.id
              );
            }, 10);
          }

          // Fluctuate latency slightly for realistic network monitoring
          const latencyDelta = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const newLatency = Math.max(12, Math.min(dev.latency + latencyDelta, 180));

          return {
            ...dev,
            streamProgress: newProgress,
            lifetimeStreams: newLifetimeStreams,
            trackId: currentTrackId,
            battery: Math.floor(newBattery),
            latency: newLatency,
            uptime: dev.uptime + 2,
            sessionDuration: dev.sessionDuration + 2,
          };
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [blackoutActive, addLog]);

  // 5. Automated Periodic Proxy Rotations Loop
  useEffect(() => {
    if (blackoutActive || isConstantIpMode) return;

    const interval = setInterval(() => {
      // Pick 2-4 random devices to rotate their proxies
      const countToRotate = Math.floor(Math.random() * 3) + 2;
      const deviceIndicesToRotate: number[] = [];

      while (deviceIndicesToRotate.length < countToRotate) {
        const idx = Math.floor(Math.random() * 50);
        if (!deviceIndicesToRotate.includes(idx)) {
          deviceIndicesToRotate.push(idx);
        }
      }

      setDevices((prevDevices) => {
        return prevDevices.map((dev, index) => {
          if (!deviceIndicesToRotate.includes(index) || dev.status === "OFFLINE") {
            return dev;
          }

          // Assign random location
          const randomLoc = PROXY_LOCATIONS[Math.floor(Math.random() * PROXY_LOCATIONS.length)];
          const newIp = generateRandomIp();
          const newLatency = Math.floor(Math.random() * 90) + 15;

          // Temporary rotating flash
          setTimeout(() => {
            setDevices((innerPrev) => {
              return innerPrev.map((innerDev) => {
                if (innerDev.id === dev.id && innerDev.status === "ROTATING") {
                  return {
                    ...innerDev,
                    status: "STREAMING",
                    streamRate: [192, 256, 320][Math.floor(Math.random() * 3)],
                  };
                }
                return innerDev;
              });
            });
          }, 1500);

          // Return device in ROTATING state
          return {
            ...dev,
            status: "ROTATING",
            proxyIp: newIp,
            proxyCountry: randomLoc.country,
            proxyCountryCode: randomLoc.code || "JP",
            proxyCity: randomLoc.city,
            latency: newLatency,
          };
        });
      });

      // Write batch logs
      const firstRotated = devices[deviceIndicesToRotate[0]];
      if (firstRotated) {
        addLog(
          `Automated Proxy Rotator triggered. Scheduled cycle rotated IPs for ${countToRotate} streaming nodes to bypass CDN correlation fingerprinting.`,
          "ROTATION"
        );
      }
    }, rotationRate * 1000);

    return () => clearInterval(interval);
  }, [rotationRate, blackoutActive, devices, addLog]);

  // 6. Random Cyber-Incidents Simulator
  useEffect(() => {
    if (blackoutActive) return;

    const interval = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.2) {
        // Trigger a random high-tech dystopian story event
        const events = [
          {
            msg: "Corporate anti-fraud algorithms detected at Spotify North-West corridor. Stealth security measures holding.",
            type: "WARNING" as const,
          },
          {
            msg: "Arasaka Security Grid initiated a deep packet scan across Siberia sub-grid. Handshaking redirected safely.",
            type: "INFO" as const,
          },
          {
            msg: "Bonus stream traffic multipliers acquired on Undercity Outlaws rebel signal! Stream credits multiplier active [+5.0 Soma-Credits].",
            type: "REWARD" as const,
          },
          {
            msg: "Decentralized IP proxy database synchronized. Loaded 14 fresh stealth proxies.",
            type: "SUCCESS" as const,
          },
          {
            msg: "Latency spike detected across detours of Neo-Seoul Mapo network. Self-repair routing engaged.",
            type: "WARNING" as const,
          },
        ];

        const incident = events[Math.floor(Math.random() * events.length)];
        addLog(incident.msg, incident.type);
      }
    }, 18000);

    return () => clearInterval(interval);
  }, [blackoutActive, addLog]);

  // 7. Master Override Handler Actions
  
  // A. Force All 50 devices to rotate proxies instantly
  const handleForceAllRotation = useCallback(() => {
    addLog("CRITICAL OVERRIDE: Instant forced IP rotating initiated across all 50 proxy channels!", "CRITICAL");
    
    setDevices((prev) => {
      return prev.map((dev) => {
        if (dev.status === "OFFLINE") return dev;

        const randomLoc = PROXY_LOCATIONS[Math.floor(Math.random() * PROXY_LOCATIONS.length)];
        const newIp = generateRandomIp();
        const newLatency = Math.floor(Math.random() * 80) + 15;

        // Auto-reconnect after rotating flash
        setTimeout(() => {
          setDevices((innerPrev) => {
            return innerPrev.map((innerDev) => {
              if (innerDev.id === dev.id && innerDev.status === "ROTATING") {
                return {
                  ...innerDev,
                  status: "STREAMING",
                  streamRate: [192, 256, 320][Math.floor(Math.random() * 3)],
                };
              }
              return innerDev;
            });
          });
        }, 2000);

        return {
          ...dev,
          status: "ROTATING",
          proxyIp: newIp,
          proxyCountry: randomLoc.country,
          proxyCountryCode: randomLoc.code || "JP",
          proxyCity: randomLoc.city,
          latency: newLatency,
        };
      });
    });

    addLog("Master proxy rotation finished. Handshaked 50 fresh encrypted tunnels globally.", "SUCCESS");
  }, [addLog]);

  // B. Mass Cast Song on all 50 devices
  const handleMassCastTrack = useCallback((trackId: string) => {
    const song = TRACK_PLAYLIST.find((t) => t.id === trackId);
    if (!song) return;

    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.status === "OFFLINE") return dev;
        return {
          ...dev,
          trackId: trackId,
          streamProgress: 0,
          sessionDuration: 0,
          status: "STREAMING", // Ensure all online devices are actively streaming it
        };
      })
    );

    addLog(
      `MASTER OVERRIDE: Multicasting track '${song.title}' by ${song.artist} globally to all 50 devices. High-fidelity feed synchronized.`,
      "SUCCESS"
    );
  }, [addLog]);

  // C. Boot all devices (Reconnect/resume streaming)
  const handleBootAll = useCallback(() => {
    setDevices((prev) =>
      prev.map((dev) => ({
        ...dev,
        status: "STREAMING",
        streamRate: dev.streamRate || 256,
        latency: dev.latency || Math.floor(Math.random() * 60) + 25,
      }))
    );
    addLog("Master Control: Boot command transmitted. Activating and calibrating all 50 streaming cells.", "SUCCESS");
  }, [addLog]);

  // D. Master Mute Stealth
  const handleToggleMute = useCallback(() => {
    setIsMuted((prevMute) => {
      const nextMute = !prevMute;
      if (nextMute) {
        addLog("Stealth mode activated: Muting virtual audio streams. Traffic bandwidth metrics throttled to reduce corporate telemetry signatures.", "WARNING");
      } else {
        addLog("Stealth mode disabled: Resuming high-density audio stream relays.", "INFO");
      }
      return nextMute;
    });
  }, [addLog]);

  // E. Blackout Defense Protocol (Emergency shutdown)
  const handleToggleBlackout = useCallback(() => {
    setBlackoutActive((prevBlackout) => {
      const nextBlackout = !prevBlackout;
      if (nextBlackout) {
        setDevices((prev) =>
          prev.map((dev) => ({
            ...dev,
            status: "OFFLINE",
            streamRate: 0,
            latency: 0,
            streamProgress: 0,
          }))
        );
        addLog("⚠️⚠️⚠️ CRITICAL BLACKOUT DEFENSE ENGAGED! DROPPING ALL 50 TUNNELS, CLEARING MAC ADDRESSES, DELETING CACHE TO PREVENT CORPORATION DETECTION!", "CRITICAL");
      } else {
        addLog("Blackout defense released. Cold booting grid terminal and establishing global socket connections...", "SUCCESS");
        // Re-generate fresh virtual devices to simulate rebuilding the environment
        setTimeout(() => {
          setDevices(generateInitialDevices());
          addLog("50 virtual sockets securely instantiated and calibrated across global proxies.", "SUCCESS");
        }, 1000);
      }
      return nextBlackout;
    });
  }, [addLog]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col pb-4">
      
      {/* Navigation */}
      <nav className="bg-gray-100 p-4 border-b border-gray-200 flex gap-4">
        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-emerald-500 text-white' : 'hover:bg-gray-200'}`}>
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </button>
        <button onClick={() => setActiveTab('streaming')} className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'streaming' ? 'bg-emerald-500 text-white' : 'hover:bg-gray-200'}`}>
          <MonitorPlay className="w-5 h-5" /> Streaming
        </button>
        <button onClick={() => setActiveTab('twitter')} className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'twitter' ? 'bg-emerald-500 text-white' : 'hover:bg-gray-200'}`}>
          <Twitter className="w-5 h-5" /> Twitter Impressions
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex-1 p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Dashboard</h2>
             <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
               <main className="xl:col-span-8 flex flex-col gap-4">
                 <InteractiveMap devices={devices} selectedDevice={selectedDevice} onSelectDevice={handleSelectDevice} />
               </main>
               <aside className="xl:col-span-4 flex flex-col gap-4">
                 <DeviceDetailPanel device={selectedDevice} devices={devices} pinnedIds={pinnedDeviceIds} onTogglePin={handleTogglePinDevice} onUpdateDevice={handleUpdateDevice} onAddLog={addLog} />
                 <LogConsole logs={logs} onClearLogs={() => setLogs([])} />
                 <StreamControls
                    farmStatus={farmStatus}
                    isMuted={isMuted}
                    rotationRate={rotationRate}
                    onSetRotationRate={setRotationRate}
                    onMassCastTrack={handleMassCastTrack}
                    onForceAllRotation={handleForceAllRotation}
                    onBootAll={handleBootAll}
                    onToggleMute={handleToggleMute}
                    onToggleBlackout={handleToggleBlackout}
                    isConstantIpMode={isConstantIpMode}
                    onToggleConstantIpMode={() => {
                        setIsConstantIpMode(prev => {
                        const nextState = !prev;
                        addLog(
                            nextState 
                            ? "Underground Order: CONSTANT IP MODE ACTIVE. Devices locked on current static geographic nodes securely."
                            : "Warning: Constant IP constraints relaxed. Rotating dynamic proxies enabled.",
                            nextState ? "SUCCESS" : "WARNING"
                        );
                        return nextState;
                        });
                    }}
                    />
               </aside>
             </div>
          </div>
        )}
        
        {activeTab === 'streaming' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Streaming Wall</h2>
            <StreamingWall devices={devices} pinnedIds={pinnedDeviceIds} onTogglePin={handleTogglePinDevice} onSelectDevice={handleSelectDevice} onUpdateDevice={handleUpdateDevice} onAddLog={addLog} />
          </div>
        )}

        {activeTab === 'twitter' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Twitter Impressions & Likes</h2>
            <DeviceGrid devices={devices} selectedDevice={selectedDevice} onSelectDevice={handleSelectDevice} />
          </div>
        )}
      </div>
    </div>
  );
}

