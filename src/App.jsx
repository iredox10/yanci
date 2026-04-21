import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { NewsProvider } from './context/NewsContext';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
import { ElectionProvider } from './context/ElectionContext';
import AudioPlayer from './components/guardian/AudioPlayer';
import GuardianHome from './pages/GuardianHome';
import ArticlePage from './pages/ArticlePage';
import LiveArticlePage from './pages/LiveArticlePage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import SectionPage from './pages/SectionPage';
import TagPage from './pages/TagPage';
import AuthorPage from './pages/AuthorPage';

import SiyasaPage from './pages/SiyasaPage';
import LabaraiPage from './pages/LabaraiPage';
import KasuwanciPage from './pages/KasuwanciPage';
import WasanniPage from './pages/WasanniPage';
import FasahaPage from './pages/FasahaPage';
import RaayiPage from './pages/RaayiPage';
import AladuPage from './pages/AladuPage';
import BidiyoPage from './pages/BidiyoPage';
import ElectionHub from './pages/ElectionHub';
import ElectionResults from './pages/ElectionResults';
import CandidateProfiles from './pages/CandidateProfiles';
import FactCheckPage from './pages/FactCheckPage';
import VoterEducation from './pages/VoterEducation';
import ProtectedRoute from './components/ProtectedRoute';
import PermissionRoute from './components/PermissionRoute';
import RegisterPage from './pages/RegisterPage';

