import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaChartPie, FaPlus, FaTrash, FaPen, FaCheckToSlot,
  FaCalendar, FaUsers, FaCircleCheck, FaClock,
} from 'react-icons/fa6';
import { useElection } from '../../context/ElectionContext';

const STATUS_CONFIG = {
  upcoming: { label: 'Mai Zuwa', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FaCalendar },
  active: { label: 'Kai Tsaye', color: 'bg-green-100 text-green-700 border-green-200', icon: FaClock },
  completed: { label: 'An Kammala', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FaCircleCheck },
};

export default function AdminElections() {
  const { elections, candidates, factChecks, addElection, updateElection, deleteElection } = useElection();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    date: '',
    type: 'general',
    status: 'upcoming',
    electoralBody: 'INEC',
    description: '',
  });

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      name: '', fullName: '', date: '', type: 'general',
      status: 'upcoming', electoralBody: 'INEC', description: '',
    });
    setShowModal(true);
  };

  const openEdit = (election) => {
    setEditingId(election.id);
    setFormData({
      name: election.name || '',
      fullName: election.fullName || '',
      date: election.date || '',
      type: election.type || 'general',
      status: election.status || 'upcoming',
      electoralBody: election.electoralBody || 'INEC',
      description: election.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateElection(editingId, formData);
    } else {
      await addElection(formData);
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Ka tabbata kana son share wannan zabe?')) {
      await deleteElection(id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaCheckToSlot className="text-[#0f3036]" />
            Sarrafa Zabe
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gudanar da zabuka, 'yan takara, sakamako, da gaskiya.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0f3036] text-white rounded-lg font-bold text-sm hover:bg-[#1a454c] transition-colors"
        >
          <FaPlus className="w-4 h-4" /> Sabon Zabe
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Jimlar Zabuka</div>
          <div className="text-3xl font-black">{elections.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">'Yan Takara</div>
          <div className="text-3xl font-black">{candidates.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Binciken Gaskiya</div>
          <div className="text-3xl font-black">{factChecks.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Kai Tsaye</div>
          <div className="text-3xl font-black text-green-600">{elections.filter(e => e.status === 'active').length}</div>
        </div>
      </div>

      {/* Elections List */}
      <div className="space-y-4">
        {elections.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <FaCheckToSlot className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500 font-medium">Babu zabe tukuna.</p>
            <button onClick={openCreate} className="mt-4 text-sm text-[#0f3036] font-bold hover:underline">
              + Ƙara zabe na farko
            </button>
          </div>
        ) : (
          elections.map((election) => {
            const statusConfig = STATUS_CONFIG[election.status] || STATUS_CONFIG.upcoming;
            const StatusIcon = statusConfig.icon;
            const electionCandidates = candidates.filter(c => c.electionId === election.id);
            return (
              <div key={election.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{election.name}</h2>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" /> {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{election.fullName || election.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <FaCalendar className="text-gray-400" /> {election.date ? new Date(election.date).toLocaleDateString('ha-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Ba a saita ba'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaUsers className="text-gray-400" /> {electionCandidates.length} 'yan takara
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaChartPie className="text-gray-400" /> {election.electoralBody || 'INEC'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-100">
                  <Link
                    to={`/admin/elections/${election.id}/results`}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors"
                  >
                    <FaChartPie className="w-4 h-4" /> Sakamako
                  </Link>
                  <Link
                    to={`/admin/elections/${election.id}/candidates`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                  >
                    <FaUsers className="w-4 h-4" /> 'Yan Takara
                  </Link>
                  <Link
                    to={`/admin/elections/${election.id}/factchecks`}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-100 transition-colors"
                  >
                    <FaCheckToSlot className="w-4 h-4" /> Gaskiya
                  </Link>
                  <button
                    onClick={() => openEdit(election)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                  >
                    <FaPen className="w-4 h-4" /> Gyara
                  </button>
                  <button
                    onClick={() => handleDelete(election.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? 'Gyara Zabe' : 'Sabon Zabe'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sunan Zabe</label>
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="Zaben Gabaɗaya 2027" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cikakken Suna (Turanci)</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nigeria General Election 2027" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ranar Zabe</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Matsayi</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]">
                    <option value="upcoming">Mai Zuwa</option>
                    <option value="active">Kai Tsaye</option>
                    <option value="completed">An Kammala</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nau'i</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]">
                    <option value="general">Gabaɗaya</option>
                    <option value="presidential">Shugaban Ƙasa</option>
                    <option value="governor">Gwamna</option>
                    <option value="by-election">Cike Gurbi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hukumar Zabe</label>
                  <input name="electoralBody" value={formData.electoralBody} onChange={handleChange} placeholder="INEC" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bayani</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036] resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">Soke</button>
                <button type="submit" className="px-6 py-2 bg-[#0f3036] text-white text-sm font-bold rounded-lg hover:bg-[#1a454c] transition-colors">
                  {editingId ? 'Ajiye Canje-canje' : 'Ƙirƙiri Zabe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
