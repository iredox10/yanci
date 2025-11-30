import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Image, Bold, Italic, Trash2, Clock } from 'lucide-react';

const AdminLiveConsole = () => {
  const { id } = useParams();
  const [updateText, setUpdateText] = useState('');
  const [updates, setUpdates] = useState([
    { id: 1, time: "10:45", content: "The keynote speaker has just arrived at the venue.", author: "AY" },
    { id: 2, time: "10:30", content: "Welcome to our live coverage of the Lagos Tech Summit.", author: "IS" }
  ]);

  const handlePost = () => {
    if (!updateText.trim()) return;
    
    const newUpdate = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: updateText,
      author: "Me"
    };
    
    setUpdates([newUpdate, ...updates]);
    setUpdateText('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link to="/admin/live" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live Now</span>
            </div>
            <h2 className="text-xl font-bold text-[#0f3036]">Lagos Tech Summit 2025</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 text-sm">
            End Coverage
          </button>
          <button className="px-4 py-2 bg-[#0f3036] text-white font-bold rounded hover:bg-[#1a4a52] text-sm">
            View on Site
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Editor Column */}
        <div className="w-2/3 flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Bold className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Italic className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Image className="w-4 h-4" /></button>
            </div>
            <textarea 
              className="flex-1 w-full resize-none outline-none text-lg placeholder:text-gray-300"
              placeholder="What's happening now?"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
            />
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
              <span className="text-xs text-gray-400">Markdown supported</span>
              <button 
                onClick={handlePost}
                className="bg-[#c70000] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-[#a10000] transition-colors"
              >
                <Send className="w-4 h-4" /> Post Update
              </button>
            </div>
          </div>
        </div>

        {/* Feed Column */}
        <div className="w-1/3 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto">
          <div className="p-3 bg-gray-100 border-b border-gray-200 font-bold text-gray-600 text-sm sticky top-0">
            Live Feed ({updates.length})
          </div>
          <div className="divide-y divide-gray-200">
            {updates.map((update) => (
              <div key={update.id} className="p-4 bg-white hover:bg-gray-50 group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold text-sm">{update.time}</span>
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{update.author}</span>
                  </div>
                  <button className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{update.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLiveConsole;
