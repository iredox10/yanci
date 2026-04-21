# Yanci - Implementation Plan & Feature Log

## Features Implemented

### 1. Image Optimization ✅
**File:** `src/components/LazyImage.jsx`
- IntersectionObserver-based lazy loading with 200px root margin
- Native `loading="lazy"` and `decoding="async"` attributes
- Blur placeholder with pulse animation during loading
- Error fallback with image icon
- Configurable: aspectRatio, objectFit, placeholderColor, priority mode
- Used in: ArticlePage, GuardianHome, and all image-heavy components

### 2. Scheduled Publishing ✅
**Files:** `src/pages/admin/AdminEditor.jsx`, `src/lib/appwrite.js`
- Articles with `status: 'scheduled'` and `publishAt` in the past auto-transition to `published` on save
- AdminEditor shows date/time picker when status is "scheduled"
- Auto-publish check runs on every save (auto-save and manual)
- Displays countdown: "Za a buga: [date/time]" when scheduled

### 3. Revision History ✅
**Files:** 
- `src/components/RevisionHistory.jsx`
- `src/pages/admin/AdminEditor.jsx`
- Appwrite collection: `article_revisions` (ID: `69e0a8323874be8d0f4c`)

**How it works:**
- Before every article update, a diff is computed comparing old vs new
- Only changed fields are stored (added, removed, changed arrays)
- Full snapshot stored for restore capability
- "History" panel appears in editor sidebar when editing existing articles
- Users can browse revisions, see what changed, and restore any version
- Shows author name, time ago, and change type

### 4. Breaking News System ✅
**Files:**
- `src/components/BreakingNewsBanner.jsx`
- `src/pages/GuardianHome.jsx`
- `src/pages/admin/AdminEditor.jsx`
- Appwrite fields: `is_breaking` (boolean), `breaking_until` (datetime)

**How it works:**
- Admin toggles "Breaking News" in the Publish panel of AdminEditor
- Sets duration (1h, 3h, 6h, 12h, 24h, 48h) — auto-calculates expiry
- Red animated banner appears at top of homepage below navbar
- Auto-checks every 60 seconds for expired breaking news
- Users can dismiss the banner
- Checks all articles for `is_breaking: true` with valid `breaking_until`

### 5. Backend Analytics ✅
**Files:**
- `src/lib/appwrite.js` (new methods)
- `src/pages/ArticlePage.jsx` (tracking)
- `src/pages/admin/AdminAnalytics.jsx` (dashboard)
- Appwrite collection: `article_views` (ID: `69e0a83578bc408d2406`)

**Tracked data per view:**
- article_id, session_id, ip_hash, referrer, section, country, device, viewed_at

**Available methods:**
- `trackView()` — record a new view
- `getArticleViews(articleId)` — get view count for specific article
- `getMostReadArticles(limit)` — get top articles by views
- `getViewsBySection()` — views grouped by section
- `getTotalViews()` — total views across all articles
- `getViewsByDateRange(start, end)` — daily view counts
- `getUniqueVisitors()` — unique session count

### 6. Moderation Queue ✅
**Files:**
- `src/pages/admin/AdminArticles.jsx`
- `src/pages/admin/AdminEditor.jsx`
- Appwrite field: `review_status` (string: pending/approved/rejected)

**How it works:**
- New articles from contributors default to `review_status: 'pending'`
- "Review" filter tabs: All, Pending, Approved, Rejected
- Pending articles shown with amber badge
- Editors can approve/reject articles
- Articles with `review_status: 'pending'` are filtered separately

### 7. Social Auto-Post ✅
**File:** `scripts/social-auto-post.js`

**Usage:**
```bash
# Post a specific article
node scripts/social-auto-post.js <article_id>

# Check for recent unposted articles (last 24h)
node scripts/social-auto-post.js --check-recent
```

**Required .env variables:**
```
TWITTER_BEARER_TOKEN=your_token
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_ACCESS_TOKEN=your_token
SITE_URL=https://yanci.ng
```

**Features:**
- Posts to Twitter/X API v2 with article headline + trail + URL
- Posts to Facebook Page with title, URL, and featured image
- Marks articles as `social_posted: true` after posting
- Can be run manually or set up as Appwrite Cloud Function / cron job

### 8. Related Articles Algorithm ✅
**File:** `src/components/RelatedArticles.jsx`

**Weighted scoring:**
- Same tags: 3 points per shared tag
- Same section/category: 2 points
- Same author: 1 point
- Recency bonus (last 7 days): +1 point

