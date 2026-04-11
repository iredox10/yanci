import { useState, useEffect } from 'react';
import { appwriteService } from '../lib/appwrite';

const HIGHLIGHTS_KEY = 'yanci_highlights';
const STATS_KEY = 'yanci_homepage_stats';
const SPORTS_KEY = 'yanci_sports';
const HOMEPAGE_BUILDER_KEY = 'yanci_homepage_builder';

const ICON_MAP = {
  trend: 'arrow-trend',
  radio: 'broadcast',
  innovation: 'wand',
  fire: 'fire',
  calendar: 'calendar',
  users: 'users',
};

const DEFAULT_HIGHLIGHTS = [
  { id: 1, tag: 'Kasuwanci', title: 'Kasuwar hannayen jari ta yi sama da kashi 4 cikin yini biyu', copy: 'Masu zuba jari sun amince da kudurin gwamnati na saukaka haraji ga masana\'antun kere-kere.', icon: 'trend', accent: '#10b981', gradient: 'from-emerald-500/20 to-teal-500/20' },
  { id: 2, tag: 'Sauti', title: 'Shirin rediyon Yanci Live ya dawo da sabbin makalu daga jihohi 8', copy: 'Masu sauraro na iya kallo kai tsaye tare da mika tambaya daga manhajar mu.', icon: 'radio', accent: '#3b82f6', gradient: 'from-blue-500/20 to-indigo-500/20' },
  { id: 3, tag: 'Kirkire-kirkire', title: 'Matasa a Zaria sun ƙirƙira manhajar gano gonaki ta tauraron dan adam', copy: 'Aikin ya samu tallafin dala 150,000 daga hadin gwiwar ƙungiyoyin noma na duniya.', icon: 'innovation', accent: '#8b5cf6', gradient: 'from-violet-500/20 to-purple-500/20' },
];

const DEFAULT_STATS = [
  { id: 1, label: 'Labarai', value: 12500, suffix: '+', icon: 'article' },
  { id: 2, label: 'Masu karatu', value: 500, suffix: 'K+', icon: 'reader' },
  { id: 3, label: 'Kasashen duniya', value: 45, suffix: '', icon: 'globe' },
];

const DEFAULT_SPORTS = {
  liveMatches: [
    { id: 1, league: 'NPFL', homeTeam: 'Yanci Stars', homeLogo: 'YS', awayTeam: 'City Royals', awayLogo: 'CR', homeScore: 3, awayScore: 2, minute: "90+2'", isLive: true, events: [{ minute: "88'", team: 'home', player: 'Ahmed', score: '3-2' }], streamUrl: '' },
  ],
  standings: [
    { pos: 1, team: 'Yanci Stars', p: 24, w: 18, d: 4, l: 2, gf: 52, ga: 17, gd: '+35', pts: 58 },
    { pos: 2, team: 'Enyimba', p: 24, w: 15, d: 7, l: 2, gf: 45, ga: 17, gd: '+28', pts: 52 },
    { pos: 3, team: 'Rangers', p: 24, w: 14, d: 7, l: 3, gf: 40, ga: 18, gd: '+22', pts: 49 },
  ],
  fixtures: [
    { id: 1, league: 'NPFL', home: 'Yanci Stars', away: 'Enyimba', date: 'Yau', time: '16:00', stadium: 'Ahmadu Bello', odds: { home: 1.85, draw: 3.20, away: 4.50 } },
    { id: 2, league: 'Premier League', home: 'Super Eagles', away: 'Black Stars', date: 'Gobe', time: '20:00', stadium: 'Moshood Abiola', odds: { home: 1.45, draw: 4.00, away: 6.50 } },
  ],
  playerOfWeek: { name: 'Ahmed Musa', team: 'Yanci Stars', initials: 'AM', goals: 5, assists: 3, rating: 9.2 },
};

const DEFAULT_LAYOUT = [
  { id: 'ticker', label: 'Breaking News Ticker', enabled: true, order: 0 },
  { id: 'hero', label: 'Hero Story + Sidebar', enabled: true, order: 1 },
  { id: 'highlights', label: 'Highlight Panels (3 cards)', enabled: true, order: 2 },
  { id: 'stats', label: 'Statistics Counter', enabled: true, order: 3 },
  { id: 'opinion', label: 'Opinion Section', enabled: true, order: 4 },
  { id: 'sport', label: 'Sports Section', enabled: true, order: 5 },
  { id: 'lifestyle', label: 'Lifestyle & Culture', enabled: true, order: 6 },
  { id: 'elections', label: 'Election Hub Widget', enabled: false, order: 7 },
  { id: 'newsletter', label: 'Newsletter CTA', enabled: true, order: 8 },
];

