import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaShieldHalved, FaPlus, FaTrash, FaPen, FaArrowLeft, FaXmark,
  FaCircleCheck, FaCircleXmark, FaTriangleExclamation, FaCircleQuestion,
} from 'react-icons/fa6';
import { useElection } from '../../context/ElectionContext';
import { PARTIES } from '../../data/electionData';

const VERDICT_OPTIONS = [
  { value: 'true', label: 'Gaskiya', color: 'green', icon: FaCircleCheck },
  { value: 'false', label: 'Ƙarya', color: 'red', icon: FaCircleXmark },
  { value: 'misleading', label: 'Ba Gaskiya Ba', color: 'amber', icon: FaTriangleExclamation },
  { value: 'unverified', label: 'Ba a Taba Ba', color: 'gray', icon: FaCircleQuestion },
];

function getParty(id) {
  return PARTIES.find((p) => p.id === id) || PARTIES[0];
}

export default function AdminFactChecks() {
  const { id } = useParams();
  const { elections, candidates, factChecks, addFactCheck, updateFactCheck, deleteFactCheck } = useElection();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterVerdict, setFilterVerdict] = useState('all');
  const [formData, setFormData] = useState({
    claim: '', claimant: '', claimantParty: 'apc',
    verdict: 'unverified', analysis: '', source: '', date: '',
  });

  const election = elections.find(e => e.id === id) || elections[0];
  const electionCandidates = candidates.filter(c => c.electionId === election?.id || c.position === 'president');
  const electionFactChecks = factChecks.filter(fc => fc.electionId === election?.id);

  const filteredChecks = filterVerdict === 'all'
    ? electionFactChecks
    : electionFactChecks.filter(fc => fc.verdict === filterVerdict);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      claim: '', claimant: '', claimantParty: 'apc',
      verdict: 'unverified', analysis: '', source: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const openEdit = (fc) => {
    setEditingId(fc.id);
    setFormData({
      claim: fc.claim || '',
      claimant: fc.claimant || '',
      claimantParty: fc.claimantParty || 'apc',
      verdict: fc.verdict || 'unverified',
      analysis: fc.analysis || '',
      source: fc.source || '',
      date: fc.date || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, electionId: election?.id };
    if (editingId) {
      await updateFactCheck(editingId, data);
    } else {
      await addFactCheck(data);
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (fcId) => {
    if (confirm('Ka tabbata kana son share wannan binciken gaskiya?')) {
      await deleteFactCheck(fcId);
    }
  };

  const verdictCounts = { all: electionFactChecks.length };
  electionFactChecks.forEach(fc => {
    verdictCounts[fc.verdict] = (verdictCounts[fc.verdict] || 0) + 1;
  });

  if (!election) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Zaben ba a samu ba.</p>
          <Link to="/admin/elections" className="text-[#0f3036] font-bold text-sm mt-2 inline-block">← Komawa</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/elections" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaArrowLeft className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FaShieldHalved className="text-[#0f3036]" />
              Binciken Gaskiya — {election.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{electionFactChecks.length} bincike</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0f3036] text-white rounded-lg font-bold text-sm hover:bg-[#1a454c] transition-colors"
        >
          <FaPlus className="w-4 h-4" /> Sabon Bincike
        </button>
      </div>

      {/* Verdict Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {VERDICT_OPTIONS.map(({ value, label, color, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilterVerdict(filterVerdict === value ? 'all' : value)}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              filterVerdict === value
                ? `bg-${color}-50 border-${color}-400`
                : 'bg-white border-gray-100 hover:border-gray-300'
            }`}
          >
            <Icon className={`w-5 h-5 mx-auto mb-1 text-${color}-500`} />
            <div className="text-lg font-black">{verdictCounts[value] || 0}</div>
            <div className={`text-[10px] font-bold text-${color}-700`}>{label}</div>
          </button>
        ))}
        <button
          onClick={() => setFilterVerdict('all')}
          className={`p-3 rounded-xl border-2 text-center transition-all ${
            filterVerdict === 'all'
              ? 'bg-[#0f3036] text-white border-[#0f3036]'
              : 'bg-white border-gray-100 hover:border-gray-300'
          }`}
        >
          <div className="text-lg font-black">{verdictCounts.all}</div>
          <div className="text-[10px] font-bold text-gray-500">Duka</div>
        </button>
      </div>

      {/* Fact Check List */}
      <div className="space-y-4">
        {filteredChecks.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <FaShieldHalved className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500 font-medium">Babu binciken gaskiya tukuna.</p>
            <button onClick={openCreate} className="mt-4 text-sm text-[#0f3036] font-bold hover:underline">
              + Ƙara bincike na farko
            </button>
          </div>
        ) : (
          filteredChecks.map((fc) => {
            const verdictOpt = VERDICT_OPTIONS.find(v => v.value === fc.verdict) || VERDICT_OPTIONS[3];
            const party = getParty(fc.claimantParty);
            const VerdictIcon = verdictOpt.icon;
            return (
              <div key={fc.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${verdictOpt.color}-100 text-${verdictOpt.color}-800 flex items-center gap-1.5`}>
                        <VerdictIcon className="w-3 h-3" /> {verdictOpt.label}
                      </span>
                      <span className="text-xs text-gray-400">{fc.date}</span>
                    </div>
                    <blockquote className="text-base font-serif italic text-gray-800 mb-3 pl-4 border-l-2 border-gray-200">
                      "{fc.claim}"
                    </blockquote>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: party.color }}>
                        {(fc.claimant || 'C')[0]}
                      </div>
                      <span className="text-sm font-bold">{fc.claimant}</span>
                      <span className="text-xs text-gray-400">({party.name})</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">{fc.analysis}</p>
                    <p className="text-xs text-gray-400">Tushen: {fc.source}</p>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button onClick={() => openEdit(fc)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                      <FaPen className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(fc.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Gyara Bincike' : 'Sabon Binciken Gaskiya'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaXmark className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Iƙirari</label>
                <textarea name="claim" value={formData.claim} onChange={handleChange} required rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036] resize-none" placeholder='"..."' />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mai Iƙirari</label>
                  <input name="claimant" value={formData.claimant} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Jam'iyya</label>
                  <select name="claimantParty" value={formData.claimantParty} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]">
                    {PARTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hukunci</label>
                <div className="grid grid-cols-4 gap-3">
                  {VERDICT_OPTIONS.map(({ value, label, color, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, verdict: value }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.verdict === value
                          ? `bg-${color}-50 border-${color}-400`
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 text-${color}-500`} />
                      <div className="text-xs font-bold">{label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bincike</label>
                <textarea name="analysis" value={formData.analysis} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tushen</label>
                  <input name="source" value={formData.source} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ranar</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">Soke</button>
                <button type="submit" className="px-6 py-2 bg-[#0f3036] text-white text-sm font-bold rounded-lg hover:bg-[#1a454c] transition-colors">
                  {editingId ? 'Ajiye Canje-canje' : 'Ƙirƙiri Bincike'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
