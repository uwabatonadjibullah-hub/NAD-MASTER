/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Home from './pages/Home';
import Quran from './pages/Quran';
import Dhikr from './pages/Dhikr';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Navigation from './components/Navigation';
import TopAppBar from './components/TopAppBar';
import SideDrawer from './components/SideDrawer';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151312] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#d6c3b5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#151312] text-[#e7e1e0] font-sans selection:bg-[#d6c3b5]/30">
        {user && (
          <>
            <TopAppBar user={user} onMenuClick={() => setSidebarOpen(true)} />
            <SideDrawer
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              user={user}
            />
          </>
        )}
        <main className={`${user ? 'pt-16 pb-20 md:pb-0' : ''}`}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/schedule" element={user ? <Schedule /> : <Navigate to="/login" />} />
            <Route path="/quran" element={user ? <Quran /> : <Navigate to="/login" />} />
            <Route path="/dhikr" element={user ? <Dhikr /> : <Navigate to="/login" />} />
            <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        {user && <Navigation />}
      </div>
    </Router>
  );
}

