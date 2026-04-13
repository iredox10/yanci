import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_PERMISSIONS = {
  read_articles: true, create_articles: true, edit_own_articles: true, publish_articles: true,
  edit_others_articles: false, delete_articles: false, manage_categories: false,
  manage_media: true, manage_comments: false, manage_users: false, manage_roles: false,
  manage_settings: false, manage_newsletter: false, manage_analytics: false,
  manage_elections: false, manage_live_blog: false, manage_highlights: false,
  manage_sports: false, manage_layout: false, manage_seo: false,
  manage_notifications: false, view_analytics: false, export_data: false,
};

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (user?.role === 'super_admin') {
      return Object.fromEntries(Object.keys(DEFAULT_PERMISSIONS).map(k => [k, true]));
    }
    const userPerms = user?.permissions || {};
    return { ...DEFAULT_PERMISSIONS, ...userPerms };
  }, [user]);

  const hasPermission = (key) => !!permissions[key];
  const hasAnyPermission = (...keys) => keys.some(k => permissions[k]);

  return { permissions, hasPermission, hasAnyPermission, user };
};

export const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { hasPermission } = usePermissions();
  if (!hasPermission(permission)) return fallback;
  return children;
};
