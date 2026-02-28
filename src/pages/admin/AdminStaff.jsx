import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SEED_STAFF } from '../../context/AuthContext';
import { useNews } from '../../context/NewsContext';
import {
  FaUserPlus, FaTrash, FaShieldHalved, FaEnvelope, FaPencil,
  FaLock, FaCircleCheck, FaCircleXmark, FaMugHot, FaTableList,
  FaXmark, FaChevronDown, FaChevronUp, FaKey, FaUser, FaUserShield,
} from 'react-icons/fa6';

// ─── Constants ─────────────────────────────────────────────────────────────────

const PILLARS = [
  { value: 'news',      label: 'Labarai & Siyasa' },
  { value: 'sport',     label: 'Wasanni' },
  { value: 'opinion',   label: "Ra'ayi" },
  { value: 'culture',   label: "Al'adu" },
  { value: 'lifestyle', label: 'Kasuwanci & Rayuwa' },
];

const PILLAR_COLOR = {
  news:      'bg-red-50 text-red-700 border-red-100',
  sport:     'bg-blue-50 text-blue-700 border-blue-100',
  opinion:   'bg-orange-50 text-orange-700 border-orange-100',
  culture:   'bg-purple-50 text-purple-700 border-purple-100',
  lifestyle: 'bg-yellow-50 text-yellow-700 border-yellow-100',
};

const ROLE_META = {
  super_admin: { label: 'Super Admin', color: 'bg-[#0f3036]/10 text-[#0f3036] border-[#0f3036]/20' },
  editor:      { label: 'Edita',       color: 'bg-blue-50 text-blue-700 border-blue-100' },
};

const STATUS_META = {
  active:     { label: 'Mai Aiki',  color: 'bg-green-50 text-green-700 border-green-100',  icon: FaCircleCheck },
  on_leave:   { label: 'Hutawa',    color: 'bg-yellow-50 text-yellow-700 border-yellow-100', icon: FaMugHot },
  suspended:  { label: 'Dakatar',   color: 'bg-red-50 text-red-700 border-red-100',         icon: FaCircleXmark },
};

const PERMISSIONS = [
  { action: 'Karanta labarai duka',         super_admin: true,  editor: true  },
  { action: 'Ƙirƙiri labari',              super_admin: true,  editor: true  },
  { action: 'Gyara labarin kansa',         super_admin: true,  editor: true  },
  { action: 'Buga labari',                 super_admin: true,  editor: true  },
  { action: 'Gyara labarin wani',          super_admin: true,  editor: false },
  { action: 'Share labari',               super_admin: true,  editor: false },
  { action: 'Sarrafa ma\'aikatan redaksha',super_admin: true,  editor: false },
  { action: 'Duba rahoton ayyuka',         super_admin: true,  editor: false },
  { action: 'Saita jadawalin buga',        super_admin: true,  editor: true  },
  { action: 'Aika labari don duba',        super_admin: true,  editor: true  },
];

const SEED_IDS = new Set(SEED_STAFF.map(s => s.id));

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ha', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatRelative(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Yanzu';
  if (mins < 60) return `Minti ${mins} da suka wuce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Awa ${hrs} da suka wuce`;
  const days = Math.floor(hrs / 24);
  return `Kwana ${days} da suka wuce`;
}

// ─── Empty form state ──────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', email: '', role: 'editor', category: 'news', pin: '', status: 'active' };

// ─── Modal ─────────────────────────────────────────────────────────────────────

