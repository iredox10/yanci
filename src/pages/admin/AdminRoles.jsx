import { useState, useEffect } from 'react';
import { appwriteService } from '../../lib/appwrite';
import {
  FaShieldHalved, FaPlus, FaTrash, FaPen, FaXmark, FaSpinner,
  FaCheck, FaCircleXmark, FaLock, FaUsers,
} from 'react-icons/fa6';

const ALL_PERMISSIONS = [
  { key: 'read_articles', label: 'Read articles', group: 'Content' },
  { key: 'create_articles', label: 'Create articles', group: 'Content' },
  { key: 'edit_own_articles', label: 'Edit own articles', group: 'Content' },
  { key: 'publish_articles', label: 'Publish articles', group: 'Content' },
  { key: 'edit_others_articles', label: "Edit others' articles", group: 'Content' },
  { key: 'delete_articles', label: 'Delete articles', group: 'Content' },
  { key: 'manage_categories', label: 'Manage categories', group: 'Content' },
  { key: 'manage_media', label: 'Manage media library', group: 'Media' },
  { key: 'manage_comments', label: 'Manage comments', group: 'Community' },
  { key: 'manage_users', label: 'Manage users', group: 'Administration' },
  { key: 'manage_roles', label: 'Manage roles & permissions', group: 'Administration' },
  { key: 'manage_settings', label: 'Manage site settings', group: 'Administration' },
  { key: 'manage_newsletter', label: 'Manage newsletter', group: 'Marketing' },
  { key: 'manage_analytics', label: 'Manage analytics', group: 'Analytics' },
  { key: 'view_analytics', label: 'View analytics', group: 'Analytics' },
  { key: 'manage_elections', label: 'Manage elections', group: 'Special' },
  { key: 'manage_live_blog', label: 'Manage live blog', group: 'Special' },
  { key: 'manage_highlights', label: 'Manage highlights', group: 'Special' },
  { key: 'manage_sports', label: 'Manage sports', group: 'Special' },
  { key: 'manage_layout', label: 'Manage homepage layout', group: 'Special' },
  { key: 'manage_seo', label: 'Manage SEO', group: 'Special' },
  { key: 'manage_notifications', label: 'Manage notifications', group: 'Special' },
  { key: 'export_data', label: 'Export data', group: 'Data' },
];

const emptyRole = { name: '', description: '', permissions: {}, is_system: false, priority: 0 };

const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState(emptyRole);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRoles(); }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const docs = await appwriteService.getRoles();
      setRoles(docs.map(d => ({ ...d, id: d.$id, permissions: typeof d.permissions === 'string' ? JSON.parse(d.permissions) : d.permissions })));
    } catch (e) { console.error('Failed to load roles:', e); }
    finally { setLoading(false); }
  };

  const openEdit = (role) => { setDraft({ ...role, permissions: { ...role.permissions } }); setModal('edit'); };
  const openNew = () => { setDraft({ ...emptyRole, permissions: {} }); setModal('add'); };

  const togglePerm = (key) => setDraft(prev => ({ ...prev, permissions: { ...prev.permissions, [key]: !prev.permissions[key] } }));

  const handleSave = async () => {
    if (!draft.name.trim()) return alert('Role name is required');
    setSaving(true);
    try {
      const data = { ...draft, permissions: JSON.stringify(draft.permissions) };
      if (modal === 'edit' && draft.$id) {
        await appwriteService.updateRole(draft.$id, data);
      } else {
        await appwriteService.createRole(data);
      }
      await loadRoles();
      setModal(null);
    } catch (e) { alert('Failed to save: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (role) => {
    if (role.is_system) return alert('Cannot delete system roles');
    if (!window.confirm('Delete role "' + role.name + '"?')) return;
    try {
      await appwriteService.deleteRole(role.$id);
      await loadRoles();
    } catch (e) { alert('Failed to delete'); }
  };

  const permCount = (perms) => Object.values(perms).filter(Boolean).length;

  if (loading) return <div className="flex-1 flex items-center justify-center"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div>;

  const groups = {};
  ALL_PERMISSIONS.forEach(p => { if (!groups[p.group]) groups[p.group] = []; groups[p.group].push(p); });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShieldHalved className="text-[#c59d5f]" /> Roles & Permissions
          </h2>
          <p className="text-sm text-gray-500 mt-1">Define roles and control what each can access</p>
        </div>
        <button onClick={openNew} className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-[#1a454c] font-bold text-sm">
          <FaPlus className="w-4 h-4" /> New Role
        </button>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map(role => (
          <div key={role.$id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-900">{role.name}</h3>
                  {role.is_system && <span className="text-[10px] font-bold uppercase bg-[#c59d5f]/10 text-[#c59d5f] px-2 py-0.5 rounded-full">System</span>}
                </div>
                {role.description && <p className="text-sm text-gray-500 mt-1">{role.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(role)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaPen className="w-4 h-4" /></button>
                {!role.is_system && <button onClick={() => handleDelete(role)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash className="w-4 h-4" /></button>}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_PERMISSIONS.filter(p => role.permissions[p.key]).map(p => (
                <span key={p.key} className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">{p.label}</span>
              ))}
              <span className="text-[10px] font-bold text-gray-400 px-2 py-0.5">{permCount(role.permissions)}/{ALL_PERMISSIONS.length} permissions</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">{modal === 'add' ? 'New Role' : 'Edit Role'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><FaXmark className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Role Name</label>
                <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Senior Editor" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label>
                <input value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="What this role can do" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Permissions</label>
                {Object.entries(groups).map(([group, perms]) => (
                  <div key={group} className="mb-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{group}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {perms.map(p => (
                        <button key={p.key} onClick={() => togglePerm(p.key)} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${draft.permissions[p.key] ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}>
                          <span>{p.label}</span>
                          {draft.permissions[p.key] ? <FaCheck className="w-3.5 h-3.5 text-green-600" /> : <FaCircleXmark className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={saving || !draft.name} className="px-6 py-2 text-sm font-bold text-white bg-[#0f3036] hover:bg-[#1a454c] rounded-lg disabled:opacity-50 flex items-center gap-2">
                {saving && <FaSpinner className="animate-spin" />} Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
