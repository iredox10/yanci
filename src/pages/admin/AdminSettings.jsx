import { useState } from 'react';
import { GUARDIAN_DATA } from '../../data/guardianData';
import { appwriteService, PROJECT_ID } from '../../lib/appwrite';
import { FaDatabase, FaCloudArrowUp, FaCheck } from 'react-icons/fa6';

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
        'pillar', 'section', 'type', 'author', 'isLive', 'liveUpdates'
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
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
          <p className="text-gray-500">Manage your application configuration.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaDatabase className="text-[#0f3036]" /> Database Connection
          </h3>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-md border ${isAppwriteConfigured ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
              <p className="font-bold flex items-center gap-2">
                {isAppwriteConfigured ? <><FaCheck /> Appwrite Connected</> : 'Appwrite Not Configured'}
              </p>
              <p className="text-sm mt-1">
                {isAppwriteConfigured 
                  ? `Connected to project: ${PROJECT_ID}` 
                  : 'Add your VITE_APPWRITE_* variables to .env to enable cloud storage.'}
              </p>
            </div>

            {isAppwriteConfigured && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-sm text-gray-700 mb-2">Data Management</h4>
                <p className="text-sm text-gray-500 mb-4">
                  If your database is empty, you can seed it with the initial demo data (Headlines, Sport, etc.).
                </p>
                
                <button 
                  onClick={handleSeed} 
                  disabled={seeding}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-white transition-colors ${seeding ? 'bg-gray-400 cursor-wait' : 'bg-[#0f3036] hover:bg-[#1a454c]'}`}
                >
                  {seeding ? 'Seeding...' : <><FaCloudArrowUp /> Seed Database</>}
                </button>

                {status === 'success' && (
                  <p className="text-green-600 text-sm font-bold mt-2">Successfully uploaded initial data!</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 text-sm font-bold mt-2">Failed to seed data. Check console for details.</p>
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
