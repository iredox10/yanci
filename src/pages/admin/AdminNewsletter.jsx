import { useState, useEffect } from 'react';
import { FaNewspaper, FaEnvelope, FaTrash, FaMagnifyingGlass, FaSpinner, FaDownload, FaEye, FaChartLine } from 'react-icons/fa6';

const STORAGE_KEY = 'yanci_newsletter_subscribers';

// Generate some sample subscribers
const sampleSubscribers = [
  { id: 1, email: 'musa@example.com', subscribedAt: '2025-01-15T10:30:00Z', status: 'active', opens: 24 },
  { id: 2, email: 'aisha@example.com', subscribedAt: '2025-02-20T14:15:00Z', status: 'active', opens: 18 },
  { id: 3, email: 'ibrahim@example.com', subscribedAt: '2025-03-05T09:00:00Z', status: 'active', opens: 31 },
  { id: 4, email: 'fatima@example.com', subscribedAt: '2025-03-10T16:45:00Z', status: 'unsubscribed', opens: 5 },
  { id: 5, email: 'abdullahi@example.com', subscribedAt: '2025-03-22T11:20:00Z', status: 'active', opens: 12 },
];

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : sampleSubscribers;
  });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(new Set());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
  }, [subscribers]);

  const filtered = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const totalCount = subscribers.length;
  const totalOpens = subscribers.reduce((sum, s) => sum + (s.opens || 0), 0);

  const handleDelete = (id) => {
    if (window.confirm('Share wannan subscriber?')) {
      setSubscribers(prev => prev.filter(s => s.id !== id));
      setSelected(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  const handleBulkDelete = () => {
    if (selected.size === 0 || !window.confirm(`Share ${selected.size} subscribers?`)) return;
    setSubscribers(prev => prev.filter(s => !selected.has(s.id)));
    setSelected(new Set());
  };

  const handleToggleStatus = (id) => {
    setSubscribers(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === 'active' ? 'unsubscribed' : 'active' } : s
    ));
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      const csv = [
        'Email,Status,Subscribed At,Opens',
        ...subscribers.map(s => `${s.email},${s.status},${s.subscribedAt},${s.opens}`),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'yanci_newsletter_subscribers.csv';
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
    }, 500);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(s => s.id)));
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaNewspaper className="text-[#c59d5f]" /> Newsletter Subscribers
          </h2>
          <p className="text-sm text-gray-500 mt-1">Gudanar da masu rijistar wasiku na Yanci</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || subscribers.length === 0}
          className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-[#1a454c] font-bold text-sm disabled:opacity-50"
        >
          {exporting ? <FaSpinner className="animate-spin w-4 h-4" /> : <FaDownload className="w-4 h-4" />}
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaEnvelope className="text-blue-600" /></div>
            <span className="text-sm text-gray-500 font-medium">Total Subscribers</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{totalCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaChartLine className="text-green-600" /></div>
            <span className="text-sm text-gray-500 font-medium">Active</span>
          </div>
          <p className="text-3xl font-black text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><FaEye className="text-purple-600" /></div>
            <span className="text-sm text-gray-500 font-medium">Total Opens</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{totalOpens.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Nema subscriber..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c59d5f] text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'unsubscribed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-[#0f3036] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="bg-[#0f3036] text-white p-3 rounded-lg flex items-center justify-between">
          <span className="text-sm font-bold">{selected.size} selected</span>
          <button onClick={handleBulkDelete} className="text-red-300 hover:text-red-100 text-sm font-bold flex items-center gap-2">
            <FaTrash className="w-3 h-3" /> Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Subscribed</th>
                <th className="p-3 text-center">Opens</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(sub => (
                <tr key={sub.id} className={`hover:bg-gray-50 ${selected.has(sub.id) ? 'bg-blue-50' : ''}`}>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(sub.id)}
                      onChange={() => {
                        setSelected(prev => {
                          const next = new Set(prev);
                          if (next.has(sub.id)) next.delete(sub.id);
                          else next.add(sub.id);
                          return next;
                        });
                      }}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-900">{sub.email}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3 text-center text-gray-500">{formatDate(sub.subscribedAt)}</td>
                  <td className="p-3 text-center font-bold">{sub.opens || 0}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => handleToggleStatus(sub.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Toggle Status">
                        {sub.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400">
                    <FaEnvelope className="mx-auto text-3xl mb-2 opacity-30" />
                    Babu subscribers a wannan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;
