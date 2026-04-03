import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronRight, FaUsers, FaMapLocationDot, FaCheckToSlot,
  FaChartColumn, FaClock, FaShieldHalved, FaBullhorn, FaArrowUpRightFromSquare,
  FaFire, FaPersonBooth, FaBuildingColumns, FaGavel, FaCircleCheck,
} from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import SEO from '../components/SEO';
import { useNews } from '../context/NewsContext';
import { useElection } from '../context/ElectionContext';
import {
  ELECTION_INFO, PARTIES, CANDIDATES, FACT_CHECKS, KEY_RACES, VOTER_INFO,
  STATE_RESULTS as SEED_STATE_RESULTS, computeNationalTotals,
} from '../data/electionData';

const VERDICT_COLORS = {
  true: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Gaskiya' },
  false: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Ƙarya' },
  misleading: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', label: 'Ba Gaskiya Ba' },
  unverified: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', label: 'Ba a Taba Ba' },
};

function getParty(id) {
  return PARTIES.find((p) => p.id === id) || PARTIES[0];
}

function getCandidate(id) {
  return electionCandidates.find((c) => c.id === id) || CANDIDATES.find((c) => c.id === id);
}

function formatNumber(n) {
  if (n == null) return '—';
  return n.toLocaleString('en-NG');
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const electionDate = new Date(ELECTION_INFO.date);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = electionDate - now;
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isElectionDay = timeLeft.days === 0;

  return (
    <div className="text-center">
      <div className="text-sm font-bold uppercase tracking-widest text-white/60 mb-3">
        {isElectionDay ? 'Ranar Zabe!' : 'Kidayar Kwanaki'}
      </div>
      <div className="flex items-center justify-center gap-3 md:gap-5">
        {[
          { value: timeLeft.days, label: 'Kwanaki' },
          { value: timeLeft.hours, label: 'Sa\'a' },
          { value: timeLeft.minutes, label: 'Minti' },
          { value: timeLeft.seconds, label: 'Daƙiƙa' },
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[60px] md:min-w-[80px]">
              <div className="text-2xl md:text-4xl font-black text-white font-mono">
                {String(unit.value).padStart(2, '0')}
              </div>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mt-2">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultProgressBar({ candidateId, votes, percentage, statesWon, states25, maxPercentage }) {
  const candidate = getCandidate(candidateId);
  const party = getParty(candidate?.party);
  const barWidth = maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0;
  const isLeading = percentage === maxPercentage && maxPercentage > 0;

  return (
    <div className={`mb-5 p-4 rounded-lg ${isLeading ? 'bg-green-50 border border-green-200' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: party.color }} />
          <span className="font-bold text-gray-900">{candidate?.name || candidateId}</span>
          {isLeading && <FaCircleCheck className="text-green-600 w-4 h-4" />}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: party.color + '20', color: party.color }}>
            {party.name}
          </span>
        </div>
        <div className="text-right">
          <span className="font-black text-xl" style={{ color: party.color }}>{percentage.toFixed(1)}%</span>
          <div className="text-xs text-gray-500">{formatNumber(votes)} kuri'u</div>
        </div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${barWidth}%`, backgroundColor: party.color }} />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>Jihohi {statesWon} won</span>
        <span>25% a {states25} jihohi</span>
      </div>
    </div>
  );
}

function FactCheckCard({ factCheck }) {
  const verdict = VERDICT_COLORS[factCheck.verdict] || VERDICT_COLORS.unverified;
  const party = getParty(factCheck.claimantParty);

  return (
    <div className={`bg-white border-l-4 rounded-r-lg p-4 shadow-sm ${verdict.border.replace('border-', 'border-l-')}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${verdict.bg} ${verdict.text}`}>
          {verdict.label}
        </span>
        <span className="text-xs text-gray-400">{factCheck.date}</span>
      </div>
      <blockquote className="text-sm font-serif italic text-gray-700 mb-2">
        "{factCheck.claim}"
      </blockquote>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
        <span className="text-xs font-bold text-gray-600">{factCheck.claimant}</span>
        <span className="text-[10px] font-bold text-gray-400">({party.name})</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{factCheck.analysis}</p>
    </div>
  );
}

export default function ElectionHub() {
  const { articles } = useNews();
  const { elections, candidates: ctxCandidates, results: ctxResults, factChecks: ctxFactChecks } = useElection();

  // Use Appwrite data if available, fallback to seed data
  const activeElection = elections.find(e => e.status === 'active') || elections[0];
  const electionCandidates = activeElection
    ? ctxCandidates.filter(c => c.electionId === activeElection.id || c.position === 'president')
    : CANDIDATES;
  const electionFactChecks = activeElection
    ? ctxFactChecks.filter(fc => fc.electionId === activeElection.id)
    : FACT_CHECKS;

  // Parse candidateVotes from Appwrite (stored as JSON string)
  const stateResults = useMemo(() => {
    if (ctxResults.length > 0) {
      return SEED_STATE_RESULTS.map(seed => {
        const appResult = ctxResults.find(r => r.state === seed.state);
        if (!appResult) return seed;
        return {
          ...seed,
          ...appResult,
          candidateVotes: typeof appResult.candidateVotes === 'string'
            ? JSON.parse(appResult.candidateVotes)
            : (appResult.candidateVotes || seed.candidateVotes),
          met25Threshold: typeof appResult.met25Threshold === 'string'
            ? JSON.parse(appResult.met25Threshold)
            : (appResult.met25Threshold || seed.met25Threshold),
        };
      });
    }
    return SEED_STATE_RESULTS;
  }, [ctxResults]);

  const electionArticles = useMemo(
    () => articles.filter((a) =>
      a.section === 'siyasa' ||
      a.tags?.toLowerCase().includes('zabe') ||
      a.kicker?.toLowerCase().includes('zabe')
    ).slice(0, 8),
    [articles]
  );

  const candidateIds = electionCandidates.map(c => c.id);
  const nationalTotals = computeNationalTotals(candidateIds);

  // Top 6 battleground states (closest margins)
  const battlegroundStates = useMemo(() => {
    return stateResults
      .map(s => {
        const votes = Object.values(s.candidateVotes || {});
        if (votes.length < 2) return { ...s, margin: 999 };
        const sorted = [...votes].sort((a, b) => b - a);
        const margin = ((sorted[0] - sorted[1]) / s.validVotes) * 100;
        return { ...s, margin };
      })
      .sort((a, b) => a.margin - b.margin)
      .slice(0, 6);
  }, [stateResults]);

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title="Zabe 2027 — Yanci"
        description="Cikakken bayani game da zaben Najeriya 2027 — sakamako, 'yan takara, gaskiya, da ilimin ɗan zaba."
        url="/zabe"
      />
      <GuardianNav />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16 relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <FaFire className="w-3 h-3" /> Kai Tsaye
            </span>
            <span className="text-white/60 text-sm">{ELECTION_INFO.electoralBodyFull}</span>
          </div>
          <h1 className="font-serif font-black text-4xl md:text-6xl tracking-tighter mb-3">
            {ELECTION_INFO.name}
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-2xl">
            Cikakken rufe baya na zaben gabaɗaya Najeriya 2027 — sakamako kai tsaye, 'yan takara, binciken gaskiya, da ilimin ɗan zaba.
          </p>

          <CountdownTimer />

          {/* Nav Pills */}
          <div className="flex flex-wrap gap-3 mt-10 justify-center">
            {[
              { label: 'Sakamako', path: '/zabe/sakamako', icon: FaChartColumn },
              { label: "'Yan Takara", path: '/zabe/yan-takara', icon: FaUsers },
              { label: 'Gaskiya', path: '/zabe/gaskiya', icon: FaShieldHalved },
              { label: "Ilimin ɗan Zaba", path: '/zabe/ilimi', icon: FaCheckToSlot },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-all backdrop-blur border border-white/10"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 space-y-16">

        {/* Key Metrics — INEC Style */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Masu Rajista</div>
            <div className="text-2xl font-black">{formatNumber(nationalTotals.registeredVoters)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Waɗanda suka Kada</div>
            <div className="text-2xl font-black">{formatNumber(nationalTotals.accreditedVoters)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Kuri'u Ingantattu</div>
            <div className="text-2xl font-black">{formatNumber(nationalTotals.validVotes)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Kuri'un da aka Ki</div>
            <div className="text-2xl font-black text-red-600">{formatNumber(nationalTotals.rejectedVotes)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Halarta</div>
            <div className="text-2xl font-black">{nationalTotals.turnout.toFixed(1)}%</div>
          </div>
        </section>

        {/* Live Results Summary */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <h2 className="text-2xl font-serif font-black">Sakamako Kai Tsaye — Shugaban Ƙasa</h2>
            </div>
            <Link to="/zabe/sakamako" className="text-sm font-bold text-[#0f3460] hover:underline flex items-center gap-1">
              Cikakken Sakamako <FaArrowUpRightFromSquare className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Jihohi {stateResults.length} / {stateResults.length} sun ruwaito
                  </span>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaClock className="w-3 h-3" />
                    An sabawa: {new Date().toLocaleString('ha-NG')}
                  </div>
                </div>
              </div>

              {electionCandidates.map((c) => {
                const votes = nationalTotals.candidateVotes[c.id] || 0;
                const pct = nationalTotals.candidatePercentages[c.id] || 0;
                const statesWon = nationalTotals.statesWon[c.id] || 0;
                const states25 = nationalTotals.statesMet25[c.id] || 0;
                return (
                  <ResultProgressBar
                    key={c.id}
                    candidateId={c.id}
                    votes={votes}
                    percentage={pct}
                    statesWon={statesWon}
                    states25={states25}
                    maxPercentage={Math.max(...electionCandidates.map(x => nationalTotals.candidatePercentages[x.id] || 0))}
                  />
                );
              })}

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">
                  <strong>Ƙa'idar Zabe:</strong> Wanda ya samu kuri'u mafi yawa kuma ya wuce kashi 25% a jihohi biyu cikin uku (24+) ya ci zaben shugaban ƙasa.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Other Races */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Sauran Gasar</h3>
                {[
                  { title: 'Majalisar Dattawa', icon: FaBuildingColumns, reported: 72, total: 109, parties: [{ partyId: 'apc', seats: 38, leading: 5 }, { partyId: 'pdp', seats: 22, leading: 4 }, { partyId: 'lp', seats: 8, leading: 2 }] },
                  { title: 'Gwamnoni', icon: FaGavel, reported: 20, total: 36, parties: [{ partyId: 'apc', states: 10, leading: 3 }, { partyId: 'pdp', states: 6, leading: 2 }, { partyId: 'lp', states: 3, leading: 1 }] },
                ].map((race) => (
                  <div key={race.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <race.icon className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-sm">{race.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{race.reported}/{race.total}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(race.reported / race.total) * 100}%` }} />
                    </div>
                    {race.parties.map((p) => {
                      const party = getParty(p.partyId);
                      return (
                        <div key={p.partyId} className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }} />
                            <span className="font-bold">{party.name}</span>
                          </div>
                          <span className="font-bold">{p.seats} won{p.leading > 0 ? ` (+${p.leading})` : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Voter Info */}
              <div className="bg-gradient-to-br from-[#0f3460] to-[#1a1a2e] text-white rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FaCheckToSlot className="text-[#c59d5f]" />
                  Ilimin ɗan Zaba
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Ranar Zabe</div>
                    <div className="font-bold">{new Date(VOTER_INFO.pollingDay).toLocaleDateString('ha-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Lokacin Zaba</div>
                    <div className="font-bold">{VOTER_INFO.pollingHours}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Abubuwan Da Ake Bukata</div>
                    <ul className="space-y-1.5">
                      {VOTER_INFO.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                          <span className="text-[#c59d5f] mt-0.5">✓</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link to="/zabe/ilimi" className="mt-6 w-full py-3 bg-[#c59d5f] text-[#0f3460] text-sm font-bold rounded-lg hover:bg-white transition-colors block text-center">
                  Ƙarin Bayani
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Battleground States */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-black">Jihohin Da Ake Kallon</h2>
            <Link to="/zabe/sakamako" className="text-sm font-bold text-[#0f3460] hover:underline flex items-center gap-1">
              Duka Jihohi <FaChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {battlegroundStates.map((state) => {
              const sortedCandidates = electionCandidates
                .map(c => ({ ...c, votes: state.candidateVotes?.[c.id] || 0 }))
                .sort((a, b) => b.votes - a.votes);
              const leader = sortedCandidates[0];
              const runnerUp = sortedCandidates[1];
              const margin = state.validVotes > 0 ? (((leader.votes - runnerUp.votes) / state.validVotes) * 100).toFixed(1) : 0;
              const turnout = state.registeredVoters > 0 ? ((state.accreditedVoters / state.registeredVoters) * 100).toFixed(1) : 0;
              const leaderParty = getParty(leader.party);

              return (
                <div key={state.state} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{state.state}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      parseFloat(turnout) > 40 ? 'bg-green-100 text-green-700' :
                      parseFloat(turnout) > 30 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {turnout}% halarta
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {sortedCandidates.slice(0, 2).map((c, idx) => {
                      const party = getParty(c.party);
                      const pct = state.validVotes > 0 ? ((c.votes / state.validVotes) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={c.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }} />
                            <span className={idx === 0 ? 'font-bold' : 'text-gray-600'}>{c.name}</span>
                            {idx === 0 && <FaCircleCheck className="text-green-600 w-3 h-3" />}
                          </div>
                          <span className="font-mono text-xs">{formatNumber(c.votes)} ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>Bambanci: {margin}%</span>
                    <span className="font-bold" style={{ color: leaderParty.color }}>{leaderParty.name} yana gaba</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Candidates Preview */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-black">'Yan Takara — Shugaban Ƙasa</h2>
            <Link to="/zabe/yan-takara" className="text-sm font-bold text-[#0f3460] hover:underline flex items-center gap-1">
              Duka 'Yan Takara <FaChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {electionCandidates.map((candidate) => {
              const party = getParty(candidate.party);
              const votes = nationalTotals.candidateVotes[candidate.id] || 0;
              const pct = nationalTotals.candidatePercentages[candidate.id] || 0;
              const statesWon = nationalTotals.statesWon[candidate.id] || 0;

              return (
                <Link
                  key={candidate.id}
                  to={`/zabe/yan-takara#${candidate.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: party.color }} />
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur">
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: party.color + '20', color: party.color }}>
                      {party.name}
                    </span>
                    <h3 className="font-bold text-lg mt-2 group-hover:text-[#0f3460] transition-colors">{candidate.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{candidate.state} · {candidate.age} shekara</p>
                    <p className="text-xs text-gray-400 mt-1">Mataimaki: {candidate.runningMate}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <span>{formatNumber(votes)} kuri'u</span>
                      <span>Jihohi {statesWon}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Fact Check Preview */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-black">Binciken Gaskiya</h2>
            <Link to="/zabe/gaskiya" className="text-sm font-bold text-[#0f3460] hover:underline flex items-center gap-1">
              Duka Gaskiya <FaChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {electionFactChecks.slice(0, 6).map((fc) => (
              <FactCheckCard key={fc.id} factCheck={fc} />
            ))}
          </div>
        </section>

        {/* Election News Feed */}
        <section>
          <h2 className="text-2xl font-serif font-black mb-6">Labaran Zabe</h2>
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {electionArticles.length > 0 ? (
                electionArticles.map((article) => (
                  <article key={article.id} className="flex flex-col sm:flex-row gap-5 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    {article.image && (
                      <Link to={`/article/${article.id}`} className="sm:w-48 flex-shrink-0 aspect-[3/2] overflow-hidden rounded-lg">
                        <img src={article.image} alt={article.headline} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </Link>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          {article.kicker || 'Zabe'}
                        </span>
                      </div>
                      <Link to={`/article/${article.id}`}>
                        <h3 className="font-serif font-bold text-xl leading-snug group-hover:text-[#0f3460] transition-colors">{article.headline}</h3>
                      </Link>
                      {article.trail && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.trail}</p>}
                      {article.author && (
                        <div className="text-xs text-gray-400 mt-3">
                          Daga <Link to={`/author/${encodeURIComponent(article.author)}`} className="font-bold text-[#0f3460] hover:underline">{article.author}</Link>
                        </div>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
                  <FaBullhorn className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-serif text-lg">Babu labaran zabe tukuna.</p>
                  <p className="text-sm mt-1">Dawo nan gaba don sabbin labarai.</p>
                </div>
              )}
            </div>

            {/* Sidebar: Key Races Info */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Gasar da Ake Kallon</h3>
                  <div className="space-y-3">
                    {KEY_RACES.map((race) => (
                      <div key={race.race} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="font-bold text-sm">{race.race}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Kujeru: {race.totalSeats}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{race.threshold}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <GuardianFooter />
    </div>
  );
}
