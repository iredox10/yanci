import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronRight, FaUsers, FaMapLocationDot, FaCheckToSlot,
  FaChartLine, FaClock, FaShieldHalved, FaBullhorn, FaArrowUpRightFromSquare,
  FaFire, FaPersonBooth, FaBuildingColumns, FaGavel,
} from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import SEO from '../components/SEO';
import { useNews } from '../context/NewsContext';
import {
  ELECTION_INFO, PARTIES, CANDIDATES, RESULTS, FACT_CHECKS, KEY_RACES, VOTER_INFO,
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
  return CANDIDATES.find((c) => c.id === id);
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

function ResultProgressBar({ candidateId, votes, percentage, statesWon, maxPercentage }) {
  const candidate = getCandidate(candidateId);
  const party = getParty(candidate?.party);
  const barWidth = maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: party.color }}
          />
          <span className="font-bold text-sm text-gray-900">{candidate?.name || candidateId}</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: party.color + '20', color: party.color }}
          >
            {party.name}
          </span>
        </div>
        <div className="text-right">
          <span className="font-black text-lg">{percentage.toFixed(1)}%</span>
          <span className="text-xs text-gray-500 ml-2">({(votes / 1000000).toFixed(1)}M)</span>
        </div>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${barWidth}%`, backgroundColor: party.color }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Jihohi {statesWon} / 37
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
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: party.color }}
        />
        <span className="text-xs font-bold text-gray-600">{factCheck.claimant}</span>
        <span className="text-[10px] font-bold text-gray-400">({party.name})</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {factCheck.analysis}
      </p>
    </div>
  );
}

export default function ElectionHub() {
  const { articles } = useNews();
  const electionArticles = useMemo(
    () => articles.filter((a) =>
      a.section === 'siyasa' ||
      a.tags?.toLowerCase().includes('zabe') ||
      a.kicker?.toLowerCase().includes('zabe')
    ).slice(0, 8),
    [articles]
  );

  const presResults = RESULTS.presidential;
  const maxPct = Math.max(...presResults.candidates.map((c) => c.percentage));

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
              { label: 'Sakamako', path: '/zabe/sakamako', icon: FaChartLine },
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

        {/* Key Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Masu Rajista", value: (ELECTION_INFO.totalRegisteredVoters / 1000000).toFixed(1) + 'M', icon: FaUsers, color: '#0f3460' },
            { label: 'Cibiyoyin Zaba', value: ELECTION_INFO.totalPollingUnits.toLocaleString(), icon: FaMapLocationDot, color: '#008751' },
            { label: 'Jihohi + FCT', value: ELECTION_INFO.totalStates + 1, icon: FaBuildingColumns, color: '#ED1C24' },
            { label: 'Matsakaicin Halarta', value: RESULTS.presidential.turnout + '%', icon: FaPersonBooth, color: '#003DA5' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{stat.label}</span>
                </div>
                <div className="text-2xl md:text-3xl font-black">{stat.value}</div>
              </div>
            );
          })}
        </section>

        {/* Live Results Summary */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <h2 className="text-2xl font-serif font-black">Sakamako Kai Tsaye — Shugaban Ƙasa</h2>
            </div>
            <Link
              to="/zabe/sakamako"
              className="text-sm font-bold text-[#0f3460] hover:underline flex items-center gap-1"
            >
              Cikakken Sakamako <FaArrowUpRightFromSquare className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Jihohi {presResults.statesReported} / {presResults.statesTotal} sun ruwaito
                  </span>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${(presResults.statesReported / presResults.statesTotal) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaClock className="w-3 h-3" />
                    An sabawa: {new Date(presResults.lastUpdated).toLocaleString('ha-NG')}
                  </div>
                </div>
              </div>

              {presResults.candidates.map((c) => (
                <ResultProgressBar
                  key={c.candidateId}
                  candidateId={c.candidateId}
                  votes={c.votes}
                  percentage={c.percentage}
                  statesWon={c.statesWon}
                  maxPercentage={maxPct}
                />
              ))}

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">
                  <strong>Ƙa'idar Zabe:</strong> Wanda ya samu kuri'u mafi yawa kuma ya wuce kashi 25% a jihohi biyu cikin uku (24+) ya ci zaben shugaban ƙasa.
                </p>
              </div>
            </div>

            {/* Sidebar: Key Races */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Sauran Gasar</h3>
              {[
                {
                  title: 'Majalisar Dattawa',
                  icon: FaBuildingColumns,
                  reported: RESULTS.senate.seatsReported,
                  total: RESULTS.senate.totalSeats,
                  parties: RESULTS.senate.parties.slice(0, 3),
                },
                {
                  title: 'Gwamnoni',
                  icon: FaGavel,
                  reported: RESULTS.governor.statesReported,
                  total: RESULTS.governor.totalStates,
                  parties: RESULTS.governor.parties.slice(0, 3),
                },
              ].map((race) => (
                <div key={race.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <race.icon className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-sm">{race.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{race.reported}/{race.total}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(race.reported / race.total) * 100}%` }}
                    />
                  </div>
                  {race.parties.map((p) => {
                    const party = getParty(p.partyId);
                    return (
                      <div key={p.partyId} className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }} />
                          <span className="font-bold">{party.name}</span>
                        </div>
                        <span className="font-bold">{p.seats} won{p.leading > 0 ? ` (+${p.leading} leading)` : ''}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Candidates Preview */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-black">'Yan Takara — Shugaban Ƙasa</h2>
            <Link
              to="/zabe/yan-takara"
              className="text-sm font-bold text-[#0f3460] hover:underline flex items-center gap-1"
            >
              Duka 'Yan Takara <FaChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CANDIDATES.map((candidate) => {
              const party = getParty(candidate.party);
              return (
                <Link
                  key={candidate.id}
                  to={`/zabe/yan-takara#${candidate.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: party.color }}
                    />
                  </div>
                  <div className="p-4">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: party.color + '20', color: party.color }}
                    >
                      {party.name}
                    </span>
                    <h3 className="font-bold text-lg mt-2 group-hover:text-[#0f3460] transition-colors">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{candidate.state} · {candidate.age} shekara</p>
                    <p className="text-xs text-gray-400 mt-1">Mataimaki: {candidate.runningMate}</p>
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
            <Link
              to="/zabe/gaskiya"
              className="text-sm font-bold text-[#0f3460] hover:underline flex items-center gap-1"
            >
              Duka Gaskiya <FaChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FACT_CHECKS.slice(0, 6).map((fc) => (
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
                  <article
                    key={article.id}
                    className="flex flex-col sm:flex-row gap-5 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    {article.image && (
                      <Link
                        to={`/article/${article.id}`}
                        className="sm:w-48 flex-shrink-0 aspect-[3/2] overflow-hidden rounded-lg"
                      >
                        <img
                          src={article.image}
                          alt={article.headline}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          {article.kicker || 'Zabe'}
                        </span>
                      </div>
                      <Link to={`/article/${article.id}`}>
                        <h3 className="font-serif font-bold text-xl leading-snug group-hover:text-[#0f3460] transition-colors">
                          {article.headline}
                        </h3>
                      </Link>
                      {article.trail && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.trail}</p>
                      )}
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

            {/* Sidebar: Voter Info */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
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
                  <Link
                    to="/zabe/ilimi"
                    className="mt-6 w-full py-3 bg-[#c59d5f] text-[#0f3460] text-sm font-bold rounded-lg hover:bg-white transition-colors block text-center"
                  >
                    Ƙarin Bayani
                  </Link>
                </div>

                {/* Key Races Info */}
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
