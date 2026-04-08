import { useState, useMemo } from 'react';
import { FaChartLine, FaEye, FaArrowTrendUp, FaUsers, FaFileLines, FaClock, FaGlobe, FaChevronUp, FaChevronDown, FaMagnifyingGlass } from 'react-icons/fa6';
import { useNews } from '../../context/NewsContext';
import { useViewTracker } from '../../hooks/useViewTracker';

const AdminAnalytics = () => {
  const { articles } = useNews();
  const { getMostRead, getViewsBySection, getTotalViews } = useViewTracker();
  const [timeRange, setTimeRange] = useState('7d');
  const [sortBy, setSortBy] = useState('views');

  // Guard against undefined articles
  const safeArticles = articles || [];

  // Simulated analytics data
  const trafficData = useMemo(() => {
    const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const labels = timeRange === '24h'
      ? Array.from({ length: 24 }, (_, i) => `${i}:00`)
      : Array.from({ length: days }, (_, i) => `Day ${i + 1}`);

    return labels.map(label => ({
      label,
      views: Math.floor(Math.random() * 5000) + 1000,
      visitors: Math.floor(Math.random() * 3000) + 500,
    }));
  }, [timeRange]);

  const totalViews = trafficData.reduce((sum, d) => sum + d.views, 0);
  const totalVisitors = trafficData.reduce((sum, d) => sum + d.visitors, 0);
  const avgViews = Math.round(totalViews / trafficData.length);
  const peakViews = Math.max(...trafficData.map(d => d.views));

  const mostRead = getMostRead(10);
  const sectionPerformance = useMemo(() => {
    const sectionViews = {};
    safeArticles.forEach(article => {
      const section = article.section || 'unknown';
      if (!sectionViews[section]) sectionViews[section] = { views: 0, articles: 0 };
      sectionViews[section].views += article.views || 0;
      sectionViews[section].articles += 1;
    });
    return Object.entries(sectionViews)
      .map(([section, data]) => ({ section, ...data }))
      .sort((a, b) => b.views - a.views);
  }, [safeArticles]);

  const pillarPerformance = useMemo(() => {
    const pillarViews = {};
    safeArticles.forEach(article => {
      const pillar = article.pillar || 'unknown';
      if (!pillarViews[pillar]) pillarViews[pillar] = { views: 0, articles: 0 };
      pillarViews[pillar].views += article.views || 0;
      pillarViews[pillar].articles += 1;
    });
    return Object.entries(pillarViews)
      .map(([pillar, data]) => ({ pillar, ...data }))
      .sort((a, b) => b.views - a.views);
  }, [safeArticles]);

  // Simulated top referrers
  const topReferrers = [
    { source: 'Direct', visitors: 12500, percentage: 35 },
    { source: 'Google Search', visitors: 9800, percentage: 27 },
    { source: 'Facebook', visitors: 5600, percentage: 15 },
    { source: 'Twitter/X', visitors: 4200, percentage: 12 },
    { source: 'WhatsApp', visitors: 3100, percentage: 8 },
    { source: 'Other', visitors: 1200, percentage: 3 },
  ];

  // Simulated top countries
  const topCountries = [
    { country: 'Nigeria', flag: '🇳🇬', visitors: 25000, percentage: 68 },
    { country: 'Niger', flag: '🇳🇪', visitors: 3200, percentage: 9 },
    { country: 'Ghana', flag: '🇬🇭', visitors: 2100, percentage: 6 },
    { country: 'Cameroon', flag: '🇨🇲', visitors: 1800, percentage: 5 },
    { country: 'United States', flag: '🇺🇸', visitors: 1500, percentage: 4 },
    { country: 'United Kingdom', flag: '🇬🇧', visitors: 1200, percentage: 3 },
    { country: 'Other', flag: '🌍', visitors: 1800, percentage: 5 },
  ];

  const maxViews = Math.max(...trafficData.map(d => d.views));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaChartLine className="text-[#c59d5f]" /> Analytics Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">Traffic, engagement, da performance na dukkan shafuka</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                timeRange === range
                  ? 'bg-[#0f3036] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaEye className="text-blue-600" /></div>
            <span className="text-sm text-gray-500 font-medium">Total Views</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><FaArrowTrendUp className="w-3 h-3" /> +12% vs previous</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaUsers className="text-green-600" /></div>
            <span className="text-sm text-gray-500 font-medium">Visitors</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{totalVisitors.toLocaleString()}</p>
          <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><FaArrowTrendUp className="w-3 h-3" /> +8% vs previous</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><FaFileLines className="text-purple-600" /></div>
            <span className="text-sm text-gray-500 font-medium">Avg Views/Period</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{avgViews.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><FaArrowTrendUp className="text-red-600" /></div>
            <span className="text-sm text-gray-500 font-medium">Peak Views</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{peakViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Traffic Chart (Simple Bar Visualization) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FaClock className="text-gray-400" /> Traffic Over Time
        </h3>
        <div className="flex items-end gap-1 h-40 overflow-x-auto">
          {trafficData.map((data, index) => (
            <div key={index} className="flex-1 min-w-[8px] flex flex-col items-center gap-1 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                <p className="font-bold">{data.views.toLocaleString()} views</p>
                <p>{data.visitors.toLocaleString()} visitors</p>
              </div>
              <div
                className="w-full bg-[#0f3036] rounded-t-sm hover:bg-[#c59d5f] transition-colors"
                style={{ height: `${(data.views / maxViews) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{trafficData[0]?.label}</span>
          <span>{trafficData[trafficData.length - 1]?.label}</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Read Articles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FaFileLines className="text-[#c59d5f]" /> Most Read Articles
            </h3>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"
            >
              <option value="views">By Views</option>
              <option value="date">By Date</option>
            </select>
          </div>
          <div className="space-y-2">
            {mostRead.slice(0, 8).map((article, idx) => (
              <div key={article.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx < 3 ? 'bg-[#c59d5f] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{article.headline}</p>
                  <p className="text-xs text-gray-500 capitalize">{article.section || article.pillar}</p>
                </div>
                <span className="text-xs font-bold text-gray-600">{(article.views || 0).toLocaleString()}</span>
              </div>
            ))}
            {mostRead.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">Babu bayanan karatu tukuna.</p>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaGlobe className="text-[#c59d5f]" /> Top Traffic Sources
          </h3>
          <div className="space-y-3">
            {topReferrers.map((source, idx) => (
              <div key={source.source} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-4">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">{source.source}</span>
                    <span className="text-xs font-bold text-gray-600">{source.visitors.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#0f3036] h-2 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 w-10 text-right">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section & Pillar Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaChartLine className="text-[#c59d5f]" /> Section Performance
          </h3>
          <div className="space-y-2">
            {sectionPerformance.map((section) => (
              <div key={section.section} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <span className="text-sm font-bold text-gray-900 capitalize">{section.section}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{section.articles} articles</span>
                  <span className="text-sm font-bold text-gray-600">{section.views.toLocaleString()} views</span>
                </div>
              </div>
            ))}
            {sectionPerformance.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No section data yet.</p>
            )}
          </div>
        </div>

        {/* Pillar Performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaChartLine className="text-[#c59d5f]" /> Pillar Performance
          </h3>
          <div className="space-y-2">
            {pillarPerformance.map((pillar) => (
              <div key={pillar.pillar} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <span className="text-sm font-bold text-gray-900 capitalize">{pillar.pillar}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{pillar.articles} articles</span>
                  <span className="text-sm font-bold text-gray-600">{pillar.views.toLocaleString()} views</span>
                </div>
              </div>
            ))}
            {pillarPerformance.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No pillar data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Geographic Data */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FaGlobe className="text-[#c59d5f]" /> Reader Geography
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topCountries.map((country) => (
            <div key={country.country} className="flex items-center gap-3">
              <span className="text-xl">{country.flag}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-900">{country.country}</span>
                  <span className="text-xs font-bold text-gray-600">{country.visitors.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-[#c59d5f] h-1.5 rounded-full"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-gray-500 w-10 text-right">{country.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
