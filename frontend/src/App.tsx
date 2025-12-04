import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
        <footer className="py-8 text-center">
          <p className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            Stay tuned for more!
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
