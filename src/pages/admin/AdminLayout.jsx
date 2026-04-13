import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaChartPie,
  FaFileLines,
  FaCirclePlus,
  FaGear,
  FaRightFromBracket,
  FaUsers,
  FaTowerBroadcast,
  FaArrowRightFromBracket,
  FaBars,
  FaXmark,
  FaImage,
  FaPhotoFilm,
  FaCheckToSlot,
  FaBell,
  FaNewspaper,
  FaTrophy,
  FaStar,
  FaChartLine,
  FaComment,
  FaPalette,
  FaShieldHalved,
  FaUserShield,
  FaUserGear,
  FaUser,
} from 'react-icons/fa6';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, navigate, loading]);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  if (loading) return <div className="min-h-screen bg-[#0f3036] flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0f3036] text-white flex flex-col shrink-0 transition-transform duration-300 transform
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 className="font-serif font-black text-2xl tracking-tighter">
              Yanci<span className="text-[#c59d5f]">.</span> Admin
            </h1>
            <div className="mt-2 text-xs text-gray-400">
              Logged in as <br />
              <span className="font-bold text-white text-sm">{user.name}</span>
              {user.role && <span className="block text-[#c59d5f] capitalize">{user.role === 'super_admin' ? 'Super Admin' : `${user.category || 'General'} Editor`}</span>}
            </div>
          </div>
          <button
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaXmark className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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

          <Link
            to="/admin/elections"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname.startsWith('/admin/elections') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaCheckToSlot className="w-5 h-5" /> Elections
          </Link>

          <Link
            to="/admin/media"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/media') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaImage className="w-5 h-5" /> Media Library
          </Link>

          <Link
            to="/admin/multimedia"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/multimedia') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaPhotoFilm className="w-5 h-5" /> Multimedia
          </Link>

          <Link
            to="/admin/sports"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname.startsWith('/admin/sports') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaTrophy className="w-5 h-5" /> Sports
          </Link>

          <Link
            to="/admin/highlights"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/highlights') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaStar className="w-5 h-5" /> Highlight Panels
          </Link>

          <Link
            to="/admin/newsletter"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/newsletter') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaNewspaper className="w-5 h-5" /> Newsletter
          </Link>

          <Link
            to="/admin/comments"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/comments') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaComment className="w-5 h-5" /> Comments
          </Link>

          <Link
            to="/admin/analytics"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/analytics') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaChartLine className="w-5 h-5" /> Analytics
          </Link>

          <Link
            to="/admin/homepage-stats"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/homepage-stats') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaChartLine className="w-5 h-5" /> Homepage Stats
          </Link>

          <Link
            to="/admin/homepage"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/homepage') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaPalette className="w-5 h-5" /> Homepage Builder
          </Link>

          <Link
            to="/admin/seo"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/seo') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaShieldHalved className="w-5 h-5" /> SEO & Metadata
          </Link>

          <Link
            to="/admin/notifications"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/notifications') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
          >
            <FaBell className="w-5 h-5" /> Notifications
          </Link>

          {user.role === 'super_admin' && (
            <>
              <Link
                to="/admin/users"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/users') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
              >
                <FaUsers className="w-5 h-5" /> Users
              </Link>
              <Link
                to="/admin/roles"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/roles') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
              >
                <FaUserShield className="w-5 h-5" /> Roles & Permissions
              </Link>
            </>
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
          <Link to="/admin/profile" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${isActive('/admin/profile') ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <FaUser className="w-5 h-5" /> My Profile
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-left text-sm">
            <FaArrowRightFromBracket className="w-5 h-5" /> Logout
          </button>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors text-sm">
            <FaRightFromBracket className="w-5 h-5" /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#0f3036] text-white px-4 h-16 flex items-center justify-between shrink-0 shadow-md z-30">
          <button
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars className="w-6 h-6 text-white" />
          </button>
          <h1 className="font-serif font-black text-xl tracking-tighter">
            Yanci<span className="text-[#c59d5f]">.</span>
          </h1>
          <div className="w-10 h-10 rounded-full bg-[#c59d5f]/20 text-[#c59d5f] flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0)}
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-50 h-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
