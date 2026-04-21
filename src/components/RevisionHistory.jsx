import { useState, useEffect } from 'react';
import { appwriteService } from '../lib/appwrite';
import { FaClock, FaRotateLeft, FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa6';

const RevisionHistory = ({ articleId, currentData, onRestore }) => {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    const load = async () => {
      setLoading(true);
      try {
        const docs = await appwriteService.getRevisions(articleId);
        setRevisions(docs.map(d => ({ ...d, diff: typeof d.diff === 'string' ? JSON.parse(d.diff) : d.diff })));
      } catch (e) { console.error('Failed to load revisions:', e); }
      finally { setLoading(false); }
    };
    load();
  }, [articleId]);

  const handleRestore = (revision) => {
    if (!window.confirm('Restore this version? Current changes will be saved as a new revision.')) return;
    onRestore?.(revision.snapshot);
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    return Math.floor(hrs / 24) + 'd ago';
  };

  if (loading) return <div className="flex items-center justify-center py-8"><FaSpinner className="animate-spin text-gray-400" /></div>;
  if (revisions.length === 0) return <div className="text-center py-8 text-gray-400 text-sm">No revisions yet. Revisions are saved automatically when you update the article.</div>;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm text-gray-700 flex items-center gap-2">
          <FaClock className="text-[#c59d5f]" /> Revision History ({revisions.length})
        </h4>
        <button onClick={() => setShowDiff(!showDiff)} className="text-xs font-bold text-[#c59d5f] hover:underline">
          {showDiff ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {revisions.map((rev, i) => (
        <div key={rev.$id} className="border border-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === rev.$id ? null : rev.$id)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
            aria-expanded={expanded === rev.$id}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0f3036]/10 text-[#0f3036] flex items-center justify-center text-xs font-bold">
                {rev.author_name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{rev.author_name || 'Unknown'}</p>
                <p className="text-xs text-gray-400">{timeAgo(rev.$createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{rev.change_type || 'edit'}</span>
              {expanded === rev.$id ? <FaChevronUp className="w-3 h-3 text-gray-400" /> : <FaChevronDown className="w-3 h-3 text-gray-400" />}
            </div>
          </button>

          {expanded === rev.$id && (
            <div className="px-3 pb-3 border-t border-gray-50">
              {rev.message && <p className="text-sm text-gray-600 mt-2 mb-2">{rev.message}</p>}

              {showDiff && rev.diff && (
                <div className="mt-2 space-y-1">
                  {rev.diff.added?.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-green-700">Added: </span>
                      <span className="text-green-600">{rev.diff.added.join(', ')}</span>
                    </div>
                  )}
                  {rev.diff.removed?.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-red-700">Removed: </span>
                      <span className="text-red-600">{rev.diff.removed.join(', ')}</span>
                    </div>
                  )}
                  {rev.diff.changed?.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-blue-700">Changed: </span>
                      <span className="text-blue-600">{rev.diff.changed.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => handleRestore(rev)}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#c59d5f] hover:text-[#b08a4f] transition-colors"
              >
                <FaRotateLeft className="w-3 h-3" /> Restore this version
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RevisionHistory;
