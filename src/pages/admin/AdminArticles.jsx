import { useState, useMemo, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FaPencil, FaTrash, FaPlus, FaCopy, FaSquareCheck, FaSquare, FaEye,
  FaCalendarCheck, FaFileLines, FaCircleCheck, FaCircleDot, FaMagnifyingGlass,
  FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown, FaArrowUpZA,
  FaArrowDownAZ, FaArrowUpWideShort, FaArrowDownShortWide, FaArrowUp19,
  FaSort, FaUser, FaTag, FaRotateLeft, FaBolt,
} from 'react-icons/fa6';
import { appwriteService } from '../../lib/appwrite';

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

const FORMAT_META = {
  breaking:  { label: 'Breaking', color: 'bg-red-100 text-red-800 border-red-200', icon: FaBolt },
  news:      { label: 'Labarai',  color: 'bg-gray-100 text-gray-700 border-gray-200' },
  feature:   { label: 'Feature',  color: 'bg-purple-50 text-purple-700 border-purple-200' },
  opinion:   { label: "Ra'ayi",   color: 'bg-orange-50 text-orange-700 border-orange-200' },
  analysis:  { label: 'Nazari',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  interview: { label: 'Hira',     color: 'bg-teal-50 text-teal-700 border-teal-200' },
  explainer: { label: 'Bayani',   color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  review:    { label: 'Duba',     color: 'bg-pink-50 text-pink-700 border-pink-200' },
};

const ITEMS_PER_PAGE = 20;

const AdminArticles = () => {
  const { articles, deleteArticle, updateArticle, addArticle } = useNews();
  const { user } = useAuth();
  const [selected, setSelected] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterReview, setFilterReview] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState('$createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Pagination
  const [page, setPage] = useState(1);

  // View counts
  const [viewCounts, setViewCounts] = useState({});

  useEffect(() => {
    const loadViews = async () => {
      try {
        const mostRead = await appwriteService.getMostReadArticles(1000);
        const counts = {};
        mostRead.forEach(({ articleId, views }) => { counts[articleId] = views; });
        setViewCounts(counts);
      } catch {}
    };
    loadViews();
  }, []);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [filterStatus, filterReview, searchQuery, filterAuthor, filterSection, filterFormat, dateFrom, dateTo]);

  // Filter by user category
  const ownedArticles = useMemo(() => {
    if (user?.category) return articles.filter(a => a.pillar === user.category);
    return articles;
  }, [articles, user?.category]);

  // Get unique authors and sections for filter dropdowns
  const authors = useMemo(() => {
    const set = new Set();
    ownedArticles.forEach(a => { if (a.author) set.add(a.author); });
    return Array.from(set).sort();
  }, [ownedArticles]);

  const sections = useMemo(() => {
    const set = new Set();
    ownedArticles.forEach(a => { if (a.section) set.add(a.section); });
    return Array.from(set).sort();
  }, [ownedArticles]);

  // Apply all filters
  let filtered = useMemo(() => {
    let result = ownedArticles;

    if (filterStatus !== 'all') {
      result = result.filter(a => (a.status || 'published') === filterStatus);
    }
    if (filterReview !== 'all') {
      result = result.filter(a => (a.review_status || 'approved') === filterReview);
    }
    if (filterAuthor !== 'all') {
      result = result.filter(a => a.author === filterAuthor);
    }
    if (filterSection !== 'all') {
      result = result.filter(a => a.section === filterSection);
    }
    if (filterFormat !== 'all') {
      result = result.filter(a => a.format === filterFormat);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        (a.headline || '').toLowerCase().includes(q) ||
        (a.trail || '').toLowerCase().includes(q) ||
        (a.tags || '').toLowerCase().includes(q) ||
        (a.author || '').toLowerCase().includes(q)
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter(a => {
        const d = a.$createdAt ? new Date(a.$createdAt).getTime() : null;
        return d && d >= from;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo + 'T23:59:59').getTime();
      result = result.filter(a => {
        const d = a.$createdAt ? new Date(a.$createdAt).getTime() : null;
        return d && d <= to;
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'headline':
          aVal = (a.headline || '').toLowerCase();
          bVal = (b.headline || '').toLowerCase();
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case 'status':
          aVal = a.status || 'published';
          bVal = b.status || 'published';
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case 'views':
          aVal = viewCounts[a.$id || a.id] || 0;
          bVal = viewCounts[b.$id || b.id] || 0;
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        case 'author':
          aVal = a.author || '';
          bVal = b.author || '';
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        default: // $createdAt
          aVal = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
          bVal = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });

    return result;
  }, [ownedArticles, filterStatus, filterReview, filterAuthor, filterSection, filterFormat, searchQuery, dateFrom, dateTo, sortField, sortDir, viewCounts]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedArticles = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort className="w-3 h-3 text-gray-300 ml-1" />;
    return sortDir === 'asc' ? <FaChevronUp className="w-3 h-3 text-[#0f3036] ml-1" /> : <FaChevronDown className="w-3 h-3 text-[#0f3036] ml-1" />;
  };

  // Selection
  const allSelected = paginatedArticles.length > 0 && paginatedArticles.every(a => selected.has(String(a.id)));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginatedArticles.map(a => String(a.id))));
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
    const copy = { ...rest, headline: `[KWAFI] ${article.headline}`, status: 'draft', slug: '' };
    await addArticle(copy);
  };

  const handleQuickStatus = async (article, newStatus) => {
    await updateArticle(article.id || article.$id, { status: newStatus });
  };

  const applyBulkAction = async () => {
    if (!bulkAction || selected.size === 0) return;
    if (bulkAction === 'delete') {
      if (!confirmBulkDelete) { setConfirmBulkDelete(true); return; }
      for (const id of selected) await deleteArticle(id);
      setSelected(new Set());
      setConfirmBulkDelete(false);
    } else {
      for (const id of selected) await updateArticle(id, { status: bulkAction });
      setSelected(new Set());
    }
    setBulkAction('');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterAuthor('all');
    setFilterSection('all');
    setFilterFormat('all');
    setDateFrom('');
    setDateTo('');
    setFilterStatus('all');
    setFilterReview('all');
  };

  const hasActiveFilters = searchQuery || filterAuthor !== 'all' || filterSection !== 'all' || filterFormat !== 'all' || dateFrom || dateTo;

  const statusCounts = {
    all: ownedArticles.length,
    published: ownedArticles.filter(a => (a.status || 'published') === 'published').length,
    draft: ownedArticles.filter(a => (a.status || 'published') === 'draft').length,
    scheduled: ownedArticles.filter(a => (a.status || 'published') === 'scheduled').length,
    review: ownedArticles.filter(a => (a.status || 'published') === 'review').length,
  };

  const formatViews = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Labarai {user?.category && `(${user.category})`}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} article{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
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
      <div className="flex flex-wrap items-center gap-2">
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

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
            hasActiveFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <FaMagnifyingGlass className="w-2.5 h-2.5" />
          Filters {hasActiveFilters && `(${[searchQuery, filterAuthor !== 'all', filterSection !== 'all', filterFormat !== 'all', dateFrom, dateTo].filter(Boolean).length})`}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-full flex items-center gap-1">
            <FaRotateLeft className="w-2.5 h-2.5" /> Clear
          </button>
        )}
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#c59d5f] outline-none"
            />
          </div>
          <select value={filterAuthor} onChange={e => setFilterAuthor(e.target.value)} className="text-xs p-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#c59d5f] outline-none">
            <option value="all">All Authors</option>
            {authors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filterSection} onChange={e => setFilterSection(e.target.value)} className="text-xs p-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#c59d5f] outline-none">
            <option value="all">All Sections</option>
            {sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterFormat} onChange={e => setFilterFormat(e.target.value)} className="text-xs p-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#c59d5f] outline-none">
            <option value="all">All Formats</option>
            {Object.entries(FORMAT_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs p-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#c59d5f] outline-none" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs p-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#c59d5f] outline-none" />
        </div>
      )}

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
                confirmBulkDelete ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#0f3036] text-white hover:bg-[#1a454c] disabled:opacity-40'
              }`}
            >
              {confirmBulkDelete ? 'Tabbatar Share' : 'Aiwatar'}
            </button>
            {confirmBulkDelete && (
              <button onClick={() => setConfirmBulkDelete(false)} className="px-3 py-2 rounded-lg text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">Soke</button>
            )}
          </div>
          <button onClick={() => setSelected(new Set())} className="text-xs text-gray-500 hover:text-gray-800 underline">Soke zaɓin</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-[#0f3036] transition-colors" title={allSelected ? 'Cire zaɓin duka' : 'Zaɓi duka'}>
                    {allSelected ? <FaSquareCheck className="w-4 h-4 text-[#0f3036]" /> : <FaSquare className="w-4 h-4" />}
                  </button>
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('headline')}>
                  <span className="flex items-center">Labari<SortIcon field="headline" /></span>
                </th>
                <th className="p-4 w-24 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('status')}>
                  <span className="flex items-center">Matsayi<SortIcon field="status" /></span>
                </th>
                <th className="p-4 w-24 hidden lg:table-cell">Format</th>
                <th className="p-4 w-28 hidden xl:table-cell">Pillar</th>
                <th className="p-4 w-20 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => handleSort('views')}>
                  <span className="flex items-center">Views<SortIcon field="views" /></span>
                </th>
                <th className="p-4 w-36 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => handleSort('$createdAt')}>
                  <span className="flex items-center">Kwanan Wata<SortIcon field="$createdAt" /></span>
                </th>
                <th className="p-4 w-24 cursor-pointer select-none hover:text-gray-900 hidden xl:table-cell" onClick={() => handleSort('author')}>
                  <span className="flex items-center">Author<SortIcon field="author" /></span>
                </th>
                <th className="p-4 text-right w-36">Ayyuka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedArticles.map(article => {
                const status = article.status || 'published';
                const statusMeta = STATUS_META[status] || STATUS_META.published;
                const pillarColor = PILLAR_COLOR[article.pillar] || PILLAR_COLOR.news;
                const formatMeta = FORMAT_META[article.format];
                const FormatIcon = formatMeta?.icon;
                const isSelected = selected.has(String(article.id));
                const views = viewCounts[article.$id || article.id] || 0;
                const nextStatus = status === 'draft' ? 'review' : status === 'review' ? 'published' : status === 'published' ? 'draft' : 'draft';

                return (
                  <tr key={article.id} className={`hover:bg-gray-50 group transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                    <td className="p-4">
                      <button onClick={() => toggleOne(article.id)} className="text-gray-400 hover:text-[#0f3036] transition-colors">
                        {isSelected ? <FaSquareCheck className="w-4 h-4 text-[#0f3036]" /> : <FaSquare className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {article.image && (
                          <img src={article.image} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded object-cover bg-gray-100 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 line-clamp-1">{article.headline}</p>
                          <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{article.kicker}</p>
                          {article.slug && <p className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">/{article.slug}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleQuickStatus(article, nextStatus)}
                        className={`px-2 py-0.5 rounded text-[10px] font-black border ${statusMeta.color} hover:opacity-80 transition-opacity cursor-pointer`}
                        title={`Click to change to ${nextStatus}`}
                      >
                        {statusMeta.label}
                      </button>
                      {status === 'scheduled' && article.publishAt && (
                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(article.publishAt).toLocaleDateString()}</p>
                      )}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {formatMeta ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black border ${formatMeta.color}`}>
                          {FormatIcon && <FormatIcon className="w-2.5 h-2.5" />} {formatMeta.label}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 capitalize hidden xl:table-cell">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${pillarColor}`}>{article.pillar}</span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell font-mono">
                      {views > 0 ? formatViews(views) : '—'}
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell whitespace-nowrap">
                      {article.$createdAt ? new Date(article.$createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden xl:table-cell max-w-[120px] truncate">
                      {article.author || '—'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <Link to={`/article/${article.id}`} target="_blank" className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors" title="Duba labari">
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDuplicate(article)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors" title="Yi kwafi">
                          <FaCopy className="w-4 h-4" />
                        </button>
                        <Link to={`/admin/edit/${article.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Gyara">
                          <FaPencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Share">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" aria-label="Previous page">
                <FaChevronLeft className="w-3 h-3" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${page === pageNum ? 'bg-[#0f3036] text-white' : 'hover:bg-gray-200 text-gray-600'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" aria-label="Next page">
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="p-16 text-center">
            <FaFileLines className="mx-auto text-4xl text-gray-200 mb-4" />
            <p className="font-bold text-gray-600 text-lg">Ba a sami labari ba</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              {hasActiveFilters ? 'Try adjusting your filters or search query.' : 'Ƙirƙiri labari na farko don ganin shi a nan.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {hasActiveFilters && (
                <button onClick={clearFilters} className="px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <FaRotateLeft className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
              <Link to="/admin/create" className="px-4 py-2 text-sm font-bold text-white bg-[#0f3036] rounded-lg hover:bg-[#1a454c] flex items-center gap-2">
                <FaPlus className="w-3.5 h-3.5" /> Create Article
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArticles;
