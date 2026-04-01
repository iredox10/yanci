import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaChartColumn, FaCirclePlus, FaTrashCan, FaFloppyDisk, FaArrowLeft,
  FaDownload, FaUpload, FaFilter,
} from 'react-icons/fa6';
import { useElection } from '../../context/ElectionContext';
import { PARTIES, STATE_RESULTS as SEED_STATE_RESULTS } from '../../data/electionData';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara',
];

const REGIONS = ['Duka', 'North West', 'North East', 'North Central', 'South West', 'South East', 'South South'];

const STATE_REGION_MAP = {
  'Abia': 'South East', 'Adamawa': 'North East', 'Akwa Ibom': 'South South', 'Anambra': 'South East',
  'Bauchi': 'North East', 'Bayelsa': 'South South', 'Benue': 'North Central', 'Borno': 'North East',
  'Cross River': 'South South', 'Delta': 'South South', 'Ebonyi': 'South East', 'Edo': 'South South',
  'Ekiti': 'South West', 'Enugu': 'South East', 'FCT': 'North Central', 'Gombe': 'North East',
  'Imo': 'South East', 'Jigawa': 'North West', 'Kaduna': 'North West', 'Kano': 'North West',
  'Katsina': 'North West', 'Kebbi': 'North West', 'Kogi': 'North Central', 'Kwara': 'North Central',
  'Lagos': 'South West', 'Nasarawa': 'North Central', 'Niger': 'North Central', 'Ogun': 'South West',
  'Ondo': 'South West', 'Osun': 'South West', 'Oyo': 'South West', 'Plateau': 'North Central',
  'Rivers': 'South South', 'Sokoto': 'North West', 'Taraba': 'North East', 'Yobe': 'North East',
  'Zamfara': 'North West',
};

function getParty(id) {
  return PARTIES.find((p) => p.id === id) || PARTIES[0];
}

