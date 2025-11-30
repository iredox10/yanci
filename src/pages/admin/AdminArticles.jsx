import { useNews } from '../../context/NewsContext';
import { Link } from 'react-router-dom';
import { FaPencil, FaTrash, FaPlus } from 'react-icons/fa6';

const AdminArticles = () => {
  const { articles, deleteArticle } = useNews();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Manage Articles</h2>
        <Link 
          to="/admin/create" 
          className="bg-[#0f3036] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#1a454c] transition-colors"
        >
          <FaPlus className="w-4 h-4" /> Add New
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="p-4">Article</th>
              <th className="p-4">Pillar</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map(article => (
              <tr key={article.id} className="hover:bg-gray-50 group">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    {article.image && (
                      <img src={article.image} alt="" className="w-12 h-12 rounded object-cover bg-gray-100" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{article.headline}</p>
                      <p className="text-xs text-gray-500">{article.kicker}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold border
                    ${article.pillar === 'news' ? 'bg-red-50 text-red-700 border-red-100' : 
                      article.pillar === 'sport' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      article.pillar === 'opinion' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      'bg-gray-50 text-gray-700 border-gray-100'}`}>
                    {article.pillar}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {new Date().toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      to={`/admin/edit/${article.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <FaPencil className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {articles.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No articles found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticles;
