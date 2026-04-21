import { useState } from 'react';
import { FaTriangleExclamation, FaCheck, FaPen, FaXmark, FaPlus, FaClock } from 'react-icons/fa6';

const VERDICT_TYPES = {
  correction: { label: 'Correction', icon: FaPen, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  clarification: { label: 'Clarification', icon: FaCheck, color: 'bg-green-50 text-green-700 border-green-200' },
  apology: { label: 'Apology', icon: FaTriangleExclamation, color: 'bg-red-50 text-red-700 border-red-200' },
};

const CorrectionsDisplay = ({ corrections = [], className = '' }) => {
  if (!corrections.length) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
        <FaTriangleExclamation className="text-amber-500" /> Corrections & Clarifications
      </h3>
      {corrections.map((c, i) => {
        const type = VERDICT_TYPES[c.type] || VERDICT_TYPES.correction;
        const TypeIcon = type.icon;
        return (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${type.color}`}>
            <TypeIcon className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                {c.date && (
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <FaClock className="w-2.5 h-2.5" />
                    {new Date(c.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed">{c.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CorrectionsEditor = ({ value = [], onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState({ type: 'correction', text: '' });

  const handleAdd = () => {
    if (!draft.text.trim()) return;
    const newCorrection = {
      ...draft,
      date: new Date().toISOString(),
      author: '',
    };
    onChange?.([...value, newCorrection]);
    setDraft({ type: 'correction', text: '' });
    setIsAdding(false);
  };

  const handleDelete = (index) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <FaTriangleExclamation className="text-amber-500" /> Corrections & Clarifications
        </h4>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="text-[10px] font-bold text-[#c59d5f] hover:text-[#b08a4f] flex items-center gap-1">
            <FaPlus className="w-2.5 h-2.5" /> Add
          </button>
        )}
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((c, i) => {
            const type = VERDICT_TYPES[c.type] || VERDICT_TYPES.correction;
            return (
              <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg group">
                <div className="flex-1 min-w-0">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${type.color}`}>{type.label}</span>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{c.text}</p>
                </div>
                <button onClick={() => handleDelete(i)} className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" aria-label="Delete correction">
                  <FaXmark className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isAdding && (
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <select
            value={draft.type}
            onChange={e => setDraft({ ...draft, type: e.target.value })}
            className="w-full text-xs p-2 border border-gray-200 rounded bg-white"
          >
            {Object.entries(VERDICT_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <textarea
            value={draft.text}
            onChange={e => setDraft({ ...draft, text: e.target.value })}
            placeholder="Describe the correction or clarification..."
            rows="2"
            className="w-full text-xs p-2 border border-gray-200 rounded resize-none"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded">Cancel</button>
            <button onClick={handleAdd} disabled={!draft.text.trim()} className="px-3 py-1.5 text-xs font-bold text-white bg-[#0f3036] hover:bg-[#1a454c] rounded disabled:opacity-50">Add</button>
          </div>
        </div>
      )}

      {!isAdding && value.length === 0 && (
        <p className="text-[10px] text-gray-400">No corrections or clarifications.</p>
      )}
    </div>
  );
};

export { CorrectionsDisplay, CorrectionsEditor, VERDICT_TYPES };
