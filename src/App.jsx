// src/App.jsx  — Locomotive Scroll removed, native smooth scroll used
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';

import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import Profile      from './components/Profile';
import Skills       from './components/Skills';
import OpenSource   from './components/OpenSource';
import Projects     from './components/Projects';
import Achievements from './components/Achievements';
import Blog         from './components/Blog';
import Footer       from './components/Footer';

import AdminLogin     from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

/* ── Loading screen ── */
function LoadingScreen() {
  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-deep)',
    }}>
      <span style={{
        fontFamily: "'Crimson Text', serif",
        fontSize: '14px', letterSpacing: '3px',
        textTransform: 'uppercase', color: 'var(--text-tertiary)',
      }}>…</span>
    </div>
  );
}

/* ── Protected route ── */
function ProtectedRoute({ children }) {
  const [user,    setUser]    = useState(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false); });
    return unsub;
  }, []);
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/admin" replace />;
}

/* ── Public portfolio — single scrolling page ── */
function PublicPortfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Profile />
        <Skills />
        <OpenSource />
        <Projects />
        <Achievements />
        <Blog />
        <Footer />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<PublicPortfolio />} />
        <Route path="/admin"           element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
