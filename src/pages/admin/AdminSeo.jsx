import { useState, useEffect } from 'react';
import { FaShieldHalved, FaFloppyDisk, FaGlobe, FaLink, FaImage, FaShareNodes, FaMagnifyingGlass, FaSpinner, FaCheck } from 'react-icons/fa6';

const STORAGE_KEY = 'yanci_seo_settings';

const defaultSettings = {
  siteTitle: 'Yanci - Muryar Arewa',
  siteDescription: 'Labarai da ra\'ayi daga Najeriya - Your trusted Nigerian news source',
  siteUrl: 'https://yanci.com',
  ogImage: '/og-image.jpg',
  ogLocale: 'ha_NG',
  ogType: 'website',
  twitterHandle: '@yancinews',
  googleAnalyticsId: '',
  googleSearchConsoleId: '',
  facebookAppId: '',
  canonicalUrl: 'https://yanci.com',
  robotsTxt: 'User-agent: *\nAllow: /\n\nSitemap: https://yanci.com/sitemap.xml',
  metaKeywords: 'Nigeria news, Hausa news, Arewa, Yanci, Labarai, Najeriya',
  author: 'Yanci Editorial Team',
};

const AdminSeo = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const tabs = [
    { id: 'general', label: 'General SEO', icon: FaMagnifyingGlass },
    { id: 'social', label: 'Social Media', icon: FaShareNodes },
    { id: 'verification', label: 'Verification', icon: FaCheck },
    { id: 'advanced', label: 'Advanced', icon: FaShieldHalved },
  ];

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShieldHalved className="text-[#c59d5f]" /> SEO & Metadata Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">Gudanar da SEO, metadata, da social media settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded-md flex items-center gap-2 font-bold text-sm transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-[#0f3036] text-white hover:bg-[#1a454c] disabled:opacity-50'
          }`}
        >
          {saving ? <FaSpinner className="animate-spin w-4 h-4" /> : saved ? <FaCheck className="w-4 h-4" /> : <FaFloppyDisk className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Ajiye Settings'}
        </button>
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

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Site Title</label>
            <input
              value={settings.siteTitle}
              onChange={e => updateSetting('siteTitle', e.target.value)}
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Default title shown across all pages</p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={e => updateSetting('siteDescription', e.target.value)}
              rows="3"
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Used for search engine snippets (150-160 characters ideal)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2"><FaGlobe className="w-4 h-4" /> Site URL</label>
              <input
                value={settings.siteUrl}
                onChange={e => updateSetting('siteUrl', e.target.value)}
                placeholder="https://yanci.com"
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2"><FaLink className="w-4 h-4" /> Canonical URL</label>
              <input
                value={settings.canonicalUrl}
                onChange={e => updateSetting('canonicalUrl', e.target.value)}
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2"><FaImage className="w-4 h-4" /> Default OG Image</label>
              <input
                value={settings.ogImage}
                onChange={e => updateSetting('ogImage', e.target.value)}
                placeholder="/og-image.jpg"
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Locale</label>
              <input
                value={settings.ogLocale}
                onChange={e => updateSetting('ogLocale', e.target.value)}
                placeholder="ha_NG"
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Meta Keywords (comma-separated)</label>
            <input
              value={settings.metaKeywords}
              onChange={e => updateSetting('metaKeywords', e.target.value)}
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Author</label>
            <input
              value={settings.author}
              onChange={e => updateSetting('author', e.target.value)}
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
            />
          </div>
        </div>
      )}

      {/* Social Tab */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-6">
            <p className="text-sm text-blue-800 font-medium">Configure how your site appears when shared on social media platforms.</p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Twitter Handle</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm">@</span>
              <input
                value={settings.twitterHandle.replace('@', '')}
                onChange={e => updateSetting('twitterHandle', '@' + e.target.value.replace('@', ''))}
                className="flex-1 text-sm p-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Facebook App ID</label>
            <input
              value={settings.facebookAppId}
              onChange={e => updateSetting('facebookAppId', e.target.value)}
              placeholder="1234567890"
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">OG Type</label>
            <select
              value={settings.ogType}
              onChange={e => updateSetting('ogType', e.target.value)}
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none bg-white"
            >
              <option value="website">Website</option>
              <option value="article">Article</option>
              <option value="profile">Profile</option>
            </select>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Social Share Preview</p>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <FaImage className="text-gray-400 text-3xl" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 uppercase">{settings.siteUrl}</p>
                <p className="font-bold text-sm mt-1">{settings.siteTitle}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{settings.siteDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Tab */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-6">
            <p className="text-sm text-amber-800 font-medium">Add verification codes from search engines to prove site ownership.</p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Google Search Console Verification</label>
            <input
              value={settings.googleSearchConsoleId}
              onChange={e => updateSetting('googleSearchConsoleId', e.target.value)}
              placeholder="google-site-verification=XXXXXXXXXXXX"
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Found in Google Search Console → Settings → Ownership verification</p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Google Analytics ID</label>
            <input
              value={settings.googleAnalyticsId}
              onChange={e => updateSetting('googleAnalyticsId', e.target.value)}
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX"
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none"
            />
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">robots.txt</label>
            <textarea
              value={settings.robotsTxt}
              onChange={e => updateSetting('robotsTxt', e.target.value)}
              rows="8"
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none font-mono resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Controls how search engines crawl your site</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeo;
