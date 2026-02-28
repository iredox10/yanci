# Yanci — Missing Features for News Website Standard

## Gap Analysis (Feb 2026)

---

### 1. SEARCH (Critical Gap)
**No search functionality exists anywhere in the app.** This is arguably the single most important missing feature on any news site. Users cannot search for articles, topics, authors, or keywords. Every major news site — The Guardian, BBC, Punch, Vanguard — has full-text search as a core navigation element.

---

### 2. USER ACCOUNTS & PERSONALIZATION
- No reader registration/login (only staff login exists)
- No saved reading history
- No "My Topics" or personalized feed based on interests
- No newsletter subscription / email capture
- No reading list sync across devices
- Reuters 2024 report shows **personalization is now a top driver of return visits**

---

### 3. NOTIFICATIONS & ALERTS
- No push notifications (despite being a PWA — the capability is there but unused)
- No breaking news alerts
- No email newsletters
- No "notify me when there's news about X topic" feature
- Nigerian news consumers are **heavily mobile-first**; push is critical

---

### 4. COMMENTS & COMMUNITY
- Zero comment/discussion system on articles
- No reader reactions (likes/upvotes)
- No letters to the editor / reader contributions
- This is a standard feature on Punch, Vanguard, The Cable, HausaMedia

---

### 5. SOCIAL SHARING — INCOMPLETE
- Sharing exists but **WhatsApp sharing is present yet not optimized** with Open Graph meta tags (`og:title`, `og:image`, `og:description`)
- No proper `<meta>` SEO/OG tags generated per article
- Sharing on WhatsApp will show a blank link preview — devastating for a Nigerian audience where WhatsApp is the **#1 news distribution channel** (Reuters 2024: 21% globally, higher in Nigeria)

---

### 6. SEO & STRUCTURED DATA
- No server-side rendering or static generation — it's a pure SPA (Vite + React), meaning **Google cannot crawl article content**
- No `sitemap.xml` generation
- No `robots.txt`
- No JSON-LD structured data (Article, NewsArticle, BreadcrumbList schema)
- No canonical URLs
- No per-page `<title>` and `<meta description>` tags
- A news site that Google can't index is invisible

---

### 7. TAGS & TOPIC PAGES
- Articles have `pillar` and `section` but **no tagging system**
- No topic/tag pages (e.g., "All stories about Tinubu", "All stories about NNPC")
- No author profile pages (articles have author names but no dedicated author pages)
- No "More from this author" feature

---

### 8. MULTIMEDIA — VIDEO & PODCAST
- Video section page exists (`BidiyoPage`) but has **no actual video player** — it's just a placeholder layout
- No embedded YouTube/native video player
- Audio player exists but there's **no podcast section or episode management** in the admin
- No photo galleries / slideshow component

---

### 9. MONETIZATION
- No advertising slots (banner ads, native ads, sponsored content markers)
- No subscription/paywall model
- No membership/donation system
- No sponsored content labeling
- Nigerian digital news relies heavily on display advertising; without ad slots there's zero revenue path

---

### 10. CONTENT DISCOVERY
- No "Most Read" / "Trending" articles (homepage has a popular tab but it's not sorted by real engagement data)
- No "Related Stories" beyond basic same-pillar matching
- No content recommendation engine
- No article tagging for automated related content
- No "You might also like" widget

---

### 11. DATA & ANALYTICS
- No analytics integration (Google Analytics, Mixpanel, or Plausible)
- Admin dashboard shows no real traffic metrics (page views, unique visitors, time on page)
- No article performance tracking (which stories are getting read, shared, completed)
- Without analytics, editorial decisions are blind

---

### 12. ACCESSIBILITY
- No visible skip-navigation links
- No dark mode / reading mode toggle for readers (only a global design)
- No font size controls for readers
- No ARIA landmark labeling audit
- No keyboard navigation testing

---

### 13. FACT-CHECKING & TRUST SIGNALS
- No corrections/updates policy visible on articles
- No "About this article" transparency box
- No author bylines with bio/credentials on articles
- No "Last updated" timestamp display
- No misinformation labels/flags
- Trust is the **#1 challenge** in Nigerian media (Reuters 2024)

---

### 14. SYNDICATION & RSS
- No RSS feeds per section or overall
- No AMP (Accelerated Mobile Pages) support
- No news sitemap (Google News requires `<news:news>` sitemap format for inclusion)

---

### 15. MISSING ADMIN CAPABILITIES
- No scheduled publishing (publish at a future date/time)
- No draft/review workflow (no "pending review" or "editor approval" state)
- No article duplication / templates
- No bulk actions on article list
- No image library / media manager (images are uploaded per-article, no reuse)
- No SEO fields in the editor (meta title, meta description, slug)

---

## Priority Summary

| Priority | Feature |
|---|---|
| **P0 — Blocking** | SEO/SSR, Open Graph tags, Search |
| **P1 — Critical** | Push notifications, User accounts, Analytics |
| **P2 — Standard** | Comments, Author pages, Tags/Topics, Video player |
| **P3 — Growth** | Monetization/ads, Newsletters, RSS, Podcast management |
| **P4 — Polish** | Dark mode, Font size controls, Fact-check signals, Corrections |

> The most **commercially damaging** gap is the SEO/crawlability problem — a pure React SPA means no Google indexing, which means no organic traffic. For a Hausa-language news site targeting Northern Nigeria, WhatsApp sharing without Open Graph previews is the second most critical issue since most traffic will arrive via WhatsApp links that will render blank.
