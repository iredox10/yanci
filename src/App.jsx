import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuardianHome from './pages/GuardianHome';
import ArticlePage from './pages/ArticlePage';
import LiveArticlePage from './pages/LiveArticlePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuardianHome />} />
        <Route path="/article/3" element={<LiveArticlePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="*" element={<GuardianHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
