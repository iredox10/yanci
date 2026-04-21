import { useState, useEffect, useCallback, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { appwriteService } from '../../lib/appwrite';
import { useNavigate, useParams } from 'react-router-dom';
import RevisionHistory from '../../components/RevisionHistory';
import {
  FaFloppyDisk,
  FaArrowLeft,
  FaCloudArrowUp,
  FaSpinner,
  FaEye,
  FaTowerBroadcast,
  FaClock,
  FaCheck,
  FaTrash,
  FaMapLocationDot,
  FaQuoteLeft,
  FaCircleInfo,
  FaLayerGroup,
  FaPlus,
  FaGear,
  FaCalendarCheck,
  FaLink,
  FaMagnifyingGlass,
  FaTag,
  FaUserGroup,
  FaTriangleExclamation,
  FaNewspaper,
  FaShareNodes,
  FaXmark,
  FaImage,
  FaCircleDot,
  FaBolt,
  FaRotateLeft,
  FaClockRotateLeft,
} from 'react-icons/fa6';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { CorrectionsEditor } from '../../components/Corrections';

// ─── Constants ────────────────────────────────────────────────────────────────

const PILLAR_SECTIONS = {
  news:      ['headlines', 'siyasa', 'kasa', 'duniya', 'tattalin-arziki'],
  sport:     ['wasanni', 'kwallon-kafa', 'dambe', 'tsere', 'wasan-kwaikwayo'],
  opinion:   ['ra\'ayi', 'sharhi', 'edito', 'tattaunawa'],
  culture:   ['al\'adu', 'fasaha', 'kiɗa', 'fim', 'littafi'],
  lifestyle: ['kasuwanci', 'lafiya', 'abinci', 'tafiye-tafiye', 'fasaha-rayuwa'],
};

const ARTICLE_FORMATS = [
  { value: 'news',      label: 'Labarai' },
  { value: 'feature',   label: 'Feature' },
  { value: 'opinion',   label: "Ra'ayi" },
  { value: 'analysis',  label: 'Nazari' },
  { value: 'interview', label: 'Hira' },
  { value: 'explainer', label: 'Bayani' },
  { value: 'review',    label: 'Duba' },
  { value: 'breaking',  label: 'Labari mai karfi' },
];

const FORMAT_COLOR = {
  news:      'bg-red-50 text-red-700',
  feature:   'bg-purple-50 text-purple-700',
  opinion:   'bg-orange-50 text-orange-700',
  analysis:  'bg-blue-50 text-blue-700',
  interview: 'bg-teal-50 text-teal-700',
  explainer: 'bg-indigo-50 text-indigo-700',
  review:    'bg-pink-50 text-pink-700',
  breaking:  'bg-red-100 text-red-800',
};

// ─── Focal point picker ───────────────────────────────────────────────────────

const FocalPointPicker = ({ imageUrl, focalX, focalY, onChange }) => {
  const ref = useRef(null);

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onChange(x, y);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        Wurin Yanka (Focal Point) — danna hoton
      </p>
      <div
        ref={ref}
        onClick={handleClick}
        className="relative w-full aspect-video rounded-lg overflow-hidden cursor-crosshair border border-gray-200"
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: `${focalX ?? 50}% ${focalY ?? 50}%` }}
      >
        {/* Crosshair */}
        {focalX != null && focalY != null && (
          <div
            className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg bg-[#c59d5f]/60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${focalX}%`, top: `${focalY}%` }}
          />
        )}
        <div className="absolute inset-0 bg-black/10 hover:bg-black/5 transition-colors" />
        <div className="absolute bottom-1.5 right-2 text-[10px] text-white/80 font-mono bg-black/40 px-1.5 py-0.5 rounded">
          {focalX ?? 50}%, {focalY ?? 50}%
        </div>
      </div>
    </div>
  );
};

// ─── Tag input ────────────────────────────────────────────────────────────────

const TagInput = ({ value, onChange }) => {
  const [input, setInput] = useState('');
  const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];

  const addTag = (raw) => {
    const tag = raw.trim();
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag].join(', '));
    setInput('');
  };

  const removeTag = (tag) => {
    onChange(tags.filter(t => t !== tag).join(', '));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#c59d5f]">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 bg-[#0f3036]/8 text-[#0f3036] text-[11px] font-bold px-2 py-0.5 rounded-full">
            <FaTag className="w-2 h-2 opacity-60" />{tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 hover:text-red-600 transition-colors">
              <FaXmark className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
            if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1]);
          }}
          onBlur={() => input.trim() && addTag(input)}
          placeholder={tags.length ? '' : "Shigar da tag, matsa Enter ko comma..."}
          className="flex-1 min-w-[120px] text-xs outline-none bg-transparent placeholder-gray-300"
        />
      </div>
      <p className="text-[10px] text-gray-400">{tags.length} tag{tags.length !== 1 ? 's' : ''}</p>
    </div>
  );
};