export default function AdminElectionResults() {
  const { id } = useParams();
  const { elections, candidates, results, addResult, updateResult, deleteResult, bulkUpdateResults } = useElection();
  const [activeRegion, setActiveRegion] = useState('Duka');
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const election = elections.find(e => e.id === id) || elections[0];
  const electionCandidates = election ? candidates.filter(c => c.electionId === election.id || c.position === 'president') : [];

  // Build state results from seed + Appwrite data
  const stateResults = useMemo(() => {
    const seedMap = {};
    SEED_STATE_RESULTS.forEach(sr => {
      seedMap[sr.state] = sr;
    });
    return NIGERIAN_STATES.map(state => {
      const seed = seedMap[state] || {
        state,
        region: STATE_REGION_MAP[state] || 'Unknown',
        presidential: {},
        turnout: 0,
        governor: null,
      };
      // Merge with Appwrite results if available
      const stateResultData = results.find(r => r.state === state && r.electionId === id);
      if (stateResultData) {
        return { ...seed, ...stateResultData };
      }
      return seed;
    });
  }, [results, id]);

  const filteredStates = useMemo(() => {
    if (activeRegion === 'Duka') return stateResults;
    return stateResults.filter(s => s.region === activeRegion);
  }, [stateResults, activeRegion]);

  const handleCellEdit = (state, candidateId) => {
    setEditingCell({ state, candidateId });
    const stateData = stateResults.find(s => s.state === state);
    const currentVal = stateData?.presidential?.[candidateId] || 0;
    setEditValue(String(currentVal));
  };

  const handleCellSave = async () => {
    if (!editingCell) return;
    const { state, candidateId } = editingCell;
    const val = parseInt(editValue) || 0;

    const existingResult = results.find(r => r.state === state && r.electionId === id);
    const stateData = stateResults.find(s => s.state === state);
    const newPresidential = { ...(stateData?.presidential || {}), [candidateId]: val };

    if (existingResult) {
      await updateResult(existingResult.id, { presidential: newPresidential });
    } else {
      await addResult({
        electionId: id,
        state,
        region: STATE_REGION_MAP[state] || '',
        presidential: newPresidential,
        turnout: stateData?.turnout || 0,
        governor: stateData?.governor || null,
      });
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCellSave();
    if (e.key === 'Escape') { setEditingCell(null); setEditValue(''); }
    if (e.key === 'Tab') {
      e.preventDefault();
      handleCellSave();
      // Move to next candidate or next state
      const currentIdx = electionCandidates.findIndex(c => c.id === editingCell?.candidateId);
      const stateIdx = NIGERIAN_STATES.findIndex(s => s === editingCell?.state);
      if (currentIdx < electionCandidates.length - 1) {
        handleCellEdit(editingCell.state, electionCandidates[currentIdx + 1].id);
      } else if (stateIdx < NIGERIAN_STATES.length - 1) {
        handleCellEdit(NIGERIAN_STATES[stateIdx + 1], electionCandidates[0]?.id);
      }
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    // In a real app, this would batch-save all state results
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
  };

  // Calculate totals
  const totals = useMemo(() => {
    const t = {};
    electionCandidates.forEach(c => { t[c.id] = 0; });
    filteredStates.forEach(s => {
      electionCandidates.forEach(c => {
        t[c.id] += s.presidential?.[c.id] || 0;
      });
    });
    return t;
  }, [filteredStates, electionCandidates]);

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/elections" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaArrowLeft className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FaChartColumn className="text-[#0f3036]" />
              Sakamako — {election.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Shigar da sakamako kowace jiha. Danna cell don gyara.</p>
          </div>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0f3036] text-white rounded-lg font-bold text-sm hover:bg-[#1a454c] transition-colors disabled:opacity-50"
        >
          <FaFloppyDisk className="w-4 h-4" /> {saving ? 'Ana ajiyewa...' : 'Ajiye Duka'}
        </button>
      </div>

      {/* Region Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
        <FaFilter className="text-gray-400 shrink-0" />
        {REGIONS.map(region => (
          <button
            key={region}
            onClick={() => setActiveRegion(region)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeRegion === region
                ? 'bg-[#0f3036] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                  Jiha
                </th>
                <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500 min-w-[100px]">
                  Yanki
                </th>
                {electionCandidates.map(c => {
                  const party = getParty(c.party);
                  return (
                    <th key={c.id} className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider min-w-[80px]" style={{ color: party.color }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }} />
                        {party.name}
                      </div>
                    </th>
                  );
                })}
                <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500 min-w-[80px]">
                  Jimla
                </th>
                <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500 min-w-[80px]">
                  Halarta
                </th>
                <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500 min-w-[80px]">
                  Gwamna
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((stateData) => {
                const stateTotal = electionCandidates.reduce((sum, c) => sum + (stateData.presidential?.[c.id] || 0), 0);
                const maxVal = Math.max(...electionCandidates.map(c => stateData.presidential?.[c.id] || 0));
                const winner = electionCandidates.find(c => stateData.presidential?.[c.id] === maxVal && maxVal > 0);
                return (
                  <tr key={stateData.state} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 font-bold sticky left-0 bg-white z-10">
                      {stateData.state}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">
                      {stateData.region}
                    </td>
                    {electionCandidates.map(c => {
                      const val = stateData.presidential?.[c.id] || 0;
                      const party = getParty(c.party);
                      const isEditing = editingCell?.state === stateData.state && editingCell?.candidateId === c.id;
                      const isWinner = c.id === winner?.id;
                      return (
                        <td key={c.id} className="px-4 py-2.5 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onBlur={handleCellSave}
                              onKeyDown={handleKeyDown}
                              autoFocus
                              className="w-20 px-2 py-1 border-2 border-[#0f3036] rounded text-sm text-center font-bold focus:outline-none"
                            />
                          ) : (
                            <button
                              onClick={() => handleCellEdit(stateData.state, c.id)}
                              className={`text-sm font-bold px-2 py-1 rounded hover:bg-gray-100 transition-colors min-w-[60px] ${
                                isWinner ? 'font-black' : 'text-gray-400'
                              }`}
                              style={isWinner ? { color: party.color } : {}}
                            >
                              {val > 0 ? `${val}%` : '—'}
                            </button>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2.5 text-center font-black text-sm">
                      {stateTotal > 0 ? `${stateTotal}%` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        stateData.turnout > 40 ? 'bg-green-100 text-green-700' :
                        stateData.turnout > 30 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {stateData.turnout > 0 ? `${stateData.turnout}%` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {stateData.governor ? (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: (getParty(stateData.governor)?.color || '#888') + '20',
                            color: getParty(stateData.governor)?.color || '#888',
                          }}
                        >
                          {getParty(stateData.governor)?.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* Totals Row */}
              <tr className="bg-gray-50 border-t-2 border-gray-200 font-black">
                <td className="px-4 py-3 sticky left-0 bg-gray-50 z-10">JIMLA</td>
                <td className="px-4 py-3"></td>
                {electionCandidates.map(c => {
                  const party = getParty(c.party);
                  const total = totals[c.id] || 0;
                  const avg = filteredStates.length > 0 ? (total / filteredStates.length).toFixed(1) : 0;
                  return (
                    <td key={c.id} className="px-4 py-3 text-center" style={{ color: party.color }}>
                      {avg}%
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-center"></td>
                <td className="px-4 py-3 text-center"></td>
                <td className="px-4 py-3 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 flex items-center gap-4">
        <span>💡 Danna cell don shigar da kashi (%)</span>
        <span>⏎ Enter = Ajiye</span>
        <span>Tab = Matsarwa gaba</span>
        <span>Esc = Soke</span>
      </div>
    </div>
  );
}
