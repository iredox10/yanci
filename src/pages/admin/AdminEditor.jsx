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
  FaTrash
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

  const [formData, setFormData] = useState({
    headline: '',
    kicker: '',
    trail: '',
    body: '',
    image: '',
    videoUrl: '',
    keyFigures: '',
    pillar: user?.category || 'news',
    section: 'headlines',
    type: 'standard',
    author: user?.name || '',
    isLive: false
  });

  const saveTimeoutRef = useRef(null);

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
          setFormData(article);
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
        await updateArticle(parseInt(id) || id, formData);
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
      }, 5000); // Auto-save after 5 seconds of inactivity
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [formData, isDirty]);

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
    <div className="flex flex-col min-h-full bg-[#f5f5f5]">
      {/* Sticky Composer Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/articles')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            title="Back to Articles"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-gray-900 truncate max-w-[300px]">
              {formData.headline || 'Untitled Article'}
            </h1>
            <div className="flex items-center gap-2 text-[10px]">
              {lastSaved ? (
                <span className="text-green-600 flex items-center gap-1">
                  <FaCheck className="w-2 h-2" /> Saved at {lastSaved.toLocaleTimeString()}
                </span>
              ) : (
                <span className="text-gray-400">Not saved yet</span>
              )}
              {isDirty && <span className="text-amber-500 font-bold">• Unsaved changes</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(`/article/${id}`, '_blank')}
            disabled={!isEditing}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FaEye /> Preview
          </button>
          <button
            onClick={handleSave}
            disabled={uploading || !isDirty}
            className={`px-6 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all ${
              isDirty 
                ? 'bg-[#0f3036] text-white hover:bg-[#1a454c] shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {uploading ? <FaSpinner className="animate-spin" /> : <FaFloppyDisk />}
            Save changes
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor Column */}
        <main className="flex-1 overflow-y-auto bg-white p-8 md:p-16">
          <div className="max-w-[800px] mx-auto space-y-12">
            {/* Kicker Input */}
            <div className="relative">
              <input
                type="text"
                name="kicker"
                value={formData.kicker}
                onChange={handleChange}
                className="w-full text-xs font-bold uppercase tracking-widest text-[#c70000] border-none focus:ring-0 p-0 placeholder-gray-300"
                placeholder="ADD KICKER / CATEGORY"
              />
            </div>

            {/* Headline Input - Massive serif */}
            <textarea
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              rows="1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full text-4xl md:text-6xl font-serif font-black text-[#0f3036] border-none focus:ring-0 p-0 resize-none placeholder-gray-200 leading-tight"
              placeholder="Article headline"
            />

            {/* Trail Text - Smaller serif */}
            <textarea
              name="trail"
              value={formData.trail}
              onChange={handleChange}
              rows="2"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full text-xl font-serif text-gray-500 border-none focus:ring-0 p-0 resize-none border-l-4 border-gray-100 pl-6 placeholder-gray-200 italic"
              placeholder="Trail text: A short summary that appears below the headline..."
            />

            {/* Author Input */}
            <div className="flex items-center gap-4 py-6 border-y border-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
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
                theme="snow"
                value={formData.body || ''}
                onChange={(content) => {
                  setFormData(prev => ({ ...prev, body: content }));
                  setIsDirty(true);
                }}
                modules={quillModules}
                placeholder="Start writing your story..."
                className="font-body text-lg leading-loose"
              />
            </div>
          </div>
        </main>

        {/* Sidebar Column */}
        <aside className="w-[350px] border-l border-gray-200 bg-gray-50 overflow-y-auto p-6 hidden xl:block">
          <div className="space-y-8">
            {/* Meta Section */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                Metadata
              </h3>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600">Publication Pillar</label>
                <select
                  name="pillar"
                  value={formData.pillar}
                  onChange={handleChange}
                  disabled={!!user?.category}
                  className="w-full text-sm p-2 bg-white border border-gray-200 rounded shadow-sm focus:ring-2 focus:ring-[#c59d5f] outline-none capitalize"
                >
                  <option value="news">News</option>
                  <option value="sport">Sport</option>
                  <option value="opinion">Opinion</option>
                  <option value="culture">Culture</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600">Display Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full text-sm p-2 bg-white border border-gray-200 rounded shadow-sm focus:ring-2 focus:ring-[#c59d5f] outline-none"
                >
                  <option value="standard">Standard</option>
                  <option value="hero">Hero (Priority)</option>
                  <option value="compact">Compact (Side)</option>
                </select>
              </div>

              <div className="p-4 bg-white rounded border border-gray-200 shadow-sm space-y-3">
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
                    Is Live Blog?
                  </span>
                </label>
              </div>
            </section>

            {/* Featured Image Section */}
            <section className="space-y-4 pt-8 border-t border-gray-200">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Main Media
              </h3>
              
              <div className="space-y-3">
                {formData.image ? (
                  <div className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-md">
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
                  <label className="flex flex-col items-center justify-center aspect-video bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-200 transition-all text-gray-400">
                    {uploading ? <FaSpinner className="animate-spin text-2xl" /> : (
                      <>
                        <FaCloudArrowUp className="text-2xl mb-2" />
                        <span className="text-[10px] font-bold uppercase">Add Main Image</span>
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
                  className="w-full text-[10px] p-2 bg-white border border-gray-200 rounded outline-none"
                  placeholder="Or paste image URL..."
                />
              </div>
            </section>

            {/* Key Figures Section */}
            <section className="space-y-4 pt-8 border-t border-gray-200">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Key Figures
              </h3>
              <textarea
                name="keyFigures"
                value={formData.keyFigures}
                onChange={handleChange}
                rows="4"
                className="w-full text-xs p-3 bg-white border border-gray-200 rounded shadow-sm focus:ring-2 focus:ring-[#c59d5f] outline-none"
                placeholder="Name - Role (one per line)"
              />
            </section>

            {/* Stats */}
            <section className="pt-8 border-t border-gray-200 text-[10px] font-bold text-gray-400 flex justify-between">
              <span>WORDS: {wordCount}</span>
              <span>READ TIME: {Math.max(1, Math.ceil(wordCount / 200))} MIN</span>
            </section>
          </div>
        </aside>
      </div>

      {/* Editor CSS Overrides */}
      <style>{`
        .composer-editor .ql-container.ql-snow {
          border: none !important;
          font-family: 'Source Serif 4', Georgia, serif;
        }
        .composer-editor .ql-editor {
          padding: 0 !important;
          font-size: 1.125rem;
          line-height: 1.8;
          color: #171717;
        }
        .composer-editor .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f0f0f0 !important;
          position: sticky;
          top: 56px;
          z-index: 40;
          background: white;
          margin-bottom: 2rem;
          padding: 8px 0 !important;
        }
        .composer-editor .ql-editor.ql-blank::before {
          left: 0 !important;
          font-style: italic;
          color: #d1d5db;
        }
        .composer-editor .ql-editor h1 { font-family: 'Playfair Display', serif; font-weight: 900; }
        .composer-editor .ql-editor h2 { font-family: 'Playfair Display', serif; font-weight: 800; }
        .composer-editor .ql-editor h3 { font-family: 'Playfair Display', serif; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default AdminEditor;
