/**
 * useAdminData hook
 * Fetches data managed by the admin panel (highlights, stats, sports, homepage layout)
 * from localStorage so the homepage reflects admin changes.
 */

import { useState, useEffect } from 'react';

const HIGHLIGHTS_KEY = 'yanci_highlights';
const STATS_KEY = 'yanci_homepage_stats';
const SPORTS_KEY = 'yanci_sports';
const HOMEPAGE_BUILDER_KEY = 'yanci_homepage_builder';

// Icon mapping for highlight panels
const ICON_MAP = {
  trend: 'arrow-trend',
  radio: 'broadcast',
  innovation: 'wand',
  fire: 'fire',
  calendar: 'calendar',
  users: 'users',
};

export const useAdminData = () => {
  const [highlights, setHighlights] = useState([]);
  const [homepageStats, setHomepageStats] = useState([]);
  const [sportsData, setSportsData] = useState(null);
  const [homepageLayout, setHomepageLayout] = useState([]);

  useEffect(() => {
    // Load highlights
    const savedHighlights = localStorage.getItem(HIGHLIGHTS_KEY);
    if (savedHighlights) {
      try {
        setHighlights(JSON.parse(savedHighlights));
      } catch (e) {
        console.error('Failed to parse highlights:', e);
      }
    }

    // Load homepage stats
    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) {
      try {
        setHomepageStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse stats:', e);
      }
    }

    // Load sports data
    const savedSports = localStorage.getItem(SPORTS_KEY);
    if (savedSports) {
      try {
        setSportsData(JSON.parse(savedSports));
      } catch (e) {
        console.error('Failed to parse sports:', e);
      }
    }

    // Load homepage layout
    const savedLayout = localStorage.getItem(HOMEPAGE_BUILDER_KEY);
    if (savedLayout) {
      try {
        setHomepageLayout(JSON.parse(savedLayout));
      } catch (e) {
        console.error('Failed to parse layout:', e);
      }
    }
  }, []);

  // Helper to check if a section is enabled
  const isSectionEnabled = (sectionId) => {
    if (homepageLayout.length === 0) return true; // Default to enabled if no layout set
    const section = homepageLayout.find(s => s.id === sectionId);
    return section ? section.enabled : true;
  };

  // Helper to get sections in order
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
    isSectionEnabled,
    getOrderedSections,
  };
};
