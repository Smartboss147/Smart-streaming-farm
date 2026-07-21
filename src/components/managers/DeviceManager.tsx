import React, { useState } from 'react';
import { Search, Filter, Cpu, HardDrive, Wifi, Power, RefreshCw, XCircle, PlayCircle, Eye } from 'lucide-react';
import { VirtualDevice } from '../../types';

interface DeviceManagerProps {
  devices: VirtualDevice[];
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({ devices }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.proxyCountry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button className="px-4 py-2 font-bold text-blue-600 border-b-2 border-blue-600">All Devices</button>
        <button className="px-4 py-2 font-bold text-gray-500 hover:text-gray-900">Device Groups</button>
        <button className="px-4 py-2 font-bold text-gray-500 hover:text-gray-900">Health Check</button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <div className="flex gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   placeholder="Search devices..." 
                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" 
                 />
              </div>
           </div>
           <div className="flex gap-4">
               <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                 <Filter className="w-5 h-5" /> Filters
               </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="pb-3 font-bold">Device Name</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Location</th>
                <th className="pb-3 font-bold">IP Address</th>
                <th className="pb-3 font-bold">Task</th>
                <th className="pb-3 font-bold">Metrics</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map(dev => (
                <tr key={dev.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                     <p className="font-bold text-gray-900">{dev.name}</p>
                     <p className="text-xs text-gray-500 font-mono">BAT: {dev.battery}%</p>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${dev.status === 'STREAMING' ? 'bg-green-100 text-green-700' : dev.status === 'OFFLINE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {dev.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm">
                      {dev.proxyCountry} ({dev.proxyCountryCode})
                  </td>
                  <td className="py-4 text-sm font-mono text-gray-600">{dev.proxyIp}</td>
                  <td className="py-4 text-sm">
                     {dev.trackId ? (
                         <span className="text-blue-600 font-bold truncate max-w-[150px] block" title={dev.trackId}>{dev.trackId}</span>
                     ) : (
                         <span className="text-gray-400">Idle</span>
                     )}
                  </td>
                  <td className="py-4">
                     <div className="flex items-center gap-3 text-xs text-gray-500">
                         <span className="flex items-center gap-1" title="CPU"><Cpu className="w-3 h-3"/> {Math.floor(Math.random() * 40 + 10)}%</span>
                         <span className="flex items-center gap-1" title="RAM"><HardDrive className="w-3 h-3"/> {Math.floor(Math.random() * 60 + 20)}%</span>
                         <span className="flex items-center gap-1" title="Network"><Wifi className="w-3 h-3"/> {dev.streamRate}kbps</span>
                     </div>
                  </td>
                  <td className="py-4 text-right">
                     <div className="flex justify-end gap-1">
                         <button className="p-1.5 text-gray-400 hover:text-green-600" title="Start/Enable"><PlayCircle className="w-4 h-4" /></button>
                         <button className="p-1.5 text-gray-400 hover:text-red-600" title="Stop/Disable"><XCircle className="w-4 h-4" /></button>
                         <button className="p-1.5 text-gray-400 hover:text-blue-600" title="Restart"><RefreshCw className="w-4 h-4" /></button>
                         <button className="p-1.5 text-gray-400 hover:text-gray-800" title="View Logs"><Eye className="w-4 h-4" /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
