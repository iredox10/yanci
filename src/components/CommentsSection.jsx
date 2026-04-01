/**
 * CommentsSection — reader comments component for article pages.
 *
 * Features:
 * - Add new comments with name and body
 * - Like/upvote comments
 * - Delete own comments
 * - Sort by newest or most liked
 * - Stored in localStorage (Appwrite integration ready)
 */

import { useState } from 'react';
import { FaHeart, FaReply, FaSort, FaTrash } from 'react-icons/fa6';
import { useComments } from '../hooks/useComments';

function CommentItem({ comment, onDelete, onLike }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Yanzu';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0 group">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#0f3036] text-white flex items-center justify-center text-xs font-bold shrink-0">
          {(comment.name || 'A')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-gray-900">{comment.name || 'Mai karatu'}</span>
            <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.body}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaHeart className={comment.likes > 0 ? 'text-red-500' : ''} size={12} />
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>
            {comment.isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FaTrash size={11} /> Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentsSection({ articleId }) {
  const { comments, loading, addComment, deleteComment, likeComment } = useComments(articleId);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [submitting, setSubmitting] = useState(false);

  // Check if user has commented before (load name from localStorage)
  const storedName = typeof window !== 'undefined' ? localStorage.getItem('yanci_comment_name') : null;
  if (storedName && !name) setName(storedName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    const commenterName = name.trim() || 'Mai karatu';
    localStorage.setItem('yanci_comment_name', commenterName);

    addComment({
      name: commenterName,
      body: body.trim(),
      isOwner: true,
    });

    setBody('');
    setSubmitting(false);
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'liked') return (b.likes || 0) - (a.likes || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
        {comments.length > 1 && (
          <button
            onClick={() => setSortBy(sortBy === 'newest' ? 'liked' : 'newest')}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaSort size={12} />
            {sortBy === 'newest' ? 'Sabbi' : 'Mafi so'}
          </button>
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 rounded-lg p-5">
        <div className="mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sunanka (zaɓi)"
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036]"
          />
        </div>
        <div className="mb-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Rubuta sharhinka anan..."
            rows={3}
            required
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3036]/20 focus:border-[#0f3036] resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="px-5 py-2 bg-[#0f3036] text-white text-sm font-bold rounded-lg hover:bg-[#1a454c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Ana aika...' : 'Aika Sharhi'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Ana loda sharhi...</div>
      ) : sortedComments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          Babu sharhi tukuna. Ka zama na farko!
        </div>
      ) : (
        <div>
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={deleteComment}
              onLike={likeComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
