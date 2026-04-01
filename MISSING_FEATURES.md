# Yanci — Missing Features for News Website Standard

## Status Update (Apr 2026)

---

### 1. SEARCH ✅ IMPLEMENTED
Full-text search page at `/search` with article/topic/author filtering.

---

### 2. USER ACCOUNTS & PERSONALIZATION — PARTIAL
- ✅ Newsletter subscription with email capture (localStorage)
- ❌ No reader registration/login
- ❌ No saved reading history
- ❌ No personalized feed

---

### 3. NOTIFICATIONS & ALERTS ✅ IMPLEMENTED
- ✅ PWA push notification support (`usePushNotifications` hook)
- ✅ Notification permission prompt on homepage
- ✅ Admin notification sender UI (not yet routed)
- ⚠️ Requires VAPID keys + Appwrite Cloud Function for production delivery

---

### 4. COMMENTS & COMMUNITY ✅ IMPLEMENTED
- ✅ Comments section on article pages (`CommentsSection` component)
- ✅ Like/upvote comments
- ✅ Delete own comments
- ✅ Sort by newest or most liked
- ⚠️ Currently localStorage-only; needs Appwrite collection for persistence

---

### 5. SOCIAL SHARING ✅ FIXED
- ✅ SEO component with full Open Graph & Twitter Card meta tags
- ✅ Per-article OG title, description, image, URL
- ✅ WhatsApp link previews now work correctly

---

### 6. SEO & STRUCTURED DATA ✅ IMPLEMENTED
- ✅ Per-page `<title>` and `<meta description>` via react-helmet-async
- ✅ Canonical URLs on every page
- ✅ Open Graph & Twitter Card meta tags
- ✅ JSON-LD structured data (NewsArticle, WebSite schema)
- ✅ Dynamic sitemap.xml generation at build time (all articles, tags, authors)
- ✅ Google News sitemap (`sitemap-news.xml`)
- ✅ robots.txt with sitemap references
- ❌ No SSR/SSG — still a pure SPA (Google indexing limited)

---

### 7. TAGS & TOPIC PAGES ✅ IMPLEMENTED
- ✅ Tag pages at `/tag/:tag` with co-occurring tags sidebar
- ✅ Author pages at `/author/:name` with bio, stats, article list
- ✅ Article tagging system

---

### 8. MULTIMEDIA — VIDEO & PODCAST ✅ IMPLEMENTED
- ✅ YouTube embed player on BidiyoPage
- ✅ Video playlist sidebar
- ✅ Audio player component
- ❌ No photo galleries / slideshow component

---

### 9. MONETIZATION ✅ IMPLEMENTED
- ✅ AdSlot component (banner, sidebar, inline, sponsored variants)
- ✅ Sponsored content labels
- ⚠️ Needs actual ad network integration (Google AdSense, etc.)

---

### 10. CONTENT DISCOVERY — PARTIAL
- ✅ Most Read tracking via `useViewTracker` hook
- ✅ Related articles by pillar/section
- ❌ No content recommendation engine
- ❌ No "You might also like" widget

---

### 11. DATA & ANALYTICS ✅ IMPLEMENTED
- ✅ Analytics hook with Plausible/GA4 support
- ✅ View tracking for article engagement
- ❌ Admin dashboard doesn't show real traffic metrics yet

---

### 12. ACCESSIBILITY ✅ IMPLEMENTED
- ✅ Skip-navigation link
- ✅ ARIA landmarks (`role="main"`, `aria-label`)
- ✅ `prefers-reduced-motion` support
- ❌ No dark mode toggle
- ❌ No font size controls

---

### 13. FACT-CHECKING & TRUST SIGNALS ✅ IMPLEMENTED
- ✅ Last-updated timestamps on articles
- ✅ Author bylines with links to author pages
- ✅ Full fact-checking system (`/zabe/gaskiya` public + admin CRUD)
- ❌ No corrections policy page

---

### 14. SYNDICATION & RSS ✅ IMPLEMENTED
- ✅ RSS feeds per section (auto-generated at build time)
- ✅ RSS autodiscovery links in HTML head
- ✅ Google News sitemap
- ❌ No AMP support

---

### 15. ELECTION COVERAGE ✅ IMPLEMENTED
- ✅ Election Hub (`/zabe`) with countdown, results, candidates, fact-checks
- ✅ Live Results Dashboard (`/zabe/sakamako`) with state-by-state breakdown
- ✅ Candidate Profiles (`/zabe/yan-takara`) with comparison table
- ✅ Fact-Check Section (`/zabe/gaskiya`) with verdict system
- ✅ Voter Education (`/zabe/ilimi`) with registration & voting guide
- ✅ Admin: Election management (`/admin/elections`)
- ✅ Admin: Results entry spreadsheet (`/admin/elections/:id/results`)
- ✅ Admin: Candidate CRUD (`/admin/elections/:id/candidates`)
- ✅ Admin: Fact-check CRUD (`/admin/elections/:id/factchecks`)

---

### 16. MISSING ADMIN CAPABILITIES — PARTIAL
- ✅ Media library / media manager
- ✅ SEO fields in editor (meta title, meta description, slug)
- ✅ Election management system
- ❌ No scheduled publishing
- ❌ No draft/review workflow
- ❌ No bulk actions on article list

---

## Remaining Priority Summary

| Priority | Feature |
|---|---|
| **P0 — Blocking** | SSR/SSG for Google crawlability |
| **P1 — Critical** | Reader accounts, Analytics dashboard in admin |
| **P2 — Standard** | Photo galleries, Content recommendations |
| **P3 — Growth** | Scheduled publishing, Draft/review workflow |
| **P4 — Polish** | Dark mode, Font size controls, Corrections policy |
