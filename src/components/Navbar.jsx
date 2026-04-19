// src/components/Navbar.jsx — native window scroll event, no Locomotive dependency
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'Profile',      href: '#profile' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Open Source',  href: '#opensource' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Blog',         href: '#blog' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId,   setActiveId]   = useState('hero');
  const linksRef = useRef([]);

  /* ── Native scroll → frosted glass ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section via IntersectionObserver ── */
  useEffect(() => {
    const ids = ['hero', ...NAV_LINKS.map(l => l.href.replace('#', ''))];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
    }, { rootMargin: '-40% 0px -50% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  /* ── Mobile overlay stagger ── */
  useEffect(() => {
    if (mobileOpen && linksRef.current.length) {
      gsap.fromTo(linksRef.current,
        { y: 30, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' }
      );
    }
  }, [mobileOpen]);

  function handleNavClick(e, href) {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '66px',
        background: scrolled ? 'rgba(26,18,9,0.92)' : 'rgba(26,18,9,0)',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '0.5px solid var(--border-warm)' : '0.5px solid transparent',
        transition: 'background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
      }}>
        {/* Logo */}
        <a href="#hero" onClick={e => handleNavClick(e, '#hero')} style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '18px', fontWeight: 600,
          color: 'var(--accent-gold)', letterSpacing: '0.3px',
          textDecoration: 'none',
        }}>
          Virendra G.
        </a>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.replace('#', '');
            const isActive = activeId === id;
            return (
              <a
                key={href}
                href={href}
                onClick={e => handleNavClick(e, href)}
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: '11px', letterSpacing: '2.5px',
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={e => { if (!isActive) e.target.style.color = 'var(--accent-gold)'; }}
                onMouseLeave={e => { if (!isActive) e.target.style.color = 'var(--text-secondary)'; }}
              >
                {label}
              </a>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
          style={{
            background: 'transparent', border: 'none',
            flexDirection: 'column', gap: '5px',
            padding: '6px', cursor: 'pointer',
          }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '1.5px',
              background: 'var(--accent-gold)',
              transition: 'all 0.25s ease',
              transform: mobileOpen && i === 0 ? 'rotate(45deg) translateY(6.5px)'
                        : mobileOpen && i === 2 ? 'rotate(-45deg) translateY(-6.5px)'
                        : mobileOpen && i === 1 ? 'scaleX(0)' : 'none',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'var(--bg-deep)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '36px',
        opacity: mobileOpen ? 1 : 0,
        pointerEvents: mobileOpen ? 'all' : 'none',
        transition: 'opacity 0.3s ease',
      }}>
        {NAV_LINKS.map(({ label, href }, i) => (
          <a
            key={href}
            ref={el => linksRef.current[i] = el}
            href={href}
            onClick={e => handleNavClick(e, href)}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px', color: 'var(--text-primary)',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--accent-gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
          >
            {label}
          </a>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}
