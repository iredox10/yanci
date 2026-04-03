import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaChartColumn, FaFloppyDisk, FaArrowLeft,
  FaFilter, FaCircleCheck, FaTriangleExclamation,
  FaCircleXmark, FaRotate, FaCirclePlus, FaArrowUpRightFromSquare,
  FaDownload, FaDatabase,
} from 'react-icons/fa6';
import { useElection } from '../../context/ElectionContext';
import { PARTIES, STATE_RESULTS as SEED_STATE_RESULTS, computeNationalTotals, CANDIDATES } from '../../data/electionData';

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

function getCandidate(id) {
  return CANDIDATES.find((c) => c.id === id);
}

function formatNumber(n) {
  if (n == null) return '—';
  return n.toLocaleString('en-NG');
}

function emptyStateResult(state) {
  return {
    state,
    region: STATE_REGION_MAP[state] || '',
    registeredVoters: 0,
    accreditedVoters: 0,
    validVotes: 0,
    rejectedVotes: 0,
    totalVotesCast: 0,
    candidateVotes: {},
    met25Threshold: [],
    winner: null,
    governor: null,
    senate: {},
  };
}

export default function AdminElectionResults() {
  const { id } = useParams();
  const { elections, candidates: ctxCandidates, results, addResult, updateResult, deleteResult } = useElection();
  const [activeRegion, setActiveRegion] = useState('Duka');
  const [searchState, setSearchState] = useState('');
  const [expandedState, setExpandedState] = useState(null);
  const [editingState, setEditingState] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const election = elections.find(e => e.id === id) || elections[0];
  const electionCandidates = election
    ? ctxCandidates.filter(c => c.electionId === election.id || c.position === 'president')
    : [];

  // Build state results: merge seed data with Appwrite overrides
  const stateResults = useMemo(() => {
    const seedMap = {};
    SEED_STATE_RESULTS.forEach(sr => { seedMap[sr.state] = { ...sr }; });
    results.forEach(r => {
      if (r.state && seedMap[r.state]) {
        Object.assign(seedMap[r.state], r);
      }
    });
    return NIGERIAN_STATES.map(state => {
      if (seedMap[state]) return seedMap[state];
      return emptyStateResult(state);
    });
  }, [results]);

  // Compute national totals
  const nationalTotals = useMemo(() => {
    return computeNationalTotals(electionCandidates.map(c => c.id));
  }, [stateResults, electionCandidates]);

  const filteredStates = useMemo(() => {
    let states = stateResults;
    if (activeRegion !== 'Duka') {
      states = states.filter(s => s.region === activeRegion);
    }
    if (searchState) {
      states = states.filter(s => s.state.toLowerCase().includes(searchState.toLowerCase()));
    }
    return states;
  }, [stateResults, activeRegion, searchState]);

  // Summary stats for the region filter
  const regionTotals = useMemo(() => {
    let reg = 0, accred = 0, valid = 0, rejected = 0;
    filteredStates.forEach(s => {
      reg += s.registeredVoters || 0;
      accred += s.accreditedVoters || 0;
      valid += s.validVotes || 0;
      rejected += s.rejectedVotes || 0;
    });
    return {
      registeredVoters: reg,
      accreditedVoters: accred,
      validVotes: valid,
      rejectedVotes: rejected,
      turnoutPct: reg > 0 ? ((accred / reg) * 100).toFixed(1) : 0,
      statesReported: filteredStates.filter(s => s.validVotes > 0).length,
    };
  }, [filteredStates]);

  // Open edit modal for a state
  const openEdit = useCallback((stateData) => {
    setEditingState(stateData.state);
    setEditForm({
      registeredVoters: stateData.registeredVoters || 0,
      accreditedVoters: stateData.accreditedVoters || 0,
      validVotes: stateData.validVotes || 0,
      rejectedVotes: stateData.rejectedVotes || 0,
      candidateVotes: { ...(stateData.candidateVotes || {}) },
      governor: stateData.governor || '',
      verified: stateData.verified || false,
    });
  }, []);

  const closeEdit = () => {
    setEditingState(null);
    setEditForm(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCandidateVoteChange = (candidateId, value) => {
    setEditForm(prev => ({
      ...prev,
      candidateVotes: { ...prev.candidateVotes, [candidateId]: parseInt(value) || 0 },
    }));
  };

  const handleSaveState = async () => {
    if (!editingState || !editForm) return;
    setSaving(true);

    const validVotes = editForm.validVotes || 0;
    const candidateVotes = editForm.candidateVotes || {};

    let maxVotes = 0;
    let winner = null;
    const met25 = [];

    Object.entries(candidateVotes).forEach(([cid, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = cid;
      }
      if (validVotes > 0 && (votes / validVotes) >= 0.25) {
        met25.push(cid);
      }
    });

    const resultData = {
      electionId: election?.id,
      state: editingState,
      region: STATE_REGION_MAP[editingState] || '',
      registeredVoters: editForm.registeredVoters,
      accreditedVoters: editForm.accreditedVoters,
      validVotes: editForm.validVotes,
      rejectedVotes: editForm.rejectedVotes,
      totalVotesCast: (editForm.accreditedVoters || 0),
      candidateVotes,
      met25Threshold: met25,
      winner,
      governor: editForm.governor || null,
      verified: editForm.verified || false,
    };

    const existing = results.find(r => r.state === editingState && r.electionId === election?.id);
    if (existing) {
      await updateResult(existing.id, resultData);
    } else {
      await addResult(resultData);
    }

    setSaveMessage({ type: 'success', text: `An ajiye sakamakon ${editingState}` });
    setTimeout(() => setSaveMessage(null), 3000);
    closeEdit();
    setSaving(false);
  };

  const handleResetToSeed = async (stateName) => {
    if (!confirm(`Ka tabbata kana son maido da sakamakon ${stateName} zuwa bayanan asali?`)) return;
    const existing = results.find(r => r.state === stateName && r.electionId === election?.id);
    if (existing) {
      await deleteResult(existing.id);
    }
    setSaveMessage({ type: 'info', text: `An maido da ${stateName} zuwa bayanan asali` });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Export results as CSV
  const handleExportCSV = () => {
    const headers = ['State', 'Region', 'Registered Voters', 'Accredited Voters', 'Valid Votes', 'Rejected Votes', 'Turnout %', ...electionCandidates.map(c => c.name), 'Winner', 'Governor'];
    const rows = stateResults.map(s => {
      const turnout = s.registeredVoters > 0 ? ((s.accreditedVoters / s.registeredVoters) * 100).toFixed(1) : 0;
      const winner = getCandidate(s.winner);
      return [
        s.state, s.region, s.registeredVoters, s.accreditedVoters, s.validVotes, s.rejectedVotes, turnout,
        ...electionCandidates.map(c => s.candidateVotes?.[c.id] || 0),
        winner?.name || '', s.governor || '',
      ];
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election-results-${election.id}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Seed all states from seed data
  const handleSeedAll = async () => {
    if (!confirm('Ka tabbata kana son cika dukkan jihohi 37 da bayanan asali? Wannan zai maye gurbin duk canje-canjen da aka yi.')) return;
    setSaving(true);
    const promises = SEED_STATE_RESULTS.map(sr => {
      const existing = results.find(r => r.state === sr.state && r.electionId === election?.id);
      const data = {
        electionId: election?.id,
        state: sr.state,
        region: sr.region,
        registeredVoters: sr.registeredVoters,
        accreditedVoters: sr.accreditedVoters,
        validVotes: sr.validVotes,
        rejectedVotes: sr.rejectedVotes,
        totalVotesCast: sr.totalVotesCast,
        candidateVotes: sr.candidateVotes,
        met25Threshold: sr.met25Threshold,
        winner: sr.winner,
        governor: sr.governor || null,
        senate: sr.senate || {},
      };
      if (existing) {
        return updateResult(existing.id, data);
      }
      return addResult(data);
    });
    await Promise.all(promises);
    setSaveMessage({ type: 'success', text: `An cika dukkan jihohi ${SEED_STATE_RESULTS.length} da bayanan asali` });
    setTimeout(() => setSaveMessage(null), 5000);
    setSaving(false);
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
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/elections" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaArrowLeft className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FaChartColumn className="text-[#0f3036]" />
              Sakamako — {election.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Shigar da sakamako kowace jiha — masu rajista, waɗanda suka kada kuri'a, kuri'u ingantattu, da kuri'un 'yan takara.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/zabe/sakamako"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
          >
            <FaArrowUpRightFromSquare className="w-4 h-4" /> Duba
          </a>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            <FaDownload className="w-4 h-4" /> Export
          </button>
          <button
            onClick={handleSeedAll}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            <FaDatabase className="w-4 h-4" /> Cika Duka
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${
          saveMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {saveMessage.type === 'success' ? <FaCircleCheck /> : <FaTriangleExclamation />}
          {saveMessage.text}
        </div>
      )}

      {/* National Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Masu Rajista</div>
          <div className="text-xl font-black">{formatNumber(nationalTotals.registeredVoters)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Waɗanda suka Kada</div>
          <div className="text-xl font-black">{formatNumber(nationalTotals.accreditedVoters)}</div>
          <div className="text-xs text-gray-500">{nationalTotals.turnout.toFixed(1)}% halarta</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Kuri'u Ingantattu</div>
          <div className="text-xl font-black">{formatNumber(nationalTotals.validVotes)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Kuri'un da aka Ki</div>
          <div className="text-xl font-black text-red-600">{formatNumber(nationalTotals.rejectedVotes)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Jihohi sun Ruwaito</div>
          <div className="text-xl font-black">{regionTotals.statesReported}/{filteredStates.length}</div>
        </div>
      </div>

      {/* Candidate Vote Totals */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Jimlar Kuri'u na Ƙasa</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {electionCandidates.map(c => {
            const party = getParty(c.party);
            const votes = nationalTotals.candidateVotes[c.id] || 0;
            const pct = nationalTotals.candidatePercentages[c.id] || 0;
            const statesWon = nationalTotals.statesWon[c.id] || 0;
            const states25 = nationalTotals.statesMet25[c.id] || 0;
            return (
              <div key={c.id} className="p-4 rounded-lg" style={{ backgroundColor: party.color + '10' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }} />
                  <span className="font-bold text-sm">{c.name}</span>
                </div>
                <div className="text-2xl font-black" style={{ color: party.color }}>
                  {formatNumber(votes)}
                </div>
                <div className="text-sm font-bold" style={{ color: party.color }}>{pct.toFixed(1)}%</div>
                <div className="text-xs text-gray-500 mt-1">
                  Jihohi {statesWon} | 25% a {states25}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Region Filter + Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
        <input
          type="text"
          value={searchState}
          onChange={e => setSearchState(e.target.value)}
          placeholder="Nemi jiha..."
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]"
        />
      </div>

      {/* State Results Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: '1100px' }}>
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-50 z-20 min-w-[100px]">
                  Jiha
                </th>
                <th className="text-right px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500 min-w-[80px]">
                  Masu Rajista
                </th>
                <th className="text-right px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500 min-w-[80px]">
                  Su ka Kada
                </th>
                <th className="text-right px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500 min-w-[60px]">
                  Halarta
                </th>
                <th className="text-right px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500 min-w-[80px]">
                  Ingantattu
                </th>
                <th className="text-right px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500 min-w-[60px]">
                  An Ki
                </th>
                {electionCandidates.map(c => {
                  const party = getParty(c.party);
                  return (
                    <th key={c.id} className="text-right px-3 py-3 font-bold text-[10px] uppercase tracking-wider min-w-[70px]" style={{ color: party.color }}>
                      {party.name}
                    </th>
                  );
                })}
                <th className="text-center px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500 min-w-[60px]">
                  Wanda ya Ci
                </th>
                <th className="text-center px-3 py-3 font-bold text-[10px] uppercase tracking-wider text-gray-500 min-w-[65px] sticky right-0 bg-gray-50 z-20">
                  Aiki
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((stateData) => {
                const turnout = stateData.registeredVoters > 0
                  ? ((stateData.accreditedVoters / stateData.registeredVoters) * 100).toFixed(1)
                  : 0;
                const winner = stateData.winner ? getCandidate(stateData.winner) : null;
                const winnerParty = winner ? getParty(winner.party) : null;
                const isExpanded = expandedState === stateData.state;

                return (
                  <tr key={stateData.state} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-bold sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setExpandedState(isExpanded ? null : stateData.state)}
                          className="flex items-center gap-1 hover:text-[#0f3036] transition-colors"
                        >
                          {isExpanded ? '▾' : '▸'} {stateData.state}
                        </button>
                        {stateData.verified && <FaCircleCheck className="w-3.5 h-3.5 text-green-600" title="Tabbatar" />}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{formatNumber(stateData.registeredVoters)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{formatNumber(stateData.accreditedVoters)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        parseFloat(turnout) > 40 ? 'bg-green-100 text-green-700' :
                        parseFloat(turnout) > 30 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {turnout}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{formatNumber(stateData.validVotes)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-red-500">{formatNumber(stateData.rejectedVotes)}</td>
                    {electionCandidates.map(c => {
                      const votes = stateData.candidateVotes?.[c.id] || 0;
                      const party = getParty(c.party);
                      const pct = stateData.validVotes > 0 ? ((votes / stateData.validVotes) * 100).toFixed(1) : '0.0';
                      const isWinner = stateData.winner === c.id;
                      return (
                        <td key={c.id} className="px-3 py-2.5 text-right">
                          <div className={`font-mono text-xs ${isWinner ? 'font-black' : 'text-gray-500'}`} style={isWinner ? { color: party.color } : {}}>
                            {votes > 0 ? formatNumber(votes) : '—'}
                          </div>
                          {votes > 0 && (
                            <div className="text-[9px] text-gray-400">{pct}%</div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-center">
                      {winnerParty ? (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: winnerParty.color + '20', color: winnerParty.color }}
                        >
                          {winnerParty.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center sticky right-0 bg-white z-10">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(stateData)}
                          className="p-1.5 hover:bg-blue-50 rounded transition-colors text-gray-400 hover:text-blue-600"
                          title="Gyara"
                        >
                          <FaCirclePlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleResetToSeed(stateData.state)}
                          className="p-1.5 hover:bg-amber-50 rounded transition-colors text-gray-400 hover:text-amber-600"
                          title="Maido da asali"
                        >
                          <FaRotate className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between rounded-b-xl">
          <span>Nuna {filteredStates.length} daga cikin jihohi {stateResults.length}</span>
          <span className="text-gray-400">↔ Gurgura don ganin duka</span>
        </div>
      </div>

      {/* Expanded State Detail */}
      {expandedState && (() => {
        const sd = stateResults.find(s => s.state === expandedState);
        if (!sd) return null;
        const turnout = sd.registeredVoters > 0 ? ((sd.accreditedVoters / sd.registeredVoters) * 100).toFixed(1) : 0;
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{sd.state} — Cikakkun Bayanai</h3>
              <button onClick={() => setExpandedState(null)} className="text-gray-400 hover:text-gray-600">
                <FaCircleXmark className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Masu Rajista</div>
                <div className="text-lg font-black">{formatNumber(sd.registeredVoters)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Waɗanda suka Kada</div>
                <div className="text-lg font-black">{formatNumber(sd.accreditedVoters)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Halarta</div>
                <div className="text-lg font-black">{turnout}%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Ingantattu</div>
                <div className="text-lg font-black">{formatNumber(sd.validVotes)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">An Ki</div>
                <div className="text-lg font-black text-red-600">{formatNumber(sd.rejectedVotes)}</div>
              </div>
            </div>

            {/* Candidate breakdown */}
            <div className="space-y-3">
              {electionCandidates.map(c => {
                const party = getParty(c.party);
                const votes = sd.candidateVotes?.[c.id] || 0;
                const pct = sd.validVotes > 0 ? ((votes / sd.validVotes) * 100).toFixed(1) : '0.0';
                const isWinner = sd.winner === c.id;
                const met25 = sd.validVotes > 0 && (votes / sd.validVotes) >= 0.25;
                const barWidth = sd.validVotes > 0 ? (votes / sd.validVotes) * 100 : 0;

                return (
                  <div key={c.id} className={`p-3 rounded-lg ${isWinner ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }} />
                        <span className="font-bold text-sm">{c.name}</span>
                        {isWinner && <FaCircleCheck className="text-green-600 w-4 h-4" />}
                        {met25 && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">≥25%</span>}
                      </div>
                      <div className="text-right">
                        <span className="font-black" style={{ color: party.color }}>{formatNumber(votes)}</span>
                        <span className="text-xs text-gray-500 ml-2">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${barWidth}%`, backgroundColor: party.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 25% threshold check */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Ƙa'idar 25%:</strong> {sd.met25Threshold?.length || 0} 'yan takara sun wuce 25% a {sd.state}.
                {sd.met25Threshold?.length >= 1 ? ' An cika sharadi a wannan jiha.' : ' Babu wanda ya cika sharadi.'}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Edit Modal */}
      {editingState && editForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeEdit}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold">Gyara Sakamako — {editingState}</h2>
                <p className="text-xs text-gray-500 mt-1">Shigar da bayanan zabe kamar yadda INEC ta sanar</p>
              </div>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaCircleXmark className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Voter Stats */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Bayanan Masu Zabe</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Masu Rajista</label>
                    <input type="number" value={editForm.registeredVoters} onChange={e => handleEditChange('registeredVoters', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Waɗanda suka Kada</label>
                    <input type="number" value={editForm.accreditedVoters} onChange={e => handleEditChange('accreditedVoters', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kuri'u Ingantattu</label>
                    <input type="number" value={editForm.validVotes} onChange={e => handleEditChange('validVotes', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Kuri'un da aka Ki</label>
                    <input type="number" value={editForm.rejectedVotes} onChange={e => handleEditChange('rejectedVotes', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]" />
                  </div>
                </div>
                {editForm.accreditedVoters > 0 && editForm.registeredVoters > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Halarta: {((editForm.accreditedVoters / editForm.registeredVoters) * 100).toFixed(1)}%
                  </p>
                )}
              </div>

              {/* Candidate Votes */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Kuri'un 'Yan Takara</h3>
                <div className="space-y-3">
                  {electionCandidates.map(c => {
                    const party = getParty(c.party);
                    const votes = editForm.candidateVotes?.[c.id] || 0;
                    const pct = editForm.validVotes > 0 ? ((votes / editForm.validVotes) * 100).toFixed(1) : '0.0';
                    const met25 = editForm.validVotes > 0 && (votes / editForm.validVotes) >= 0.25;
                    return (
                      <div key={c.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: party.color }} />
                        <div className="w-32 shrink-0">
                          <div className="font-bold text-sm">{c.name}</div>
                          <div className="text-[10px] text-gray-500">{party.name}</div>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={votes || ''}
                            onChange={e => handleCandidateVoteChange(c.id, e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]"
                          />
                        </div>
                        <div className="w-20 text-right shrink-0">
                          <div className="font-bold text-sm" style={{ color: party.color }}>{pct}%</div>
                          {met25 && <div className="text-[9px] text-green-600 font-bold">≥25% ✓</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Governor */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Gwamna (zaɓi)</h3>
                <select
                  value={editForm.governor || ''}
                  onChange={e => handleEditChange('governor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]"
                >
                  <option value="">— Babu —</option>
                  {PARTIES.map(p => <option key={p.id} value={p.id}>{p.name} — {p.fullName}</option>)}
                </select>
              </div>

              {/* Verified Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                  <input type="checkbox" checked={editForm.verified || false} onChange={e => handleEditChange('verified', e.target.checked)} className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                  <div>
                    <span className="text-sm font-bold text-gray-700">Tabbatar da Sakamako</span>
                    <p className="text-xs text-gray-500">Alama yana nuna cewa an tabbatar da wannan sakamako daga INEC</p>
                  </div>
                </label>
                {(editForm.verified || false) && <FaCircleCheck className="w-6 h-6 text-green-600" />}
              </div>

              {/* Validation */}
              {(() => {
                const totalCandidateVotes = Object.values(editForm.candidateVotes || {}).reduce((a, b) => a + b, 0);
                const diff = Math.abs(totalCandidateVotes - (editForm.validVotes || 0));
                if (editForm.validVotes > 0 && diff > 0) {
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-700">
                        ⚠️ Jimlar kuri'un 'yan takara ({formatNumber(totalCandidateVotes)}) ba ta daidai da kuri'u ingantattu ({formatNumber(editForm.validVotes)}). Bambanci: {formatNumber(diff)}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={closeEdit} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">Soke</button>
              <button
                onClick={handleSaveState}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#0f3036] text-white text-sm font-bold rounded-lg hover:bg-[#1a454c] transition-colors disabled:opacity-50"
              >
                <FaFloppyDisk className="w-4 h-4" />
                {saving ? 'Ana ajiyewa...' : 'Ajiye Sakamako'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
