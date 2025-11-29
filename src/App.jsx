import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuardianHome from './pages/GuardianHome';
import ArticlePage from './pages/ArticlePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuardianHome />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="*" element={<GuardianHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
