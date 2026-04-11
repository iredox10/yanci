import { useState, useEffect } from 'react';
import { appwriteService } from '../../lib/appwrite';
import { FaStar, FaPlus, FaTrash, FaPen, FaSpinner, FaArrowUp, FaArrowDown, FaXmark } from 'react-icons/fa6';

const STORAGE_KEY = 'yanci_highlights';

const initialHighlights = [
  { id: 1, tag: 'Kasuwanci', title: 'Kasuwar hannayen jari ta yi sama da kashi 4 cikin yini biyu', copy: 'Masu zuba jari sun amince da kudurin gwamnati na saukaka haraji ga masana\'antun kere-kere.', icon: 'trend', accent: '#10b981', gradient: 'from-emerald-500/20 to-teal-500/20' },
  { id: 2, tag: 'Sauti', title: 'Shirin rediyon Yanci Live ya dawo da sabbin makalu daga jihohi 8', copy: 'Masu sauraro na iya kallo kai tsaye tare da mika tambaya daga manhajar mu.', icon: 'radio', accent: '#3b82f6', gradient: 'from-blue-500/20 to-indigo-500/20' },
  { id: 3, tag: 'Kirkire-kirkire', title: 'Matasa a Zaria sun ƙirƙira manhajar gano gonaki ta tauraron dan adam', copy: 'Aikin ya samu tallafin dala 150,000 daga hadin gwiwar ƙungiyoyin noma na duniya.', icon: 'innovation', accent: '#8b5cf6', gradient: 'from-violet-500/20 to-purple-500/20' },
];

const ICON_OPTIONS = [
  { value: 'trend', label: 'Trend (Arrow)' },
  { value: 'radio', label: 'Radio/Broadcast' },
  { value: 'innovation', label: 'Innovation (Wand)' },
  { value: 'fire', label: 'Fire/Trending' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'users', label: 'Users/Team' },
];

const COLOR_PRESETS = [
  { accent: '#10b981', gradient: 'from-emerald-500/20 to-teal-500/20', label: 'Emerald' },
  { accent: '#3b82f6', gradient: 'from-blue-500/20 to-indigo-500/20', label: 'Blue' },
  { accent: '#8b5cf6', gradient: 'from-violet-500/20 to-purple-500/20', label: 'Purple' },
  { accent: '#f59e0b', gradient: 'from-amber-500/20 to-orange-500/20', label: 'Amber' },
  { accent: '#ef4444', gradient: 'from-red-500/20 to-pink-500/20', label: 'Red' },
  { accent: '#06b6d4', gradient: 'from-cyan-500/20 to-sky-500/20', label: 'Cyan' },
];

const emptyDraft = { tag: '', title: '', copy: '', icon: 'trend', accent: '#10b981', gradient: 'from-emerald-500/20 to-teal-500/20' };

const AdminHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [useAppwrite, setUseAppwrite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await appwriteService.getHighlights();
        if (docs.length > 0) {
          setHighlights(docs.map(doc => ({ ...doc, id: doc.$id })));
          setUseAppwrite(true);
          return;
        }
      } catch {}
      const saved = localStorage.getItem(STORAGE_KEY);
      setHighlights(saved ? JSON.parse(saved) : initialHighlights);
    };
    load();
  }, []);

  const persist = async (data) => {
    if (useAppwrite) {
      try {
        if (data.$id) {
          await appwriteService.updateHighlight(data.$id, data);
        } else {
          await appwriteService.createHighlight(data);
        }
      } catch {
        console.warn('Appwrite save failed, using localStorage fallback');
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...draft, order: draft.order ?? highlights.length };
    let updated;
    if (draft.id && draft.$id) {
      updated = highlights.map(h => h.$id === draft.$id ? { ...h, ...data } : h);
    } else {
      updated = [...highlights, { ...data, id: Date.now() }];
    }
    setHighlights(updated);
    await persist(updated);
    setIsModalOpen(false);
    setDraft(emptyDraft);
    setSaving(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Share wannan highlight?')) return;
    if (useAppwrite && item.$id) {
      try { await appwriteService.deleteHighlight(item.$id); } catch {}
    }
    const updated = highlights.filter(h => h.$id !== item.$id && h.id !== item.id);
    setHighlights(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleMove = (index, direction) => {
    const newItems = [...highlights];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setHighlights(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const openEdit = (highlight) => { setDraft(highlight); setIsModalOpen(true); };
  const openNew = () => { setDraft(emptyDraft); setIsModalOpen(true); };

  const getIconLabel = (value) => ICON_OPTIONS.find(o => o.value === value)?.label || value;
  const getColorLabel = (accent) => COLOR_PRESETS.find(c => c.accent === accent)?.label || 'Custom';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaStar className="text-[#c59d5f]" /> Highlight Panels
          </h2>
          <p className="text-sm text-gray-500 mt-1">Gudanar da manyan labarai a shafin farko {useAppwrite ? '(Appwrite)' : '(Local)'}</p>
        </div>
        <button onClick={openNew} className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#1a454c] transition-colors font-bold text-sm">
          <FaPlus className="w-4 h-4" /> Ƙara Sabo
        </button>
      </div>

      <div className="space-y-4">
        {highlights.map((item, index) => (
          <div key={item.$id || item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48 h-32 rounded-lg flex flex-col items-center justify-center shrink-0 p-4 text-white" style={{ background: `linear-gradient(135deg, ${item.accent}33, ${item.accent}11)` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: item.accent }}>
                <FaStar className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: item.accent }}>{item.tag}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{item.title}</h3>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"><FaArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === highlights.length - 1} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"><FaArrowDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FaPen className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(item)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.copy}</p>
              <div className="flex gap-2 text-xs font-bold text-gray-400">
                <span className="bg-gray-100 px-2 py-1 rounded">Icon: {getIconLabel(item.icon)}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Color: {getColorLabel(item.accent)}</span>
              </div>
            </div>
          </div>
        ))}
        {highlights.length === 0 && (
          <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
            <FaStar className="mx-auto text-4xl mb-2 opacity-30" />
            Babu highlight panels tukuna.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-900">{draft.id ? 'Gyara Highlight' : 'Ƙara Sabo Highlight'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FaXmark className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Tag/Label</label>
                <input value={draft.tag} onChange={e => setDraft({ ...draft, tag: e.target.value })} placeholder="Kasuwanci, Sauti, etc." className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Take (Title)</label>
                <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Bayani (Copy/Description)</label>
                <textarea value={draft.copy} onChange={e => setDraft({ ...draft, copy: e.target.value })} rows="3" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Icon</label>
                <select value={draft.icon} onChange={e => setDraft({ ...draft, icon: e.target.value })} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none bg-white">
                  {ICON_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Launi (Color Preset)</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_PRESETS.map((preset) => (
                    <button key={preset.accent} onClick={() => setDraft({ ...draft, accent: preset.accent, gradient: preset.gradient })} className={`w-10 h-10 rounded-lg border-2 transition-all ${draft.accent === preset.accent ? 'border-gray-800 scale-110' : 'border-transparent'}`} style={{ backgroundColor: preset.accent }} title={preset.label} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Soke</button>
              <button onClick={handleSave} disabled={saving || !draft.title || !draft.tag} className="px-6 py-2 text-sm font-bold text-white bg-[#0f3036] hover:bg-[#1a454c] rounded-lg disabled:opacity-50 flex items-center gap-2">
                {saving && <FaSpinner className="animate-spin" />} Ajiye
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHighlights;
