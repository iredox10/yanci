import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appwriteService, storage, BUCKET_ID } from '../../lib/appwrite';
import { FaImage, FaTrash, FaCloudArrowUp, FaCopy, FaCheck, FaSpinner, FaMagnifyingGlass } from 'react-icons/fa6';

const AdminMedia = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const limit = 100; // Load up to 100 recent files
      const response = await storage.listFiles(BUCKET_ID, []);
      
      const fileUrls = response.files.map(file => ({
        id: file.$id,
        name: file.name,
        size: (file.sizeOriginal / 1024 / 1024).toFixed(2) + ' MB',
        date: new Date(file.$createdAt).toLocaleDateString(),
        url: appwriteService.getFilePreview(file.$id)
      }));
      setFiles(fileUrls);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await appwriteService.uploadFile(file);
      await loadFiles();
    } catch (error) {
      alert('Upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Shin kana son share wannan hoton? Ba za a iya dawo da shi ba.")) {
      try {
        await storage.deleteFile(BUCKET_ID, fileId);
        setFiles(prev => prev.filter(f => f.id !== fileId));
      } catch (error) {
        alert("Failed to delete file. It might be in use.");
        console.error(error);
      }
    }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Media Library</h2>
          <p className="text-sm text-gray-500">Gudanar da hotuna da fayiloli</p>
        </div>
        
        <label className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#1a454c] transition-colors font-bold text-sm cursor-pointer w-full sm:w-auto">
          {uploading ? <FaSpinner className="animate-spin w-4 h-4" /> : <FaCloudArrowUp className="w-4 h-4" />}
          Loda Hoto
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="relative max-w-md">
        <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          placeholder="Nemo hoto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c59d5f]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-4xl text-gray-300" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
          <FaImage className="mx-auto text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500">Babu hotuna a dakin ajiya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map(file => (
            <div key={file.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group">
              <div className="aspect-square relative bg-gray-100 placeholder-image">
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => copyUrl(file.url, file.id)}
                    className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                    title="Kwafi URL"
                  >
                    {copiedId === file.id ? <FaCheck className="text-green-600" /> : <FaCopy />}
                  </button>
                  <button 
                    onClick={() => handleDelete(file.id)}
                    className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                    title="Share"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-800 truncate" title={file.name}>{file.name}</p>
                <div className="flex justify-between items-center mt-1 text-[10px] text-gray-500">
                  <span>{file.size}</span>
                  <span>{file.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
