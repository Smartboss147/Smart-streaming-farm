import React, { useState } from 'react';
import { TwitterCampaign } from '../types';
import { Plus, Play, Pause, Square, Trash2 } from 'lucide-react';

export const TwitterCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<TwitterCampaign[]>([]);
  const [newUrl, setNewUrl] = useState("");

  const addCampaign = () => {
    if (!newUrl) return;
    const newCampaign: TwitterCampaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Campaign ${campaigns.length + 1}`,
      targetUrl: newUrl,
      status: "Draft",
      targetLikes: 100,
      targetImpressions: 1000,
      completedLikes: 0,
      completedImpressions: 0,
      assignedDevices: [],
      startDate: new Date().toISOString(),
    };
    setCampaigns([...campaigns, newCampaign]);
    setNewUrl("");
  };

  const runCampaign = (id: string) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id && c.status !== 'Running') {
        return { ...c, status: 'Running' };
      }
      return c;
    }));

    // Simulate engagement from 50 devices
    const interval = setInterval(() => {
      setCampaigns(prevCampaigns => {
        return prevCampaigns.map(c => {
          if (c.id === id && c.status === 'Running') {
            const newLikes = Math.min(c.completedLikes + 50, c.targetLikes);
            const newImpressions = Math.min(c.completedImpressions + 500, c.targetImpressions);
            
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

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <input 
          type="text" 
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Paste X/Twitter Post URL"
          className="flex-1 p-4 border border-gray-300 rounded-xl text-lg"
        />
        <button onClick={addCampaign} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 text-lg hover:bg-blue-700">
          <Plus size={24} /> Load Campaign
        </button>
      </div>

      <div className="grid gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{c.name}</h3>
                  <p className="text-gray-500 text-base break-all">{c.targetUrl}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${c.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {c.status}
                  </span>
                  <button onClick={() => runCampaign(c.id)} className="p-3 hover:bg-gray-100 rounded-full text-blue-600"><Play size={22} /></button>
                  <button className="p-3 hover:bg-gray-100 rounded-full"><Pause size={22} /></button>
                  <button className="p-3 hover:bg-gray-100 rounded-full"><Square size={22} /></button>
                  <button className="p-3 hover:bg-red-50 text-red-600 rounded-full"><Trash2 size={22} /></button>
                </div>
            </div>
            
            {/* Progress Visualization */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 font-bold">Likes</p>
                    <p className="text-2xl font-bold">{c.completedLikes} / {c.targetLikes}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 font-bold">Impressions</p>
                    <p className="text-2xl font-bold">{c.completedImpressions} / {c.targetImpressions}</p>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(c.completedImpressions / c.targetImpressions) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
