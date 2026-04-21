import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const ROLE_PERMISSIONS = {
  super_admin: {
    read_articles: true, create_articles: true, edit_own_articles: true, publish_articles: true,
    edit_others_articles: true, delete_articles: true, manage_categories: true,
    manage_media: true, manage_comments: true, manage_users: true, manage_roles: true,
    manage_settings: true, manage_newsletter: true, manage_analytics: true,
    manage_elections: true, manage_live_blog: true, manage_highlights: true,
    manage_sports: true, manage_layout: true, manage_seo: true,
    manage_notifications: true, view_analytics: true, export_data: true,
  },
  managing_editor: {
    read_articles: true, create_articles: true, edit_own_articles: true, publish_articles: true,
    edit_others_articles: true, delete_articles: true, manage_categories: true,
    manage_media: true, manage_comments: true, manage_users: false, manage_roles: false,
    manage_settings: false, manage_newsletter: true, manage_analytics: false,
    manage_elections: true, manage_live_blog: true, manage_highlights: true,
    manage_sports: true, manage_layout: false, manage_seo: true,
    manage_notifications: true, view_analytics: true, export_data: true,
  },
  editor: {
    read_articles: true, create_articles: true, edit_own_articles: true, publish_articles: true,
    edit_others_articles: false, delete_articles: false, manage_categories: true,
    manage_media: true, manage_comments: false, manage_users: false, manage_roles: false,
    manage_settings: false, manage_newsletter: false, manage_analytics: false,
    manage_elections: false, manage_live_blog: true, manage_highlights: false,
    manage_sports: false, manage_layout: false, manage_seo: false,
    manage_notifications: false, view_analytics: true, export_data: false,
  },
  author: {
    read_articles: true, create_articles: true, edit_own_articles: true, publish_articles: true,
    edit_others_articles: false, delete_articles: false, manage_categories: false,
    manage_media: true, manage_comments: false, manage_users: false, manage_roles: false,
    manage_settings: false, manage_newsletter: false, manage_analytics: false,
    manage_elections: false, manage_live_blog: false, manage_highlights: false,
    manage_sports: false, manage_layout: false, manage_seo: false,
    manage_notifications: false, view_analytics: false, export_data: false,
  },
  contributor: {
    read_articles: true, create_articles: true, edit_own_articles: true, publish_articles: false,
    edit_others_articles: false, delete_articles: false, manage_categories: false,
    manage_media: false, manage_comments: false, manage_users: false, manage_roles: false,
    manage_settings: false, manage_newsletter: false, manage_analytics: false,
    manage_elections: false, manage_live_blog: false, manage_highlights: false,
    manage_sports: false, manage_layout: false, manage_seo: false,
    manage_notifications: false, view_analytics: false, export_data: false,
  },
};

const DEFAULT_PERMISSIONS = ROLE_PERMISSIONS.editor;

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (user?.role === 'super_admin') return ROLE_PERMISSIONS.super_admin;
    const roleKey = (user?.role || 'editor').toLowerCase().replace(/ /g, '_');
    return ROLE_PERMISSIONS[roleKey] || DEFAULT_PERMISSIONS;
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

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  managing_editor: 'Managing Editor',
  editor: 'Editor',
  author: 'Author',
  contributor: 'Contributor',
};
