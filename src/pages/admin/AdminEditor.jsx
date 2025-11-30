import { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa6';

const AdminEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, addArticle, updateArticle, getArticleById } = useNews();
  
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    headline: '',
    kicker: '',
    trail: '',
    image: '',
    pillar: 'news',
    section: 'headlines',
    type: 'standard',
    author: '',
    isLive: false
  });

  useEffect(() => {
    if (isEditing) {
      const article = getArticleById(id);
      if (article) {
        setFormData(article);
      } else {
        navigate('/admin/articles');
      }
    }
  }, [id, isEditing, getArticleById, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateArticle(parseInt(id) || id, formData);
    } else {
      addArticle(formData);
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
          className="bg-[#0f3036] text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#1a454c] transition-colors font-bold"
        >
          <FaSave className="w-4 h-4" /> Save Article
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
          <label className="block text-sm font-bold text-gray-700">Image URL</label>
          <input 
            type="url" 
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none"
            placeholder="https://..."
          />
          {formData.image && (
            <div className="mt-2 h-40 w-full bg-gray-100 rounded-md overflow-hidden">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Pillar (Category)</label>
            <select 
              name="pillar"
              value={formData.pillar}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59d5f] focus:border-transparent outline-none capitalize"
            >
              <option value="news">News</option>
              <option value="sport">Sport</option>
              <option value="opinion">Opinion</option>
              <option value="culture">Culture</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
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
