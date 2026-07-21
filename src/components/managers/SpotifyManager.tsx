import React, { useState } from 'react';
import { Search, Play, Pause, Smartphone, ListMusic, Library, Settings, Activity, FileText, UserCircle } from 'lucide-react';

export const SpotifyManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'playlists' | 'library' | 'devices' | 'analytics' | 'logs' | 'settings'>('playlists');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto">
        {(['accounts', 'playlists', 'library', 'devices', 'analytics', 'logs', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold capitalize whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[500px]">
        {activeTab === 'accounts' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold">Account Manager</h3>
                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Connect Account</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => (
                     <div key={i} className="border border-gray-200 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <UserCircle className="w-10 h-10 text-green-500" />
                            <div>
                                <p className="font-bold">StreamBot_0{i}</p>
                                <p className="text-sm text-gray-500">Premium Active</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Connected</span>
                     </div>
                 ))}
             </div>
          </div>
        )}
        {activeTab === 'playlists' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold">Playlist Manager</h3>
                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">New Playlist</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {[1,2,3].map(i => (
                     <div key={i} className="border border-gray-200 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                           <ListMusic className="text-gray-400" />
                        </div>
                        <div>
                            <p className="font-bold">Global Hits Vol {i}</p>
                            <p className="text-sm text-gray-500">120 Tracks • 4h 30m</p>
                        </div>
                     </div>
                 ))}
             </div>
          </div>
        )}
        {activeTab === 'library' && (
           <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="relative flex-1">
                   <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                   <input type="text" placeholder="Search Spotify library..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl" />
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Search</button>
             </div>
             <div className="text-center py-20 text-gray-500">
                <Library className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Search for tracks, albums, or artists to add to your rotation.</p>
             </div>
           </div>
        )}
        {activeTab === 'devices' && (
           <div className="space-y-4">
             <h3 className="text-xl font-bold">Device Assignment & Playback</h3>
             <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                   <p className="font-bold">Currently Casting: Neon Rain over Sector 7</p>
                   <p className="text-sm text-gray-500">45/50 Devices Active</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><Pause className="w-5 h-5" /></button>
                   <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">Manage Queue</button>
                </div>
             </div>
           </div>
        )}
        {activeTab === 'analytics' && (
           <div className="space-y-4">
             <h3 className="text-xl font-bold">Spotify Analytics</h3>
             <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                   <p className="text-sm text-gray-500 font-bold">Total Streams (24h)</p>
                   <p className="text-3xl font-bold mt-2">124,592</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                   <p className="text-sm text-gray-500 font-bold">Active Listeners</p>
                   <p className="text-3xl font-bold mt-2">45</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                   <p className="text-sm text-gray-500 font-bold">Royalties Est.</p>
                   <p className="text-3xl font-bold mt-2">$342.10</p>
                </div>
             </div>
           </div>
        )}
        {activeTab === 'logs' && (
           <div className="space-y-4">
             <h3 className="text-xl font-bold">Playback Logs</h3>
             <div className="bg-gray-900 text-emerald-400 font-mono p-4 rounded-xl text-sm h-64 overflow-y-auto">
                <p>[10:45:01] Device 01: Started track "Synthetic Soul"</p>
                <p>[10:45:03] Device 02: Started track "Synthetic Soul"</p>
                <p>[10:45:12] Device 05: Handshake failed, retrying proxy...</p>
             </div>
           </div>
        )}
        {activeTab === 'settings' && (
           <div className="space-y-4">
             <h3 className="text-xl font-bold">Spotify Integration Settings</h3>
             <div className="space-y-4 max-w-lg">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">API Client ID</label>
                   <input type="password" value="************************" className="w-full p-3 border border-gray-300 rounded-lg" readOnly />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">API Client Secret</label>
                   <input type="password" value="************************" className="w-full p-3 border border-gray-300 rounded-lg" readOnly />
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold mt-4">Save Configuration</button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};
