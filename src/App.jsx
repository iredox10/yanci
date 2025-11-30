import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import GuardianHome from './pages/GuardianHome';
import ArticlePage from './pages/ArticlePage';
import LiveArticlePage from './pages/LiveArticlePage';

import SiyasaPage from './pages/SiyasaPage';
import LabaraiPage from './pages/LabaraiPage';
import KasuwanciPage from './pages/KasuwanciPage';
import WasanniPage from './pages/WasanniPage';
import FasahaPage from './pages/FasahaPage';
import RaayiPage from './pages/RaayiPage';
import AladuPage from './pages/AladuPage';
import BidiyoPage from './pages/BidiyoPage';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminArticles from './pages/admin/AdminArticles';
import AdminEditor from './pages/admin/AdminEditor';
import AdminSettings from './pages/admin/AdminSettings';
import AdminStaff from './pages/admin/AdminStaff';
import AdminLiveManager from './pages/admin/AdminLiveManager';
import AdminLiveConsole from './pages/admin/AdminLiveConsole';

import { AudioProvider } from './context/AudioContext';
import AudioPlayer from './components/guardian/AudioPlayer';

function App() {
  return (
    <NewsProvider>
      <AudioProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<GuardianHome />} />
            <Route path="/siyasa" element={<SiyasaPage />} />
            <Route path="/labarai" element={<LabaraiPage />} />
            <Route path="/kasuwanci" element={<KasuwanciPage />} />
            <Route path="/wasanni" element={<WasanniPage />} />
            <Route path="/fasaha" element={<FasahaPage />} />
            <Route path="/raayi" element={<RaayiPage />} />
            <Route path="/aladu" element={<AladuPage />} />
            <Route path="/bidiyo" element={<BidiyoPage />} />
            <Route path="/article/3" element={<LiveArticlePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="create" element={<AdminEditor />} />
              <Route path="edit/:id" element={<AdminEditor />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="live" element={<AdminLiveManager />} />
              <Route path="live/:id" element={<AdminLiveConsole />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<GuardianHome />} />
          </Routes>
          <AudioPlayer />
        </BrowserRouter>
      </AudioProvider>
    </NewsProvider>
  );
}

export default App;