export const useAdminData = () => {
  const [highlights, setHighlights] = useState([]);
  const [homepageStats, setHomepageStats] = useState([]);
  const [sportsData, setSportsData] = useState(null);
  const [homepageLayout, setHomepageLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useAppwrite, setUseAppwrite] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try Appwrite first
        const hl = await appwriteService.getHighlights();
        if (hl.length > 0) {
          setHighlights(hl.map(doc => ({ ...doc, id: doc.$id })));
          setUseAppwrite(true);
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem(HIGHLIGHTS_KEY);
          setHighlights(saved ? JSON.parse(saved) : DEFAULT_HIGHLIGHTS);
        }
      } catch {
        const saved = localStorage.getItem(HIGHLIGHTS_KEY);
        setHighlights(saved ? JSON.parse(saved) : DEFAULT_HIGHLIGHTS);
      }

      try {
        const stats = await appwriteService.getHomepageStats();
        if (stats.length > 0) {
          setHomepageStats(stats.map(doc => ({ ...doc, id: doc.$id })));
          setUseAppwrite(true);
        } else {
          const saved = localStorage.getItem(STATS_KEY);
          setHomepageStats(saved ? JSON.parse(saved) : DEFAULT_STATS);
        }
      } catch {
        const saved = localStorage.getItem(STATS_KEY);
        setHomepageStats(saved ? JSON.parse(saved) : DEFAULT_STATS);
      }

      try {
        const sports = await appwriteService.getSportsData();
        if (sports) {
          const parsed = {
            liveMatches: typeof sports.liveMatches === 'string' ? JSON.parse(sports.liveMatches) : sports.liveMatches || [],
            standings: typeof sports.standings === 'string' ? JSON.parse(sports.standings) : sports.standings || [],
            fixtures: typeof sports.fixtures === 'string' ? JSON.parse(sports.fixtures) : sports.fixtures || [],
            playerOfWeek: typeof sports.playerOfWeek === 'string' ? JSON.parse(sports.playerOfWeek) : sports.playerOfWeek || DEFAULT_SPORTS.playerOfWeek,
          };
          setSportsData(parsed);
          setUseAppwrite(true);
        } else {
          const saved = localStorage.getItem(SPORTS_KEY);
          setSportsData(saved ? JSON.parse(saved) : DEFAULT_SPORTS);
        }
      } catch {
        const saved = localStorage.getItem(SPORTS_KEY);
        setSportsData(saved ? JSON.parse(saved) : DEFAULT_SPORTS);
      }

      try {
        const layout = await appwriteService.getHomepageLayout();
        if (layout.length > 0) {
          try {
            const sections = JSON.parse(layout[0].sections || '[]');
            if (sections.length > 0) setHomepageLayout(sections);
          } catch {}
        } else {
          const saved = localStorage.getItem(HOMEPAGE_BUILDER_KEY);
          if (saved) {
            try { setHomepageLayout(JSON.parse(saved)); } catch {}
          }
        }
      } catch {
        const saved = localStorage.getItem(HOMEPAGE_BUILDER_KEY);
        if (saved) {
          try { setHomepageLayout(JSON.parse(saved)); } catch {}
        }
      }

      if (homepageLayout.length === 0) setHomepageLayout(DEFAULT_LAYOUT);

      setLoading(false);
    };

    loadData();
  }, []);

  const isSectionEnabled = (sectionId) => {
    if (homepageLayout.length === 0) return true;
    const section = homepageLayout.find(s => s.id === sectionId);
    return section ? section.enabled : true;
  };

  const getOrderedSections = () => {
    if (homepageLayout.length === 0) return [];
    return homepageLayout
      .filter(s => s.enabled)
      .sort((a, b) => a.order - b.order);
  };

  return {
    highlights,
    homepageStats,
    sportsData,
    homepageLayout,
    loading,
    useAppwrite,
    isSectionEnabled,
    getOrderedSections,
  };
};
