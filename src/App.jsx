import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuardianHome from './pages/GuardianHome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuardianHome />} />
        <Route path="*" element={<GuardianHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
