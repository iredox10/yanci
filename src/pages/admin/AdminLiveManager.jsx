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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    handleCreateNewLiveBlog();
  };

  // Filter for live articles
  const liveEvents = articles.filter(article => article.isLive);

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
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative">
      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-black text-lg text-[#0f3036] uppercase tracking-tighter">Start Live Blog</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Title (Headline)</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] focus:bg-white outline-none transition-all"
                  placeholder="e.g. Lagos Tech Summit 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Reporters (Authors)</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] focus:bg-white outline-none transition-all"
                  placeholder="e.g. Ibrahim Sani & Amina Yusuf"
                  value={formData.authors}
                  onChange={(e) => setFormData({...formData, authors: e.target.value})}
                />
                <p className="text-[10px] text-gray-400 mt-2 italic">Separated by commas or ampersands.</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-[#c70000] text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-[#a10000] shadow-lg shadow-red-200 transition-all"
                >
                  Start Coverage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0f3036]">Live Coverage</h2>
          <p className="text-sm text-gray-500">Real-time event management.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-[#c70000] text-white px-6 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#a10000] transition-all shadow-lg shadow-red-100 font-bold text-sm w-full sm:w-auto"
        >
          <FaTowerBroadcast className="w-4 h-4" /> New Live Blog
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-600 animate-pulse border border-red-100">
                LIVE
              </span>
              <div className="text-gray-400 text-[10px] font-bold flex items-center gap-1">
                <FaClock className="w-3 h-3" /> {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-[#0f3036] mb-3 line-clamp-2 leading-snug group-hover:text-[#c59d5f] transition-colors">
              {event.headline}
            </h3>
            
            <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#0f3036] text-[10px] border border-gray-200 uppercase">
                {(event.author || 'E')[0]}
              </div>
              <span className="font-medium">{event.author || 'Editorial Team'}</span>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-gray-50">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {event.liveUpdates ? event.liveUpdates.length : 0} UPDATES
              </span>
              <Link 
                to={`/admin/live/${event.id}`}
                className="text-xs font-black text-[#0f3036] hover:text-[#c59d5f] flex items-center gap-1 uppercase tracking-widest"
              >
                Manage &rarr;
              </Link>
            </div>
          </div>
        ))}
        
        {liveEvents.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTowerBroadcast className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No live events currently active.</p>
            <button onClick={handleOpenModal} className="text-[#c59d5f] font-black uppercase text-xs tracking-widest hover:underline mt-4">
              Start your first one
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLiveManager;
