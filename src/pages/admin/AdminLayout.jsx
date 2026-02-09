import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// Icons updated
import { FaChartPie, FaFileLines, FaCirclePlus, FaGear, FaRightFromBracket, FaUsers, FaTowerBroadcast, FaArrowRightFromBracket } from 'react-icons/fa6';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f3036] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-serif font-black text-2xl tracking-tighter">
            Yanci<span className="text-[#c59d5f]">.</span> Admin
          </h1>
          <div className="mt-2 text-xs text-gray-400">
            Logged in as <br />
            <span className="font-bold text-white text-sm">{user.name}</span>
            {user.category && <span className="block text-[#c59d5f] capitalize">{user.category} Editor</span>}
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaChartPie className="w-5 h-5" /> Dashboard
          </Link>
          
          <Link 
            to="/admin/articles" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/articles') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaFileLines className="w-5 h-5" /> Articles
          </Link>

          <Link 
            to="/admin/live" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/live') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaTowerBroadcast className="w-5 h-5" /> Live Coverage
          </Link>

          {user.role === 'super_admin' && (
            <Link 
              to="/admin/staff" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/staff') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
            >
              <FaUsers className="w-5 h-5" /> Staff
            </Link>
          )}
          
          <Link 
            to="/admin/create" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/create') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaCirclePlus className="w-5 h-5" /> New Article
          </Link>
          
          <Link 
            to="/admin/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/settings') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaGear className="w-5 h-5" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-left">
            <FaArrowRightFromBracket className="w-5 h-5" /> Logout
          </button>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors">
            <FaRightFromBracket className="w-5 h-5" /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