// Admin — lazy loaded so they don't inflate the public bundle
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
const AdminEditor = lazy(() => import('./pages/admin/AdminEditor'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'));
const AdminLiveManager = lazy(() => import('./pages/admin/AdminLiveManager'));
const AdminLiveConsole = lazy(() => import('./pages/admin/AdminLiveConsole'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminMultimedia = lazy(() => import('./pages/admin/AdminMultimedia'));
const AdminElections = lazy(() => import('./pages/admin/AdminElections'));
const AdminElectionResults = lazy(() => import('./pages/admin/AdminElectionResults'));
const AdminCandidates = lazy(() => import('./pages/admin/AdminCandidates'));
const AdminFactChecks = lazy(() => import('./pages/admin/AdminFactChecks'));

// New Admin Pages
const AdminSports = lazy(() => import('./pages/admin/AdminSports'));
const AdminHighlights = lazy(() => import('./pages/admin/AdminHighlights'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'));
const AdminHomepageStats = lazy(() => import('./pages/admin/AdminHomepageStats'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSeo = lazy(() => import('./pages/admin/AdminSeo'));
const AdminHomepageBuilder = lazy(() => import('./pages/admin/AdminHomepageBuilder'));
const NotificationSettings = lazy(() => import('./pages/admin/NotificationSettings'));
const AdminRoles = lazy(() => import('./pages/admin/AdminRoles'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminCalendar = lazy(() => import('./pages/admin/AdminCalendar'));

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <NewsProvider>
          <AudioProvider>
            <ElectionProvider>
              <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<GuardianHome />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/siyasa" element={<SiyasaPage />} />
                <Route path="/labarai" element={<LabaraiPage />} />
                <Route path="/kasuwanci" element={<KasuwanciPage />} />
                <Route path="/wasanni" element={<WasanniPage />} />
                <Route path="/fasaha" element={<FasahaPage />} />
                <Route path="/raayi" element={<RaayiPage />} />
                <Route path="/aladu" element={<AladuPage />} />
                <Route path="/bidiyo" element={<BidiyoPage />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                <Route path="/section/:id" element={<SectionPage />} />
                <Route path="/tag/:tag" element={<TagPage />} />
                <Route path="/author/:name" element={<AuthorPage />} />

                {/* Election Routes */}
                <Route path="/zabe" element={<ElectionHub />} />
                <Route path="/zabe/sakamako" element={<ElectionResults />} />
                <Route path="/zabe/yan-takara" element={<CandidateProfiles />} />
                <Route path="/zabe/gaskiya" element={<FactCheckPage />} />
                <Route path="/zabe/ilimi" element={<VoterEducation />} />

                {/* Admin Routes — lazy loaded, wrapped in Suspense + ProtectedRoute */}
                <Route path="/admin/login" element={<Suspense fallback={<div className="min-h-screen bg-[#0f3036]" />}><AdminLogin /></Suspense>} />
                <Route path="/register" element={<Suspense fallback={<div className="min-h-screen bg-[#0f3036]" />}><RegisterPage /></Suspense>} />
                <Route path="/admin" element={<ProtectedRoute><Suspense fallback={<div className="min-h-screen bg-[#fafaf9] animate-pulse" />}><AdminLayout /></Suspense></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="articles" element={<PermissionRoute permission="read_articles"><AdminArticles /></PermissionRoute>} />
                  <Route path="create" element={<PermissionRoute permission="create_articles"><AdminEditor /></PermissionRoute>} />
                  <Route path="edit/:id" element={<PermissionRoute permission="edit_own_articles"><AdminEditor /></PermissionRoute>} />
                  <Route path="media" element={<PermissionRoute permission="manage_media"><AdminMedia /></PermissionRoute>} />
                  <Route path="multimedia" element={<PermissionRoute permission="manage_media"><AdminMultimedia /></PermissionRoute>} />
                  <Route path="staff" element={<PermissionRoute permission="manage_users"><AdminStaff /></PermissionRoute>} />
                  <Route path="live" element={<PermissionRoute permission="manage_live_blog"><AdminLiveManager /></PermissionRoute>} />
                  <Route path="live/:id" element={<PermissionRoute permission="manage_live_blog"><AdminLiveConsole /></PermissionRoute>} />
                  <Route path="settings" element={<PermissionRoute permission="manage_settings"><AdminSettings /></PermissionRoute>} />
                  <Route path="elections" element={<PermissionRoute permission="manage_elections"><AdminElections /></PermissionRoute>} />
                  <Route path="elections/:id/results" element={<PermissionRoute permission="manage_elections"><AdminElectionResults /></PermissionRoute>} />
                  <Route path="elections/:id/candidates" element={<PermissionRoute permission="manage_elections"><AdminCandidates /></PermissionRoute>} />
                  <Route path="elections/:id/factchecks" element={<PermissionRoute permission="manage_elections"><AdminFactChecks /></PermissionRoute>} />

                  <Route path="sports" element={<PermissionRoute permission="manage_sports"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminSports /></Suspense></PermissionRoute>} />
                  <Route path="highlights" element={<PermissionRoute permission="manage_highlights"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminHighlights /></Suspense></PermissionRoute>} />
                  <Route path="newsletter" element={<PermissionRoute permission="manage_newsletter"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminNewsletter /></Suspense></PermissionRoute>} />
                  <Route path="homepage-stats" element={<PermissionRoute permission="manage_layout"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminHomepageStats /></Suspense></PermissionRoute>} />
                  <Route path="comments" element={<PermissionRoute permission="manage_comments"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminComments /></Suspense></PermissionRoute>} />
                  <Route path="analytics" element={<PermissionRoute permission="view_analytics"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminAnalytics /></Suspense></PermissionRoute>} />
                  <Route path="seo" element={<PermissionRoute permission="manage_seo"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminSeo /></Suspense></PermissionRoute>} />
                  <Route path="homepage" element={<PermissionRoute permission="manage_layout"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminHomepageBuilder /></Suspense></PermissionRoute>} />
                  <Route path="notifications" element={<PermissionRoute permission="manage_notifications"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><NotificationSettings /></Suspense></PermissionRoute>} />
                  <Route path="roles" element={<PermissionRoute permission="manage_roles"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminRoles /></Suspense></PermissionRoute>} />
                  <Route path="users" element={<PermissionRoute permission="manage_users"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminUsers /></Suspense></PermissionRoute>} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="calendar" element={<PermissionRoute permission="read_articles"><Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}><AdminCalendar /></Suspense></PermissionRoute>} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <AudioPlayer />
              </BrowserRouter>
            </ElectionProvider>
          </AudioProvider>
        </NewsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
