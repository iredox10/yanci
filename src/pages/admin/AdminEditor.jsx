import { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { appwriteService } from '../../lib/appwrite';
import { useNavigate, useParams } from 'react-router-dom';
import { FaFloppyDisk, FaArrowLeft, FaCloudArrowUp, FaSpinner } from 'react-icons/fa6';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addArticle, updateArticle, getArticleById } = useNews();
  const { user } = useAuth();

  const isEditing = !!id;
  const [uploading, setUploading] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing, navigate, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await appwriteService.uploadFile(file);
      const fileUrl = appwriteService.getFilePreview(response.$id);
      setFormData(prev => ({ ...prev, [field]: fileUrl }));
    } catch (error) {
      alert('File upload failed. Check console.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateArticle(parseInt(id) || id, formData);
    } else {
      await addArticle(formData);
    }
    navigate('/admin/articles');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/articles')}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`bg-[#0f3036] text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors font-bold ${uploading ? 'opacity-50 cursor-wait' : 'hover:bg-[#1a454c]'}`}
        >
          <FaFloppyDisk className="w-4 h-4" /> Save Article
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Kicker (Tag)</label>
            <input
              type="text"
              name="kicker"
              value={formData.kicker}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none"
              placeholder="e.g. Politics, Sport, Live"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author || ''}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none"
              placeholder="Author Name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Headline</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none font-serif text-lg"
            placeholder="Enter the main headline"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Trail Text (Summary)</label>
          <textarea
            name="trail"
            value={formData.trail || ''}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none"
            placeholder="A short summary of the article..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Article Body</label>
          <div className="bg-white">
            <ReactQuill
              theme="snow"
              value={formData.body || ''}
              onChange={(content) => setFormData(prev => ({ ...prev, body: content }))}
              className="h-64 mb-12"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Featured Image</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] outline-none"
              placeholder="Image URL (or upload file)"
            />
            <label className={`flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudArrowUp />}
              <span className="text-sm font-bold">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
            </label>
          </div>
          {formData.image && (
            <div className="mt-2 h-40 w-full bg-gray-100 rounded-md overflow-hidden relative group">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => setFormData({...formData, image: ''})}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Live Video (Embed URL or File)</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl || ''}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] outline-none"
              placeholder="Video URL (or upload file)"
            />
            <label className={`flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudArrowUp />}
              <span className="text-sm font-bold">Upload</span>
              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'videoUrl')} />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Key Figures (Masu Ruwa da Tsaki)</label>
          <textarea
            name="keyFigures"
            value={formData.keyFigures || ''}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none"
            placeholder="Format: Name - Role (One per line)&#10;e.g.&#10;Sa'idu Alkali - Ministan Sufuri&#10;Fidet Okhiria - MD, NRC"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Pillar (Category)</label>
            <select
              name="pillar"
              value={formData.pillar}
              onChange={handleChange}
              disabled={!!user?.category} // Disable if user has a specific category
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none capitalize ${user?.category ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="news">News</option>
              <option value="sport">Sport</option>
              <option value="opinion">Opinion</option>
              <option value="culture">Culture</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
            {user?.category && <p className="text-xs text-gray-500">Locked to your assigned category.</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Display Type</label>
            <select
              name="type"
              value={formData.type || 'standard'}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none capitalize"
            >
              <option value="standard">Standard</option>
              <option value="hero">Hero (Big)</option>
              <option value="compact">Compact (Small)</option>
            </select>
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isLive"
                checked={formData.isLive || false}
                onChange={handleChange}
                className="w-5 h-5 text-[#c59d5f] rounded focus:ring-[#c59d5f]"
              />
              <span className="font-bold text-gray-700">Is Live Article?</span>
            </label>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AdminEditor;
