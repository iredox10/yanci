import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions, ROLE_LABELS } from '../../hooks/usePermissions';
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
  FaUser,
  FaCalendarDays,
} from 'react-icons/fa6';

const NavItem = ({ to, icon: Icon, label, active, permission, hasPermission }) => {
  if (permission && !hasPermission(permission)) return null;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active ? 'bg-[#c59d5f] text-[#0f3036] font-bold' : 'hover:bg-white/10'}`}
    >
      <Icon className="w-5 h-5" /> {label}
    </Link>
  );
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, navigate, loading]);

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

  const roleLabel = ROLE_LABELS[user?.role] || user?.category || 'Editor';

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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
              <span className="block text-[#c59d5f] capitalize">{roleLabel}</span>
            </div>
          </div>
          <button
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaXmark className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem to="/admin" icon={FaChartPie} label="Dashboard" active={isActive('/admin')} hasPermission={hasPermission} />
          <NavItem to="/admin/articles" icon={FaFileLines} label="Articles" active={isActive('/admin/articles')} hasPermission={hasPermission} permission="read_articles" />
          <NavItem to="/admin/calendar" icon={FaCalendarDays} label="Calendar" active={isActive('/admin/calendar')} hasPermission={hasPermission} permission="read_articles" />
          <NavItem to="/admin/live" icon={FaTowerBroadcast} label="Live Coverage" active={isActive('/admin/live')} hasPermission={hasPermission} permission="manage_live_blog" />
          <NavItem to="/admin/elections" icon={FaCheckToSlot} label="Elections" active={location.pathname.startsWith('/admin/elections')} hasPermission={hasPermission} permission="manage_elections" />
          <NavItem to="/admin/media" icon={FaImage} label="Media Library" active={isActive('/admin/media')} hasPermission={hasPermission} permission="manage_media" />
          <NavItem to="/admin/multimedia" icon={FaPhotoFilm} label="Multimedia" active={isActive('/admin/multimedia')} hasPermission={hasPermission} permission="manage_media" />
          <NavItem to="/admin/sports" icon={FaTrophy} label="Sports" active={location.pathname.startsWith('/admin/sports')} hasPermission={hasPermission} permission="manage_sports" />
          <NavItem to="/admin/highlights" icon={FaStar} label="Highlight Panels" active={isActive('/admin/highlights')} hasPermission={hasPermission} permission="manage_highlights" />
          <NavItem to="/admin/newsletter" icon={FaNewspaper} label="Newsletter" active={isActive('/admin/newsletter')} hasPermission={hasPermission} permission="manage_newsletter" />
          <NavItem to="/admin/comments" icon={FaComment} label="Comments" active={isActive('/admin/comments')} hasPermission={hasPermission} permission="manage_comments" />
          <NavItem to="/admin/analytics" icon={FaChartLine} label="Analytics" active={isActive('/admin/analytics')} hasPermission={hasPermission} permission="view_analytics" />
          <NavItem to="/admin/homepage-stats" icon={FaChartLine} label="Homepage Stats" active={isActive('/admin/homepage-stats')} hasPermission={hasPermission} permission="manage_layout" />
          <NavItem to="/admin/homepage" icon={FaPalette} label="Homepage Builder" active={isActive('/admin/homepage')} hasPermission={hasPermission} permission="manage_layout" />
          <NavItem to="/admin/seo" icon={FaShieldHalved} label="SEO & Metadata" active={isActive('/admin/seo')} hasPermission={hasPermission} permission="manage_seo" />
          <NavItem to="/admin/notifications" icon={FaBell} label="Notifications" active={isActive('/admin/notifications')} hasPermission={hasPermission} permission="manage_notifications" />

          <div className="pt-2 pb-1 px-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Administration</div>

          <NavItem to="/admin/users" icon={FaUsers} label="Users" active={isActive('/admin/users')} hasPermission={hasPermission} permission="manage_users" />
          <NavItem to="/admin/roles" icon={FaUserShield} label="Roles & Permissions" active={isActive('/admin/roles')} hasPermission={hasPermission} permission="manage_roles" />
          <NavItem to="/admin/settings" icon={FaGear} label="Settings" active={isActive('/admin/settings')} hasPermission={hasPermission} permission="manage_settings" />

          <div className="pt-2 pb-1 px-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Content</div>

          <NavItem to="/admin/create" icon={FaCirclePlus} label="New Article" active={isActive('/admin/create')} hasPermission={hasPermission} permission="create_articles" />
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

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
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

        <main className="flex-1 flex flex-col min-w-0 bg-gray-50 h-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
