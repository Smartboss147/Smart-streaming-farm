import React, { useState } from 'react';
import { Search, Server, Plus, Shield, Activity, Globe, Trash2, Edit } from 'lucide-react';

export const ProxyManager: React.FC = () => {
  const [proxies] = useState([
    { id: 1, ip: '192.168.1.100', port: '8080', type: 'SOCKS5', country: 'United States', status: 'Active', latency: 45, lastChecked: '2 mins ago' },
    { id: 2, ip: '203.0.113.50', port: '3128', type: 'HTTPS', country: 'Germany', status: 'Active', latency: 82, lastChecked: '5 mins ago' },
    { id: 3, ip: '198.51.100.22', port: '8080', type: 'HTTP', country: 'Japan', status: 'Dead', latency: 0, lastChecked: '10 mins ago' },
    { id: 4, ip: '192.0.2.14', port: '1080', type: 'SOCKS5', country: 'Brazil', status: 'Active', latency: 120, lastChecked: '1 min ago' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button className="px-4 py-2 font-bold text-blue-600 border-b-2 border-blue-600">Proxy List</button>
        <button className="px-4 py-2 font-bold text-gray-500 hover:text-gray-900">Add Proxy</button>
        <button className="px-4 py-2 font-bold text-gray-500 hover:text-gray-900">Test Connection</button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <div className="flex gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                 <input type="text" placeholder="Search proxies by IP or Country..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
           </div>
           <div className="flex gap-4">
               <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                 <Globe className="w-5 h-5" /> Filter Country
               </button>
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                 <Plus className="w-5 h-5" /> Import List
               </button>
           </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Server className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-bold">Total Proxies</p>
                    <p className="text-xl font-bold">1,245</p>
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-bold">Active / Healthy</p>
                    <p className="text-xl font-bold">1,198</p>
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-bold">Dead / Blocked</p>
                    <p className="text-xl font-bold">47</p>
                </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-bold">Avg Latency</p>
                    <p className="text-xl font-bold">64ms</p>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="pb-3 font-bold">IP Address</th>
                <th className="pb-3 font-bold">Port</th>
                <th className="pb-3 font-bold">Type</th>
                <th className="pb-3 font-bold">Country</th>
                <th className="pb-3 font-bold">Latency</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Last Checked</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proxies.map(proxy => (
                <tr key={proxy.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-mono text-sm">{proxy.ip}</td>
                  <td className="py-4 font-mono text-sm">{proxy.port}</td>
                  <td className="py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">{proxy.type}</span>
                  </td>
                  <td className="py-4 text-sm">{proxy.country}</td>
                  <td className="py-4 text-sm font-mono">{proxy.latency}ms</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${proxy.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {proxy.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-500">{proxy.lastChecked}</td>
                  <td className="py-4 text-right flex justify-end gap-2">
                     <button className="p-2 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                     <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
