import { useState, useEffect } from 'react';
import { FaChartLine, FaPlus, FaTrash, FaPen, FaXmark, FaSpinner, FaArrowUp, FaArrowDown } from 'react-icons/fa6';

const STORAGE_KEY = 'yanci_homepage_stats';

const initialStats = [
  { id: 1, label: 'Labarai', value: 12500, suffix: '+', icon: 'article' },
  { id: 2, label: 'Masu karatu', value: 500, suffix: 'K+', icon: 'reader' },
  { id: 3, label: 'Kasashen duniya', value: 45, suffix: '', icon: 'globe' },
];

const emptyStat = { label: '', value: 0, suffix: '', icon: 'article' };

const AdminHomepageStats = () => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialStats;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptyStat);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (draft.id) {
        setStats(prev => prev.map(s => s.id === draft.id ? draft : s));
      } else {
        setStats(prev => [...prev, { ...draft, id: Date.now() }]);
      }
      setIsModalOpen(false);
      setDraft(emptyStat);
      setSaving(false);
    }, 300);
  };

  const handleDelete = (id) => {
    if (window.confirm('Share wannan statistic?')) {
      setStats(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleMove = (index, direction) => {
    const newItems = [...stats];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setStats(newItems);
  };

  const openEdit = (stat) => {
    setDraft(stat);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setDraft(emptyStat);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaChartLine className="text-[#c59d5f]" /> Homepage Statistics
          </h2>
          <p className="text-sm text-gray-500 mt-1">Gudanar da lambobin da ke shafin farko (Animated Counters)</p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#1a454c] font-bold text-sm"
        >
          <FaPlus className="w-4 h-4" /> Ƙara Stat
        </button>
      </div>

      {/* Preview */}
      <div className="bg-[#0f3036] rounded-2xl p-8">
        <p className="text-xs font-bold text-[#c59d5f] uppercase tracking-widest mb-4">Live Preview</p>
        <div className="grid grid-cols-3 gap-8">
          {stats.map(stat => (
            <div key={stat.id} className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-black text-white mb-1">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#c59d5f]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={stat.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-black text-[#0f3036]">{stat.value.toLocaleString()}{stat.suffix}</div>
              <div>
                <p className="font-bold text-gray-900">{stat.label}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded disabled:opacity-30"><FaArrowUp className="w-3 h-3" /></button>
              <button onClick={() => handleMove(index, 'down')} disabled={index === stats.length - 1} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded disabled:opacity-30"><FaArrowDown className="w-3 h-3" /></button>
              <button onClick={() => openEdit(stat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><FaPen className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(stat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><FaTrash className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-900">{draft.id ? 'Gyara Stat' : 'Ƙara Sabo Stat'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FaXmark className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Label</label>
                <input
                  value={draft.label} onChange={e => setDraft({ ...draft, label: e.target.value })}
                  placeholder="Masu karatu, Labarai, etc."
                  className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Value (Number)</label>
                <input
                  type="number"
                  value={draft.value} onChange={e => setDraft({ ...draft, value: parseInt(e.target.value) || 0 })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Suffix (e.g. +, K+, %)</label>
                <input
                  value={draft.suffix} onChange={e => setDraft({ ...draft, suffix: e.target.value })}
                  placeholder="+, K+, %, etc."
                  className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Soke</button>
              <button
                onClick={handleSave} disabled={saving || !draft.label}
                className="px-6 py-2 text-sm font-bold text-white bg-[#0f3036] hover:bg-[#1a454c] rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <FaSpinner className="animate-spin" />} Ajiye
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomepageStats;
