import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { FaTowerBroadcast, FaPlus, FaClock, FaXmark } from 'react-icons/fa6';

const AdminLiveManager = () => {
  const { articles, addArticle } = useNews();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    authors: ''
  });

  // Filter for live articles
  const liveEvents = articles.filter(article => article.isLive);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    handleCreateNewLiveBlog();
  };

  const handleCreateNewLiveBlog = async () => {
    const newLiveArticle = {
      headline: formData.title || "Sabon Labarin Kai Tsaye",
      kicker: "Kai Tsaye",
      trail: `Live coverage of ${formData.title}`,
      body: "",
      image: "",
      pillar: user?.category || "news", // Default to user's category or 'news'
      section: "headlines",
      type: "standard",
      author: formData.authors,
      isLive: true,
      liveUpdates: []
    };
    const newId = await addArticle(newLiveArticle);
    if (newId) {
      navigate(`/admin/live/${newId}`);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-[#0f3036]">Start New Live Blog</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title (Headline)</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c59d5f] outline-none"
                  placeholder="e.g. Lagos Tech Summit 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Reporters (Authors)</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#c59d5f] outline-none"
                  placeholder="e.g. Ibrahim Sani & Amina Yusuf"
                  value={formData.authors}
                  onChange={(e) => setFormData({...formData, authors: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">The people covering this event.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#c70000] text-white font-bold rounded hover:bg-[#a10000]"
                >
                  Start Coverage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0f3036]">Live Coverage</h2>
          <p className="text-gray-500">Manage live blogs and real-time reporting.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-[#c70000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#a10000] transition-colors animate-pulse"
        >
          <FaTowerBroadcast className="w-4 h-4" /> Start New Live Blog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-red-100 text-red-600 animate-pulse">
                LIVE
              </span>
              <div className="text-gray-400 text-xs flex items-center gap-1">
                <FaClock className="w-3 h-3" /> {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-[#0f3036] mb-2 line-clamp-2">
              {event.headline}
            </h3>
            
            <div className="text-sm text-gray-500 mb-4">
              Managed by <span className="font-medium text-gray-700">{event.author || 'Editorial Team'}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500">
                {event.liveUpdates ? event.liveUpdates.length : 0} updates
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
        
        {liveEvents.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p>No live events currently active.</p>
            <button onClick={handleOpenModal} className="text-[#c59d5f] font-bold hover:underline mt-2 inline-block">
              Create one now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLiveManager;
