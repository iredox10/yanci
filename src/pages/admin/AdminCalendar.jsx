import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import {
  FaCalendar, FaChevronLeft, FaChevronRight, FaCircleCheck,
  FaCircleDot, FaClock, FaEye, FaBolt, FaXmark, FaPlus,
  FaArrowRight, FaFilter,
} from 'react-icons/fa6';

const STATUS_CONFIG = {
  published: { icon: FaCircleCheck, color: 'bg-green-100 text-green-700 border-green-200', label: 'Published' },
  draft: { icon: FaCircleDot, color: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Draft' },
  scheduled: { icon: FaClock, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Scheduled' },
  review: { icon: FaEye, color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Review' },
};

const PILLAR_COLORS = {
  news: '#8a2c2c',
  sport: '#2c7a7b',
  opinion: '#c59d5f',
  culture: '#6366f1',
  lifestyle: '#d97706',
};

const AdminCalendar = () => {
  const { articles } = useNews();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('en', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const articlesByDate = useMemo(() => {
    const map = {};
    const filtered = filterStatus === 'all' ? articles : articles.filter(a => a.status === filterStatus);
    filtered.forEach(article => {
      const dateStr = article.publishAt
        ? new Date(article.publishAt).toISOString().slice(0, 10)
        : article.$createdAt
          ? new Date(article.$createdAt).toISOString().slice(0, 10)
          : null;
      if (dateStr) {
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(article);
      }
    });
    return map;
  }, [articles, filterStatus]);

  const stats = useMemo(() => {
    const filtered = filterStatus === 'all' ? articles : articles.filter(a => a.status === filterStatus);
    return {
      total: filtered.length,
      published: filtered.filter(a => a.status === 'published').length,
      scheduled: filtered.filter(a => a.status === 'scheduled').length,
      draft: filtered.filter(a => a.status === 'draft').length,
      review: filtered.filter(a => a.status === 'review').length,
    };
  }, [articles, filterStatus]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getDateStr = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCalendar className="text-[#c59d5f]" /> Content Calendar
          </h2>
          <p className="text-sm text-gray-500 mt-1">Plan and track your editorial schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={prevMonth} className="p-2 hover:bg-white rounded-md transition-colors" aria-label="Previous month"><FaChevronLeft className="w-3 h-3" /></button>
            <span className="text-sm font-bold text-gray-700 min-w-[160px] text-center">{monthName}</span>
            <button onClick={nextMonth} className="p-2 hover:bg-white rounded-md transition-colors" aria-label="Next month"><FaChevronRight className="w-3 h-3" /></button>
          </div>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-2 text-xs font-bold text-[#0f3036] bg-gray-100 hover:bg-gray-200 rounded-lg">Today</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-[#0f3036] text-white' },
          { label: 'Published', value: stats.published, color: 'bg-green-50 text-green-700' },
          { label: 'Scheduled', value: stats.scheduled, color: 'bg-blue-50 text-blue-700' },
          { label: 'Draft', value: stats.draft, color: 'bg-gray-50 text-gray-600' },
          { label: 'Review', value: stats.review, color: 'bg-amber-50 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-bold opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <FaFilter className="w-3 h-3 text-gray-400" />
        {['all', 'published', 'scheduled', 'draft', 'review'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterStatus === status
                ? 'bg-[#0f3036] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">{d}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-gray-100 bg-gray-50/50" />;
            const dateStr = getDateStr(day);
            const dayArticles = articlesByDate[dateStr] || [];
            const isToday = dateStr === todayStr;
            const isSelected = selectedDate === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`min-h-[120px] border-b border-r border-gray-100 p-2 cursor-pointer transition-colors hover:bg-gray-50 ${isSelected ? 'bg-blue-50/50 ring-2 ring-inset ring-blue-200' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-[#0f3036] text-white' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {dayArticles.length > 0 && (
                    <span className="text-[10px] font-bold text-gray-400">{dayArticles.length}</span>
                  )}
                </div>
                <div className="space-y-1 overflow-hidden max-h-[80px]">
                  {dayArticles.slice(0, 3).map(article => {
                    const status = STATUS_CONFIG[article.status] || STATUS_CONFIG.published;
                    const StatusIcon = status.icon;
                    const pillarColor = PILLAR_COLORS[article.pillar] || '#666';
                    return (
                      <div
                        key={article.$id || article.id}
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/edit/${article.$id || article.id}`); }}
                        className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium truncate hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ backgroundColor: pillarColor + '15', color: pillarColor }}
                        title={article.headline}
                      >
                        <StatusIcon className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{article.headline?.slice(0, 25) || 'Untitled'}</span>
                      </div>
                    );
                  })}
                  {dayArticles.length > 3 && (
                    <div className="text-[10px] font-bold text-gray-400 pl-1">+{dayArticles.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detail */}
      {selectedDate && articlesByDate[selectedDate]?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <button onClick={() => setSelectedDate(null)} className="text-gray-400 hover:text-gray-600"><FaXmark className="w-5 h-5" /></button>
          </div>
          <div className="space-y-3">
            {articlesByDate[selectedDate].map(article => {
              const status = STATUS_CONFIG[article.status] || STATUS_CONFIG.published;
              const StatusIcon = status.icon;
              return (
                <div key={article.$id || article.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: PILLAR_COLORS[article.pillar] || '#666' }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{article.headline || 'Untitled'}</p>
                    <p className="text-xs text-gray-500">{article.author || 'Unknown'} · {article.section || article.pillar || ''}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${status.color}`}>
                    <StatusIcon className="w-2.5 h-2.5" /> {status.label}
                  </span>
                  <button onClick={() => navigate(`/admin/edit/${article.$id || article.id}`)} className="p-2 text-gray-400 hover:text-[#0f3036] transition-colors" aria-label="Edit article">
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedDate && !articlesByDate[selectedDate]?.length && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <FaCalendar className="mx-auto text-3xl text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No articles scheduled for {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}</p>
          <button onClick={() => navigate('/admin/create')} className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#0f3036] text-white rounded-lg text-sm font-bold hover:bg-[#1a454c]">
            <FaPlus className="w-3.5 h-3.5" /> Create Article
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
