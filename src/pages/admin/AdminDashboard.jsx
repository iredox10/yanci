import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { FaFileLines, FaEye, FaArrowTrendUp, FaUsers } from 'react-icons/fa6';

const StatCard = ({ title, value, icon, color }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { articles } = useNews();
  const { user } = useAuth();

  // Filter articles based on user category if not super admin
  const relevantArticles = user?.category 
    ? articles.filter(a => a.pillar === user.category)
    : articles;

  const totalArticles = relevantArticles.length;
  const liveArticles = relevantArticles.filter(a => a.isLive).length;
  const categoryArticles = user?.category 
    ? relevantArticles.length 
    : articles.filter(a => a.pillar === 'news').length;
  
  const thirdCardTitle = user?.category ? `${user.category} Articles` : "News Pillar";

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back, <span className="font-bold">{user?.name}</span>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Articles" 
          value={totalArticles} 
          icon={FaFileLines} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Live Stories" 
          value={liveArticles} 
          icon={FaArrowTrendUp} 
          color="bg-red-500" 
        />
        <StatCard 
          title={thirdCardTitle} 
          value={categoryArticles} 
          icon={FaEye} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Users" 
          value="12.5k" 
          icon={FaUsers} 
          color="bg-purple-500" 
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-4">Recent Articles {user?.category && `(${user.category})`}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Pillar</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {relevantArticles.slice(0, 5).map(article => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{article.headline}</td>
                  <td className="p-3 capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                      ${article.pillar === 'news' ? 'bg-red-100 text-red-800' : 
                        article.pillar === 'sport' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {article.pillar}
                    </span>
                  </td>
                  <td className="p-3 capitalize text-gray-500">{article.type || 'Standard'}</td>
                  <td className="p-3">
                    {article.isLive ? (
                      <span className="flex items-center gap-1 text-red-600 font-bold text-xs">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> LIVE
                      </span>
                    ) : (
                      <span className="text-green-600 font-bold text-xs">PUBLISHED</span>
                    )}
                  </td>
                </tr>
              ))}
              {relevantArticles.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">No articles found for this category.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
