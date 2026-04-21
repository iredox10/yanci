import { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaPencil, FaTrash, FaPlus, FaCopy, FaSquareCheck, FaSquare, FaEye, FaCalendarCheck, FaFileLines, FaCircleCheck, FaCircleDot } from 'react-icons/fa6';

const STATUS_META = {
  published:  { label: 'An Buga',         color: 'bg-green-50 text-green-700 border-green-200' },
  draft:      { label: 'Daftari',          color: 'bg-gray-50 text-gray-600 border-gray-200' },
  scheduled:  { label: 'Jadawalin Buga',  color: 'bg-blue-50 text-blue-700 border-blue-200' },
  review:     { label: 'Duba',             color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const PILLAR_COLOR = {
  news:      'bg-red-50 text-red-700 border-red-100',
  sport:     'bg-blue-50 text-blue-700 border-blue-100',
  opinion:   'bg-orange-50 text-orange-700 border-orange-100',
  culture:   'bg-purple-50 text-purple-700 border-purple-100',
  lifestyle: 'bg-yellow-50 text-yellow-700 border-yellow-100',
};

const AdminArticles = () => {
  const { articles, deleteArticle, updateArticle, addArticle } = useNews();
  const { user } = useAuth();
  const [selected, setSelected] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterReview, setFilterReview] = useState('all'); // all | pending | approved | rejected
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // Filter by user category
  const ownedArticles = user?.category
    ? articles.filter(a => a.pillar === user.category)
    : articles;

  // Filter by status tab
  let relevantArticles = filterStatus === 'all'
    ? ownedArticles
    : ownedArticles.filter(a => (a.status || 'published') === filterStatus);

  // Filter by review status
  if (filterReview !== 'all') {
    relevantArticles = relevantArticles.filter(a => (a.review_status || 'approved') === filterReview);
  }

  // Selection helpers
  const allSelected = relevantArticles.length > 0 && relevantArticles.every(a => selected.has(String(a.id)));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(relevantArticles.map(a => String(a.id))));
    }
  };
  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(String(id))) next.delete(String(id));
      else next.add(String(id));
      return next;
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Shin kana son share wannan labari?')) {
      deleteArticle(id);
      setSelected(prev => { const n = new Set(prev); n.delete(String(id)); return n; });
    }
  };

  const handleDuplicate = async (article) => {
    const { id, $id, $createdAt, $updatedAt, $permissions, ...rest } = article;
    const copy = {
      ...rest,
      headline: `[KWAFI] ${article.headline}`,
      status: 'draft',
      slug: '',
    };
    await addArticle(copy);
  };

  const applyBulkAction = async () => {
    if (!bulkAction || selected.size === 0) return;

    if (bulkAction === 'delete') {
      if (!confirmBulkDelete) {
        setConfirmBulkDelete(true);
        return;
      }
      for (const id of selected) {
        await deleteArticle(id);
      }
      setSelected(new Set());
      setConfirmBulkDelete(false);
    } else {
      // status change
      for (const id of selected) {
        await updateArticle(id, { status: bulkAction });
      }
      setSelected(new Set());
    }
    setBulkAction('');
  };

  const statusCounts = {
    all: ownedArticles.length,
    published: ownedArticles.filter(a => (a.status || 'published') === 'published').length,
    draft: ownedArticles.filter(a => (a.status || 'published') === 'draft').length,
    scheduled: ownedArticles.filter(a => (a.status || 'published') === 'scheduled').length,
    review: ownedArticles.filter(a => (a.status || 'published') === 'review').length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Labarai {user?.category && `(${user.category})`}
        </h2>
        <Link
          to="/admin/create"
          className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#1a454c] transition-colors font-bold text-sm w-full sm:w-auto"
        >
          <FaPlus className="w-4 h-4" /> Sabon Labari
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {[
          { key: 'all', label: 'Duka', icon: FaFileLines },
          { key: 'published', label: 'An Buga', icon: FaCircleCheck },
          { key: 'draft', label: 'Daftari', icon: FaCircleDot },
          { key: 'scheduled', label: 'Jadawalin', icon: FaCalendarCheck },
          { key: 'review', label: 'Duba', icon: FaEye },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setFilterStatus(key); setSelected(new Set()); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              filterStatus === key
                ? 'bg-[#0f3036] text-white border-[#0f3036]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              filterStatus === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {statusCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Review status filter */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs font-bold text-gray-500">Review:</span>
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterReview(key)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              filterReview === key
                ? key === 'pending' ? 'bg-amber-100 text-amber-800' : key === 'approved' ? 'bg-green-100 text-green-800' : key === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-[#0f3036] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
        {filterReview === 'pending' && (
          <span className="text-[10px] font-black text-amber-600 ml-1">
            {relevantArticles.length} need{relevantArticles.length !== 1 ? '' : 's'} review
          </span>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-[#0f3036]/5 border border-[#0f3036]/20 rounded-xl px-4 py-3">
          <span className="text-sm font-bold text-[#0f3036]">
            {selected.size} labari{selected.size > 1 ? 'i' : ''} an zaɓa
          </span>
          <div className="flex items-center gap-2 flex-1">
            <select
              value={bulkAction}
              onChange={e => { setBulkAction(e.target.value); setConfirmBulkDelete(false); }}
              className="text-xs p-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#c59d5f]"
            >
              <option value="">Zaɓi aikin...</option>
              <option value="published">→ An Buga</option>
              <option value="draft">→ Daftari</option>
              <option value="review">→ Duba</option>
              <option value="delete">🗑 Share Duka</option>
            </select>
            <button
              onClick={applyBulkAction}
              disabled={!bulkAction}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                confirmBulkDelete
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-[#0f3036] text-white hover:bg-[#1a454c] disabled:opacity-40'
              }`}
            >
              {confirmBulkDelete ? 'Tabbatar Share' : 'Aiwatar'}
            </button>
            {confirmBulkDelete && (
              <button
                onClick={() => setConfirmBulkDelete(false)}
                className="px-3 py-2 rounded-lg text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              >
                Soke
              </button>
            )}
          </div>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-gray-500 hover:text-gray-800 underline"
          >
            Soke zaɓin
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[750px]">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <button
                    onClick={toggleAll}
                    className="text-gray-400 hover:text-[#0f3036] transition-colors"
                    title={allSelected ? 'Cire zaɓin duka' : 'Zaɓi duka'}
                  >
                    {allSelected
                      ? <FaSquareCheck className="w-4 h-4 text-[#0f3036]" />
                      : <FaSquare className="w-4 h-4" />
                    }
                  </button>
                </th>
                <th className="p-4">Labari</th>
                <th className="p-4 w-28">Matsayi</th>
                <th className="p-4 w-28">Pillar</th>
                <th className="p-4 w-36 hidden md:table-cell">Kwanan Wata</th>
                <th className="p-4 text-right w-36">Ayyuka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {relevantArticles.map(article => {
                const status = article.status || 'published';
                const statusMeta = STATUS_META[status] || STATUS_META.published;
                const pillarColor = PILLAR_COLOR[article.pillar] || PILLAR_COLOR.news;
                const isSelected = selected.has(String(article.id));

                return (
                  <tr
                    key={article.id}
                    className={`hover:bg-gray-50 group transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="p-4">
                      <button
                        onClick={() => toggleOne(article.id)}
                        className="text-gray-400 hover:text-[#0f3036] transition-colors"
                      >
                        {isSelected
                          ? <FaSquareCheck className="w-4 h-4 text-[#0f3036]" />
                          : <FaSquare className="w-4 h-4" />
                        }
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {article.image && (
                          <img
                            src={article.image}
                            alt=""
                            className="w-10 h-10 md:w-12 md:h-12 rounded object-cover bg-gray-100 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 line-clamp-1">{article.headline}</p>
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{article.kicker}</p>
                          {article.slug && (
                            <p className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">/{article.slug}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${statusMeta.color}`}>
                        {statusMeta.label}
                      </span>
                      {status === 'scheduled' && article.publishAt && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(article.publishAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="p-4 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${pillarColor}`}>
                        {article.pillar}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell whitespace-nowrap">
                      {article.$createdAt
                        ? new Date(article.$createdAt).toLocaleDateString()
                        : new Date().toLocaleDateString()
                      }
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <Link
                          to={`/article/${article.id}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                          title="Duba labari"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(article)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                          title="Yi kwafi"
                        >
                          <FaCopy className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/admin/edit/${article.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Gyara"
                        >
                          <FaPencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Share"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {relevantArticles.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p className="font-medium">Ba a sami labari ba.</p>
            <p className="text-sm">Ƙirƙiri labari na farko don ganin shi a nan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticles;
