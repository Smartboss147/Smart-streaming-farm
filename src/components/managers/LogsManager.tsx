import React, { useState } from 'react';
import { Terminal, Search, Filter, AlertTriangle, CheckCircle, Info, Download } from 'lucide-react';
import { LogEntry } from '../../types';

interface LogsManagerProps {
  logs: LogEntry[];
}

export const LogsManager: React.FC<LogsManagerProps> = ({ logs }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'errors' | 'warnings' | 'success' | 'device' | 'campaign'>('live');
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => {
      if (activeTab === 'errors' && log.type !== 'CRITICAL') return false;
      if (activeTab === 'warnings' && log.type !== 'WARNING') return false;
      if (activeTab === 'success' && log.type !== 'SUCCESS' && log.type !== 'REWARD') return false;
      return log.msg.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto">
        {(['live', 'errors', 'warnings', 'success', 'device', 'campaign'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold capitalize whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab === 'live' ? 'Live Logs' : tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <div className="flex gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Search system logs..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" 
                 />
              </div>
           </div>
           <div className="flex gap-4">
               <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                 <Filter className="w-5 h-5" /> Filter
               </button>
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                 <Download className="w-5 h-5" /> Export Logs
               </button>
           </div>
        </div>

        <div className="flex-1 bg-[#080d0a] border border-gray-200 rounded-xl overflow-hidden flex flex-col">
           <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center gap-2">
               <Terminal className="w-4 h-4 text-gray-400" />
               <span className="text-sm font-mono text-gray-400">System Terminal Output</span>
           </div>
           <div className="flex-1 p-4 overflow-y-auto space-y-2 max-h-[600px] font-mono text-sm">
               {filteredLogs.length === 0 ? (
                   <p className="text-gray-600">No logs matching criteria.</p>
               ) : (
                   filteredLogs.map(log => (
                        <div key={log.id} className="flex gap-3">
                            <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                            <span className={`shrink-0 ${
                                log.type === 'CRITICAL' ? 'text-red-500' :
                                log.type === 'WARNING' ? 'text-yellow-500' :
                                log.type === 'SUCCESS' ? 'text-green-500' :
                                log.type === 'REWARD' ? 'text-yellow-400' :
                                'text-blue-400'
                            }`}>
                                {log.type}
                            </span>
                            <span className="text-gray-300 break-words">{log.msg}</span>
                        </div>
                   ))
               )}
           </div>
        </div>
      </div>
    </div>
  );
};