// ─── Related Articles Picker ──────────────────────────────────────────────────

const RelatedPicker = ({ articles, value, onChange }) => {
  const [search, setSearch] = useState('');
  const ids = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  const toggle = (id) => {
    const sid = String(id);
    if (ids.includes(sid)) {
      onChange(ids.filter(i => i !== sid).join(', '));
    } else if (ids.length < 3) {
      onChange([...ids, sid].join(', '));
    }
  };

  const pinned = articles.filter(a => ids.includes(String(a.id)));
  const filtered = articles
    .filter(a => !ids.includes(String(a.id)))
    .filter(a => !search || a.headline?.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8);

  return (
    <div className="space-y-2">
      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="space-y-1">
          {pinned.map(a => (
            <div key={a.id} className="flex items-center gap-2 bg-[#0f3036]/5 rounded-lg px-2.5 py-2 text-xs">
              <FaCircleDot className="text-[#c59d5f] w-2.5 h-2.5 shrink-0" />
              <span className="flex-1 line-clamp-1 font-medium text-[#0f3036]">{a.headline}</span>
              <button type="button" onClick={() => toggle(a.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                <FaXmark className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {ids.length < 3 && (
        <>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nemo labari..."
            className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#c59d5f] bg-white"
          />
          <div className="space-y-0.5 max-h-40 overflow-y-auto">
            {filtered.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(a.id)}
                className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-xs group"
              >
                <FaPlus className="text-gray-300 group-hover:text-[#c59d5f] w-2.5 h-2.5 shrink-0 transition-colors" />
                <span className="line-clamp-1 text-gray-700">{a.headline}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-[11px] text-gray-400 py-3">Ba a sami labari ba</p>
            )}
          </div>
        </>
      )}
      <p className="text-[10px] text-gray-400">{ids.length}/3 labari an zaɓa</p>
    </div>
  );
};

// ─── Main editor ──────────────────────────────────────────────────────────────

const AdminEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addArticle, updateArticle, getArticleById, articles } = useNews();
  const { user } = useAuth();

  const isEditing = !!id;
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activePanel, setActivePanel] = useState('meta'); // meta | publish | seo | media | social | related

  const [formData, setFormData] = useState({
    headline: '',
    kicker: '',
    trail: '',
    body: '',
    image: '',
    imageCaption: '',
    imageCredit: '',
    imageAlt: '',
    imageFocalX: 50,
    imageFocalY: 50,
    videoUrl: '',
    keyFigures: '',
    series: '',
    pillar: user?.category || 'news',
    section: 'headlines',
    format: 'news',
    type: 'standard',
    author: user?.name || '',
    coAuthor: '',
    isLive: false,
    isSensitive: false,
    status: 'published',
    publishAt: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    tags: '',
    relatedArticles: '',
  });

  const saveTimeoutRef = useRef(null);
  const quillRef = useRef(null);

  const headlineLen = formData.headline.length;
  const headlineTooLong = headlineLen > 80;

  // Word count
  useEffect(() => {
    const text = formData.body.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [formData.body]);

  // Pillar lock for editors
  useEffect(() => {
    if (user?.category) {
      setFormData(prev => ({ ...prev, pillar: user.category }));
    }
  }, [user]);

  // Load article for editing
  useEffect(() => {
    let ignore = false;
    if (isEditing) {
      const article = getArticleById(id);
      if (article) {
        if (user?.category && article.pillar !== user.category) {
          if (!ignore) {
            alert("Ba ka da izinin gyara wannan labari.");
            navigate('/admin/articles');
          }
          return;
        }
        if (!ignore) {
          setFormData({
            headline: article.headline || '',
            kicker: article.kicker || '',
            trail: article.trail || '',
            body: article.body || '',
            image: article.image || '',
            imageCaption: article.imageCaption || '',
            imageCredit: article.imageCredit || '',
            imageAlt: article.imageAlt || '',
            imageFocalX: article.imageFocalX ?? 50,
            imageFocalY: article.imageFocalY ?? 50,
            videoUrl: article.videoUrl || '',
            keyFigures: article.keyFigures || '',
            series: article.series || '',
            pillar: article.pillar || user?.category || 'news',
            section: article.section || 'headlines',
            format: article.format || 'news',
            type: article.type || 'standard',
            author: article.author || user?.name || '',
            coAuthor: article.coAuthor || '',
            isLive: article.isLive || false,
            isSensitive: article.isSensitive || false,
            status: article.status || 'published',
            publishAt: article.publishAt || '',
            slug: article.slug || '',
            metaTitle: article.metaTitle || '',
            metaDescription: article.metaDescription || '',
            ogTitle: article.ogTitle || '',
            ogDescription: article.ogDescription || '',
            tags: article.tags || '',
            relatedArticles: article.relatedArticles || '',
          });
        }
      } else {
        if (!ignore) navigate('/admin/articles');
      }
    }
    return () => { ignore = true; };
  }, [id, isEditing, navigate, user, getArticleById]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setIsDirty(true);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await appwriteService.uploadFile(file);
      const fileUrl = appwriteService.getFilePreview(response.$id);
      setFormData(prev => ({ ...prev, [field]: fileUrl }));
      setIsDirty(true);
    } catch (error) {
      alert('File upload failed.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = useCallback(async () => {
    try {
      // Check scheduled publishing: if publishAt is in the past, auto-set to published
      let dataToSave = { ...formData };
      if (dataToSave.status === 'scheduled' && dataToSave.publishAt) {
        const publishTime = new Date(dataToSave.publishAt).getTime();
        if (Date.now() >= publishTime) {
          dataToSave.status = 'published';
        }
      }

      if (isEditing) {
        // Save revision before updating
        try {
          const currentArticle = articles.find(a => a.$id === id || a.id === id);
          if (currentArticle) {
            const diff = computeDiff(currentArticle, dataToSave);
            if (Object.keys(diff).length > 0) {
              await appwriteService.createRevision({
                article_id: id,
                author_id: user?.id || '',
                author_name: user?.name || '',
                diff: JSON.stringify(diff),
                snapshot: JSON.stringify(currentArticle),
                change_type: 'edit',
                message: 'Auto-saved revision',
              });
            }
          }
        } catch (e) { console.warn('Failed to save revision:', e); }

        await updateArticle(id, dataToSave);
      } else {
        const newId = await addArticle(dataToSave);
        if (newId) navigate(`/admin/edit/${newId}`, { replace: true });
      }
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  }, [isEditing, id, formData, updateArticle, addArticle, navigate, user, articles]);

  // Compute diff between old and new article
  const computeDiff = (oldArticle, newArticle) => {
    const diff = { added: [], removed: [], changed: [] };
    const fields = ['headline', 'kicker', 'trail', 'body', 'status', 'tags', 'section', 'pillar'];
    for (const field of fields) {
      const oldVal = oldArticle[field];
      const newVal = newArticle[field];
      if (oldVal !== newVal) {
        if (oldVal == null || oldVal === '') diff.added.push(field);
        else if (newVal == null || newVal === '') diff.removed.push(field);
        else diff.changed.push(field);
      }
    }
    return diff;
  };

  // Auto-save
  useEffect(() => {
    if (isDirty) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(handleSave, 10000);
    }
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [formData, isDirty, handleSave]);

  const insertComponent = (type) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true);
    let placeholder = '';
    switch (type) {
      case 'map': {
        const mapUrl = prompt('Enter Google Maps Embed URL:');
        if (mapUrl) placeholder = `<div class="yanci-atom-map" data-url="${mapUrl}">[MAP COMPONENT]</div>`;
        break;
      }
      case 'quote':
        placeholder = `<blockquote><p>"Shigar da maganar da kake so a nan."</p><footer>— Sunan Marubuci</footer></blockquote>`;
        break;
      case 'highlight':
        placeholder = `<div class="yanci-atom-highlight" style="background:#fbf8f3; border-left:4px solid #c59d5f; padding:1.5rem; margin:2rem 0;"><strong>MUHIMMIN ABIN LURA:</strong><br/>Shigar da muhimman bayanai a nan...</div>`;
        break;
      case 'review': {
        const reviewTitle = prompt('Review Item Name:');
        const rating = prompt('Rating (1-5):', '5');
        if (reviewTitle) placeholder = `<div class="yanci-atom-review" data-title="${reviewTitle}" data-rating="${rating}">[REVIEW: ${reviewTitle} - ${rating}/5]</div>`;
        break;
      }
      case 'profile': {
        const name = prompt('Name:');
        const role = prompt('Role/Title:');
        const image = prompt('Image URL (optional):');
        const desc = prompt('Description:');
        if (name) {
          const safeDesc = desc ? desc.replace(/"/g, '&quot;') : '';
          placeholder = `<div class="yanci-atom-profile" data-name="${name}" data-role="${role || ''}" data-image="${image || ''}" data-desc="${safeDesc}">[PROFILE: ${name}]</div>`;
        }
        break;
      }
      case 'image': {
        const imgUrl = prompt('Image URL:');
        const caption = prompt('Caption:');
        const credit = prompt('Credit:');
        if (imgUrl) {
          const safeCaption = caption ? caption.replace(/"/g, '&quot;') : '';
          placeholder = `<div class="yanci-atom-image" data-src="${imgUrl}" data-caption="${safeCaption}" data-credit="${credit || ''}">[IMAGE: ${caption || 'Untitled'}]</div>`;
        }
        break;
      }
      default: break;
    }
    if (placeholder) {
      quill.clipboard.dangerouslyPasteHTML(range.index, placeholder);
      setIsDirty(true);
    }
    setShowComponentMenu(false);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'blockquote'],
      ['clean'],
    ],
  };

  // Sidebar panels
  const PANELS = [
    { id: 'meta',    label: 'Metadata',  icon: FaGear },
    { id: 'publish', label: 'Buga',      icon: FaCalendarCheck },
    { id: 'media',   label: 'Hoto',      icon: FaImage },
    { id: 'seo',     label: 'SEO',       icon: FaMagnifyingGlass },
    { id: 'social',  label: 'Yada',      icon: FaShareNodes },
    { id: 'related', label: 'Dangane',   icon: FaNewspaper },
    { id: 'corrections', label: 'Gyara', icon: FaTriangleExclamation },
    ...(isEditing ? [{ id: 'history', label: 'History', icon: FaClockRotateLeft }] : []),
  ];

  const currentSections = PILLAR_SECTIONS[formData.pillar] || PILLAR_SECTIONS.news;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => navigate('/admin/articles')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-gray-900 truncate max-w-[150px] md:max-w-[300px]">
                {formData.headline || 'Untitled Article'}
              </h1>
              {formData.format && formData.format !== 'news' && (
                <span className={`hidden md:inline text-[10px] font-bold px-1.5 py-0.5 rounded ${FORMAT_COLOR[formData.format] || 'bg-gray-100 text-gray-500'}`}>
                  {ARTICLE_FORMATS.find(f => f.value === formData.format)?.label}
                </span>
              )}
              {formData.isSensitive && (
                <FaTriangleExclamation className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Content warning" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] whitespace-nowrap">
              {lastSaved ? (
                <span className="text-green-600 flex items-center gap-1">
                  <FaCheck className="w-2 h-2" /> {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              ) : (
                <span className="text-gray-400">Ba a adana ba</span>
              )}
              {isDirty && <span className="text-amber-500 font-bold hidden xs:inline">• Unsaved</span>}
              <span className="text-gray-300 hidden md:inline">•</span>
              <span className="text-gray-400 hidden md:inline">{wordCount} kalmomi · {Math.max(1, Math.ceil(wordCount / 200))} min</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`xl:hidden p-2 rounded-full transition-colors ${showSidebar ? 'bg-[#0f3036] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <FaGear className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.open(`/article/${id}`, '_blank')}
            disabled={!isEditing}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full sm:rounded-md sm:px-4 sm:py-2 sm:text-xs sm:font-bold flex items-center gap-2 disabled:opacity-30"
          >
            <FaEye /> <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={handleSave}
            disabled={uploading || !isDirty}
            className={`p-2 sm:px-6 sm:py-2 rounded-full sm:rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              isDirty ? 'bg-[#0f3036] text-white hover:bg-[#1a454c] shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {uploading ? <FaSpinner className="animate-spin" /> : <FaFloppyDisk />}
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Editor Column */}
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8 lg:p-16 relative">
          <div className="max-w-[800px] mx-auto space-y-8 md:space-y-12">

            {/* Format badge picker (inline) */}
            <div className="flex flex-wrap gap-1.5">
              {ARTICLE_FORMATS.map(f => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => { setFormData(p => ({ ...p, format: f.value })); setIsDirty(true); }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                    formData.format === f.value
                      ? (FORMAT_COLOR[f.value] || 'bg-gray-100 text-gray-700') + ' border-current/20 ring-2 ring-current/20'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sensitivity flag */}
            {formData.isSensitive && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-800 font-bold">
                <FaTriangleExclamation className="w-3.5 h-3.5 shrink-0" />
                Wannan labari yana ɗauke da abun ciki mai kula — an sanya alama.
              </div>
            )}

            {/* Kicker */}
            <input
              type="text"
              name="kicker"
              value={formData.kicker}
              onChange={handleChange}
              className="w-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#c70000] border-none focus:ring-0 p-0 placeholder-gray-300"
              placeholder="ADD KICKER / CATEGORY"
            />

            {/* Headline + char counter */}
            <div className="relative">
              <textarea
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                rows="1"
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                className={`w-full text-3xl md:text-6xl font-serif font-black text-[#0f3036] border-none focus:ring-0 p-0 resize-none placeholder-gray-200 leading-tight ${headlineTooLong ? 'text-red-600' : ''}`}
                placeholder="Article headline"
              />
              <div className={`flex justify-end mt-1 text-[10px] font-bold transition-colors ${headlineTooLong ? 'text-red-500' : headlineLen > 60 ? 'text-amber-500' : 'text-gray-300'}`}>
                {headlineLen}/80
                {headlineTooLong && <span className="ml-1">— taken labari ya yi tsawo</span>}
              </div>
            </div>

            {/* Trail */}
            <textarea
              name="trail"
              value={formData.trail}
              onChange={handleChange}
              rows="2"
              onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              className="w-full text-lg md:text-xl font-serif text-gray-500 border-none focus:ring-0 p-0 resize-none border-l-4 border-gray-100 pl-4 md:pl-6 placeholder-gray-200 italic"
              placeholder="Short summary..."
            />

            {/* Author / Co-author row */}
            <div className="flex items-start gap-4 py-4 md:py-6 border-y border-gray-50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs md:text-sm shrink-0">
                  {formData.author?.[0] || 'Y'}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full text-sm font-bold text-gray-700 border-none focus:ring-0 p-0 placeholder-gray-300"
                    placeholder="Sunan marubuci"
                  />
                  <div className="flex items-center gap-1.5">
                    <FaUserGroup className="w-2.5 h-2.5 text-gray-300" />
                    <input
                      type="text"
                      name="coAuthor"
                      value={formData.coAuthor}
                      onChange={handleChange}
                      className="flex-1 text-xs text-gray-400 border-none focus:ring-0 p-0 placeholder-gray-200"
                      placeholder="da kuma... (marubuci na biyu)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="composer-editor pb-32">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.body || ''}
                onChange={(content) => { setFormData(prev => ({ ...prev, body: content })); setIsDirty(true); }}
                modules={quillModules}
                placeholder="Fara rubutu..."
                className="font-body text-base md:text-lg leading-loose"
              />
            </div>
          </div>

          {/* Floating Block Inserter */}
          <div className="fixed bottom-6 right-4 sm:bottom-10 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 md:left-auto md:translate-x-0 md:right-[360px] z-40">
            <div className="relative">
              {showComponentMenu && (
                <div className="absolute bottom-full mb-4 right-0 sm:left-1/2 sm:-translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 min-w-[200px]">
                  <p className="text-[10px] font-bold uppercase text-gray-400 px-4 py-2">Ƙara Abun Ciki</p>
                  {[
                    { type: 'map',       icon: FaMapLocationDot, label: 'Taswirar Wuri',  color: 'text-blue-500' },
                    { type: 'quote',     icon: FaQuoteLeft,       label: 'Maganar Zance', color: 'text-[#c59d5f]' },
                    { type: 'highlight', icon: FaCircleInfo,       label: 'Muhimmin Bayani', color: 'text-amber-500' },
                  ].map(item => (
                    <button
                      key={item.type}
                      onClick={() => insertComponent(item.type)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm transition-colors text-left"
                    >
                      <item.icon className={item.color} /> {item.label}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowComponentMenu(!showComponentMenu)}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
                  showComponentMenu ? 'bg-[#c70000] rotate-45 text-white' : 'bg-[#0f3036] text-white hover:scale-110'
                }`}
              >
                <FaPlus className="text-lg md:text-xl" />
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar Column */}
        <aside className={`
          fixed inset-y-0 right-0 z-40 w-[320px] md:w-[360px] border-l border-gray-200 bg-white overflow-hidden transition-transform duration-300 transform flex flex-col
          xl:relative xl:translate-x-0 xl:block
          ${showSidebar ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
        `}>
          {/* Panel nav tabs */}
          <div className="shrink-0 border-b border-gray-100 bg-gray-50 flex overflow-x-auto">
            <div className="flex items-center justify-between w-full xl:hidden px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-sm text-[#0f3036]">Saitunan Labari</h2>
              <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <FaXmark className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="shrink-0 flex border-b border-gray-100 overflow-x-auto">
            {PANELS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePanel(p.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide shrink-0 transition-all border-b-2 ${
                  activePanel === p.id
                    ? 'border-[#c59d5f] text-[#0f3036]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <p.icon className="w-3.5 h-3.5" />
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">

            {/* ── META PANEL ── */}
            {activePanel === 'meta' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pillar</label>
                  <select
                    name="pillar"
                    value={formData.pillar}
                    onChange={(e) => {
                      const newPillar = e.target.value;
                      setFormData(p => ({
                        ...p,
                        pillar: newPillar,
                        section: PILLAR_SECTIONS[newPillar]?.[0] || 'headlines',
                      }));
                      setIsDirty(true);
                    }}
                    disabled={!!user?.category}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none capitalize disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    {['news','sport','opinion','culture','lifestyle'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Section</label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                  >
                    {currentSections.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nau'in Labari (Format)</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                  >
                    {ARTICLE_FORMATS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Jerin Labarai (Series)</label>
                  <div className="relative">
                    <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                    <input
                      type="text"
                      name="series"
                      value={formData.series}
                      onChange={handleChange}
                      className="w-full text-sm pl-8 p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                      placeholder="Suna na jerin labaran..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nau'in Shafi (Type)</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                  >
                    <option value="standard">Standard</option>
                    <option value="hero">Hero (Priority)</option>
                    <option value="compact">Compact (Side)</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <FaTag className="inline w-2.5 h-2.5 mr-1" />Tags / Keywords
                  </label>
                  <TagInput
                    value={formData.tags}
                    onChange={(v) => { setFormData(p => ({ ...p, tags: v })); setIsDirty(true); }}
                  />
                </div>

                {/* Key Figures */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mahimman Mutane</label>
                  <textarea
                    name="keyFigures"
                    value={formData.keyFigures}
                    onChange={handleChange}
                    rows="3"
                    className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none resize-none"
                    placeholder="Suna - Matsayi (layi ɗaya kowannensu)"
                  />
                </div>

                {/* Flags */}
                <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isLive"
                      checked={formData.isLive}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#c70000] rounded focus:ring-[#c70000]"
                    />
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <FaTowerBroadcast className={formData.isLive ? 'text-red-600' : 'text-gray-300'} />
                      Live Blog?
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isSensitive"
                      checked={formData.isSensitive}
                      onChange={handleChange}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                    />
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <FaTriangleExclamation className={formData.isSensitive ? 'text-amber-500' : 'text-gray-300'} />
                      Abun Ciki mai Kula?
                    </span>
                  </label>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[10px] font-bold text-gray-400 flex justify-between uppercase tracking-widest">
                  <span>{wordCount} KALMOMI</span>
                  <span>{Math.max(1, Math.ceil(wordCount / 200))} MIN KARATU</span>
                </div>
              </>
            )}

            {/* ── PUBLISH PANEL ── */}
            {activePanel === 'publish' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Matsayi</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                  >
                    <option value="published">An Buga</option>
                    <option value="draft">Daftari</option>
                    <option value="scheduled">Jadawalin Buga</option>
                    <option value="review">Duba Kafin Buga</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Lokacin Buga</label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                      <input
                        type="datetime-local"
                        name="publishAt"
                        value={formData.publishAt}
                        onChange={handleChange}
                        className="w-full text-sm pl-8 p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                      />
                    </div>
                    {formData.publishAt && (
                      <p className="text-[10px] text-gray-400">
                        Za a buga: {new Date(formData.publishAt).toLocaleString('ha', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    )}
                    {!formData.publishAt && (
                      <p className="text-[10px] text-amber-600 font-bold">
                        Zaɓi lokacin buga domin ajiye jadawalin.
                      </p>
                    )}
                  </div>
                )}

                {/* Breaking News Toggle */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FaBolt className="text-red-500" /> Breaking News
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, is_breaking: !prev.is_breaking }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${formData.is_breaking ? 'bg-red-600' : 'bg-gray-300'}`}
                      role="switch"
                      aria-checked={formData.is_breaking}
                      aria-label="Toggle breaking news"
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${formData.is_breaking ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                  {formData.is_breaking && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Duration (hours)</label>
                      <select
                        value={formData.breaking_duration || 24}
                        onChange={e => {
                          const hours = parseInt(e.target.value);
                          const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
                          setFormData(prev => ({ ...prev, breaking_duration: hours, breaking_until: until }));
                        }}
                        className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        <option value={1}>1 hour</option>
                        <option value={3}>3 hours</option>
                        <option value={6}>6 hours</option>
                        <option value={12}>12 hours</option>
                        <option value={24}>24 hours</option>
                        <option value={48}>48 hours</option>
                      </select>
                      <p className="text-[10px] text-red-500 font-bold">
                        Active until: {formData.breaking_until ? new Date(formData.breaking_until).toLocaleString() : 'Not set'}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── REVISION HISTORY PANEL ── */}
            {activePanel === 'history' && isEditing && (
              <RevisionHistory
                articleId={id}
                currentData={formData}
                onRestore={(snapshot) => {
                  try {
                    const data = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;
                    setFormData(prev => ({ ...prev, ...data }));
                    setIsDirty(true);
                  } catch (e) { console.error('Failed to restore revision:', e); }
                }}
              />
            )}

            {/* ── MEDIA PANEL ── */}
            {activePanel === 'media' && (
              <>
                {/* Featured image upload */}
                {formData.image ? (
                  <div className="space-y-3">
                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <img src={formData.image} alt="Featured" className="w-full aspect-video object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="p-2 bg-white text-gray-800 rounded-full cursor-pointer hover:bg-gray-100">
                          <FaCloudArrowUp />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                        </label>
                        <button
                          onClick={() => setFormData(p => ({ ...p, image: '' }))}
                          className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    {/* Focal Point */}
                    <FocalPointPicker
                      imageUrl={formData.image}
                      focalX={formData.imageFocalX}
                      focalY={formData.imageFocalY}
                      onChange={(x, y) => { setFormData(p => ({ ...p, imageFocalX: x, imageFocalY: y })); setIsDirty(true); }}
                    />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all text-gray-400">
                    {uploading ? <FaSpinner className="animate-spin text-2xl" /> : (
                      <>
                        <FaCloudArrowUp className="text-2xl mb-2" />
                        <span className="text-[10px] font-bold uppercase">Upload Image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                  </label>
                )}

                {/* Image URL manual */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">URL Hoto</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full text-[11px] p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#c59d5f]"
                    placeholder="https://..."
                  />
                </div>

                {/* Caption */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Bayanin Hoto (Caption)
                    <span className="font-normal ml-1 text-gray-300">{formData.imageCaption.length}/255</span>
                  </label>
                  <input
                    type="text"
                    name="imageCaption"
                    value={formData.imageCaption}
                    onChange={handleChange}
                    maxLength={255}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                    placeholder="Me ke faruwa a cikin wannan hoto..."
                  />
                </div>

                {/* Credit */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Marubuci Hoto (Credit)</label>
                  <input
                    type="text"
                    name="imageCredit"
                    value={formData.imageCredit}
                    onChange={handleChange}
                    maxLength={128}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                    placeholder="Hoto: Sunan Mai Daukar Hoto / Reuters"
                  />
                </div>

                {/* Alt text */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Alt Text (Accessibility)
                    <span className="font-normal ml-1 text-gray-300">{formData.imageAlt.length}/128</span>
                  </label>
                  <input
                    type="text"
                    name="imageAlt"
                    value={formData.imageAlt}
                    onChange={handleChange}
                    maxLength={128}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                    placeholder="Taƙaitaccen bayani ga makafi..."
                  />
                </div>
              </>
            )}

            {/* ── SEO PANEL ── */}
            {activePanel === 'seo' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Slug (URL)</label>
                  <div className="relative">
                    <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full text-sm pl-8 p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                      placeholder="labari-slug-nan"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const auto = formData.headline
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .trim()
                        .replace(/\s+/g, '-')
                        .slice(0, 80);
                      setFormData(p => ({ ...p, slug: auto }));
                      setIsDirty(true);
                    }}
                    className="text-[10px] text-[#c59d5f] hover:underline"
                  >
                    ↺ Ƙirƙira daga taken labari
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Meta Title <span className="font-normal text-gray-300">({(formData.metaTitle || formData.headline).length}/60)</span>
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    maxLength={60}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                    placeholder={formData.headline || 'SEO taken labari...'}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Meta Description <span className="font-normal text-gray-300">({(formData.metaDescription || formData.trail).length}/160)</span>
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    maxLength={160}
                    rows={3}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none resize-none"
                    placeholder={formData.trail || 'Taƙaitaccen bayani ga injunan bincike...'}
                  />
                </div>

                {/* SERP Preview */}
                {(formData.metaTitle || formData.headline) && (
                  <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-0.5">
                    <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Misalin Google</p>
                    <p className="text-blue-700 text-xs font-medium line-clamp-1">
                      {formData.metaTitle || formData.headline} | Yanci
                    </p>
                    <p className="text-green-700 text-[10px]">
                      yanci.ng/article/{formData.slug || id || '...'}
                    </p>
                    <p className="text-gray-600 text-[10px] line-clamp-2">
                      {formData.metaDescription || formData.trail || 'Bayani ba a rubuta ba tukuna.'}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ── SOCIAL PANEL ── */}
            {activePanel === 'social' && (
              <>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700 mb-2">
                  Waɗannan filayen suna sarrafa yadda labarin zai bayyana a Facebook, Twitter, da sauran kafofin yada labarai.
                  Idan ba a cika su ba, za a yi amfani da Meta Title da Description.
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    OG / Social Title <span className="font-normal text-gray-300">({(formData.ogTitle).length}/200)</span>
                  </label>
                  <input
                    type="text"
                    name="ogTitle"
                    value={formData.ogTitle}
                    onChange={handleChange}
                    maxLength={200}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none"
                    placeholder={formData.metaTitle || formData.headline || 'Taken labari akan kafofin yada labarai...'}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    OG / Social Description <span className="font-normal text-gray-300">({(formData.ogDescription).length}/300)</span>
                  </label>
                  <textarea
                    name="ogDescription"
                    value={formData.ogDescription}
                    onChange={handleChange}
                    maxLength={300}
                    rows={3}
                    className="w-full text-sm p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c59d5f] outline-none resize-none"
                    placeholder={formData.metaDescription || formData.trail || 'Bayani akan kafofin yada labarai...'}
                  />
                </div>

                {/* Social preview card */}
                {(formData.ogTitle || formData.metaTitle || formData.headline) && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <p className="text-[10px] font-bold uppercase text-gray-400 px-3 pt-3 pb-1">Misalin Social Card</p>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt=""
                        className="w-full aspect-video object-cover"
                        style={{ objectPosition: `${formData.imageFocalX ?? 50}% ${formData.imageFocalY ?? 50}%` }}
                      />
                    )}
                    <div className="p-3 bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase">yanci.ng</p>
                      <p className="text-xs font-bold text-gray-900 line-clamp-2 mt-0.5">
                        {formData.ogTitle || formData.metaTitle || formData.headline}
                      </p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                        {formData.ogDescription || formData.metaDescription || formData.trail}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── RELATED PANEL ── */}
            {activePanel === 'related' && (
              <>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-700 mb-2">
                  Zaɓi har zuwa labaran 3 da za su bayyana a ƙarshen wannan labarin a matsayin "Dubi kuma".
                </div>
                <RelatedPicker
                  articles={articles.filter(a => String(a.id) !== String(id))}
                  value={formData.relatedArticles}
                  onChange={(v) => { setFormData(p => ({ ...p, relatedArticles: v })); setIsDirty(true); }}
                />
              </>
            )}

            {/* ── CORRECTIONS PANEL ── */}
            {activePanel === 'corrections' && (
              <CorrectionsEditor
                value={formData.corrections || []}
                onChange={(v) => { setFormData(p => ({ ...p, corrections: v })); setIsDirty(true); }}
              />
            )}

          </div>
        </aside>
      </div>

      {/* CSS Overrides */}
      <style>{`
        .composer-editor .ql-container.ql-snow { border: none !important; font-family: 'Source Serif 4', Georgia, serif; }
        .composer-editor .ql-editor { padding: 0 !important; font-size: 1rem; line-height: 1.8; color: #171717; min-height: 500px; }
        @media (min-width: 768px) { .composer-editor .ql-editor { font-size: 1.125rem; } }
        .composer-editor .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f0f0f0 !important;
          position: sticky; top: 0; z-index: 40;
          background: white; margin-bottom: 2rem;
          padding: 8px 0 !important;
          overflow-x: auto; white-space: nowrap; display: flex; flex-wrap: wrap;
        }
        .composer-editor .ql-editor.ql-blank::before { left: 0 !important; font-style: italic; color: #d1d5db; }
        .composer-editor .ql-editor h1 { font-family: 'Playfair Display', serif; font-weight: 900; }
        .composer-editor .ql-editor h2 { font-family: 'Playfair Display', serif; font-weight: 800; }
        .composer-editor .ql-editor h3 { font-family: 'Playfair Display', serif; font-weight: 700; }
        .yanci-atom-map { background: #f0f9ff; border: 2px dashed #0ea5e9; color: #0369a1; padding: 1.5rem; text-align: center; font-weight: bold; margin: 1.5rem 0; border-radius: 0.5rem; font-size: 0.875rem; }
      `}</style>
    </div>
  );
};

export default AdminEditor;
