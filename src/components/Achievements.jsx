// src/components/Achievements.jsx — IntersectionObserver replace Locomotive call events
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCollection, orderBy } from '../hooks/useFirestore';
import voisCert   from '../Assets/voiscertificate.pdf';
import esummitImg from '../Assets/Esummit.jpeg';

const STATIC_ACHIEVEMENTS = [
  { id:'s1', order:1, title:'VOIS for Tech Innovation Marathon 2.0',        org:'Vodafone Intelligent Solutions', result:'Hackathon Finalist',     date:'2025', cert_url:voisCert,   cert_type:'pdf'   },
  { id:'s2', order:2, title:'E-Summit 2026 — Innovate4Impact Buildathon',   org:'Pune Zonals',                   result:'2nd Place',              date:'2026', cert_url:esummitImg, cert_type:'image' },
  { id:'s3', order:3, title:'Smart India Hackathon 2025 (SIH)',             org:'Internal College Round',         result:'Winner — College Qualifier', date:'2025', cert_url:null, cert_type:'none' },
  { id:'s4', order:4, title:'Hack4Impact — 24hr National Level Hackathon',  org:'IIIT Delhi · E-Summit 2026',    result:'Participant',             date:'2026', cert_url:null, cert_type:'none' },
  { id:'s5', order:5, title:'GirlScript Summer of Code (GSSoC)',            org:'GSSoC Foundation',              result:'Applied & Contributing',  date:'2026', cert_url:null, cert_type:'none' },
  { id:'s6', order:6, title:'DTO Hackathon',                                org:'Digital Technology Organization',result:'Applied',               date:'2026', cert_url:null, cert_type:'none' },
];

function badgeClass(result) {
  const r = (result || '').toLowerCase();
  if (r.includes('finalist'))  return 'finalist';
  if (r.includes('winner') || r.includes('1st')) return 'winner';
  if (r.includes('2nd'))       return 'second';
  if (r.includes('qualifier') || r.includes('participating')) return 'qualifier';
  return 'applied';
}

function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}
    >
      <img
        src={src} alt="Certificate"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', border: '1px solid var(--border-warm)', borderRadius: '8px' }}
      />
      <button onClick={onClose} style={{
        position: 'fixed', top: '20px', right: '24px',
        background: 'rgba(255,255,255,0.1)', border: '0.5px solid var(--border-warm)',
        borderRadius: '50%', width: '36px', height: '36px',
        color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>×</button>
    </div>
  );
}

export default function Achievements() {
  const { data, loading } = useCollection('achievements', [orderBy('order')]);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const itemRefs   = useRef([]);
  const revealedSet = useRef(new Set());

  const achievements = (() => {
    const base = (data && data.length > 0) ? data : STATIC_ACHIEVEMENTS;
    return base.map(a => {
      const match = STATIC_ACHIEVEMENTS.find(s => s.order === a.order || s.title === a.title);
      return { ...a, cert_url: a.cert_url ?? match?.cert_url ?? null, cert_type: a.cert_type ?? match?.cert_type ?? 'none' };
    }).sort((a, b) => a.order - b.order);
  })();

  /* ── IntersectionObserver per item ── */
  useEffect(() => {
    if (loading) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const el  = entry.target;
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        if (entry.isIntersecting && !revealedSet.current.has(idx)) {
          revealedSet.current.add(idx);
          el.classList.add('revealed');
          gsap.fromTo(el,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }
          );
          const dot = el.querySelector('.ach-dot');
          if (dot) gsap.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.4, delay: 0.1, ease: 'back.out(2.5)' });
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    itemRefs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loading, achievements.length]);

  return (
    <section id="achievements" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <p className="section-label">// achievements</p>
        <h2 className="section-heading">The trail so far</h2>

        {loading ? (
          <div style={{ paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '88px' }} />)}
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            {/* Vertical timeline line */}
            <div style={{
              position: 'absolute', left: '8px', top: '10px', bottom: '20px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--accent-rust) 80%, transparent)',
            }} />

            {achievements.map((a, i) => (
              <div
                key={a.id || i}
                ref={el => itemRefs.current[i] = el}
                className="achievement-item"
                data-idx={i}
                style={{ position: 'relative', paddingBottom: '28px' }}
              >
                {/* Dot */}
                <div className="ach-dot" style={{
                  position: 'absolute', left: '-35px', top: '14px',
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  border: '2px solid var(--bg-primary)',
                  boxShadow: '0 0 10px rgba(232,201,138,0.4)',
                }} />

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span className={`result-badge ${badgeClass(a.result)}`}>{a.result}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '1px' }}>{a.date}</span>
                      </div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '17px', color: 'var(--text-primary)', marginBottom: '4px',
                      }}>{a.title}</h3>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: a.cert_url ? '12px' : 0 }}>
                        {a.org}
                      </p>

                      {a.cert_url && a.cert_type === 'pdf' && (
                        <a href={a.cert_url} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
                          color: 'var(--accent-amber)',
                        }}>
                          📄 View Certificate ↗
                        </a>
                      )}

                      {a.cert_url && a.cert_type === 'image' && (
                        <button onClick={() => setLightboxSrc(a.cert_url)} style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
                          color: 'var(--accent-amber)', padding: 0,
                          fontFamily: "'Crimson Text', serif",
                        }}>
                          🏆 View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </section>
  );
}
