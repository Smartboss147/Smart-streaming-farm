import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Activity, Download, Calendar } from 'lucide-react';

export const AnalyticsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'device' | 'campaign' | 'proxy' | 'export'>('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto">
        {(['dashboard', 'reports', 'device', 'campaign', 'proxy', 'export'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold capitalize whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab === 'dashboard' ? 'Live Dashboard' : tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[500px]">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold">Live Farm Analytics</h3>
                 <div className="flex items-center gap-2 text-sm text-gray-500 font-bold bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Activity className="w-4 h-4 text-green-500 animate-pulse" /> Live Updates Active
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="p-5 border border-gray-200 rounded-xl">
                     <p className="text-sm text-gray-500 font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Total Streams</p>
                     <p className="text-3xl font-bold mt-2">1,204,592</p>
                     <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12.5% this week</p>
                 </div>
                 <div className="p-5 border border-gray-200 rounded-xl">
                     <p className="text-sm text-gray-500 font-bold flex items-center gap-2"><Users className="w-4 h-4"/> Active Devices</p>
                     <p className="text-3xl font-bold mt-2">50 / 50</p>
                     <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">100% Uptime</p>
                 </div>
                 <div className="p-5 border border-gray-200 rounded-xl">
                     <p className="text-sm text-gray-500 font-bold flex items-center gap-2"><Activity className="w-4 h-4"/> Success Rate</p>
                     <p className="text-3xl font-bold mt-2">98.2%</p>
                     <p className="text-xs text-gray-500 font-bold mt-2 flex items-center gap-1">Average over 24h</p>
                 </div>
                 <div className="p-5 border border-gray-200 rounded-xl">
                     <p className="text-sm text-gray-500 font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Proxy Health</p>
                     <p className="text-3xl font-bold mt-2">Good</p>
                     <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1">2 proxies rotated recently</p>
                 </div>
             </div>

             <div className="h-64 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                 <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                 <p className="font-bold">Real-time charts will render here</p>
                 <p className="text-sm">using D3 / Recharts based on stream flow data.</p>
             </div>
          </div>
        )}
        
        {activeTab === 'export' && (
           <div className="space-y-6">
             <h3 className="text-xl font-bold">Export Reports</h3>
             <div className="flex gap-4">
                 <button className="px-6 py-4 border border-gray-200 rounded-xl flex items-center gap-3 hover:bg-gray-50 transition-colors">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <Download className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                        <p className="font-bold">Export to CSV</p>
                        <p className="text-sm text-gray-500">Download raw metrics data.</p>
                     </div>
                 </button>
                 <button className="px-6 py-4 border border-gray-200 rounded-xl flex items-center gap-3 hover:bg-gray-50 transition-colors">
                     <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                        <Download className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                        <p className="font-bold">Export to PDF</p>
                        <p className="text-sm text-gray-500">Download formatted report.</p>
                     </div>
                 </button>
             </div>
           </div>
        )}

        {/* Placeholders for others */}
        {['reports', 'device', 'campaign', 'proxy'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-bold text-lg capitalize">{activeTab} Analytics Module</p>
                <p className="text-sm text-gray-500 mt-2">Data visualization panels are syncing.</p>
            </div>
        )}
      </div>
    </div>
  );
};
