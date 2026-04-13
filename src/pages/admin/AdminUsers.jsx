import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appwriteService } from '../../lib/appwrite';
import {
  FaUsers, FaEnvelope, FaPlus, FaTrash, FaXmark, FaSpinner, FaCheck,
  FaCopy, FaLink, FaShieldHalved, FaClock, FaBan, FaCircleInfo,
} from 'react-icons/fa6';

const ROLES = [
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'news', label: 'News Editor' },
  { value: 'sport', label: 'Sports Editor' },
  { value: 'opinion', label: 'Opinion Editor' },
  { value: 'culture', label: 'Culture Editor' },
  { value: 'lifestyle', label: 'Lifestyle Editor' },
];

const AdminUsers = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', role: 'news' });
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => { loadInvitations(); }, []);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const docs = await appwriteService.getInvitations();
      setInvitations(docs.map(d => ({ ...d, labels: typeof d.labels === 'string' ? d.labels.split(',').filter(Boolean) : d.labels || [] })));
    } catch (e) { console.error('Failed to load invitations:', e); }
    finally { setLoading(false); }
  };

  const generateToken = () => {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleInvite = async () => {
    if (!form.email || !form.name) return alert('Email and name are required');
    setSending(true);
    try {
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await appwriteService.createInvitation({
        email: form.email,
        name: form.name,
        token,
        role: form.role,
        labels: 'superadmin,' + form.role,
        invited_by: user?.id || 'unknown',
        status: 'pending',
        expires_at: expiresAt,
      });
      setForm({ email: '', name: '', role: 'news' });
      setModal(false);
      await loadInvitations();
    } catch (e) {
      alert('Failed to send invite: ' + e.message);
    } finally {
      setSending(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Revoke this invitation?')) return;
    try {
      await appwriteService.updateInvitation(id, { status: 'revoked' });
      await loadInvitations();
    } catch (e) { alert('Failed to revoke'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invitation permanently?')) return;
    try {
      await appwriteService.deleteInvitation(id);
      await loadInvitations();
    } catch (e) { alert('Failed to delete'); }
  };

  const copyLink = (token) => {
    const url = window.location.origin + '/register?token=' + token;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const isExpired = (inv) => {
    if (inv.status !== 'pending') return false;
    return inv.expires_at && new Date(inv.expires_at) < new Date();
  };

  const statusBadge = (inv) => {
    if (inv.status === 'accepted') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700"><FaCheck className="w-2.5 h-2.5" /> Accepted</span>;
    if (inv.status === 'revoked') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500"><FaBan className="w-2.5 h-2.5" /> Revoked</span>;
    if (isExpired(inv)) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700"><FaClock className="w-2.5 h-2.5" /> Expired</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700"><FaClock className="w-2.5 h-2.5" /> Pending</span>;
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div>;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-[#c59d5f]" /> User Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Invite new admins and manage pending invitations</p>
        </div>
        <button onClick={() => setModal(true)} className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-[#1a454c] font-bold text-sm">
          <FaPlus className="w-4 h-4" /> Invite User
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <FaCircleInfo className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-blue-900 mb-1">How Invitations Work</h4>
            <p className="text-sm text-blue-800">
              Generate an invite link and share it with the new admin. They'll register with their own password and automatically receive the role you assign. Links expire after 7 days.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-bold text-sm text-gray-700">Invitations ({invitations.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {invitations.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <FaEnvelope className="mx-auto text-3xl mb-2 opacity-30" />
              <p className="text-sm">No invitations yet. Click "Invite User" to add a new admin.</p>
            </div>
          )}
          {invitations.map(inv => (
            <div key={inv.$id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm text-gray-900 truncate">{inv.name}</p>
                  {statusBadge(inv)}
                </div>
                <p className="text-xs text-gray-500 truncate">{inv.email}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(inv.labels || []).filter(l => l !== 'superadmin').map(l => (
                    <span key={l} className="text-[10px] font-bold bg-[#0f3036]/10 text-[#0f3036] px-1.5 py-0.5 rounded">{l}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {inv.status === 'pending' && !isExpired(inv) && (
                  <>
                    <button onClick={() => copyLink(inv.token)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Copy Invite Link">
                      {copied === inv.token ? <FaCheck className="w-3.5 h-3.5" /> : <FaLink className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleRevoke(inv.$id)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" title="Revoke">
                      <FaBan className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(inv.$id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg flex items-center gap-2"><FaEnvelope className="text-[#c59d5f]" /> Invite New Admin</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FaXmark className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Amina Yusuf" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="amina@yanci.ng" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none bg-white">
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleInvite} disabled={sending || !form.email || !form.name} className="px-6 py-2 text-sm font-bold text-white bg-[#0f3036] hover:bg-[#1a454c] rounded-lg disabled:opacity-50 flex items-center gap-2">
                {sending && <FaSpinner className="animate-spin" />} Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
