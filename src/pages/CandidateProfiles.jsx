import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChevronRight, FaUsers, FaLocationDot, FaGraduationCap,
  FaBriefcase, FaBullhorn, FaCheck,
} from 'react-icons/fa6';
import GuardianNav from '../components/guardian/GuardianNav';
import GuardianFooter from '../components/guardian/GuardianFooter';
import SEO from '../components/SEO';
import { useElection } from '../context/ElectionContext';
import { CANDIDATES, PARTIES } from '../data/electionData';

function getParty(id) {
  return PARTIES.find((p) => p.id === id) || PARTIES[0];
}

export default function CandidateProfiles() {
  const { candidates: ctxCandidates, elections } = useElection();
  const activeElection = elections.find(e => e.status === 'active') || elections[0];
  const electionCandidates = activeElection
    ? ctxCandidates.filter(c => c.electionId === activeElection.id || c.position === 'president')
    : CANDIDATES;

  return (
    <div className="bg-[#fafaf9] min-h-screen font-sans text-[#1c1917]">
      <SEO
        title="'Yan Takara — Zabe 2027 | Yanci"
        description="Bayanin dukkan 'yan takara a zaben shugaban ƙasa Najeriya 2027 — manufofi, tarihi, da alkawurai."
        url="/zabe/yan-takara"
      />
      <GuardianNav />

      {/* Header */}
      <div className="bg-[#1a1a2e] text-white py-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-3">
            <FaUsers className="text-[#c59d5f] w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Zabe 2027</span>
          </div>
          <h1 className="font-serif font-black text-3xl md:text-5xl tracking-tighter">
            'Yan Takara — Shugaban Ƙasa
          </h1>
          <p className="text-white/60 text-sm mt-2 max-w-2xl">
            Bayanin cikakke game da dukkan 'yan takara — manufofinsu, tarihin siyasa, da alkawuran da suka yi wa ɗan ƙasa.
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">

        {/* Candidate Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {electionCandidates.map((candidate) => {
            const party = getParty(candidate.party);
            return (
              <div
                key={candidate.id}
                id={candidate.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Photo */}
                  <div className="md:w-48 flex-shrink-0 relative">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-full h-full md:h-full aspect-square object-cover"
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1.5"
                      style={{ backgroundColor: party.color }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: party.color + '20', color: party.color }}
                      >
                        {party.name} — {party.fullName}
                      </span>
                    </div>

                    <h2 className="font-serif font-black text-2xl mb-1">{candidate.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Mataimaki: <span className="font-bold text-gray-700">{candidate.runningMate}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaLocationDot className="text-gray-400 w-4 h-4" />
                        <span>{candidate.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaGraduationCap className="text-gray-400 w-4 h-4" />
                        <span className="text-xs">{candidate.education}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaBriefcase className="text-gray-400 w-4 h-4" />
                        <span className="text-xs">{candidate.previousOffice}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                        <FaBullhorn className="w-3 h-3" /> Manufofi
                      </h4>
                      <ul className="space-y-1.5">
                        {(typeof candidate.platform === 'string' ? candidate.platform.split('\n').filter(Boolean) : candidate.platform || []).map((item, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <FaCheck className="w-3 h-3 mt-0.5 shrink-0" style={{ color: party.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Side-by-Side Comparison */}
        <section>
          <h2 className="text-2xl font-serif font-black mb-6">Kwatance 'Yan Takara</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500 w-40">Bayani</th>
                    {electionCandidates.map((c) => {
                      const party = getParty(c.party);
                      return (
                        <th key={c.id} className="text-center px-4 py-3 font-bold" style={{ color: party.color }}>
                          <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white" style={{ backgroundColor: party.color }}>
                            {c.name[0]}
                          </div>
                          {c.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Jam\'iyya', key: 'party', format: (c) => getParty(c.party).name },
                    { label: 'Jiha', key: 'state' },
                    { label: 'Shekaru', key: 'age' },
                    { label: 'Ilimi', key: 'education' },
                    { label: 'Mataimaki', key: 'runningMate' },
                    { label: 'Mukamin Da Ya Taɓa Riƙe', key: 'previousOffice' },
                  ].map((row) => (
                    <tr key={row.key} className="border-b border-gray-50">
                      <td className="px-4 py-3 font-bold text-xs uppercase tracking-wider text-gray-500">{row.label}</td>
                      {electionCandidates.map((c) => (
                        <td key={c.id} className="px-4 py-3 text-center text-sm">
                          {row.format ? row.format(c) : c[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      <GuardianFooter />
    </div>
  );
}
