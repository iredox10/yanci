import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Plus, Calendar, Clock } from 'lucide-react';

const LIVE_EVENTS = [
  { 
    id: 1, 
    title: "Lagos Tech Summit 2025 - Day 1", 
    status: "Live", 
    author: "Tech Desk",
    startTime: "09:00 AM",
    updates: 45
  },
  { 
    id: 2, 
    title: "Presidential Address on Economy", 
    status: "Scheduled", 
    author: "Politics Team",
    startTime: "Tomorrow, 10:00 AM",
    updates: 0
  },
  { 
    id: 3, 
    title: "Super Eagles vs Ghana - AFCON Qualifier", 
    status: "Ended", 
    author: "Sports Desk",
    startTime: "Yesterday",
    updates: 128
  }
];

const AdminLiveManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0f3036]">Live Coverage</h2>
          <p className="text-gray-500">Manage live blogs and real-time reporting.</p>
        </div>
        <button className="bg-[#c70000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#a10000] transition-colors animate-pulse">
          <Radio className="w-4 h-4" /> Start New Live Blog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LIVE_EVENTS.map((event) => (
          <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                event.status === 'Live' ? 'bg-red-100 text-red-600 animate-pulse' :
                event.status === 'Scheduled' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {event.status}
              </span>
              <div className="text-gray-400 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" /> {event.startTime}
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-[#0f3036] mb-2 line-clamp-2">
              {event.title}
            </h3>
            
            <div className="text-sm text-gray-500 mb-4">
              Managed by <span className="font-medium text-gray-700">{event.author}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500">
                {event.updates} updates
              </span>
              <Link 
                to={`/admin/live/${event.id}`}
                className="text-sm font-bold text-[#0f3036] hover:text-[#c59d5f] flex items-center gap-1"
              >
                Open Console &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLiveManager;