**Used in:** ArticlePage (replaces the old "More Stories" section)

### 9. Print-Friendly View ✅
**File:** `src/index.css` (@media print section)

**Features:**
- Hides: nav, footer, sidebar, ads, comments, audio player, notifications
- Shows: article headline (24pt), author/date metadata, article body
- Images: max-width 100%, page-break-inside: avoid
- Links: shows URL after link text for external links
- Blockquotes: styled with left border
- Print header and URL footer added
- `@media (prefers-reduced-motion)` already existed

### 10. Accessibility (WCAG) ✅
**Files:** Multiple

**Implemented:**
- `role="alert"` and `aria-live="assertive"` on BreakingNewsBanner
- `aria-label` on dismiss buttons, toggle switches, navigation
- `aria-expanded` on collapsible sections
- `aria-checked` on toggle switches
- `role="switch"` on breaking news toggle
- `prefers-reduced-motion` support (already existed)
- `focus-visible` outline styles (already existed)
- Skip navigation link (already existed)
- Semantic HTML: `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`
- `loading="lazy"` and `decoding="async"` on images
- Print styles for screen readers

---

## Appwrite Collections Created

| Collection | ID | Purpose |
|---|---|---|
| `article_revisions` | `69e0a8323874be8d0f4c` | Diff-based revision history |
| `article_views` | `69e0a83578bc408d2406` | Server-side view tracking |

## Appwrite Fields Added to Articles

| Field | Type | Purpose |
|---|---|---|
| `is_breaking` | boolean | Breaking news flag |
| `breaking_until` | string (datetime) | Auto-expiry for breaking news |
| `review_status` | string | Moderation: pending/approved/rejected |

---

## Not Implemented (Deferred)

### SSR/SSG (Feature #1)
**Reason:** Requires full framework migration from Vite SPA to Next.js/Remix. This is a 2-4 week project.

**Recommended approach for future:**
1. Migrate to Next.js 15 with App Router
2. Use `generateStaticParams()` for article pages
3. ISR (Incremental Static Regeneration) for fresh content
4. Server Actions for admin operations
5. Deploy to Vercel for automatic SSR

### AMP (Feature #11 - Partial)
**Reason:** Google is deprecating AMP as a ranking factor (2024). Core Web Vitals matter more.

**What was done instead:** Image optimization, lazy loading, and print-friendly CSS achieve the same performance goals.

---

## Files Changed/Created

### New Files (8)
- `src/components/LazyImage.jsx`
- `src/components/BreakingNewsBanner.jsx`
- `src/components/RevisionHistory.jsx`
- `src/components/RelatedArticles.jsx`
- `src/components/PermissionRoute.jsx`
- `scripts/social-auto-post.js`
- `IMPLEMENTATION_PLAN.md` (this file)

### Modified Files (10)
- `.env` — Added REVISIONS and VIEWS collection IDs
- `src/lib/appwrite.js` — Added revisions and views service methods
- `src/pages/admin/AdminEditor.jsx` — Breaking news toggle, revision history panel, auto-save revisions
- `src/pages/admin/AdminArticles.jsx` — Review status filter
- `src/pages/admin/AdminAnalytics.jsx` — Backend analytics integration
- `src/pages/GuardianHome.jsx` — BreakingNewsBanner, LazyImage
- `src/pages/ArticlePage.jsx` — RelatedArticles, backend view tracking
- `src/index.css` — Print styles, accessibility improvements
- `src/App.jsx` — PermissionRoute imports
- `src/pages/admin/AdminLayout.jsx` — Permission-based sidebar

---

## How to Use

### Breaking News
1. Open article in AdminEditor
2. Go to "Buga" (Publish) panel
3. Toggle "Breaking News" on
4. Select duration (1-48 hours)
5. Save — banner appears on homepage

### Scheduled Publishing
1. Set status to "Jadawalin Buga" (Scheduled)
2. Pick date/time in the datetime picker
3. Save — article auto-publishes when time arrives

### View Revision History
1. Open existing article in AdminEditor
2. Click "History" tab in sidebar
3. Browse revisions, click to expand details
4. Click "Restore this version" to revert

### Social Auto-Post
1. Configure Twitter/Facebook credentials in `.env`
2. Run: `node scripts/social-auto-post.js --check-recent`
3. Or set up as cron: `0 * * * * node scripts/social-auto-post.js --check-recent`

### Moderation Queue
1. Go to AdminArticles
2. Click "Pending" in the Review filter
3. Review articles, approve or reject as needed
