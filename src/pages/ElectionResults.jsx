import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronRight, FaClock, FaFilter, FaArrowUp, FaBuildingColumns,
  FaGavel, FaPersonBooth, FaChartLine,
} from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import SEO from '../components/SEO';
import { RESULTS, STATE_RESULTS, PARTIES, CANDIDATES } from '../data/electionData';

const REGIONS = ['Duka', 'North West', 'North East', 'North Central', 'South West', 'South East', 'South South'];

function getParty(id) {
  return PARTIES.find((p) => p.id === id) || PARTIES[0];
}

function getCandidate(id) {
  return CANDIDATES.find((c) => c.id === id);
}

export default function ElectionResults() {
  const [activeTab, setActiveTab] = useState('presidential');
  const [activeRegion, setActiveRegion] = useState('Duka');
  const [searchState, setSearchState] = useState('');

  const filteredStates = useMemo(() => {
    let states = STATE_RESULTS;
    if (activeRegion !== 'Duka') {
      states = states.filter((s) => s.region === activeRegion);
    }
    if (searchState) {
      states = states.filter((s) => s.state.toLowerCase().includes(searchState.toLowerCase()));
    }
    return states;
  }, [activeRegion, searchState]);

  const presResults = RESULTS.presidential;

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title="Sakamako Kai Tsaye — Zabe 2027 | Yanci"
        description="Sakamako kai tsaye na zaben Najeriya 2027 — shugaban ƙasa, majalisar dattawa, gwamnoni."
        url="/zabe/sakamako"
      />
      <GuardianNav />

      {/* Header */}
      <div className="bg-[#1a1a2e] text-white py-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Kai Tsaye
            </span>
          </div>
          <h1 className="font-serif font-black text-3xl md:text-5xl tracking-tighter">
            Sakamako Kai Tsaye
          </h1>
          <p className="text-white/60 text-sm mt-2">
            An ruwaito jihohi {presResults.statesReported} / {presResults.statesTotal} · Matsakaicin halarta: {presResults.turnout}%
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {[
            { id: 'presidential', label: 'Shugaban Ƙasa', icon: FaPersonBooth },
            { id: 'senate', label: 'Majalisar Dattawa', icon: FaBuildingColumns },
            { id: 'governor', label: 'Gwamnoni', icon: FaGavel },
            { id: 'states', label: 'Jihohi', icon: FaChartLine },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0f3460] text-[#0f3460]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Presidential Results */}
        {activeTab === 'presidential' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Jimlar Kuri'u</div>
                <div className="text-2xl font-black">{(presResults.totalVotesCast / 1000000).toFixed(1)}M</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Halarta</div>
                <div className="text-2xl font-black">{presResults.turnout}%</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Jihohi</div>
                <div className="text-2xl font-black">{presResults.statesReported}/{presResults.statesTotal}</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">An Sabawa</div>
                <div className="text-sm font-bold">{new Date(presResults.lastUpdated).toLocaleString('ha-NG')}</div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-lg">Teburin 'Yan Takara</h2>
              </div>
              <div className="p-6">
                {[...presResults.candidates]
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((c, idx) => {
                    const candidate = getCandidate(c.candidateId);
                    const party = getParty(candidate?.party);
                    const isLeading = idx === 0;
                    return (
                      <div
                        key={c.candidateId}
                        className={`flex items-center gap-4 py-4 ${isLeading ? 'bg-green-50 -mx-6 px-6' : ''} ${idx < presResults.candidates.length - 1 ? 'border-b border-gray-50' : ''}`}
                      >
                        <div className="w-8 text-center">
                          <span className={`text-lg font-black ${isLeading ? 'text-green-600' : 'text-gray-400'}`}>
                            {idx + 1}
                          </span>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: party.color }}
                        >
                          {(candidate?.name || 'C')[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold">{candidate?.name || c.candidateId}</div>
                          <div className="text-xs text-gray-500">{party.name} · {party.fullName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-xl">{c.percentage.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">{(c.votes / 1000000).toFixed(2)}M kuri'u</div>
                          <div className="text-xs text-gray-400">Jihohi {c.statesWon}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Progress Bars */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Kwatanta Kuri'u</h3>
              {presResults.candidates.map((c) => {
                const candidate = getCandidate(c.candidateId);
                const party = getParty(candidate?.party);
                const maxVotes = Math.max(...presResults.candidates.map((x) => x.votes));
                const barWidth = maxVotes > 0 ? (c.votes / maxVotes) * 100 : 0;
                return (
                  <div key={c.candidateId} className="mb-5 last:mb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }} />
                        <span className="font-bold text-sm">{candidate?.name}</span>
                      </div>
                      <span className="font-black">{c.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${barWidth}%`, backgroundColor: party.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Senate Results */}
        {activeTab === 'senate' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Majalisar Dattawa — Kujeru 109</h2>
                <span className="text-sm text-gray-500">{RESULTS.senate.seatsReported}/109 sun ruwaito</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {RESULTS.senate.parties.map((p) => {
                  const party = getParty(p.partyId);
                  return (
                    <div key={p.partyId} className="text-center p-4 rounded-lg" style={{ backgroundColor: party.color + '10' }}>
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" style={{ backgroundColor: party.color }}>
                        {party.name[0]}
                      </div>
                      <div className="text-2xl font-black">{p.seats}</div>
                      <div className="text-xs font-bold" style={{ color: party.color }}>{party.name}</div>
                      {p.leading > 0 && (
                        <div className="text-[10px] text-gray-500 mt-1">+{p.leading} leading</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Governor Results */}
        {activeTab === 'governor' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Gwamnoni — Jihohi 36</h2>
                <span className="text-sm text-gray-500">{RESULTS.governor.statesReported}/36 sun ruwaito</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {RESULTS.governor.parties.map((p) => {
                  const party = getParty(p.partyId);
                  return (
                    <div key={p.partyId} className="text-center p-4 rounded-lg" style={{ backgroundColor: party.color + '10' }}>
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" style={{ backgroundColor: party.color }}>
                        {party.name[0]}
                      </div>
                      <div className="text-2xl font-black">{p.states}</div>
                      <div className="text-xs font-bold" style={{ color: party.color }}>{party.name}</div>
                      {p.leading > 0 && (
                        <div className="text-[10px] text-gray-500 mt-1">+{p.leading} leading</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* State-by-State Results */}
        {activeTab === 'states' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <FaFilter className="text-gray-400 shrink-0" />
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      activeRegion === region
                        ? 'bg-[#0f3460] text-white'
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
                onChange={(e) => setSearchState(e.target.value)}
                placeholder="Nemi jiha..."
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/20 focus:border-[#0f3460]"
              />
            </div>

            {/* State Results Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Jiha</th>
                      <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Yanki</th>
                      <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Halarta</th>
                      {CANDIDATES.map((c) => {
                        const party = getParty(c.party);
                        return (
                          <th key={c.id} className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider" style={{ color: party.color }}>
                            {party.name}
                          </th>
                        );
                      })}
                      <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Gwamna</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStates.map((state) => {
                      const maxPct = Math.max(state.presidential.c1, state.presidential.c2, state.presidential.c3, state.presidential.c4);
                      const winner = Object.entries(state.presidential).find(([, v]) => v === maxPct)?.[0];
                      return (
                        <tr key={state.state} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-bold">{state.state}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{state.region}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              state.turnout > 40 ? 'bg-green-100 text-green-700' :
                              state.turnout > 30 ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {state.turnout}%
                            </span>
                          </td>
                          {CANDIDATES.map((c) => {
                            const party = getParty(c.party);
                            const pct = state.presidential[c.id] || 0;
                            const isWinner = c.id === winner;
                            return (
                              <td key={c.id} className="px-4 py-3 text-center">
                                <span className={`text-xs font-bold ${isWinner ? '' : 'text-gray-400'}`} style={isWinner ? { color: party.color } : {}}>
                                  {pct}%
                                </span>
                              </td>
                            );
                          })}
                          <td className="px-4 py-3">
                            {state.governor ? (
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: (getParty(state.governor)?.color || '#888') + '20',
                                  color: getParty(state.governor)?.color || '#888',
                                }}
                              >
                                {getParty(state.governor)?.name}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      <GuardianFooter />
    </div>
  );
}
