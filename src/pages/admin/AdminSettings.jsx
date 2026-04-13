import { useState, useEffect } from 'react';
import { appwriteService } from '../../lib/appwrite';
import {
  FaGlobe, FaMagnifyingGlass, FaEnvelope, FaBell, FaWrench, FaDatabase,
  FaSpinner, FaCheck, FaTriangleExclamation, FaEye, FaEyeSlash,
  FaFloppyDisk, FaDownload, FaUpload, FaTrash, FaPlus, FaXmark,
  FaPen, FaRotateLeft,
} from 'react-icons/fa6';

const TABS = [
  { id: 'general', label: 'General', icon: FaGlobe },
  { id: 'seo', label: 'SEO & Metadata', icon: FaMagnifyingGlass },
  { id: 'email', label: 'Email / SMTP', icon: FaEnvelope },
  { id: 'notifications', label: 'Notifications', icon: FaBell },
  { id: 'maintenance', label: 'Maintenance', icon: FaWrench },
  { id: 'backup', label: 'Backup & Data', icon: FaDatabase },
];

const DEFAULT_SETTINGS = {
  site_name: 'Yanci', tagline: 'Labarai na Gaskiya', logo_url: '', favicon_url: '',
  contact_email: '', contact_phone: '', address: '',
  facebook_url: '', twitter_url: '', instagram_url: '', youtube_url: '',
  default_meta_desc: '', default_og_image: '', google_analytics_id: '',
  smtp_host: '', smtp_port: 587, smtp_user: '', smtp_pass: '',
  maintenance_mode: false, maintenance_message: '',
  comments_enabled: true, newsletter_enabled: true,
  vapid_public_key: '', vapid_private_key: '', firebase_config: '',
};

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const doc = await appwriteService.getSettings();
        if (doc) {
          setSettings(prev => ({ ...prev, ...doc }));
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await appwriteService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Failed to save:', e);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yanci-settings-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        setSettings(prev => ({ ...prev, ...data }));
        alert('Settings imported successfully');
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div>;

  const Tab = TABS.find(t => t.id === activeTab);
  const Icon = Tab.icon;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Icon className="text-[#c59d5f]" /> {Tab.label}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Configure your site settings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="px-4 py-2.5 rounded-md border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <FaRotateLeft className="w-3.5 h-3.5" /> Reset
          </button>
          <button onClick={handleSave} disabled={saving} className={`px-6 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-[#0f3036] text-white hover:bg-[#1a454c] disabled:opacity-50'}`}>
            {saving ? <FaSpinner className="animate-spin w-4 h-4" /> : saved ? <FaCheck className="w-4 h-4" /> : <FaFloppyDisk className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto pb-px">
        {TABS.map(tab => {
          const TIcon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#c59d5f] text-[#0f3036]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <TIcon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="max-w-3xl space-y-6">
        {activeTab === 'general' && (
          <>
            <Section title="Site Identity">
              <Field label="Site Name" value={settings.site_name} onChange={v => update('site_name', v)} />
              <Field label="Tagline" value={settings.tagline} onChange={v => update('tagline', v)} />
              <Field label="Logo URL" value={settings.logo_url} onChange={v => update('logo_url', v)} placeholder="https://example.com/logo.png" />
              <Field label="Favicon URL" value={settings.favicon_url} onChange={v => update('favicon_url', v)} placeholder="https://example.com/favicon.ico" />
            </Section>
            <Section title="Contact Information">
              <Field label="Contact Email" type="email" value={settings.contact_email} onChange={v => update('contact_email', v)} />
              <Field label="Contact Phone" value={settings.contact_phone} onChange={v => update('contact_phone', v)} />
              <Field label="Address" value={settings.address} onChange={v => update('address', v)} />
            </Section>
            <Section title="Social Media">
              <Field label="Facebook URL" value={settings.facebook_url} onChange={v => update('facebook_url', v)} />
              <Field label="Twitter/X URL" value={settings.twitter_url} onChange={v => update('twitter_url', v)} />
              <Field label="Instagram URL" value={settings.instagram_url} onChange={v => update('instagram_url', v)} />
              <Field label="YouTube URL" value={settings.youtube_url} onChange={v => update('youtube_url', v)} />
            </Section>
          </>
        )}

        {activeTab === 'seo' && (
          <>
            <Section title="Default SEO">
              <Field label="Default Meta Description" value={settings.default_meta_desc} onChange={v => update('default_meta_desc', v)} textarea />
              <Field label="Default OG Image URL" value={settings.default_og_image} onChange={v => update('default_og_image', v)} placeholder="https://example.com/og-image.jpg" />
              <Field label="Google Analytics ID" value={settings.google_analytics_id} onChange={v => update('google_analytics_id', v)} placeholder="G-XXXXXXXXXX" />
            </Section>
          </>
        )}

        {activeTab === 'email' && (
          <>
            <Section title="SMTP Configuration">
              <Field label="SMTP Host" value={settings.smtp_host} onChange={v => update('smtp_host', v)} placeholder="smtp.gmail.com" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="SMTP Port" type="number" value={settings.smtp_port} onChange={v => update('smtp_port', parseInt(v) || 587)} />
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">SMTP Password</label>
                  <div className="relative">
                    <input type={showSmtpPass ? 'text' : 'password'} value={settings.smtp_pass} onChange={e => update('smtp_pass', e.target.value)} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none pr-10" />
                    <button onClick={() => setShowSmtpPass(!showSmtpPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showSmtpPass ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <Field label="SMTP Username" value={settings.smtp_user} onChange={v => update('smtp_user', v)} />
            </Section>
          </>
        )}

        {activeTab === 'notifications' && (
          <>
            <Section title="Push Notifications">
              <Field label="VAPID Public Key" value={settings.vapid_public_key} onChange={v => update('vapid_public_key', v)} />
              <Field label="VAPID Private Key" value={settings.vapid_private_key} onChange={v => update('vapid_private_key', v)} />
              <Field label="Firebase Config (JSON)" value={settings.firebase_config} onChange={v => update('firebase_config', v)} textarea placeholder='{"apiKey":"...","projectId":"..."}' />
            </Section>
          </>
        )}

        {activeTab === 'maintenance' && (
          <>
            <Section title="Maintenance Mode">
              <Toggle label="Enable Maintenance Mode" checked={settings.maintenance_mode} onChange={v => update('maintenance_mode', v)} />
              {settings.maintenance_mode && (
                <Field label="Maintenance Message" value={settings.maintenance_message} onChange={v => update('maintenance_message', v)} textarea placeholder="We're currently performing maintenance. Please check back soon." />
              )}
            </Section>
            <Section title="Feature Toggles">
              <Toggle label="Enable Comments" checked={settings.comments_enabled} onChange={v => update('comments_enabled', v)} />
              <Toggle label="Enable Newsletter Signup" checked={settings.newsletter_enabled} onChange={v => update('newsletter_enabled', v)} />
            </Section>
          </>
        )}

        {activeTab === 'backup' && (
          <>
            <Section title="Export / Import Settings">
              <div className="flex gap-3">
                <button onClick={handleExport} className="px-4 py-2.5 bg-[#0f3036] text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#1a454c]">
                  <FaDownload className="w-4 h-4" /> Export Settings
                </button>
                <label className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
                  <FaUpload className="w-4 h-4" /> Import Settings
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </Section>
            <Section title="Danger Zone">
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><FaTriangleExclamation className="w-4 h-4" /> Clear All Cached Data</h4>
                <p className="text-sm text-red-600 mb-4">This will clear localStorage cache for highlights, stats, sports, and layout. Appwrite data will not be affected.</p>
                <button onClick={() => { localStorage.clear(); alert('Cache cleared'); }} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 flex items-center gap-2">
                  <FaTrash className="w-3.5 h-3.5" /> Clear Cache
                </button>
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
    <h3 className="font-bold text-base text-gray-800 border-b border-gray-100 pb-3">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value, onChange, type = 'text', placeholder, textarea }) => (
  <div>
    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows="3" className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none resize-none" />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c59d5f] outline-none" />
    )}
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#0f3036]' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  </div>
);

export default AdminSettings;
