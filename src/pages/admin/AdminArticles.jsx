import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaPencil, FaTrash, FaPlus } from 'react-icons/fa6';

const AdminArticles = () => {
  const { articles, deleteArticle } = useNews();
  const { user } = useAuth();

  // Filter articles based on user category if not super admin
  const relevantArticles = user?.category 
    ? articles.filter(a => a.pillar === user.category)
    : articles;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Articles {user?.category && `(${user.category})`}</h2>
        <Link 
          to="/admin/create" 
          className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#1a454c] transition-colors font-bold text-sm w-full sm:w-auto"
        >
          <FaPlus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4">Article</th>
                <th className="p-4 w-32">Pillar</th>
                <th className="p-4 w-32 hidden md:table-cell">Date</th>
                <th className="p-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {relevantArticles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50 group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {article.image && (
                        <img src={article.image} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded object-cover bg-gray-100 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 line-clamp-1">{article.headline}</p>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{article.kicker}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase
                      ${article.pillar === 'news' ? 'bg-red-50 text-red-700 border-red-100' : 
                        article.pillar === 'sport' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                        article.pillar === 'opinion' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        'bg-gray-50 text-gray-700 border-gray-100'}`}>
                      {article.pillar}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs hidden md:table-cell whitespace-nowrap">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <Link 
                        to={`/admin/edit/${article.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <FaPencil className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
        </div>
        
        {relevantArticles.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p className="font-medium">No articles found.</p>
            <p className="text-sm">Create your first article to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticles;
