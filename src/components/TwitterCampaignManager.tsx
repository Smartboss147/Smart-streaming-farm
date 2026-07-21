import React, { useState } from 'react';
import { TwitterCampaign } from '../types';
import { Plus, Play, Pause, Square, Trash2, Calendar, Tags, AlignLeft, Hash } from 'lucide-react';

export const TwitterCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<TwitterCampaign[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState("Normal");
  
  const validateTwitterUrl = (url: string) => {
    return url.includes('twitter.com') || url.includes('x.com');
  };

  const addCampaign = (startImmediately: boolean = false) => {
    if (!newUrl || !validateTwitterUrl(newUrl)) {
        alert("Please enter a valid X/Twitter post URL.");
        return;
    }
    
    const newCampaign: TwitterCampaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: campaignName || `Campaign ${campaigns.length + 1}`,
      targetUrl: newUrl,
      status: startImmediately ? "Running" : "Draft",
      targetLikes: 500,
      targetImpressions: 5000,
      completedLikes: 0,
      completedImpressions: 0,
      assignedDevices: [],
      startDate: startTime || new Date().toISOString(),
    };
    
    setCampaigns([...campaigns, newCampaign]);
    setNewUrl("");
    setCampaignName("");
    setNotes("");
    setTags("");
    setStartTime("");
    
    if (startImmediately) {
       runSimulation(newCampaign.id);
    }
  };

  const runSimulation = (id: string) => {
    const interval = setInterval(() => {
      setCampaigns(prevCampaigns => {
        return prevCampaigns.map(c => {
          if (c.id === id && c.status === 'Running') {
            const newLikes = Math.min(c.completedLikes + Math.floor(Math.random() * 5), c.targetLikes);
            const newImpressions = Math.min(c.completedImpressions + Math.floor(Math.random() * 50), c.targetImpressions);
            
            if (newLikes >= c.targetLikes && newImpressions >= c.targetImpressions) {
              clearInterval(interval);
              return { ...c, completedLikes: newLikes, completedImpressions: newImpressions, status: 'Completed' };
            }
            return { ...c, completedLikes: newLikes, completedImpressions: newImpressions };
          }
          return c;
        });
      });
    }, 2000);
  };

  const updateStatus = (id: string, status: "Running" | "Paused" | "Stopped") => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        if (status === 'Running' && c.status !== 'Running') {
            runSimulation(id);
        }
        return { ...c, status };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Campaign Form */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
         <h3 className="text-xl font-bold mb-4">New Campaign</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Campaign Name</label>
                     <input type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g. Summer Promo Boost" className="w-full p-3 border border-gray-300 rounded-xl" />
                 </div>
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Target Post URL (X/Twitter)</label>
                     <input type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://x.com/user/status/12345" className="w-full p-3 border border-gray-300 rounded-xl" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Schedule Start</label>
                        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                        <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl">
                            <option>Low</option>
                            <option>Normal</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>
                 </div>
             </div>
             <div className="space-y-4">
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Tags</label>
                     <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. #marketing, #crypto" className="w-full p-3 border border-gray-300 rounded-xl" />
                 </div>
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
                     <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal campaign notes..." className="w-full p-3 border border-gray-300 rounded-xl h-[120px] resize-none"></textarea>
                 </div>
             </div>
         </div>
         <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-100">
             <button onClick={() => addCampaign(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Save Draft</button>
             <button onClick={() => addCampaign(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Start Campaign</button>
         </div>
      </div>

      {/* Campaigns List */}
      <div className="grid gap-6">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
             
             {/* Header */}
             <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                 <div>
                    <h3 className="font-bold text-2xl text-gray-900">{c.name}</h3>
                    <p className="text-blue-600 text-sm mt-1 flex items-center gap-1"><Hash className="w-3 h-3"/> {c.targetUrl}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        c.status === 'Running' ? 'bg-green-100 text-green-700' : 
                        c.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                        c.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-200 text-gray-700'
                    }`}>
                        {c.status}
                    </span>
                 </div>
             </div>

             {/* Details & Controls */}
             <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                 
                 {/* Left: Metadata */}
                 <div className="space-y-4">
                     <div>
                         <p className="text-xs text-gray-500 font-bold uppercase mb-1">Campaign Details</p>
                         <ul className="text-sm space-y-2 text-gray-700">
                             <li><span className="font-bold text-gray-900">ID:</span> {c.id.toUpperCase()}</li>
                             <li><span className="font-bold text-gray-900">Created:</span> {new Date(c.startDate).toLocaleDateString()}</li>
                             <li><span className="font-bold text-gray-900">Assigned Accounts:</span> 50</li>
                             <li><span className="font-bold text-gray-900">Proxy Group:</span> Global Rotating</li>
                             <li><span className="font-bold text-gray-900">Notes:</span> {notes || "No internal notes provided."}</li>
                         </ul>
                     </div>
                     <div className="pt-4 border-t border-gray-100 flex gap-2">
                        <button onClick={() => updateStatus(c.id, 'Running')} disabled={c.status === 'Running' || c.status === 'Completed'} className="flex-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex justify-center items-center gap-1 font-bold disabled:opacity-50"><Play className="w-4 h-4"/> Start</button>
                        <button onClick={() => updateStatus(c.id, 'Paused')} disabled={c.status !== 'Running'} className="flex-1 py-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg flex justify-center items-center gap-1 font-bold disabled:opacity-50"><Pause className="w-4 h-4"/> Pause</button>
                        <button onClick={() => updateStatus(c.id, 'Stopped')} disabled={c.status === 'Stopped' || c.status === 'Completed'} className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex justify-center items-center gap-1 font-bold disabled:opacity-50"><Square className="w-4 h-4"/> Stop</button>
                     </div>
                 </div>

                 {/* Middle & Right: Analytics Dashboard */}
                 <div className="lg:col-span-2">
                     <p className="text-xs text-gray-500 font-bold uppercase mb-3">Live Analytics Dashboard</p>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 font-bold">Likes</p>
                            <p className="text-2xl font-bold mt-1 text-gray-900">{c.completedLikes}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 font-bold">Impressions</p>
                            <p className="text-2xl font-bold mt-1 text-gray-900">{c.completedImpressions}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 font-bold">Replies</p>
                            <p className="text-2xl font-bold mt-1 text-gray-900">{Math.floor(c.completedLikes * 0.15)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 font-bold">Reposts</p>
                            <p className="text-2xl font-bold mt-1 text-gray-900">{Math.floor(c.completedLikes * 0.4)}</p>
                        </div>
                     </div>

                     <div className="space-y-2">
                         <div className="flex justify-between text-sm font-bold text-gray-700">
                             <span>Completion Progress</span>
                             <span>{Math.floor((c.completedLikes / c.targetLikes) * 100)}%</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                             <div 
                                className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min((c.completedLikes / c.targetLikes) * 100, 100)}%` }}
                             ></div>
                         </div>
                     </div>
                 </div>

             </div>
          </div>
        ))}
        {campaigns.length === 0 && (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-400">
                <AlignLeft className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-bold text-gray-600">No active campaigns</p>
                <p className="text-sm mt-1">Create a new campaign above to begin automation.</p>
            </div>
        )}
      </div>
    </div>
  );
};