const StaffModal = ({ mode, initial, onClose, onSave, isSeed }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Sunana wajibi ne';
    if (!form.email.trim()) e.email = 'Imel wajibi ne';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Imel ba daidai ba ce';
    if (form.pin && !/^\d{4}$/.test(form.pin)) e.pin = 'PIN dole lamba 4 ce';
    if (form.role === 'editor' && !form.category) e.category = 'Zaɓi rukunin';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0f3036]/10 rounded-full flex items-center justify-center">
              {mode === 'add' ? <FaUserPlus className="text-[#0f3036] w-4 h-4" /> : <FaPencil className="text-[#0f3036] w-4 h-4" />}
            </div>
            <h3 className="text-base font-bold text-[#0f3036]">
              {mode === 'add' ? 'Ƙara Ma\'aikaci' : "Gyara Ma'aikaci"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaXmark className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Cikakken Suna <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Amina Yusuf"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c59d5f] transition ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Adireshin Imel <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="amina@yanci.ng"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c59d5f] transition ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Matsayi</label>
            <select
              value={form.role}
              onChange={e => set('role', e.target.value)}
              disabled={isSeed}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c59d5f] transition disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="editor">Edita</option>
              <option value="super_admin">Super Admin</option>
            </select>
            {isSeed && <p className="text-gray-400 text-xs mt-1">Ba za a iya canza matsayin asusu na asali ba.</p>}
          </div>

          {/* Category — only for editors */}
          {form.role === 'editor' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Rukunin Labarai <span className="text-red-500">*</span></label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                disabled={isSeed}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c59d5f] transition disabled:bg-gray-50 disabled:text-gray-400 ${errors.category ? 'border-red-400' : 'border-gray-200'}`}
              >
                {PILLARS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          )}

          {/* PIN */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              <FaKey className="inline w-3 h-3 mr-1 text-[#c59d5f]" />
              PIN (Lamba 4) — {mode === 'edit' ? 'Bar wofi don kiyaye PIN da ke akwai' : 'Zaɓi ne (Optional)'}
            </label>
            <input
              type="password"
              value={form.pin}
              onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c59d5f] tracking-widest transition ${errors.pin ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Yanayin Asusu</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(STATUS_META).map(([val, meta]) => {
                const Icon = meta.icon;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => set('status', val)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                      form.status === val
                        ? meta.color + ' ring-2 ring-offset-1 ring-current'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Soke
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#0f3036] text-white text-sm font-bold hover:bg-[#1a4a52] transition-colors"
            >
              {mode === 'add' ? "Ƙara Ma'aikaci" : 'Adana Canje-canje'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete confirmation modal ─────────────────────────────────────────────────

const DeleteModal = ({ member, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaTrash className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">Cire Ma'aikaci?</h3>
      <p className="text-sm text-gray-500 mb-6">
        Za a cire <strong>{member.name}</strong> daga tsarin. Ba za a iya maido da wannan ba.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Soke
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
        >
          Ee, Cire
        </button>
      </div>
    </div>
  </div>
);

// ─── Permissions matrix panel ──────────────────────────────────────────────────

const PermissionsMatrix = ({ open, onToggle }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#c59d5f]/10 rounded-full flex items-center justify-center">
          <FaTableList className="text-[#c59d5f] w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0f3036]">Jadawalin Izini</p>
          <p className="text-xs text-gray-500">Duba abin da kowane matsayi zai iya yi</p>
        </div>
      </div>
      {open ? <FaChevronUp className="text-gray-400 w-4 h-4" /> : <FaChevronDown className="text-gray-400 w-4 h-4" />}
    </button>

    {open && (
      <div className="border-t border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 w-2/3">Aiki</th>
              <th className="px-5 py-3 text-center text-xs font-bold text-[#0f3036]">
                <div className="flex items-center justify-center gap-1">
                  <FaUserShield className="w-3 h-3" /> Super Admin
                </div>
              </th>
              <th className="px-5 py-3 text-center text-xs font-bold text-blue-700">
                <div className="flex items-center justify-center gap-1">
                  <FaUser className="w-3 h-3" /> Edita
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PERMISSIONS.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-2.5 text-gray-700 text-xs">{row.action}</td>
                <td className="px-5 py-2.5 text-center">
                  {row.super_admin
                    ? <FaCircleCheck className="w-4 h-4 text-green-500 mx-auto" />
                    : <FaCircleXmark className="w-4 h-4 text-gray-300 mx-auto" />}
                </td>
                <td className="px-5 py-2.5 text-center">
                  {row.editor
                    ? <FaCircleCheck className="w-4 h-4 text-green-500 mx-auto" />
                    : <FaCircleXmark className="w-4 h-4 text-gray-300 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────

const AdminStaff = () => {
  const { user, staffList, addStaffMember, updateStaffMember, removeStaffMember } = useAuth();
  const { articles } = useNews();
  const navigate = useNavigate();

  const [modal, setModal] = useState(null); // null | 'add' | { mode: 'edit', member } | { mode: 'delete', member }
  const [permOpen, setPermOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  // Guard
  if (!user || user.role !== 'super_admin') {
    navigate('/admin');
    return null;
  }

  // Article counts per staff id
  const articleCounts = useMemo(() => {
    const counts = {};
    for (const a of articles) {
      if (a.author) {
        counts[a.author] = (counts[a.author] || 0) + 1;
      }
    }
    return counts;
  }, [articles]);

  // Filtered staff
  const filtered = useMemo(() => {
    return staffList.filter(m => {
      if (filterStatus !== 'all' && (m.status || 'active') !== filterStatus) return false;
      if (filterRole !== 'all' && m.role !== filterRole) return false;
      return true;
    });
  }, [staffList, filterStatus, filterRole]);

  const counts = useMemo(() => ({
    total: staffList.length,
    active: staffList.filter(m => (m.status || 'active') === 'active').length,
    on_leave: staffList.filter(m => m.status === 'on_leave').length,
    suspended: staffList.filter(m => m.status === 'suspended').length,
  }), [staffList]);

  // Add
  const handleAdd = (form) => {
    addStaffMember(form);
    setModal(null);
  };

  // Edit
  const handleEdit = (form) => {
    const { mode: _m, member } = modal;
    const update = { ...form };
    // Only update PIN if new one was entered
    if (!update.pin) delete update.pin;
    updateStaffMember(member.id, update);
    setModal(null);
  };

  // Status toggle
  const cycleStatus = (member) => {
    const cycle = { active: 'on_leave', on_leave: 'suspended', suspended: 'active' };
    updateStaffMember(member.id, { status: cycle[member.status || 'active'] });
  };

  // Delete
  const handleDelete = () => {
    if (!modal?.member) return;
    removeStaffMember(modal.member.id);
    setModal(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0f3036]">Ma'aikatan Redaksha</h2>
          <p className="text-sm text-gray-500">Sarrafa ƙungiyar edita da izinin su</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="bg-[#0f3036] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1a4a52] transition-colors font-bold text-sm w-full sm:w-auto"
        >
          <FaUserPlus className="w-4 h-4" /> Ƙara Ma'aikaci
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Ma\'aikatan duka', value: counts.total,     color: 'bg-[#0f3036]/5  text-[#0f3036]' },
          { label: 'Masu aiki',         value: counts.active,    color: 'bg-green-50    text-green-700' },
          { label: 'Cikin hutawa',       value: counts.on_leave,  color: 'bg-yellow-50   text-yellow-700' },
          { label: 'An dakatar',         value: counts.suspended, color: 'bg-red-50      text-red-700' },
        ].map(c => (
          <div key={c.label} className={`rounded-xl px-4 py-3.5 ${c.color} border border-current/10`}>
            <p className="text-2xl font-black">{c.value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-70">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Status filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1 py-1 flex-wrap">
          {[
            { val: 'all',      label: 'Duka' },
            { val: 'active',   label: 'Masu Aiki' },
            { val: 'on_leave', label: 'Hutawa' },
            { val: 'suspended',label: 'Dakatar' },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFilterStatus(f.val)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                filterStatus === f.val
                  ? 'bg-[#0f3036] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1 py-1">
          {[
            { val: 'all',        label: 'Duk Matsayi' },
            { val: 'super_admin',label: 'Super Admin' },
            { val: 'editor',     label: 'Edita' },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFilterRole(f.val)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                filterRole === f.val
                  ? 'bg-[#0f3036] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ma'aikaci</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Matsayi</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rukuni</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Yanayi</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ƙarshen Ziyara</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell text-center">Labarai</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Ayyuka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                    Ba a sami ma'aikaci ba da waɗannan tace.
                  </td>
                </tr>
              )}
              {filtered.map(member => {
                const roleMeta = ROLE_META[member.role] || ROLE_META.editor;
                const statusMeta = STATUS_META[member.status || 'active'] || STATUS_META.active;
                const StatusIcon = statusMeta.icon;
                const pillarColor = PILLAR_COLOR[member.category] || '';
                const pillarLabel = PILLARS.find(p => p.value === member.category)?.label;
                const isSeed = SEED_IDS.has(member.id);
                const articleCount = articleCounts[member.id] || 0;
                const hasPin = !!member.pin;

                return (
                  <tr key={member.id} className="hover:bg-gray-50/60 transition-colors group">
                    {/* Name + email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#c59d5f]/15 text-[#c59d5f] flex items-center justify-center font-black text-xs shrink-0 border border-[#c59d5f]/20">
                          {getInitials(member.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#0f3036] text-sm truncate">{member.name}</span>
                            {hasPin && (
                              <FaLock className="w-2.5 h-2.5 text-[#c59d5f] shrink-0" title="Yana da PIN" />
                            )}
                          </div>
                          <div className="text-gray-400 text-[11px] flex items-center gap-1 truncate mt-0.5">
                            <FaEnvelope className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleMeta.color}`}>
                        <FaShieldHalved className="w-2.5 h-2.5" />
                        {roleMeta.label}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      {pillarLabel
                        ? <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${pillarColor}`}>{pillarLabel}</span>
                        : <span className="text-gray-300 text-xs">—</span>
                      }
                    </td>

                    {/* Status — clickable to cycle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => cycleStatus(member)}
                        title="Danna don canza yanayi"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-opacity hover:opacity-70 ${statusMeta.color}`}
                      >
                        <StatusIcon className="w-2.5 h-2.5" />
                        {statusMeta.label}
                      </button>
                    </td>

                    {/* Last active */}
                    <td className="px-5 py-4 text-gray-400 text-xs hidden lg:table-cell whitespace-nowrap">
                      {formatRelative(member.lastActive)}
                    </td>

                    {/* Article count */}
                    <td className="px-5 py-4 hidden md:table-cell text-center">
                      <span className={`text-sm font-bold ${articleCount > 0 ? 'text-[#0f3036]' : 'text-gray-300'}`}>
                        {articleCount}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModal({ mode: 'edit', member })}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Gyara"
                        >
                          <FaPencil className="w-3.5 h-3.5" />
                        </button>
                        {!isSeed && (
                          <button
                            onClick={() => setModal({ mode: 'delete', member })}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Cire"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions matrix */}
      <PermissionsMatrix open={permOpen} onToggle={() => setPermOpen(v => !v)} />

      {/* Modals */}
      {modal?.mode === 'add' && (
        <StaffModal
          mode="add"
          initial={EMPTY_FORM}
          onClose={() => setModal(null)}
          onSave={handleAdd}
          isSeed={false}
        />
      )}
      {modal?.mode === 'edit' && (
        <StaffModal
          mode="edit"
          initial={{ ...modal.member, pin: '' }}
          onClose={() => setModal(null)}
          onSave={handleEdit}
          isSeed={SEED_IDS.has(modal.member.id)}
        />
      )}
      {modal?.mode === 'delete' && (
        <DeleteModal
          member={modal.member}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminStaff;
