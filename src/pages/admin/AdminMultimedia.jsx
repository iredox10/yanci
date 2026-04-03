import { useState, useEffect } from 'react';
import { FaPodcast, FaVideo, FaPlus, FaTrash, FaPen, FaCirclePlay, FaMicrophoneLines, FaSpinner } from 'react-icons/fa6';

const STORAGE_KEY = 'yanci_multimedia';
const initialDraft = { title: '', url: '', type: 'video', description: '' };

const SEED_ITEMS = [
  { id: 2, title: 'Siyasa a Yau: Kashi na 1', url: 'https://audio.com/xyz.mp3', type: 'audio', description: 'Tattaunawa kan zabed 2027.' },
];

function getSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

const AdminMultimedia = () => {
  const [items, setItems] = useState(() => getSaved() || SEED_ITEMS);
  const [draft, setDraft] = useState(initialDraft);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { save(items); }, [items]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (draft.id) {
        setItems(prev => prev.map(i => i.id === draft.id ? draft : i));
      } else {
        setItems(prev => [{ ...draft, id: Date.now() }, ...prev]);
      }
      setIsModalOpen(false);
      setDraft(initialDraft);
      setSaving(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this media item?')) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const getIcon = (type) => type === 'video' ? <FaVideo className="text-red-500" /> : <FaMicrophoneLines className="text-blue-500" />;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaPodcast className="text-[#c70000]" /> Podcasts & Bidiyo
          </h2>
          <p className="text-sm text-gray-500 mt-1">Gudanar da shirye-shiryen bidiyo da rediyo/podcast</p>
        </div>

        <button
          onClick={() => { setDraft(initialDraft); setIsModalOpen(true); }}
          className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-[#1a454c] transition-colors font-bold text-sm"
        >
          <FaPlus className="w-4 h-4" /> Ƙara Sabo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row gap-4">
            <div className={`w-full sm:w-32 h-32 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'video' ? 'bg-red-50' : 'bg-blue-50'}`}>
              {item.type === 'video' ? <FaCirclePlay className="w-10 h-10 text-red-500/20" /> : <FaPodcast className="w-10 h-10 text-blue-500/20" />}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{item.title}</h3>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setDraft(item); setIsModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <FaPen className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                {getIcon(item.type)} {item.type}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
              <div className="mt-auto">
                <div className="text-[10px] font-mono bg-gray-50 px-2 py-1 rounded truncate text-gray-400 border border-gray-100">
                  {item.url}
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-1 lg:col-span-2 text-center py-20 text-gray-400">
            Ba a sami labari ba.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-xl text-gray-900 mb-4">{draft.id ? 'Gyara' : 'Ƙara Sabo'} Media</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Take (Title)</label>
              <input
                value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 outline-none focus:ring-[#c59d5f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Nau'i (Type)</label>
              <select
                value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 outline-none focus:ring-[#c59d5f] bg-white"
              >
                <option value="video">Bidiyo (YouTube Embed)</option>
                <option value="audio">Podcast (Audio File)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">URL / Link</label>
              <input
                value={draft.url} onChange={e => setDraft({ ...draft, url: e.target.value })}
                placeholder={draft.type === 'video' ? "https://youtube.com/embed/..." : "https://...mp3"}
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 outline-none focus:ring-[#c59d5f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Bayani (Description)</label>
              <textarea
                value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })}
                rows="3"
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 outline-none focus:ring-[#c59d5f] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                Soke
              </button>
              <button
                onClick={handleSave} disabled={saving}
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
export default AdminMultimedia;
