import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaUsers, FaPlus, FaTrash, FaPen, FaArrowLeft, FaImage,
  FaLocationDot, FaGraduationCap, FaBriefcase, FaXmark,
} from 'react-icons/fa6';
import { useElection } from '../../context/ElectionContext';
import { PARTIES } from '../../data/electionData';

function getParty(id) {
  return PARTIES.find((p) => p.id === id) || PARTIES[0];
}

export default function AdminCandidates() {
  const { id } = useParams();
  const { elections, candidates, addCandidate, updateCandidate, deleteCandidate } = useElection();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', party: 'apc', position: 'president', age: '',
    state: '', education: '', platform: '', runningMate: '',
    previousOffice: '', image: '',
  });

  const election = elections.find(e => e.id === id) || elections[0];
  const electionCandidates = candidates.filter(c => c.electionId === election?.id || c.position === 'president');

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      name: '', party: 'apc', position: 'president', age: '',
      state: '', education: '', platform: '', runningMate: '',
      previousOffice: '', image: '',
    });
    setShowModal(true);
  };

  const openEdit = (candidate) => {
    setEditingId(candidate.id);
    setFormData({
      name: candidate.name || '',
      party: candidate.party || 'apc',
      position: candidate.position || 'president',
      age: candidate.age || '',
      state: candidate.state || '',
      education: candidate.education || '',
      platform: Array.isArray(candidate.platform) ? candidate.platform.join('\n') : '',
      runningMate: candidate.runningMate || '',
      previousOffice: candidate.previousOffice || '',
      image: candidate.image || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      age: parseInt(formData.age) || 0,
      platform: formData.platform.split('\n').filter(Boolean),
      electionId: election?.id,
    };
    if (editingId) {
      await updateCandidate(editingId, data);
    } else {
      await addCandidate(data);
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (candidateId) => {
    if (confirm('Ka tabbata kana son share wannan ɗan takara?')) {
      await deleteCandidate(candidateId);
    }
  };

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
              <FaUsers className="text-[#0f3036]" />
              'Yan Takara — {election.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{electionCandidates.length} 'yan takara</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0f3036] text-white rounded-lg font-bold text-sm hover:bg-[#1a454c] transition-colors"
        >
          <FaPlus className="w-4 h-4" /> Ƙara Ɗan Takara
        </button>
      </div>

      {/* Candidate Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {electionCandidates.map((candidate) => {
          const party = getParty(candidate.party);
          return (
            <div key={candidate.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="flex">
                <div className="w-32 flex-shrink-0 relative">
                  {candidate.image ? (
                    <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FaImage className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: party.color }} />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: party.color + '20', color: party.color }}>
                        {party.name}
                      </span>
                      <h3 className="font-bold text-lg mt-1">{candidate.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(candidate)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                        <FaPen className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(candidate.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mataimaki: {candidate.runningMate || '—'}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><FaLocationDot className="w-3 h-3" /> {candidate.state || '—'}</span>
                    <span className="flex items-center gap-1"><FaBriefcase className="w-3 h-3" /> {candidate.previousOffice || '—'}</span>
                  </div>
                  {candidate.platform?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Manufofi</p>
                      <ul className="space-y-0.5">
                        {candidate.platform.slice(0, 2).map((item, i) => (
                          <li key={i} className="text-xs text-gray-600 truncate">• {item}</li>
                        ))}
                        {candidate.platform.length > 2 && (
                          <li className="text-xs text-gray-400">+{candidate.platform.length - 2} ƙari</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {electionCandidates.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <FaUsers className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <p className="text-gray-500 font-medium">Babu 'yan takara tukuna.</p>
          <button onClick={openCreate} className="mt-4 text-sm text-[#0f3036] font-bold hover:underline">
            + Ƙara ɗan takara na farko
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Gyara Ɗan Takara' : 'Sabon Ɗan Takara'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaXmark className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sunan</label>
                  <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Jam'iyya</label>
                  <select name="party" value={formData.party} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]">
                    {PARTIES.map(p => <option key={p.id} value={p.id}>{p.name} — {p.fullName}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Matsayi</label>
                  <select name="position" value={formData.position} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]">
                    <option value="president">Shugaban Ƙasa</option>
                    <option value="governor">Gwamna</option>
                    <option value="senator">Sanata</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Shekaru</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Jiha</label>
                  <input name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mataimaki</label>
                  <input name="runningMate" value={formData.runningMate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mukamin Da Ya Taɓa Riƙe</label>
                  <input name="previousOffice" value={formData.previousOffice} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ilimi</label>
                <input name="education" value={formData.education} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hanyar Hoto (URL)</label>
                <input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Manufofi (kowane layi ɗaya)</label>
                <textarea name="platform" value={formData.platform} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036] resize-none" placeholder="Ƙarfafa tsaro&#10;Haɓaka aikin yi&#10;..." />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">Soke</button>
                <button type="submit" className="px-6 py-2 bg-[#0f3036] text-white text-sm font-bold rounded-lg hover:bg-[#1a454c] transition-colors">
                  {editingId ? 'Ajiye Canje-canje' : 'Ƙirƙiri Ɗan Takara'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
