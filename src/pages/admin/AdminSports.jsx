import { useState, useEffect } from 'react';
import { appwriteService } from '../../lib/appwrite';
import { FaTrophy, FaFutbol, FaPlus, FaTrash, FaPen, FaXmark, FaSpinner, FaArrowUp, FaArrowDown, FaClock, FaMapLocationDot } from 'react-icons/fa6';

const STORAGE_KEY = 'yanci_sports';

const initialSportsData = {
  liveMatches: [
    {
      id: 1,
      league: 'NPFL',
      homeTeam: 'Yanci Stars',
      homeLogo: 'YS',
      homeColor: '#0f3036',
      awayTeam: 'City Royals',
      awayLogo: 'CR',
      awayColor: '#6b7280',
      homeScore: 3,
      awayScore: 2,
      minute: "90+2'",
      isLive: true,
      events: [
        { minute: "88'", team: 'home', player: 'Ahmed', score: '3-2' },
        { minute: "72'", team: 'away', player: 'Johnson', score: '2-2' },
        { minute: "45'", team: 'home', player: 'Musa', score: '2-1' },
      ],
      streamUrl: '',
    },
  ],
  standings: [
    { pos: 1, team: 'Yanci Stars', p: 24, w: 18, d: 4, l: 2, gf: 52, ga: 17, gd: '+35', pts: 58 },
    { pos: 2, team: 'Enyimba', p: 24, w: 15, d: 7, l: 2, gf: 45, ga: 17, gd: '+28', pts: 52 },
    { pos: 3, team: 'Rangers', p: 24, w: 14, d: 7, l: 3, gf: 40, ga: 18, gd: '+22', pts: 49 },
    { pos: 4, team: 'Kano Pillars', p: 24, w: 13, d: 7, l: 4, gf: 38, ga: 20, gd: '+18', pts: 46 },
    { pos: 5, team: 'Shooting Stars', p: 24, w: 12, d: 6, l: 6, gf: 32, ga: 20, gd: '+12', pts: 42 },
  ],
  fixtures: [
    { id: 1, league: 'NPFL', home: 'Yanci Stars', away: 'Enyimba', date: 'Yau', time: '16:00', stadium: 'Ahmadu Bello', odds: { home: 1.85, draw: 3.20, away: 4.50 } },
    { id: 2, league: 'Premier League', home: 'Super Eagles', away: 'Black Stars', date: 'Gobe', time: '20:00', stadium: 'Moshood Abiola', odds: { home: 1.45, draw: 4.00, away: 6.50 } },
    { id: 3, league: 'CAF CL', home: 'Rangers', away: 'Al Ahly', date: 'Alhamis', time: '18:00', stadium: 'Awka Stadium', odds: { home: 2.10, draw: 3.10, away: 3.40 } },
  ],
  playerOfWeek: {
    name: 'Ahmed Musa',
    team: 'Yanci Stars',
    initials: 'AM',
    goals: 5,
    assists: 3,
    rating: 9.2,
  },
};

const emptyMatch = { league: '', homeTeam: '', awayTeam: '', homeScore: 0, awayScore: 0, minute: '', isLive: false, streamUrl: '', events: [] };
const emptyFixture = { league: '', home: '', away: '', date: '', time: '', stadium: '', odds: { home: 1.0, draw: 1.0, away: 1.0 } };

