import { useState, useEffect } from 'react';
import { FaPalette, FaEye, FaArrowUp, FaArrowDown, FaToggleOn, FaToggleOff, FaFloppyDisk, FaSpinner, FaCheck } from 'react-icons/fa6';

const STORAGE_KEY = 'yanci_homepage_builder';

const defaultSections = [
  { id: 'ticker', label: 'Breaking News Ticker', enabled: true, order: 0 },
  { id: 'hero', label: 'Hero Story + Sidebar', enabled: true, order: 1 },
  { id: 'highlights', label: 'Highlight Panels (3 cards)', enabled: true, order: 2 },
  { id: 'stats', label: 'Statistics Counter', enabled: true, order: 3 },
  { id: 'opinion', label: 'Opinion Section', enabled: true, order: 4 },
  { id: 'sport', label: 'Sports Section', enabled: true, order: 5 },
  { id: 'lifestyle', label: 'Lifestyle & Culture', enabled: true, order: 6 },
  { id: 'elections', label: 'Election Hub Widget', enabled: false, order: 7 },
  { id: 'newsletter', label: 'Newsletter CTA', enabled: true, order: 8 },
];

const AdminHomepageBuilder = () => {
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultSections;
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  }, [sections]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const toggleSection = (id) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap orders
    const tempOrder = newSections[index].order;
    newSections[index] = { ...newSections[index], order: newSections[targetIndex].order };
    newSections[targetIndex] = { ...newSections[targetIndex], order: tempOrder };

    setSections(newSections.sort((a, b) => a.order - b.order));
  };

  const enabledCount = sections.filter(s => s.enabled).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaPalette className="text-[#c59d5f]" /> Homepage Builder
          </h2>
          <p className="text-sm text-gray-500 mt-1">Control layout, section ordering, da widget visibility na shafin farko</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2.5 rounded-md flex items-center gap-2 font-bold text-sm transition-colors ${
              previewMode ? 'bg-[#c59d5f] text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FaEye className="w-4 h-4" /> {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2.5 rounded-md flex items-center gap-2 font-bold text-sm transition-colors ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-[#0f3036] text-white hover:bg-[#1a454c] disabled:opacity-50'
            }`}
          >
            {saving ? <FaSpinner className="animate-spin w-4 h-4" /> : saved ? <FaCheck className="w-4 h-4" /> : <FaFloppyDisk className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Ajiye Layout'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Sections</p>
          <p className="text-3xl font-black text-gray-900">{sections.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Enabled</p>
          <p className="text-3xl font-black text-green-600">{enabledCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Disabled</p>
          <p className="text-3xl font-black text-gray-400">{sections.length - enabledCount}</p>
        </div>
      </div>

      {/* Section List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Order & Visibility</span>
            <span>Section</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`p-4 flex items-center justify-between transition-colors ${
                section.enabled ? 'hover:bg-gray-50' : 'bg-gray-50/50 opacity-60'
              }`}
            >
              {/* Order Number + Move Controls */}
              <div className="flex items-center gap-3 w-32">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  section.enabled ? 'bg-[#0f3036] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </span>
                <div className="flex flex-col">
                  <button
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                  >
                    <FaArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                  >
                    <FaArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Section Label */}
              <div className="flex-1 px-4">
                <p className={`font-bold text-sm ${section.enabled ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                  {section.label}
                </p>
                <p className="text-xs text-gray-400 font-mono">/{section.id}</p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`transition-all ${section.enabled ? 'text-green-600' : 'text-gray-300'}`}
              >
                {section.enabled ? (
                  <FaToggleOn className="w-8 h-8" />
                ) : (
                  <FaToggleOff className="w-8 h-8" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode && (
        <div className="bg-[#fafaf9] rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-3 bg-[#0f3036] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <FaEye className="w-3 h-3" /> Homepage Preview (Enabled Sections Only)
          </div>
          <div className="p-6 space-y-4">
            {sections.filter(s => s.enabled).map((section, index) => (
              <div key={section.id} className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Section {index + 1}: {section.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <FaCheck className="w-4 h-4" /> How It Works
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Drag sections up/down to change their order on the homepage</li>
          <li>Toggle sections on/off to show or hide them from visitors</li>
          <li>Preview mode shows you how the layout will look</li>
          <li>Click "Ajiye Layout" to save your changes</li>
          <li>Changes are saved to localStorage and applied on next page load</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHomepageBuilder;
