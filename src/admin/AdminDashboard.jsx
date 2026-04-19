// src/admin/AdminDashboard.jsx
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';

import ProfileEditor      from './editors/ProfileEditor';
import SkillsEditor       from './editors/SkillsEditor';
import OpenSourceEditor   from './editors/OpenSourceEditor';
import ProjectsEditor     from './editors/ProjectsEditor';
import AchievementsEditor from './editors/AchievementsEditor';
import BlogEditor         from './editors/BlogEditor';

const SECTIONS = [
  { id: 'profile',      label: 'Profile',      component: ProfileEditor },
  { id: 'skills',       label: 'Skills',        component: SkillsEditor },
  { id: 'opensource',   label: 'Open Source',   component: OpenSourceEditor },
  { id: 'projects',     label: 'Projects',      component: ProjectsEditor },
  { id: 'achievements', label: 'Achievements',  component: AchievementsEditor },
  { id: 'blog',         label: 'Blog',          component: BlogEditor },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  const ActiveEditor = SECTIONS.find(s => s.id === activeSection)?.component;

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          Virendra G.
          <span>Portfolio CMS</span>
        </div>

        <nav>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`admin-nav-item${activeSection === s.id ? ' active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '0.5px solid var(--border-subtle)', paddingTop: '12px' }}>
          <button
            className="admin-nav-item logout-item"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Admin Panel — Virendra Gadekar</h1>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>

        <div className="admin-content">
          {ActiveEditor && <ActiveEditor />}
        </div>
      </div>
    </div>
  );
}
