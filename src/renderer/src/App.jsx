import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/themeContext';
import Navbar from './components/Navbar';
import Crypto from './pages/Crypto';
import Mind from './pages/Mind';
import News from './pages/News';
import Budget from './pages/Budget';
import Time from './pages/Time';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/crypto" replace />} />
            <Route path="/crypto" element={<Crypto />} />
            <Route path="/time" element={<Time />} />
            <Route path="/mind" element={<Mind />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;