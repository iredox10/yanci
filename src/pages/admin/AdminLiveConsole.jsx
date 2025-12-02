import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaPaperPlane, FaImage, FaBold, FaItalic, FaTrash, FaStar } from 'react-icons/fa6';

const AdminLiveConsole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArticleById, addLiveUpdate, deleteLiveUpdate, updateArticle } = useNews();
  const { user } = useAuth();

  const [updateText, setUpdateText] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [isKeyEvent, setIsKeyEvent] = useState(false);
  
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
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link to="/admin/live" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              {article.isLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live Now</span>
                </>
              ) : (
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ended</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#0f3036] line-clamp-1">{article.headline}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          {article.isLive && (
            <button 
              onClick={handleEndCoverage}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 text-sm"
            >
              End Coverage
            </button>
          )}
          <a 
            href={`/article/${article.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#0f3036] text-white font-bold rounded hover:bg-[#1a4a52] text-sm"
          >
            View on Site
          </a>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Editor Column */}
        <div className="w-2/3 flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex-1 flex flex-col">
            <div className="mb-4">
               <input
                  type="text"
                  className="w-full text-lg font-bold placeholder:text-gray-300 border-b border-gray-100 pb-2 outline-none mb-2"
                  placeholder="Update Title (Optional)"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
               />
            </div>

            <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><FaBold className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><FaItalic className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><FaImage className="w-4 h-4" /></button>
            </div>
            
            <textarea 
              className="flex-1 w-full resize-none outline-none text-lg placeholder:text-gray-300"
              placeholder="What's happening now?"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
            />
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={isKeyEvent}
                  onChange={(e) => setIsKeyEvent(e.target.checked)}
                  className="w-4 h-4 text-[#c59d5f] rounded focus:ring-[#c59d5f]"
                />
                <span className={`text-sm font-bold ${isKeyEvent ? 'text-[#c59d5f]' : 'text-gray-500'}`}>Key Event?</span>
              </label>

              <button 
                onClick={handlePost}
                className="bg-[#c70000] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-[#a10000] transition-colors"
              >
                <FaPaperPlane className="w-4 h-4" /> Post Update
              </button>
            </div>
          </div>
        </div>

        {/* Feed Column */}
        <div className="w-1/3 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto">
          <div className="p-3 bg-gray-100 border-b border-gray-200 font-bold text-gray-600 text-sm sticky top-0">
            Live Feed ({article.liveUpdates?.length || 0})
          </div>
          <div className="divide-y divide-gray-200">
            {(article.liveUpdates || []).map((update) => (
              <div key={update.id} className={`p-4 hover:bg-gray-50 group ${update.isKeyEvent ? 'bg-yellow-50' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold text-sm">{update.time}</span>
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{update.author}</span>
                    {update.isKeyEvent && <FaStar className="w-3 h-3 text-[#c59d5f]" title="Key Event" />}
                  </div>
                  <button 
                    onClick={() => handleDelete(update.id)}
                    className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                {update.title && <h4 className="font-bold text-gray-900 mb-1">{update.title}</h4>}
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{update.content}</p>
              </div>
            ))}
            {(!article.liveUpdates || article.liveUpdates.length === 0) && (
              <div className="p-8 text-center text-gray-400 text-sm">
                No updates yet. Post something to start the feed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLiveConsole;