const AdminSports = () => {
  const [sportsData, setSportsData] = useState(initialSportsData);
  const [useAppwrite, setUseAppwrite] = useState(false);
  const [activeTab, setActiveTab] = useState('matches');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const doc = await appwriteService.getSportsData();
        if (doc) {
          const parsed = {
            liveMatches: typeof doc.liveMatches === 'string' ? JSON.parse(doc.liveMatches) : doc.liveMatches || [],
            standings: typeof doc.standings === 'string' ? JSON.parse(doc.standings) : doc.standings || [],
            fixtures: typeof doc.fixtures === 'string' ? JSON.parse(doc.fixtures) : doc.fixtures || [],
            playerOfWeek: typeof doc.playerOfWeek === 'string' ? JSON.parse(doc.playerOfWeek) : doc.playerOfWeek || initialSportsData.playerOfWeek,
            $id: doc.$id,
          };
          setSportsData(parsed);
          setUseAppwrite(true);
          return;
        }
      } catch {}
      const saved = localStorage.getItem(STORAGE_KEY);
      setSportsData(saved ? JSON.parse(saved) : initialSportsData);
    };
    load();
  }, []);

  const persist = async (data) => {
    if (useAppwrite) {
      try {
        await appwriteService.upsertSportsData({
          liveMatches: JSON.stringify(data.liveMatches),
          standings: JSON.stringify(data.standings),
          fixtures: JSON.stringify(data.fixtures),
          playerOfWeek: JSON.stringify(data.playerOfWeek),
        });
      } catch {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleSave = async () => {
    setSaving(true);
    let updated = { ...sportsData };
    if (modalType === 'match') {
      const exists = updated.liveMatches.find(m => m.id === draft.id);
      updated.liveMatches = exists ? updated.liveMatches.map(m => m.id === draft.id ? draft : m) : [draft, ...updated.liveMatches];
    } else if (modalType === 'fixture') {
      const exists = updated.fixtures.find(f => f.id === draft.id);
      updated.fixtures = exists ? updated.fixtures.map(f => f.id === draft.id ? draft : f) : [draft, ...updated.fixtures];
    } else if (modalType === 'player') {
      updated.playerOfWeek = draft;
    } else if (modalType === 'standings') {
      const exists = updated.standings.find(s => s.pos === draft.pos);
      if (exists) {
        updated.standings = updated.standings.map(s => s.pos === draft.pos ? draft : s);
      } else {
        updated.standings = [...updated.standings, draft].sort((a, b) => a.pos - b.pos);
      }
    }
    setSportsData(updated);
    await persist(updated);
    setIsModalOpen(false);
    setDraft(null);
    setSaving(false);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Share wannan item?')) return;
    let updated = { ...sportsData };
    if (type === 'match') updated.liveMatches = updated.liveMatches.filter(m => m.id !== id);
    if (type === 'fixture') updated.fixtures = updated.fixtures.filter(f => f.id !== id);
    if (type === 'standings') updated.standings = updated.standings.filter(s => s.pos !== id).map((s, i) => ({ ...s, pos: i + 1 }));
    setSportsData(updated);
    await persist(updated);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    if (type === 'match') setDraft(item || { ...emptyMatch, id: Date.now() });
    if (type === 'fixture') setDraft(item || { ...emptyFixture, id: Date.now() });
    if (type === 'player') setDraft(item || { ...sportsData.playerOfWeek });
    if (type === 'standings') setDraft(item || { pos: 0, team: '', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: '0', pts: 0 });
    setIsModalOpen(true);
  };

  const handleMove = (type, index, direction) => {
    const key = type === 'match' ? 'liveMatches' : type === 'fixture' ? 'fixtures' : 'standings';
    const newItems = [...sportsData[key]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    if (type === 'standings') newItems.forEach((item, i) => item.pos = i + 1);
    setSportsData(prev => ({ ...prev, [key]: newItems }));
  };

  const tabs = [
    { id: 'matches', label: 'Kai Tsaye/Matches', icon: FaFutbol },
    { id: 'standings', label: 'Tsarin Gasar/Standings', icon: FaTrophy },
    { id: 'fixtures', label: 'Jadawali/Fixtures', icon: FaClock },
    { id: 'player', label: 'Dan Wasan/Player', icon: FaMapLocationDot },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTrophy className="text-[#c59d5f]" /> Sports Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Gudanar da wasanni - kai tsaye, standings, fixtures, da dan wasan mako {useAppwrite ? '(Appwrite)' : '(Local)'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#c59d5f] text-[#0f3036]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal('match')} className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-[#1a454c] font-bold text-sm">
              <FaPlus className="w-4 h-4" /> Ƙara Match
            </button>
          </div>
          <div className="space-y-4">
            {sportsData.liveMatches.map((match, index) => (
              <div key={match.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase bg-[#0f3036] text-white px-2 py-1 rounded">{match.league}</span>
                    {match.isLive && <span className="text-xs font-bold text-red-600 flex items-center gap-1"><span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /> LIVE</span>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleMove('match', index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded disabled:opacity-30"><FaArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => handleMove('match', index, 'down')} disabled={index === sportsData.liveMatches.length - 1} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded disabled:opacity-30"><FaArrowDown className="w-3 h-3" /></button>
                    <button onClick={() => openModal('match', match)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><FaPen className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete('match', match.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><FaTrash className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>{match.homeTeam}</span>
                  <span className="text-2xl font-black text-[#0f3036]">{match.homeScore} - {match.awayScore}</span>
                  <span>{match.awayTeam}</span>
                </div>
                <div className="text-center text-sm text-gray-500 mt-1">{match.minute}</div>
              </div>
            ))}
            {sportsData.liveMatches.length === 0 && (
              <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">Babu matches tukuna.</div>
            )}
          </div>
        </div>
      )}

      {/* Standings Tab */}
      {activeTab === 'standings' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal('standings')} className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-[#1a454c] font-bold text-sm">
              <FaPlus className="w-4 h-4" /> Ƙara Team
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Team</th>
                    <th className="p-3 text-center">P</th>
                    <th className="p-3 text-center">W</th>
                    <th className="p-3 text-center">D</th>
                    <th className="p-3 text-center">L</th>
                    <th className="p-3 text-center">GF</th>
                    <th className="p-3 text-center">GA</th>
                    <th className="p-3 text-center">GD</th>
                    <th className="p-3 text-center">Pts</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sportsData.standings.map((team, index) => (
                    <tr key={team.pos} className="hover:bg-gray-50">
                      <td className="p-3 font-bold">{team.pos}</td>
                      <td className="p-3 font-bold">{team.team}</td>
                      <td className="p-3 text-center text-gray-500">{team.p}</td>
                      <td className="p-3 text-center text-gray-500">{team.w}</td>
                      <td className="p-3 text-center text-gray-500">{team.d}</td>
                      <td className="p-3 text-center text-gray-500">{team.l}</td>
                      <td className="p-3 text-center text-gray-500">{team.gf}</td>
                      <td className="p-3 text-center text-gray-500">{team.ga}</td>
                      <td className="p-3 text-center font-bold">{team.gd}</td>
                      <td className="p-3 text-center font-black text-[#0f3036]">{team.pts}</td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => handleMove('standings', index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><FaArrowUp className="w-3 h-3" /></button>
                          <button onClick={() => handleMove('standings', index, 'down')} disabled={index === sportsData.standings.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><FaArrowDown className="w-3 h-3" /></button>
                          <button onClick={() => openModal('standings', team)} className="p-1 text-blue-600 hover:text-blue-800"><FaPen className="w-3 h-3" /></button>
                          <button onClick={() => handleDelete('standings', team.pos)} className="p-1 text-red-600 hover:text-red-800"><FaTrash className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fixtures Tab */}
      {activeTab === 'fixtures' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal('fixture')} className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-[#1a454c] font-bold text-sm">
              <FaPlus className="w-4 h-4" /> Ƙara Fixture
            </button>
          </div>
          <div className="space-y-4">
            {sportsData.fixtures.map((fixture, index) => (
              <div key={fixture.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold uppercase bg-[#2c7a7b]/10 text-[#2c7a7b] px-2 py-1 rounded-full">{fixture.league}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleMove('fixture', index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded disabled:opacity-30"><FaArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => handleMove('fixture', index, 'down')} disabled={index === sportsData.fixtures.length - 1} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded disabled:opacity-30"><FaArrowDown className="w-3 h-3" /></button>
                    <button onClick={() => openModal('fixture', fixture)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><FaPen className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete('fixture', fixture.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><FaTrash className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-lg font-bold mb-2">
                  <span>{fixture.home}</span>
                  <span className="text-gray-400 text-sm">VS</span>
                  <span>{fixture.away}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{fixture.date}, {fixture.time}</span>
                  <span>{fixture.stadium}</span>
                </div>
              </div>
            ))}
            {sportsData.fixtures.length === 0 && (
              <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">Babu fixtures tukuna.</div>
            )}
          </div>
        </div>
      )}

      {/* Player of the Week Tab */}
      {activeTab === 'player' && (
        <div>
          <button onClick={() => openModal('player')} className="bg-[#0f3036] text-white px-4 py-2.5 rounded-md flex items-center gap-2 hover:bg-[#1a454c] font-bold text-sm mb-4">
            <FaPen className="w-4 h-4" /> Gyara Player of the Week
          </button>
          <div className="bg-gradient-to-br from-[#c59d5f] to-[#d4a85f] rounded-2xl p-8 text-white shadow-xl max-w-lg">
            <span className="text-xs font-bold uppercase tracking-widest mb-4 block">Dan Wasan Makon</span>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl font-bold border-2 border-white/30">
                {sportsData.playerOfWeek.initials}
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold">{sportsData.playerOfWeek.name}</h3>
                <p className="text-white/80">{sportsData.playerOfWeek.team}</p>
                <div className="flex items-center gap-6 mt-4">
                  <div className="text-center"><p className="text-3xl font-black">{sportsData.playerOfWeek.goals}</p><p className="text-xs uppercase opacity-70">Kwallaye</p></div>
                  <div className="w-px h-12 bg-white/30" />
                  <div className="text-center"><p className="text-3xl font-black">{sportsData.playerOfWeek.assists}</p><p className="text-xs uppercase opacity-70">Taimakawa</p></div>
                  <div className="w-px h-12 bg-white/30" />
                  <div className="text-center"><p className="text-3xl font-black">{sportsData.playerOfWeek.rating}</p><p className="text-xs uppercase opacity-70">Maki</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && draft && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-900">
                {modalType === 'match' ? (draft.id && sportsData.liveMatches.find(m => m.id === draft.id) ? 'Gyara Match' : 'Ƙara Match') :
                 modalType === 'fixture' ? 'Fixture' :
                 modalType === 'player' ? 'Player of the Week' : 'Standing/Team'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FaXmark className="w-5 h-5" /></button>
            </div>

            {modalType === 'match' && (
              <div className="space-y-3">
                <input value={draft.league} onChange={e => setDraft({...draft, league: e.target.value})} placeholder="League (NPFL, CAF, etc.)" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <input value={draft.homeTeam} onChange={e => setDraft({...draft, homeTeam: e.target.value})} placeholder="Home Team" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <input value={draft.awayTeam} onChange={e => setDraft({...draft, awayTeam: e.target.value})} placeholder="Away Team" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <div className="flex gap-3">
                  <input type="number" value={draft.homeScore} onChange={e => setDraft({...draft, homeScore: parseInt(e.target.value) || 0})} placeholder="Home Score" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input type="number" value={draft.awayScore} onChange={e => setDraft({...draft, awayScore: parseInt(e.target.value) || 0})} placeholder="Away Score" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                </div>
                <input value={draft.minute} onChange={e => setDraft({...draft, minute: e.target.value})} placeholder="Minute (e.g. 90+2')" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <input type="checkbox" checked={draft.isLive} onChange={e => setDraft({...draft, isLive: e.target.checked})} className="w-4 h-4" /> Live Match
                </label>
              </div>
            )}

            {modalType === 'fixture' && (
              <div className="space-y-3">
                <input value={draft.league} onChange={e => setDraft({...draft, league: e.target.value})} placeholder="League" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <input value={draft.home} onChange={e => setDraft({...draft, home: e.target.value})} placeholder="Home Team" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <input value={draft.away} onChange={e => setDraft({...draft, away: e.target.value})} placeholder="Away Team" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <div className="flex gap-3">
                  <input value={draft.date} onChange={e => setDraft({...draft, date: e.target.value})} placeholder="Date (Yau, Gobe, etc.)" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input value={draft.time} onChange={e => setDraft({...draft, time: e.target.value})} placeholder="Time (16:00)" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                </div>
                <input value={draft.stadium} onChange={e => setDraft({...draft, stadium: e.target.value})} placeholder="Stadium" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>
            )}

            {modalType === 'player' && (
              <div className="space-y-3">
                <input value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} placeholder="Player Name" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <input value={draft.team} onChange={e => setDraft({...draft, team: e.target.value})} placeholder="Team" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <input value={draft.initials} onChange={e => setDraft({...draft, initials: e.target.value})} placeholder="Initials (e.g. AM)" maxLength={3} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <div className="flex gap-3">
                  <input type="number" value={draft.goals} onChange={e => setDraft({...draft, goals: parseInt(e.target.value) || 0})} placeholder="Goals" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input type="number" value={draft.assists} onChange={e => setDraft({...draft, assists: parseInt(e.target.value) || 0})} placeholder="Assists" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input type="number" step="0.1" value={draft.rating} onChange={e => setDraft({...draft, rating: parseFloat(e.target.value) || 0})} placeholder="Rating" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                </div>
              </div>
            )}

            {modalType === 'standings' && (
              <div className="space-y-3">
                <input type="number" value={draft.pos} onChange={e => setDraft({...draft, pos: parseInt(e.target.value) || 0})} placeholder="Position" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <input value={draft.team} onChange={e => setDraft({...draft, team: e.target.value})} placeholder="Team Name" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                <div className="grid grid-cols-4 gap-2">
                  <input type="number" value={draft.p} onChange={e => setDraft({...draft, p: parseInt(e.target.value) || 0})} placeholder="Played" className="text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input type="number" value={draft.w} onChange={e => setDraft({...draft, w: parseInt(e.target.value) || 0})} placeholder="Won" className="text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input type="number" value={draft.d} onChange={e => setDraft({...draft, d: parseInt(e.target.value) || 0})} placeholder="Draw" className="text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input type="number" value={draft.l} onChange={e => setDraft({...draft, l: parseInt(e.target.value) || 0})} placeholder="Lost" className="text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" value={draft.gf} onChange={e => setDraft({...draft, gf: parseInt(e.target.value) || 0})} placeholder="GF" className="text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input type="number" value={draft.ga} onChange={e => setDraft({...draft, ga: parseInt(e.target.value) || 0})} placeholder="GA" className="text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                  <input value={draft.gd} onChange={e => setDraft({...draft, gd: e.target.value})} placeholder="GD" className="text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
                </div>
                <input type="number" value={draft.pts} onChange={e => setDraft({...draft, pts: parseInt(e.target.value) || 0})} placeholder="Points" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Soke</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm font-bold text-white bg-[#0f3036] hover:bg-[#1a454c] rounded-lg disabled:opacity-50 flex items-center gap-2">
                {saving && <FaSpinner className="animate-spin" />} Ajiye
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSports;
