import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import GuardianHome from './pages/GuardianHome';
import ArticlePage from './pages/ArticlePage';
import LiveArticlePage from './pages/LiveArticlePage';

import SiyasaPage from './pages/SiyasaPage';

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
