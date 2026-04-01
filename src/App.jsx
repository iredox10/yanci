import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { NewsProvider } from './context/NewsContext';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
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

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <NewsProvider>
          <AudioProvider>
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

                {/* Admin Routes — lazy loaded, wrapped in Suspense */}
                <Route path="/admin/login" element={<Suspense fallback={<div className="min-h-screen bg-[#0f3036]" />}><AdminLogin /></Suspense>} />
                <Route path="/admin" element={<Suspense fallback={<div className="min-h-screen bg-[#fafaf9] animate-pulse" />}><AdminLayout /></Suspense>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="articles" element={<AdminArticles />} />
                  <Route path="create" element={<AdminEditor />} />
                  <Route path="edit/:id" element={<AdminEditor />} />
                  <Route path="media" element={<AdminMedia />} />
                  <Route path="multimedia" element={<AdminMultimedia />} />
                  <Route path="staff" element={<AdminStaff />} />
                  <Route path="live" element={<AdminLiveManager />} />
                  <Route path="live/:id" element={<AdminLiveConsole />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <AudioPlayer />
            </BrowserRouter>
          </AudioProvider>
        </NewsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
