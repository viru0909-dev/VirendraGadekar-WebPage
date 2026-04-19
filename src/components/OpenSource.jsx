// src/components/OpenSource.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCollection, orderBy } from '../hooks/useFirestore';

const FALLBACK_OS = [
  {
    id:'1', order:1,
    repo:'Jenkins / plugin-modernizer-tool',
    pr_number:'PR #1428',
    pr_url:'https://github.com/jenkinsci/plugin-modernizer-tool/pull/1428',
    description:'Implemented idempotent PR creation logic to prevent API 422 errors on repeated runs. Designed configurable Strategy Pattern (SKIP, UPDATE, IGNORE) selectable via CLI flags. Added Mockito unit tests covering all three strategies. Collaborated with core maintainers on code reviews.',
    tags:['Java','Jenkins','Strategy Pattern','Mockito','CI/CD'],
    merged:true, date:'2025-11',
  },
  {
    id:'2', order:2,
    repo:'Jenkins / rpm-packaging',
    pr_number:'PR #544',
    pr_url:'https://github.com/jenkinsci/rpm-packaging/pull/544',
    description:'Fixed RPM packaging spec file to resolve build failures in the Jenkins CI pipeline. Ensured compatibility with updated dependency versions and corrected file permission mappings.',
    tags:['RPM','Jenkins','Linux','Build Systems'],
    merged:true, date:'2025-09',
  },
];

export default function OpenSource() {
  const { data, loading } = useCollection('opensource', [orderBy('order')]);
  const contributions = (data && data.length > 0) ? data : FALLBACK_OS;
  const animated  = useRef(false);
  const sectionRef= useRef(null);


  /* ── Cards fly in from opposite sides ── */
  useEffect(() => {
    if (loading || animated.current || !sectionRef.current) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const cards = sectionRef.current.querySelectorAll('.os-card');
        if (cards[0]) gsap.from(cards[0], { x:-80, opacity:0, duration:0.9, ease:'power2.out' });
        if (cards[1]) gsap.from(cards[1], { x:80,  opacity:0, duration:0.9, ease:'power2.out', delay:0.15 });
        obs.disconnect();
      }
    }, { threshold: 0.2 });

    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [loading]);

  return (
    <section
      id="opensource"
      ref={sectionRef}
      data-scroll-section
      className="section"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="container">
        <p className="section-label">// open source</p>
        <h2 className="section-heading">My upstream fingerprint</h2>

        {loading ? (
          <div className="grid-2">
            {[1,2].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '240px' }} />)}
          </div>
        ) : (
          <div className="grid-2">
            {contributions.map(c => <OSCard key={c.id} c={c} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function OSCard({ c }) {
  return (
    <div
      className="card os-card"
      style={{
        borderLeft: '2px solid var(--accent-rust)',
        display: 'flex', flexDirection: 'column', gap: '14px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '16px', color: 'var(--accent-gold)', marginBottom: '4px',
          }}>
            {c.repo}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '1px' }}>
            {c.date}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '1px' }}>
            {c.pr_number}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className={`status-dot ${c.merged ? 'merged' : 'open'}`} />
            <span style={{ fontSize: '11px', color: c.merged ? 'var(--green-merged)' : 'var(--amber-open)' }}>
              {c.merged ? 'Merged' : 'Open'}
            </span>
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7 }}>
        {c.description}
      </p>

      {/* Tech tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {(c.tags || []).map(tag => (
          <span key={tag} className="pill pill-sm">{tag}</span>
        ))}
      </div>

      {/* Link */}
      <a
        href={c.pr_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block', marginTop: '4px',
          fontFamily: "'Crimson Text', serif",
          fontSize: '11px', letterSpacing: '1.5px',
          textTransform: 'uppercase', color: 'var(--accent-gold)',
          transition: 'text-decoration 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
      >
        VIEW PR ↗
      </a>
    </div>
  );
}
