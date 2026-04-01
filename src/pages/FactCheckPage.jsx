import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShieldHalved, FaFilter, FaMagnifyingGlass, FaArrowUpRightFromSquare,
  FaCircleCheck, FaCircleXmark, FaTriangleExclamation, FaCircleQuestion,
} from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import SEO from '../components/SEO';
import { FACT_CHECKS, PARTIES } from '../data/electionData';

const VERDICT_STYLES = {
  true: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
    icon: FaCircleCheck,
    label: 'Gaskiya',
    iconColor: 'text-green-500',
  },
  false: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800',
    icon: FaCircleXmark,
    label: 'Ƙarya',
    iconColor: 'text-red-500',
  },
  misleading: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    icon: FaTriangleExclamation,
    label: 'Ba Gaskiya Ba',
    iconColor: 'text-amber-500',
  },
  unverified: {
    bg: 'bg-gray-50',
    border: 'border-gray-400',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-800',
    icon: FaCircleQuestion,
    label: 'Ba a Taba Ba',
    iconColor: 'text-gray-500',
  },
};

function getParty(id) {
  return PARTIES.find((p) => p.id === id) || PARTIES[0];
}

export default function FactCheckPage() {
  const [filterVerdict, setFilterVerdict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChecks = useMemo(() => {
    let checks = FACT_CHECKS;
    if (filterVerdict !== 'all') {
      checks = checks.filter((fc) => fc.verdict === filterVerdict);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      checks = checks.filter(
        (fc) =>
          fc.claim.toLowerCase().includes(q) ||
          fc.claimant.toLowerCase().includes(q) ||
          fc.analysis.toLowerCase().includes(q)
      );
    }
    return checks;
  }, [filterVerdict, searchQuery]);

  const verdictCounts = useMemo(() => {
    const counts = { all: FACT_CHECKS.length, true: 0, false: 0, misleading: 0, unverified: 0 };
    FACT_CHECKS.forEach((fc) => {
      if (counts[fc.verdict] !== undefined) counts[fc.verdict]++;
    });
    return counts;
  }, []);

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title="Binciken Gaskiya — Zabe 2027 | Yanci"
        description="Binciken gaskiya na iƙirarin siyasa — gaskiya, ƙarya, ko ba gaskiya ba?"
        url="/zabe/gaskiya"
      />
      <GuardianNav />

      {/* Header */}
      <div className="bg-[#1a1a2e] text-white py-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-3">
            <FaShieldHalved className="text-[#c59d5f] w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Zabe 2027</span>
          </div>
          <h1 className="font-serif font-black text-3xl md:text-5xl tracking-tighter">
            Binciken Gaskiya
          </h1>
          <p className="text-white/60 text-sm mt-2 max-w-2xl">
            Muna bincika iƙirarin 'yan siyasa don tabbatar da gaskiya. Kowane iƙirari ana tantance shi bisa ga bayanan da za a iya tabbatar da su.
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(VERDICT_STYLES).map(([key, style]) => {
            const Icon = style.icon;
            return (
              <button
                key={key}
                onClick={() => setFilterVerdict(key)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  filterVerdict === key
                    ? `${style.bg} ${style.border}`
                    : 'bg-white border-gray-100 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${style.iconColor}`} />
                <div className="text-2xl font-black">{verdictCounts[key]}</div>
                <div className={`text-xs font-bold ${style.badgeText}`}>{style.label}</div>
              </button>
            );
          })}
          <button
            onClick={() => setFilterVerdict('all')}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              filterVerdict === 'all'
                ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                : 'bg-white border-gray-100 hover:border-gray-300'
            }`}
          >
            <FaFilter className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <div className="text-2xl font-black">{verdictCounts.all}</div>
            <div className="text-xs font-bold text-gray-500">Duka</div>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
                    <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nemi iƙirari ko ɗan takara..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]/20 focus:border-[#0f3460]"
          />
        </div>

        {/* Fact Check Cards */}
        {filteredChecks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FaShieldHalved className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-serif text-xl">Babu sakamako.</p>
            <p className="text-sm mt-1">Gwada wani kalma daban ko cire tacewa.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredChecks.map((fc) => {
              const style = VERDICT_STYLES[fc.verdict] || VERDICT_STYLES.unverified;
              const party = getParty(fc.claimantParty);
              const Icon = style.icon;

              return (
                <article
                  key={fc.id}
                  className={`rounded-xl border-l-4 overflow-hidden bg-white shadow-sm ${style.border}`}
                >
                  <div className="p-6">
                    {/* Verdict Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg}`}
                        >
                          <Icon className={`w-6 h-6 ${style.iconColor}`} />
                        </div>
                        <div>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${style.badgeBg} ${style.badgeText}`}>
                            {style.label}
                          </span>
                          <div className="text-xs text-gray-400 mt-1">{fc.date}</div>
                        </div>
                      </div>
                    </div>

                    {/* Claim */}
                    <blockquote className="text-lg font-serif italic text-gray-800 mb-4 pl-4 border-l-2 border-gray-200">
                      "{fc.claim}"
                    </blockquote>

                    {/* Claimant */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: party.color }}
                      >
                        {fc.claimant[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{fc.claimant}</div>
                        <div className="text-xs text-gray-500">{party.name} — {party.fullName}</div>
                      </div>
                    </div>

                    {/* Analysis */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bincike</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{fc.analysis}</p>
                    </div>

                    {/* Source */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                      <FaArrowUpRightFromSquare className="w-3 h-3" />
                      <span>Tushen: {fc.source}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Methodology */}
        <div className="mt-12 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Hanyar Bincikemu</h3>
          <div className="grid md:grid-cols-4 gap-6 text-sm">
            {[
              { step: '1', title: 'Gano Iƙirari', desc: 'Muna tattara iƙirarin \'yan siyasa daga jawuttai, talabijin, da kafofin watsa labarai.' },
              { step: '2', title: 'Bincika Bayanai', desc: 'Muna duba bayanai daga tushe na hukuma kamar NBS, INEC, da ma\'aikatun gwamnati.' },
              { step: '3', title: 'Tuntube Masana', desc: 'Muna neman ra\'ayin masana masu zaman kansu kan batun da ake bincike.' },
              { step: '4', title: 'Yanke Hukunci', desc: 'Muna ba da hukunci bisa ga shaidu: Gaskiya, Ƙarya, Ba Gaskiya Ba, ko Ba a Taba Ba.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <GuardianFooter />
    </div>
  );
}
