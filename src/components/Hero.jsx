// src/components/Hero.jsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import heroBg   from '../Assets/preview.webp';
import resumePdf from '../Assets/Resume.pdf';

const PANELS = [
  { w:90,  h:130, top:'8%',  left:'4%',   rotY:-22, rotX:6,  speed:0.00035, phaseY:0,    phaseX:1.2, opacity:0.12 },
  { w:160, h:210, top:'15%', left:'14%',  rotY:-14, rotX:3,  speed:0.00048, phaseY:2.1,  phaseX:0.4, opacity:0.09 },
  { w:220, h:300, top:'20%', left:'28%',  rotY:-6,  rotX:2,  speed:0.00031, phaseY:0.8,  phaseX:3.1, opacity:0.07 },
  { w:260, h:340, top:'18%', left:'42%',  rotY:4,   rotX:1,  speed:0.00042, phaseY:1.5,  phaseX:2.0, opacity:0.08 },
  { w:200, h:270, top:'22%', left:'57%',  rotY:12,  rotX:3,  speed:0.00038, phaseY:3.2,  phaseX:0.7, opacity:0.09 },
  { w:140, h:190, top:'12%', left:'70%',  rotY:20,  rotX:5,  speed:0.00055, phaseY:0.3,  phaseX:1.8, opacity:0.11 },
  { w:80,  h:110, top:'10%', left:'84%',  rotY:26,  rotX:7,  speed:0.00062, phaseY:1.9,  phaseX:3.5, opacity:0.13 },
  { w:110, h:150, top:'55%', left:'6%',   rotY:-18, rotX:4,  speed:0.00044, phaseY:2.7,  phaseX:0.9, opacity:0.10 },
  { w:170, h:230, top:'60%', left:'72%',  rotY:16,  rotX:4,  speed:0.00039, phaseY:0.6,  phaseX:2.4, opacity:0.10 },
  { w:100, h:140, top:'65%', left:'88%',  rotY:24,  rotX:8,  speed:0.00058, phaseY:3.8,  phaseX:1.1, opacity:0.14 },
];

export default function Hero() {
  const panelRefs    = useRef([]);
  const rafRef       = useRef(null);
  const [showHint,   setShowHint] = useState(true);

  /* ── Continuous panel animation (rAF) ── */
  useEffect(() => {
    const animate = (timestamp) => {
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = PANELS[i];
        const t    = timestamp * p.speed;
        const rotY  = p.rotY + Math.sin(t + p.phaseY) * 13;
        const rotX  = p.rotX + Math.sin(t * 0.65 + p.phaseX) * 7;
        const transY = Math.sin(t * 0.48 + p.phaseY) * 20;
        const transX = Math.sin(t * 0.31 + p.phaseX) * 10;
        const scale  = 1 + Math.sin(t * 0.38) * 0.035;
        el.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(${transY}px) translateX(${transX}px) scale(${scale})`;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── GSAP entry timeline ── */
  useEffect(() => {
    // Small delay so DOM is painted — text is visible from CSS, GSAP adds motion
    const timer = setTimeout(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-panel',
          { opacity: 0, scale: 0.4 },
          { opacity: 1, scale: 1, duration: 1.6, stagger: 0.08 }
        )
        .fromTo('.hero-sublabel',   { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.8')
        .fromTo('.hero-name-left',  { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, '-=0.5')
        .fromTo('.hero-name-right', { x:  60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, '-=0.75')
        .fromTo('.hero-tagline',    { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-cta',        { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.35')
        .fromTo('.hero-scroll-hint',{ opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.2');
    }, 100);

    // Auto-hide scroll hint
    const t = setTimeout(() => setShowHint(false), 4500);
    return () => { clearTimeout(t); clearTimeout(timer); };
  }, []);

  function scrollDown(e) {
    e.preventDefault();
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '640px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* Dark overlay — keep warm atmosphere visible */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(8,5,2,0.55)',
        zIndex: 1,
      }} />

      {/* Panels group */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        {PANELS.map((p, i) => (
          <div
            key={i}
            ref={el => panelRefs.current[i] = el}
            className={`hero-panel${i >= 3 ? ' hero-panel-optional' : ''}`}
            style={{
              position: 'absolute',
              width:  `${p.w}px`,
              height: `${p.h}px`,
              top:    p.top,
              left:   p.left,
              background: `rgba(139,90,43,${p.opacity})`,
              border: '0.5px solid rgba(232,201,138,0.16)',
              borderRadius: '2px',
              willChange: 'transform',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>

      {/* Foreground text */}
      <div style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center', padding: '0 24px', maxWidth: '760px',
      }}>
        {/* Sub-label */}
        <p className="hero-sublabel" style={{
          fontFamily: "'Crimson Text', serif",
          fontSize: '11px', letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          opacity: 1,
          marginBottom: '24px',
        }}>
          Java Full Stack · Open Source
        </p>

        {/* Name */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(52px, 8vw, 92px)',
          lineHeight: 1.05,
          marginBottom: '22px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 16px',
        }}>
          <span className="hero-name-left" style={{ color: '#fff', fontWeight: 400, opacity: 1, textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
            Virendra
          </span>
          <em className="hero-name-right" style={{
            color: 'var(--accent-gold)', fontWeight: 700, fontStyle: 'italic', opacity: 1,
            textShadow: '0 2px 24px rgba(232,201,138,0.35)',
          }}>
            Gadekar
          </em>
        </h1>

        {/* Tagline */}
        <p className="hero-tagline" style={{
          fontFamily: "'Crimson Text', serif",
          fontSize: '12px', letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#c8b890',
          opacity: 1,
          marginBottom: '48px',
          lineHeight: 1.9,
        }}>
          Open source by conviction, full stack by craft
        </p>

        {/* CTAs */}
        <div className="hero-cta" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#profile"
            onClick={scrollDown}
            className="btn btn-gold"
          >
            View my work
          </a>
          <a
            href="https://github.com/viru0909-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="hero-scroll-hint"
        onClick={scrollDown}
        style={{
          position: 'absolute', bottom: '32px', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10, cursor: 'pointer',
          opacity: showHint ? 1 : 0,
          transition: 'opacity 0.8s ease',
          animation: 'bounce 2s ease-in-out infinite',
        }}
      >
        <span style={{
          fontFamily: "'Crimson Text', serif",
          fontSize: '13px', letterSpacing: '2px',
          color: 'var(--text-tertiary)',
        }}>↓</span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-panel-optional { display: none !important; }
        }
      `}</style>
    </section>
  );
}
