import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { appwriteService } from '../../lib/appwrite';
import getCroppedImg from '../../lib/cropUtils';
import Cropper from 'react-easy-crop';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  FaArrowLeft, FaPaperPlane, FaImage, FaTrash, FaStar, FaChevronRight,
  FaThumbtack, FaGear, FaXmark, FaCirclePlay, FaLocationDot, FaSpinner,
  FaCheck, FaChevronUp, FaChevronDown, FaMagnifyingGlass, FaPencil,
  FaArrowUp, FaArrowDown, FaCloudArrowUp, FaBookOpen,
} from 'react-icons/fa6';

const AdminLiveConsole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArticleById, addLiveUpdate, deleteLiveUpdate, updateArticle } = useNews();
  const { user } = useAuth();

  const [updateText, setUpdateText] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [isKeyEvent, setIsKeyEvent] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isSummary, setIsSummary] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [editText, setEditText] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editImages, setEditImages] = useState([]);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const feedRef = useRef(null);
  const quillRef = useRef(null);

  // Cropper State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppingTarget, setCroppingTarget] = useState('update'); // 'update' or 'edit'

  const article = getArticleById(id);

  useEffect(() => {
    if (!article) navigate('/admin/live');
  }, [article, navigate]);

  const [showSettings, setShowSettings] = useState(false);
  const [settingsData, setSettingsData] = useState({ videoUrl: '', keyFigures: '' });

  useEffect(() => {
    if (article) {
      setSettingsData({
        videoUrl: article.videoUrl || '',
        keyFigures: article.keyFigures || '',
        mapEmbedUrl: article.mapEmbedUrl || '',
      });
    }
  }, [article]);

  if (!article) return null;

  const handleSaveSettings = async () => {
    await updateArticle(article.id, settingsData);
    setShowSettings(false);
  };

  const handleImageUpload = (e, target = 'update') => {
    const file = e.target.files[0];
    if (!file) return;
    const localPreviewUrl = URL.createObjectURL(file);
    setCroppingImage(localPreviewUrl);
    setCroppingTarget(target);
    setShowCropper(true);
    e.target.value = null;
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    try {
      setUploading(true);
      const croppedImageBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      const file = new File([croppedImageBlob], 'upload.jpg', { type: 'image/jpeg' });
      const response = await appwriteService.uploadFile(file);
      const fileUrl = appwriteService.getFilePreview(response.$id);
      if (fileUrl) {
        if (croppingTarget === 'edit') {
          setEditImages(prev => [...prev, fileUrl]);
        } else {
          setImages(prev => [...prev, fileUrl]);
        }
      }
      setShowCropper(false);
      setCroppingImage(null);
    } catch (e) {
      console.error(e);
      alert('Failed to crop/upload image');
    } finally {
      setUploading(false);
    }
  };

  const handlePost = () => {
    if (!updateText.trim()) return;

    const newUpdate = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: updateTitle,
      content: updateText,
      images: images.length > 0 ? images : [],
      isKeyEvent,
      isPinned,
      isSummary,
      author: user?.name || 'Editor',
      timestamp: Date.now(),
    };

    addLiveUpdate(article.id, newUpdate);
    setUpdateText('');
    setUpdateTitle('');
    setImages([]);
    setIsKeyEvent(false);
    setIsPinned(false);
    setIsSummary(false);
    if (quillRef.current) quillRef.current.getEditor().setText('');
    if (window.innerWidth < 1024) setActiveTab('feed');
  };

  const handleDelete = (updateId) => {
    if (window.confirm('Delete this update?')) deleteLiveUpdate(article.id, updateId);
  };

  const handleStartEdit = (update) => {
    setEditingUpdate(update);
    setEditTitle(update.title || '');
    setEditText(update.content || '');
    setEditImages(update.images || []);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    const updated = {
      ...editingUpdate,
      title: editTitle,
      content: editText,
      images: editImages,
    };
    const updates = (article.liveUpdates || []).map(u => u.id === editingUpdate.id ? updated : u);
    updateArticle(article.id, { liveUpdates: updates });
    setEditingUpdate(null);
  };

  const handleMoveUpdate = (updateId, direction) => {
    const updates = [...(article.liveUpdates || [])];
    const idx = updates.findIndex(u => u.id === updateId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updates.length) return;
    [updates[idx], updates[targetIdx]] = [updates[targetIdx], updates[idx]];
    updateArticle(article.id, { liveUpdates: updates });
  };

  const handleEndCoverage = () => {
    if (window.confirm('End live coverage? This will convert it to a regular article.')) {
      updateArticle(article.id, { isLive: false });
      navigate('/admin/live');
    }
  };

  const handleWrapUp = () => {
    if (window.confirm('Create a wrap-up summary article from this live blog?')) {
      const updates = article.liveUpdates || [];
      const summary = updates.filter(u => u.isSummary).map(u => u.content).join('\n\n');
      const wrapUp = {
        headline: `${article.headline} — Full Coverage`,
        kicker: article.kicker || 'Wrap-up',
        trail: `Complete coverage of ${article.headline}`,
        body: `<h2>Live Blog Summary</h2><p>${summary || 'See live blog for full details.'}</p>`,
        image: article.image || '',
        pillar: article.pillar || 'news',
        section: article.section || 'headlines',
        format: 'feature',
        author: article.author || user?.name || '',
        isLive: false,
        status: 'published',
      };
      // Navigate to create with pre-filled data
      navigate('/admin/create');
    }
  };

  const filteredUpdates = (article.liveUpdates || []).filter(u => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (u.title || '').toLowerCase().includes(q) || (u.content || '').toLowerCase().includes(q) || (u.author || '').toLowerCase().includes(q);
    }
    return true;
  });

  const quillModules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'blockquote'],
      ['clean'],
    ],
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
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setShowSettings(true)} className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 text-xs transition-all uppercase tracking-wider flex items-center gap-2">
            <FaGear /> Settings
          </button>
          {article.isLive && (
            <>
              <button onClick={handleWrapUp} className="px-3 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 text-xs transition-all uppercase tracking-wider flex items-center gap-2">
                <FaBookOpen /> Wrap-up
              </button>
              <button onClick={handleEndCoverage} className="px-3 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 text-xs transition-all uppercase tracking-wider">
                End Live
              </button>
            </>
          )}
          <a href={`/article/${article.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-[#0f3036] text-white font-bold rounded-lg hover:bg-[#1a4a52] text-xs transition-all uppercase tracking-wider text-center">
            View Site
          </a>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#0f3036] uppercase tracking-widest">Live Configuration</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-red-500"><FaXmark className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Live Video URL (YouTube)</label>
                <input type="text" value={settingsData.videoUrl} onChange={(e) => setSettingsData({ ...settingsData, videoUrl: e.target.value })} placeholder="https://youtube.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Key Figures</label>
                <textarea value={settingsData.keyFigures} onChange={(e) => setSettingsData({ ...settingsData, keyFigures: e.target.value })} placeholder="Name - Role (One per line)" rows="5" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c59d5f] outline-none leading-relaxed" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowSettings(false)} className="px-6 py-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveSettings} className="px-6 py-2 bg-[#0f3036] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#1a4a52]">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg text-[#0f3036] uppercase tracking-widest">Crop Image</h3>
              <button onClick={() => setShowCropper(false)} className="text-gray-400 hover:text-red-500"><FaXmark className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 relative bg-gray-900">
              <Cropper image={croppingImage} crop={crop} zoom={zoom} aspect={16 / 9} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-500 uppercase">Zoom</span>
                <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} className="w-full accent-[#0f3036]" />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowCropper(false)} className="px-6 py-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleCropConfirm} disabled={uploading} className="px-6 py-2 bg-[#0f3036] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#1a4a52] flex items-center gap-2">
                  {uploading ? <FaSpinner className="animate-spin" /> : <FaCheck />} Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUpdate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg text-[#0f3036]">Edit Update</h3>
              <button onClick={() => setEditingUpdate(null)} className="text-gray-400 hover:text-red-500"><FaXmark className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Update title..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#c59d5f]" />
              <ReactQuill ref={quillRef} theme="snow" value={editText} onChange={setEditText} modules={quillModules} className="bg-white rounded-xl" />
              {editImages.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {editImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                      <button onClick={() => setEditImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"><FaXmark className="w-2.5 h-2.5" /></button>
                    </div>
                  ))}
                </div>
              )}
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-200">
                <FaImage /> Add Image
                <input ref={editFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'edit')} />
              </label>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setEditingUpdate(null)} className="px-4 py-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSaveEdit} className="px-6 py-2 bg-[#0f3036] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#1a4a52]">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-gray-100 p-1 rounded-xl mb-4 shrink-0">
        <button onClick={() => setActiveTab('editor')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'editor' ? 'bg-white text-[#0f3036] shadow-sm' : 'text-gray-500'}`}>Writer</button>
        <button onClick={() => setActiveTab('feed')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'feed' ? 'bg-white text-[#0f3036] shadow-sm' : 'text-gray-500'}`}>Feed ({article.liveUpdates?.length || 0})</button>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Editor Column */}
        <div className={`flex-1 lg:w-2/3 flex flex-col gap-4 min-h-0 ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="shrink-0">
              <input type="text" className="w-full text-lg md:text-xl font-black placeholder:text-gray-200 border-none outline-none mb-2 text-[#0f3036] uppercase tracking-tighter" placeholder="UPDATE TITLE..." value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
            </div>

            <div className="flex items-center gap-2 mb-4 py-2 border-y border-gray-50 shrink-0 overflow-x-auto no-scrollbar">
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className={`p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaImage className="w-4 h-4" />}
                <span className="text-[10px] font-bold uppercase hidden sm:inline">Add Media</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'update')} />
            </div>

            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                    <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"><FaXmark className="w-2.5 h-2.5" /></button>
                  </div>
                ))}
              </div>
            )}

            <ReactQuill ref={quillRef} theme="snow" value={updateText} onChange={setUpdateText} modules={quillModules} placeholder="Start reporting..." className="flex-1 min-h-0 overflow-hidden" />

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100 mt-4 gap-4 shrink-0">
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className={`w-8 h-5 rounded-full transition-colors relative ${isPinned ? 'bg-[#0f3036]' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${isPinned ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="hidden" />
                  <span className={`text-[10px] font-black uppercase ${isPinned ? 'text-[#0f3036]' : 'text-gray-400'}`}>Pin</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className={`w-8 h-5 rounded-full transition-colors relative ${isKeyEvent ? 'bg-[#c59d5f]' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${isKeyEvent ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <input type="checkbox" checked={isKeyEvent} onChange={(e) => setIsKeyEvent(e.target.checked)} className="hidden" />
                  <span className={`text-[10px] font-black uppercase ${isKeyEvent ? 'text-[#c59d5f]' : 'text-gray-400'}`}>Key Event</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className={`w-8 h-5 rounded-full transition-colors relative ${isSummary ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${isSummary ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <input type="checkbox" checked={isSummary} onChange={(e) => setIsSummary(e.target.checked)} className="hidden" />
                  <span className={`text-[10px] font-black uppercase ${isSummary ? 'text-blue-600' : 'text-gray-400'}`}>Summary</span>
                </label>
              </div>
              <button onClick={handlePost} disabled={!updateText.trim()} className="w-full sm:w-auto bg-[#c70000] text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#a10000] transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:shadow-none">
                <FaPaperPlane className="w-4 h-4" /> Post
              </button>
            </div>
          </div>
        </div>

        {/* Feed Column */}
        <div className={`flex-1 lg:w-1/3 bg-white lg:bg-gray-50 border border-gray-200 lg:rounded-2xl flex flex-col min-h-0 overflow-hidden ${activeTab === 'feed' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="p-4 bg-gray-50 border-b border-gray-200 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Live Feed Console</span>
              <span className="text-[10px] font-black text-[#0f3036] bg-[#c59d5f]/20 px-2 py-0.5 rounded-full">{article.liveUpdates?.length || 0} UPDATES</span>
            </div>
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-3 h-3" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search updates..." className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#c59d5f]" />
            </div>
          </div>

          <div ref={feedRef} className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredUpdates.map((update, idx) => (
              <div key={update.id} className={`p-4 hover:bg-gray-50 transition-all group relative ${update.isKeyEvent ? 'border-l-4 border-[#c59d5f] bg-orange-50/30' : 'bg-white lg:bg-transparent'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-black text-xs tabular-nums">{update.time}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{update.author}</span>
                    {update.isSummary && <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded font-bold">SUMMARY</span>}
                    {update.isPinned && <FaThumbtack className="w-2.5 h-2.5 text-[#0f3036] rotate-45" />}
                    {update.isKeyEvent && <FaStar className="w-2.5 h-2.5 text-[#c59d5f]" />}
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleMoveUpdate(update.id, 'up')} disabled={idx === 0} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30"><FaChevronUp className="w-2.5 h-2.5" /></button>
                    <button onClick={() => handleMoveUpdate(update.id, 'down')} disabled={idx === filteredUpdates.length - 1} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30"><FaChevronDown className="w-2.5 h-2.5" /></button>
                    <button onClick={() => handleStartEdit(update)} className="p-1 text-blue-500 hover:text-blue-700"><FaPencil className="w-2.5 h-2.5" /></button>
                    <button onClick={() => handleDelete(update.id)} className="p-1 text-red-400 hover:text-red-600"><FaTrash className="w-2.5 h-2.5" /></button>
                  </div>
                </div>
                {update.title && <h4 className="font-serif font-black text-[#0f3036] mb-1 leading-tight uppercase tracking-tight text-sm">{update.title}</h4>}
                <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: update.content }} />
                {update.images && update.images.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {update.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded border" />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredUpdates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaMagnifyingGlass className="text-gray-300 w-5 h-5" />
                </div>
                <p className="text-gray-400 font-medium text-sm">{searchQuery ? 'No updates match your search' : 'No updates posted yet.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLiveConsole;
