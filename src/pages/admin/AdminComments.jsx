import { useState, useEffect } from 'react';
import { FaComment, FaTrash, FaCheck, FaBan, FaMagnifyingGlass, FaArrowUp, FaArrowDown, FaEye, FaSpinner } from 'react-icons/fa6';

const STORAGE_KEY = 'yanci_comments';

const sampleComments = [
  { id: 1, articleId: 1, articleTitle: 'Majalisa ta amince da dokar tsare bayanan dijital', author: 'Musa Abdullahi', email: 'musa@example.com', text: 'Wannan doka tana da muhimmanci sosai. Allah ya taimaka.', status: 'approved', date: '2025-03-20T10:30:00Z', upvotes: 12 },
  { id: 2, articleId: 1, articleTitle: 'Majalisa ta amince da dokar tsare bayanan dijital', author: 'Aisha Ibrahim', email: 'aisha@example.com', text: 'Ina tsammanin za a iya yin mafi kyau a fagen kare bayanan masu amfani.', status: 'pending', date: '2025-03-21T14:15:00Z', upvotes: 5 },
  { id: 3, articleId: 5, articleTitle: 'Super Eagles squad announcement', author: 'Fatima Yusuf', email: 'fatima@example.com', text: 'Na yi farin cikin ganin sunayen sabbin \'yan wasan.', status: 'approved', date: '2025-03-22T09:00:00Z', upvotes: 8 },
  { id: 4, articleId: 7, articleTitle: 'Yadda siyasar kula da bayanai ke tsare martabar dimokuradiyya', author: 'Anonymous', email: '', text: 'This is spam content that should be removed.', status: 'rejected', date: '2025-03-23T16:45:00Z', upvotes: 0 },
];

const AdminComments = () => {
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : sampleComments;
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [bulkActioning, setBulkActioning] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const filtered = comments.filter(c => {
    const matchesSearch = c.text.toLowerCase().includes(search.toLowerCase()) ||
                          c.author.toLowerCase().includes(search.toLowerCase()) ||
                          c.articleTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = comments.filter(c => c.status === 'pending').length;
  const approvedCount = comments.filter(c => c.status === 'approved').length;
  const rejectedCount = comments.filter(c => c.status === 'rejected').length;

  const handleApprove = (id) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const handleReject = (id) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
  };

  const handleDelete = (id) => {
    if (window.confirm('Share wannan sharhi?')) {
      setComments(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selected.size === 0) return;
    setBulkActioning(true);
    setTimeout(() => {
      setComments(prev => prev.map(c => {
        if (selected.has(c.id)) {
          if (action === 'approve') return { ...c, status: 'approved' };
          if (action === 'reject') return { ...c, status: 'rejected' };
          if (action === 'delete') return null;
        }
        return c;
      }).filter(Boolean));
      setSelected(new Set());
      setBulkActioning(false);
    }, 300);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(c => c.id)));
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const statusColors = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaComment className="text-[#c59d5f]" /> Comment Moderation
          </h2>
          <p className="text-sm text-gray-500 mt-1">Gudanar da sharhohin masu karatu</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-black text-gray-900">{comments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-black text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-black text-green-600">{approvedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-black text-red-600">{rejectedCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Nema sharhi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c59d5f] text-sm"
          />
        </div>
        {['all', 'pending', 'approved', 'rejected'].map(status => (
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

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="bg-[#0f3036] text-white p-3 rounded-lg flex items-center justify-between">
          <span className="text-sm font-bold">{selected.size} selected</span>
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction('approve')} disabled={bulkActioning} className="text-green-300 hover:text-green-100 text-xs font-bold flex items-center gap-1">
              <FaCheck className="w-3 h-3" /> Approve
            </button>
            <button onClick={() => handleBulkAction('reject')} disabled={bulkActioning} className="text-yellow-300 hover:text-yellow-100 text-xs font-bold flex items-center gap-1">
              <FaBan className="w-3 h-3" /> Reject
            </button>
            <button onClick={() => handleBulkAction('delete')} disabled={bulkActioning} className="text-red-300 hover:text-red-100 text-xs font-bold flex items-center gap-1">
              <FaTrash className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {filtered.map(comment => (
          <div key={comment.id} className={`bg-white rounded-xl border shadow-sm p-5 ${
            comment.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' :
            comment.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Checkbox + Author */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selected.has(comment.id)}
                    onChange={() => {
                      setSelected(prev => {
                        const next = new Set(prev);
                        if (next.has(comment.id)) next.delete(comment.id);
                        else next.add(comment.id);
                        return next;
                      });
                    }}
                    className="w-4 h-4"
                  />
                  <span className="font-bold text-sm text-gray-900">{comment.author}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[comment.status]}`}>
                    {comment.status}
                  </span>
                  {comment.status === 'pending' && (
                    <span className="flex items-center gap-1 text-xs text-yellow-600 font-bold">
                      <FaEye className="w-3 h-3" /> Needs Review
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-sm text-gray-700 mb-2 leading-relaxed line-clamp-2">{comment.text}</p>

                {/* Article + Date */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-medium">On: {comment.articleTitle}</span>
                  <span>•</span>
                  <span>{formatDate(comment.date)}</span>
                  <span>•</span>
                  <span>👍 {comment.upvotes} upvotes</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1 shrink-0">
                {comment.status !== 'approved' && (
                  <button onClick={() => handleApprove(comment.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                    <FaCheck className="w-4 h-4" />
                  </button>
                )}
                {comment.status !== 'rejected' && (
                  <button onClick={() => handleReject(comment.id)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Reject">
                    <FaBan className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(comment.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
            <FaComment className="mx-auto text-4xl mb-2 opacity-30" />
            Babu comments a wannan filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;
