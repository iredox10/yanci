import { useState } from 'react';
import { GUARDIAN_DATA } from '../../data/guardianData';
import { appwriteService, PROJECT_ID } from '../../lib/appwrite';
import { FaDatabase, FaCloudArrowUp, FaCheck, FaTriangleExclamation, FaSpinner } from 'react-icons/fa6';

const AdminSettings = () => {
  const [seeding, setSeeding] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'

  const isAppwriteConfigured = !!PROJECT_ID;

  const handleSeed = async () => {
    if (!window.confirm("This will upload all initial demo data to your Appwrite database. Continue?")) return;
    
    setSeeding(true);
    setStatus(null);
    
    try {
      const allArticles = [
        ...GUARDIAN_DATA.headlines.map(a => ({ ...a, section: 'headlines' })),
        ...GUARDIAN_DATA.sport.map(a => ({ ...a, section: 'sport' })),
        ...GUARDIAN_DATA.opinion.map(a => ({ ...a, section: 'opinion' })),
        ...GUARDIAN_DATA.culture.map(a => ({ ...a, section: 'culture' })),
        ...GUARDIAN_DATA.lifestyle.map(a => ({ ...a, section: 'lifestyle' })),
      ];

      const validAttributes = [
        'headline', 'kicker', 'trail', 'body', 'image', 'videoUrl', 'keyFigures', 
        'pillar', 'section', 'type', 'author', 'isLive', 'liveUpdates', 'series'
      ];

      for (const article of allArticles) {
        const cleanData = {};
        validAttributes.forEach(attr => {
          if (Object.prototype.hasOwnProperty.call(article, attr)) {
            cleanData[attr] = article[attr];
          }
        });

        cleanData.type = cleanData.type || 'standard';
        cleanData.isLive = cleanData.isLive || false;
        cleanData.liveUpdates = [];

        await appwriteService.createArticle(cleanData);
      }
      setStatus('success');
    } catch (error) {
      console.error("Seeding failed:", error);
      setStatus('error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">System Settings</h2>
          <p className="text-sm text-gray-500">Manage application configuration and data.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-8">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <FaDatabase className="text-[#0f3036]" /> Database Connection
          </h3>
          
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${isAppwriteConfigured ? 'bg-green-50 border-green-100 text-green-800' : 'bg-yellow-50 border-yellow-100 text-yellow-800'}`}>
              <p className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                {isAppwriteConfigured ? <><FaCheck /> Appwrite Connected</> : <><FaTriangleExclamation /> Appwrite Not Configured</>}
              </p>
              <p className="text-sm leading-relaxed">
                {isAppwriteConfigured 
                  ? `Your application is successfully connected to project: ${PROJECT_ID}` 
                  : 'Add your VITE_APPWRITE_* variables to .env to enable cloud storage and real-time updates.'}
              </p>
            </div>

            {isAppwriteConfigured && (
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-base text-gray-800 mb-2">Data Seeding</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Populate your database with the initial demo content if it's currently empty.
                </p>
                
                <button 
                  onClick={handleSeed} 
                  disabled={seeding}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${seeding ? 'bg-gray-200 text-gray-400 cursor-wait shadow-none' : 'bg-[#0f3036] text-white hover:bg-[#1a454c] shadow-[#0f3036]/20'}`}
                >
                  {seeding ? <FaSpinner className="animate-spin" /> : <FaCloudArrowUp />}
                  {seeding ? 'Uploading Data...' : 'Seed Database'}
                </button>

                {status === 'success' && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-2">
                    <FaCheck /> Successfully uploaded initial data!
                  </div>
                )}
                {status === 'error' && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-2">
                    <FaTriangleExclamation /> Failed to seed data. Check console.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
