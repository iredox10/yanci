import { useState, useEffect, useCallback, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { appwriteService } from '../../lib/appwrite';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaFloppyDisk, 
  FaArrowLeft, 
  FaCloudArrowUp, 
  FaSpinner, 
  FaEye, 
  FaTowerBroadcast,
  FaClock,
  FaCheck,
  FaTrash,
  FaMapLocationDot,
  FaQuoteLeft,
  FaCircleInfo,
  FaLayerGroup,
  FaPlus,
  FaGear
} from 'react-icons/fa6';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addArticle, updateArticle, getArticleById } = useNews();
  const { user } = useAuth();

  const isEditing = !!id;
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const [formData, setFormData] = useState({
    headline: '',
    kicker: '',
    trail: '',
    body: '',
    image: '',
    videoUrl: '',
    keyFigures: '',
    series: '',
    pillar: user?.category || 'news',
    section: 'headlines',
    type: 'standard',
    author: user?.name || '',
    isLive: false
  });

  const saveTimeoutRef = useRef(null);
  const quillRef = useRef(null);

  // Calculate word count
  useEffect(() => {
    const text = formData.body.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [formData.body]);

  // Ensure pillar matches user category on mount or user change
  useEffect(() => {
    if (user?.category) {
      setFormData(prev => ({ ...prev, pillar: user.category }));
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;
    if (isEditing) {
      const article = getArticleById(id);
      if (article) {
        if (user?.category && article.pillar !== user.category) {
          if (!ignore) {
            alert("You do not have permission to edit this article.");
            navigate('/admin/articles');
          }
          return;
        }
        if (!ignore) {
          setFormData({
            ...article,
            series: article.series || ''
          });
        }
      } else {
        if (!ignore) {
          navigate('/admin/articles');
        }
      }
    }
    return () => { ignore = true; };
  }, [id, isEditing, navigate, user, getArticleById]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setIsDirty(true);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await appwriteService.uploadFile(file);
      const fileUrl = appwriteService.getFilePreview(response.$id);
      setFormData(prev => ({ ...prev, [field]: fileUrl }));
      setIsDirty(true);
    } catch (error) {
      alert('File upload failed. Check console.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateArticle(id, formData);
      } else {
        const newId = await addArticle(formData);
        if (newId) navigate(`/admin/edit/${newId}`, { replace: true });
      }
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (isDirty) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 10000); // Auto-save after 10 seconds of inactivity
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [formData, isDirty]);

  const insertComponent = (type) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    let placeholder = '';

    switch(type) {
      case 'map':
        const mapUrl = prompt('Enter Google Maps Embed URL:');
        if (mapUrl) placeholder = `<div class="yanci-atom-map" data-url="${mapUrl}">[MAP COMPONENT]</div>`;
        break;
      case 'quote':
        placeholder = `<blockquote><p>"Shigar da maganar da kake so a nan."</p><footer>— Sunan Marubuci</footer></blockquote>`;
        break;
      case 'highlight':
        placeholder = `<div class="yanci-atom-highlight" style="background:#fbf8f3; border-left:4px solid #c59d5f; padding:1.5rem; margin:2rem 0;"><strong>MUHIMMIN ABIN LURA:</strong><br/>Shigar da muhimman bayanai a nan...</div>`;
        break;
      default:
        break;
    }

    if (placeholder) {
      quill.clipboard.dangerouslyPasteHTML(range.index, placeholder);
      setIsDirty(true);
    }
    setShowComponentMenu(false);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'blockquote'],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => navigate('/admin/articles')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            title="Back to Articles"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold text-gray-900 truncate max-w-[150px] md:max-w-[300px]">
              {formData.headline || 'Untitled Article'}
            </h1>
            <div className="flex items-center gap-2 text-[10px] whitespace-nowrap">
              {lastSaved ? (
                <span className="text-green-600 flex items-center gap-1">
                  <FaCheck className="w-2 h-2" /> {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              ) : (
                <span className="text-gray-400">Not saved</span>
              )}
              {isDirty && <span className="text-amber-500 font-bold hidden xs:inline">• Unsaved</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`xl:hidden p-2 rounded-full transition-colors ${showSidebar ? 'bg-[#0f3036] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Toggle Settings"
          >
            <FaGear className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.open(`/article/${id}`, '_blank')}
            disabled={!isEditing}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full sm:rounded-md sm:px-4 sm:py-2 sm:text-xs sm:font-bold flex items-center gap-2 disabled:opacity-30"
          >
            <FaEye /> <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={handleSave}
            disabled={uploading || !isDirty}
            className={`p-2 sm:px-6 sm:py-2 rounded-full sm:rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              isDirty 
                ? 'bg-[#0f3036] text-white hover:bg-[#1a454c] shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {uploading ? <FaSpinner className="animate-spin" /> : <FaFloppyDisk />}
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Editor Column */}
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8 lg:p-16 relative">
          <div className="max-w-[800px] mx-auto space-y-8 md:space-y-12">
            {/* Kicker Input */}
            <div className="relative">
              <input
                type="text"
                name="kicker"
                value={formData.kicker}
                onChange={handleChange}
                className="w-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#c70000] border-none focus:ring-0 p-0 placeholder-gray-300"
                placeholder="ADD KICKER / CATEGORY"
              />
            </div>

            {/* Headline Input */}
            <textarea
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              rows="1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full text-3xl md:text-6xl font-serif font-black text-[#0f3036] border-none focus:ring-0 p-0 resize-none placeholder-gray-200 leading-tight"
              placeholder="Article headline"
            />

            {/* Trail Text */}
            <textarea
              name="trail"
              value={formData.trail}
              onChange={handleChange}
              rows="2"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full text-lg md:text-xl font-serif text-gray-500 border-none focus:ring-0 p-0 resize-none border-l-4 border-gray-100 pl-4 md:pl-6 placeholder-gray-200 italic"
              placeholder="Short summary..."
            />

            {/* Author Input */}
            <div className="flex items-center gap-3 md:gap-4 py-4 md:py-6 border-y border-gray-50">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs md:text-sm">
                {formData.author?.[0] || 'Y'}
              </div>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="flex-1 text-sm font-bold text-gray-700 border-none focus:ring-0 p-0 placeholder-gray-300"
                placeholder="Author name"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="composer-editor pb-32">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.body || ''}
                onChange={(content) => {
                  setFormData(prev => ({ ...prev, body: content }));
                  setIsDirty(true);
                }}
                modules={quillModules}
                placeholder="Start writing..."
                className="font-body text-base md:text-lg leading-loose"
              />
            </div>
          </div>

          {/* Floating Block Inserter */}
          <div className="fixed bottom-6 right-4 sm:bottom-10 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 md:left-auto md:translate-x-0 md:right-[400px] z-40">
            <div className="relative">
              {showComponentMenu && (
                <div className="absolute bottom-full mb-4 right-0 sm:left-1/2 sm:-translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 min-w-[200px] animate-fade-in-up">
                  <p className="text-[10px] font-bold uppercase text-gray-400 px-4 py-2">Add Component</p>
                  <button 
                    onClick={() => insertComponent('map')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm transition-colors text-left"
                  >
                    <FaMapLocationDot className="text-blue-500" /> Map
                  </button>
                  <button 
                    onClick={() => insertComponent('quote')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm transition-colors text-left"
                  >
                    <FaQuoteLeft className="text-accent" /> Pull Quote
                  </button>
                  <button 
                    onClick={() => insertComponent('highlight')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm transition-colors text-left"
                  >
                    <FaCircleInfo className="text-amber-500" /> Highlight
                  </button>
                </div>
              )}
              <button 
                onClick={() => setShowComponentMenu(!showComponentMenu)}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
                  showComponentMenu ? 'bg-[#c70000] rotate-45 text-white' : 'bg-[#0f3036] text-white hover:scale-110'
                }`}
              >
                <FaPlus className="text-lg md:text-xl" />
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar Column */}
        <aside className={`
          fixed inset-y-0 right-0 z-40 w-[300px] md:w-[350px] border-l border-gray-200 bg-white md:bg-gray-50 overflow-y-auto p-6 transition-transform duration-300 transform
          xl:relative xl:translate-x-0 xl:block
          ${showSidebar ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
        `}>
          <div className="space-y-8">
            <div className="flex items-center justify-between xl:hidden mb-4">
              <h2 className="font-bold text-lg">Settings</h2>
              <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <FaPlus className="rotate-45" />
              </button>
            </div>

            {/* Meta Section */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                Metadata
              </h3>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600">Pillar</label>
                <select
                  name="pillar"
                  value={formData.pillar}
                  onChange={handleChange}
                  disabled={!!user?.category}
                  className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#c59d5f] outline-none capitalize"
                >
                  <option value="news">News</option>
                  <option value="sport">Sport</option>
                  <option value="opinion">Opinion</option>
                  <option value="culture">Culture</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600">Series</label>
                <div className="relative">
                  <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                  <input
                    type="text"
                    name="series"
                    value={formData.series}
                    onChange={handleChange}
                    className="w-full text-sm pl-8 p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#c59d5f] outline-none"
                    placeholder="Collection name..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#c59d5f] outline-none"
                >
                  <option value="standard">Standard</option>
                  <option value="hero">Hero (Priority)</option>
                  <option value="compact">Compact (Side)</option>
                </select>
              </div>

              <div className="p-4 bg-gray-50 xl:bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isLive"
                    checked={formData.isLive}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#c70000] rounded focus:ring-[#c70000]"
                  />
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                    <FaTowerBroadcast className={formData.isLive ? 'text-red-600' : 'text-gray-300'} />
                    Live Blog?
                  </span>
                </label>
              </div>
            </section>

            {/* Image Section */}
            <section className="space-y-4 pt-8 border-t border-gray-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Media</h3>
              <div className="space-y-3">
                {formData.image ? (
                  <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-md">
                    <img src={formData.image} alt="Featured" className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="p-2 bg-white text-gray-800 rounded-full cursor-pointer hover:bg-gray-100">
                        <FaCloudArrowUp />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                      </label>
                      <button 
                        onClick={() => setFormData({...formData, image: ''})}
                        className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all text-gray-400">
                    {uploading ? <FaSpinner className="animate-spin text-2xl" /> : (
                      <>
                        <FaCloudArrowUp className="text-2xl mb-2" />
                        <span className="text-[10px] font-bold uppercase">Upload Image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                  </label>
                )}
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full text-[10px] p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#c59d5f]"
                  placeholder="Image URL..."
                />
              </div>
            </section>

            {/* Key Figures */}
            <section className="space-y-4 pt-8 border-t border-gray-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Key Figures</h3>
              <textarea
                name="keyFigures"
                value={formData.keyFigures}
                onChange={handleChange}
                rows="4"
                className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#c59d5f] outline-none"
                placeholder="Name - Role (one per line)"
              />
            </section>

            {/* Stats */}
            <section className="pt-8 border-t border-gray-100 text-[10px] font-bold text-gray-400 flex justify-between uppercase tracking-widest">
              <span>{wordCount} WORDS</span>
              <span>{Math.max(1, Math.ceil(wordCount / 200))} MIN READ</span>
            </section>
          </div>
        </aside>
      </div>

      {/* CSS Overrides */}
      <style>{`
        .composer-editor .ql-container.ql-snow {
          border: none !important;
          font-family: 'Source Serif 4', Georgia, serif;
        }
        .composer-editor .ql-editor {
          padding: 0 !important;
          font-size: 1rem;
          line-height: 1.8;
          color: #171717;
          min-height: 500px;
        }
        @media (min-width: 768px) {
          .composer-editor .ql-editor { font-size: 1.125rem; }
        }
        .composer-editor .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f0f0f0 !important;
          position: sticky;
          top: 0;
          z-index: 40;
          background: white;
          margin-bottom: 2rem;
          padding: 8px 0 !important;
          overflow-x: auto;
          white-space: nowrap;
          display: flex;
          flex-wrap: wrap;
        }
        .composer-editor .ql-editor.ql-blank::before {
          left: 0 !important;
          font-style: italic;
          color: #d1d5db;
        }
        .composer-editor .ql-editor h1 { font-family: 'Playfair Display', serif; font-weight: 900; }
        .composer-editor .ql-editor h2 { font-family: 'Playfair Display', serif; font-weight: 800; }
        .composer-editor .ql-editor h3 { font-family: 'Playfair Display', serif; font-weight: 700; }
        
        .yanci-atom-map {
          background: #f0f9ff;
          border: 2px dashed #0ea5e9;
          color: #0369a1;
          padding: 1.5rem;
          text-align: center;
          font-weight: bold;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        @media (min-width: 768px) {
          .yanci-atom-map { padding: 2rem; margin: 2rem 0; }
        }
      `}</style>
    </div>
  );
};

export default AdminEditor;
