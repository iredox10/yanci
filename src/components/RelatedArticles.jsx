import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';

const RelatedArticles = ({ currentArticle, allArticles, limit = 4 }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!currentArticle || !allArticles?.length) return;

    const currentTags = currentArticle.tags || [];
    const currentSection = currentArticle.section || currentArticle.pillar || '';
    const currentAuthor = currentArticle.author || '';
    const currentId = currentArticle.$id || currentArticle.id;

    const scored = allArticles
      .filter(a => (a.$id || a.id) !== currentId && a.status === 'published')
      .map(article => {
        let score = 0;
        const articleTags = article.tags || [];
        const articleSection = article.section || article.pillar || '';
        const articleAuthor = article.author || '';

        // Same tags (highest weight)
        const sharedTags = currentTags.filter(t => articleTags.includes(t));
        score += sharedTags.length * 3;

        // Same section/category
        if (articleSection && currentSection && articleSection === currentSection) score += 2;

        // Same author
        if (articleAuthor && currentAuthor && articleAuthor === currentAuthor) score += 1;

        // Recency bonus (articles from last 7 days get +1)
        const articleDate = article.$createdAt ? new Date(article.$createdAt).getTime() : Date.now();
        const daysOld = (Date.now() - articleDate) / (1000 * 60 * 60 * 24);
        if (daysOld < 7) score += 1;

        return { ...article, score };
      })
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score || new Date(b.$createdAt || 0) - new Date(a.$createdAt || 0))
      .slice(0, limit);

    setRelated(scored);
  }, [currentArticle, allArticles, limit]);

  if (related.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Related Articles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(article => (
          <Link
            key={article.$id || article.id}
            to={`/article/${article.$id || article.id}`}
            className="group block p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">{article.section || article.pillar || ''}</p>
            <p className="text-sm font-bold text-gray-900 group-hover:text-[#c59d5f] transition-colors line-clamp-2">
              {article.headline || article.title || 'Untitled'}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <span>{article.author || ''}</span>
              {article.$createdAt && <span>· {new Date(article.$createdAt).toLocaleDateString()}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
