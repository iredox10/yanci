import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaPaperPlane, FaImage, FaBold, FaItalic, FaTrash, FaStar, FaChevronRight } from 'react-icons/fa6';

const AdminLiveConsole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArticleById, addLiveUpdate, deleteLiveUpdate, updateArticle } = useNews();
  const { user } = useAuth();

  const [updateText, setUpdateText] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [isKeyEvent, setIsKeyEvent] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'feed' for mobile
  
  const article = getArticleById(id);
  
  useEffect(() => {
    if (!article) {
      navigate('/admin/live');
    }
  }, [article, navigate]);

  if (!article) return null;

  const handlePost = () => {
    if (!updateText.trim()) return;
    
    const newUpdate = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: updateTitle,
      content: updateText,
      isKeyEvent: isKeyEvent,
      author: user?.name || "Editor"
    };
    
    addLiveUpdate(article.id, newUpdate);
    setUpdateText('');
    setUpdateTitle('');
    setIsKeyEvent(false);
    
    // On mobile, switch to feed after posting
    if (window.innerWidth < 1024) {
      setActiveTab('feed');
    }
  };

  const handleDelete = (updateId) => {
    if (window.confirm('Delete this update?')) {
      deleteLiveUpdate(article.id, updateId);
    }
  };
  
  const handleEndCoverage = () => {
    if (window.confirm('End live coverage for this article?')) {
       updateArticle(article.id, { isLive: false });
       navigate('/admin/live');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white md:bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/live" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 shrink-0">
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {article.isLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></span>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Live Now</span>
                </>
              ) : (
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ended</span>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-black text-[#0f3036] line-clamp-1 leading-tight uppercase tracking-tight">{article.headline}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          {article.isLive && (
            <button 
              onClick={handleEndCoverage}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 text-xs transition-all uppercase tracking-wider"
            >
              End Live
            </button>
          )}
          <a 
            href={`/article/${article.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-4 py-2 bg-[#0f3036] text-white font-bold rounded-lg hover:bg-[#1a4a52] text-xs transition-all uppercase tracking-wider text-center"
          >
            View Site
          </a>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-gray-100 p-1 rounded-xl mb-4 shrink-0">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'editor' ? 'bg-white text-[#0f3036] shadow-sm' : 'text-gray-500'}`}
        >
          Writer
        </button>
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'feed' ? 'bg-white text-[#0f3036] shadow-sm' : 'text-gray-500'}`}
        >
          Feed ({article.liveUpdates?.length || 0})
        </button>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Editor Column */}
        <div className={`
          flex-1 lg:w-2/3 flex flex-col gap-4 min-h-0
          ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}
        `}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="shrink-0">
               <input
                  type="text"
                  className="w-full text-lg md:text-xl font-black placeholder:text-gray-200 border-none outline-none mb-2 text-[#0f3036] uppercase tracking-tighter"
                  placeholder="UPDATE TITLE..."
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
               />
            </div>

            <div className="flex items-center gap-2 mb-4 py-2 border-y border-gray-50 shrink-0 overflow-x-auto no-scrollbar">
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><FaBold className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><FaItalic className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors flex items-center gap-2">
                <FaImage className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase hidden sm:inline">Add Media</span>
              </button>
            </div>
            
            <textarea 
              className="flex-1 w-full resize-none outline-none text-base md:text-lg placeholder:text-gray-200 text-gray-800 leading-relaxed font-serif"
              placeholder="Start reporting..."
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100 mt-4 gap-4 shrink-0">
              <label className="flex items-center gap-3 cursor-pointer select-none group w-full sm:w-auto">
                <div className={`w-10 h-6 rounded-full transition-colors relative ${isKeyEvent ? 'bg-[#c59d5f]' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isKeyEvent ? 'left-5' : 'left-1'}`} />
                </div>
                <input 
                  type="checkbox" 
                  checked={isKeyEvent}
                  onChange={(e) => setIsKeyEvent(e.target.checked)}
                  className="hidden"
                />
                <span className={`text-xs font-black uppercase tracking-widest ${isKeyEvent ? 'text-[#c59d5f]' : 'text-gray-400'}`}>Key Highlight?</span>
              </label>

              <button 
                onClick={handlePost}
                disabled={!updateText.trim()}
                className="w-full sm:w-auto bg-[#c70000] text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#a10000] transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:shadow-none"
              >
                <FaPaperPlane className="w-4 h-4" /> Post Update
              </button>
            </div>
          </div>
        </div>

        {/* Feed Column */}
        <div className={`
          flex-1 lg:w-1/3 bg-white lg:bg-gray-50 border border-gray-200 lg:rounded-2xl flex flex-col min-h-0 overflow-hidden
          ${activeTab === 'feed' ? 'flex' : 'hidden lg:flex'}
        `}>
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
            <span className="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Live Feed Console</span>
            <span className="text-[10px] font-black text-[#0f3036] bg-[#c59d5f]/20 px-2 py-0.5 rounded-full">{article.liveUpdates?.length || 0} UPDATES</span>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {(article.liveUpdates || []).map((update) => (
              <div key={update.id} className={`p-5 hover:bg-gray-50 transition-all group relative ${update.isKeyEvent ? 'border-l-4 border-[#c59d5f] bg-orange-50/30' : 'bg-white lg:bg-transparent'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-black text-xs tabular-nums">{update.time}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{update.author}</span>
                    {update.isKeyEvent && <FaStar className="w-2.5 h-2.5 text-[#c59d5f]" />}
                  </div>
                  <button 
                    onClick={() => handleDelete(update.id)}
                    className="text-gray-300 hover:text-red-600 transition-colors p-1"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
                {update.title && <h4 className="font-serif font-black text-[#0f3036] mb-2 leading-tight uppercase tracking-tight text-sm">{update.title}</h4>}
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{update.content}</p>
              </div>
            ))}
            
            {(!article.liveUpdates || article.liveUpdates.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaRadio className="text-gray-300 animate-pulse" />
                </div>
                <p className="text-gray-400 font-medium text-sm">No updates posted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon dependency fix
import { FaRadio } from 'react-icons/fa6';

export default AdminLiveConsole;
