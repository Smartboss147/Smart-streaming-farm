import React, { useState } from 'react';
import { Settings, Shield, Bell, Palette, HardDrive, Key, Users, RefreshCw } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'theme' | 'notifications' | 'api' | 'security' | 'backup' | 'database'>('general');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[600px] flex">
        
        {/* Settings Sidebar */}
        <div className="w-64 border-r border-gray-200 pr-6 flex flex-col gap-2">
            {(['general', 'theme', 'notifications', 'api', 'security', 'backup', 'database'] as const).map(tab => {
                const getIcon = (t: string) => {
                    switch(t) {
                        case 'general': return <Settings className="w-5 h-5" />;
                        case 'theme': return <Palette className="w-5 h-5" />;
                        case 'notifications': return <Bell className="w-5 h-5" />;
                        case 'api': return <Key className="w-5 h-5" />;
                        case 'security': return <Shield className="w-5 h-5" />;
                        case 'backup': return <RefreshCw className="w-5 h-5" />;
                        case 'database': return <HardDrive className="w-5 h-5" />;
                        default: return <Settings className="w-5 h-5" />;
                    }
                };

                return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold capitalize transition-colors ${
                            activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {getIcon(tab)}
                        {tab === 'api' ? 'API Keys' : tab.replace('-', ' ')}
                    </button>
                )
            })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 pl-8">
            {activeTab === 'general' && (
                <div className="space-y-8 max-w-2xl">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">General Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Farm Name</label>
                                <input type="text" defaultValue="Sector 7 Data Farm" className="w-full p-3 border border-gray-300 rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Administrator Email</label>
                                <input type="email" defaultValue="admin@farm-controller.net" className="w-full p-3 border border-gray-300 rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Timezone</label>
                                <select className="w-full p-3 border border-gray-300 rounded-xl">
                                    <option>UTC - Coordinated Universal Time</option>
                                    <option>EST - Eastern Standard Time</option>
                                    <option>PST - Pacific Standard Time</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-200">
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Save Changes</button>
                    </div>
                </div>
            )}

            {activeTab === 'api' && (
                <div className="space-y-8 max-w-2xl">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">API Configuration</h3>
                        <div className="space-y-6">
                            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Spotify Developer API Key</label>
                                <input type="password" value="************************" className="w-full p-3 border border-gray-300 rounded-lg mb-2" readOnly />
                                <p className="text-xs text-gray-500">Used for Spotify Connect and playback tracking.</p>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <label className="block text-sm font-bold text-gray-700 mb-1">X/Twitter API Bearer Token</label>
                                <input type="password" value="************************" className="w-full p-3 border border-gray-300 rounded-lg mb-2" readOnly />
                                <p className="text-xs text-gray-500">Used for automated engagement on X.</p>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Apple Music Developer Token</label>
                                <input type="password" value="************************" className="w-full p-3 border border-gray-300 rounded-lg mb-2" readOnly />
                                <p className="text-xs text-gray-500">Used for Apple Music MusicKit JS integration.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {['theme', 'notifications', 'security', 'backup', 'database'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                    <Settings className="w-16 h-16 mb-4 opacity-30" />
                    <p className="font-bold text-2xl capitalize text-gray-800">{activeTab} Settings</p>
                    <p className="text-sm text-gray-500 mt-2 text-center max-w-md">Configuration options for {activeTab} are currently loaded via environment variables in the cluster.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
