// src/components/Profile.jsx — Bento Dashboard Layout
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDocument } from '../hooks/useFirestore';
import profileImg from '../Assets/ProfileImage.jpeg';
import resumePdf  from '../Assets/Resume.pdf';

/* ── Fallback ── */
const FALLBACK = {
  name:     'Virendra Gadekar',
  tagline:  'Open source by conviction, full stack by craft',
  bio:      'BCA student from Pune who decided open source wasn\'t just for senior engineers. Merged PRs into Jenkins CI/CD — infrastructure used by millions. Builds legal AI for Indian citizens. Predicts student dropouts before they happen.',
  email:    'gadekarvirendra4@gmail.com',
  phone:    '+91-7414968840',
  location: 'Pune, Maharashtra',
  github:   'https://github.com/viru0909-dev',
  linkedin: 'https://www.linkedin.com/in/virendragadekar/',
  education: [{
    overall_cgpa: '9.09',
    semesters: [
      { sem: 'Semester 1', cgpa: '9.27' },
      { sem: 'Semester 2', cgpa: '8.91' },
      { sem: 'Semester 3', cgpa: '9.27' },
    ],
  }],
};

/* ── Shared card style ── */
const cardStyle = {
  background: 'var(--bg-surface)',
  border: '0.5px solid var(--border-warm)',
  borderRadius: 12,
  overflow: 'hidden',
};

/* ── Stat box ── */
function StatBox({ value, label }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '0.5px solid var(--border-warm)',
      borderRadius: 8,
      padding: '14px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 28, fontWeight: 700,
        color: 'var(--accent-gold)',
        lineHeight: 1,
      }}>{value}</span>
      <span style={{
        fontFamily: "'Crimson Text', serif",
        fontSize: 11, letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        lineHeight: 1.3,
      }}>{label}</span>
    </div>
  );
}

export default function Profile() {
  const { data, loading } = useDocument('profile', 'main');

  const prof = {
    name:      data?.name      || FALLBACK.name,
    bio:       data?.bio       || FALLBACK.bio,
    github:    data?.github    || FALLBACK.github,
    linkedin:  data?.linkedin  || FALLBACK.linkedin,
    education: data?.education || FALLBACK.education,
  };
  const edu = prof.education[0] || FALLBACK.education[0];

  /* ── Refs ── */
  const sectionRef   = useRef(null);
  const mainCardRef  = useRef(null);
  const leftCardRef  = useRef(null);
  const rightCardRef = useRef(null);
  const animated     = useRef(false);

  /* ── GSAP stagger on viewport entry ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || animated.current) return;
      animated.current = true;
      obs.disconnect();
      gsap.from(
        [mainCardRef.current, leftCardRef.current, rightCardRef.current].filter(Boolean),
        { y: 30, opacity: 0, duration: 0.8, stagger: 0.14, ease: 'power2.out' }
      );
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Locomotive update after data load ── */
  useEffect(() => {
    if (!loading) setTimeout(() => window.__locomotiveScroll?.update(), 400);
  }, [loading]);

  /* ── Name split ── */
  const [firstName, ...rest] = prof.name.split(' ');
  const lastName = rest.join(' ');

  return (
    <section
      id="profile"
      data-scroll-section
      ref={sectionRef}
      style={{ background: 'var(--bg-primary)', padding: '100px 0' }}
    >
      <div className="container">
        {/* Section label */}
        <p className="section-label">// profile</p>
        <h2 className="section-heading" style={{ marginBottom: 32 }}>Who I Am</h2>

        {/* ════════════════════════════════════
            MAIN IDENTITY CARD
        ════════════════════════════════════ */}
        <div ref={mainCardRef} style={{ ...cardStyle, marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 0,
          }}>

            {/* ── Avatar column (30%) ── */}
            <div style={{
              width: '30%',
              flexShrink: 0,
              padding: '28px 24px 28px 28px',
              borderRight: '0.5px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-primary)',
            }}>
              <div style={{
                width: '100%',
                maxWidth: 220,
                aspectRatio: '3/4',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--border-accent)',
                boxShadow: '0 4px 32px rgba(232,201,138,0.08)',
              }}>
                <img
                  src={profileImg}
                  alt="Virendra Gadekar"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* ── Info column (70%) ── */}
            <div style={{
              flex: 1,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}>

              {/* Header: Name + Social links */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  lineHeight: 1.15,
                  margin: 0,
                }}>
                  {firstName}{' '}
                  <em style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{lastName}</em>
                </h3>

                {/* Social icon links */}
                <div style={{ display: 'flex', gap: 10, flexShrink: 0, paddingTop: 4 }}>
                  {[
                    { href: prof.github,   label: 'GH', title: 'GitHub' },
                    { href: prof.linkedin, label: 'in', title: 'LinkedIn' },
                  ].map(({ href, label, title }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      title={title}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 32, height: 32, borderRadius: 6,
                        background: 'var(--bg-elevated)',
                        border: '0.5px solid var(--border-warm)',
                        fontFamily: "'Crimson Text', serif",
                        fontSize: 12, fontWeight: 600,
                        color: 'var(--accent-gold)',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,201,138,0.1)'; e.currentTarget.style.borderColor = 'var(--accent-gold)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border-warm)'; }}
                    >{label}</a>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '0.5px', background: 'var(--border-subtle)' }} />

              {/* ── Stats Grid (4 boxes) ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
              }}>
                <StatBox value="9.09"  label="Overall CGPA" />
                <StatBox value="2+"    label="Merged Jenkins PRs" />
                <StatBox value="BCA"   label="Class of 2027" />
                <StatBox value="AI/ML" label="Full Stack Focus" />
              </div>

              {/* ── Bio ── */}
              <p style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: 16,
                color: 'var(--text-secondary)',
                lineHeight: 1.78,
                margin: 0,
              }}>
                {prof.bio}
              </p>

              {/* ── Action row ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
                <a
                  href={resumePdf}
                  download="VirendraGadekar_Resume.pdf"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 24px',
                    background: 'transparent',
                    color: 'var(--accent-gold)',
                    border: '1.5px solid var(--border-accent)',
                    borderRadius: 6,
                    fontFamily: "'Crimson Text', serif",
                    fontSize: 14, fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '0.3px',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(232,201,138,0.09)';
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-accent)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  Download CV ↓
                </a>
                <span style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: 11, letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}>
                  Pune, Maharashtra · Java Full Stack
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            EVIDENCE & RECORDS GRID (2-col)
        ════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}>

          {/* ── Left: Academic Breakdown ── */}
          <div ref={leftCardRef} style={{ ...cardStyle, padding: '24px 28px' }}>
            <h4 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18, fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 4,
            }}>Academic Breakdown</h4>
            <p style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: 12, letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: 20,
            }}>Dr. D.Y. Patil S&T · BCA 2024–2027</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(edu.semesters || []).map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '0.5px solid var(--border-subtle)',
                }}>
                  <span style={{ fontFamily: "'Crimson Text', serif", fontSize: 15, color: 'var(--text-secondary)' }}>
                    {s.sem}
                  </span>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 17, fontWeight: 600,
                    color: parseFloat(s.cgpa) >= 9.0 ? 'var(--accent-gold)' : 'var(--text-primary)',
                  }}>
                    {s.cgpa}
                  </span>
                </div>
              ))}

              {/* Overall row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0 0',
              }}>
                <span style={{ fontFamily: "'Crimson Text', serif", fontSize: 15, color: 'var(--text-primary)', fontWeight: 700 }}>
                  Overall CGPA
                </span>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20, fontWeight: 700,
                  color: 'var(--accent-gold)',
                }}>
                  {edu.overall_cgpa || '9.09'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Evidence of Work ── */}
          <div ref={rightCardRef} style={{ ...cardStyle, padding: '24px 28px' }}>
            <h4 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18, fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 4,
            }}>Evidence of Work</h4>
            <p style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: 12, letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              marginBottom: 20,
            }}>Merged PRs · Live Projects</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { badge: 'MERGED', label: 'Jenkins PR #1428', sub: 'plugin-modernizer-tool', type: 'merged', href: 'https://github.com/jenkinsci/plugin-modernizer-tool/pull/1428' },
                { badge: 'MERGED', label: 'Jenkins PR #544',  sub: 'rpm-packaging',          type: 'merged', href: 'https://github.com/jenkinsci/rpm-packaging/pull/544' },
                { badge: 'LIVE',   label: 'Nyay-Saarthi',     sub: 'Digital Judiciary AI',   type: 'live',   href: 'https://nyaysetu-lovat.vercel.app/' },
              ].map(({ badge, label, sub, type, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    background: 'var(--bg-primary)',
                    border: '0.5px solid var(--border-subtle)',
                    borderRadius: 8,
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-warm)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
                >
                  {/* Badge */}
                  <span style={{
                    padding: '3px 9px',
                    borderRadius: 4,
                    fontSize: 9, letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    fontFamily: "'Crimson Text', serif",
                    flexShrink: 0,
                    ...(type === 'merged' ? {
                      background: 'rgba(76,175,125,0.15)',
                      color: '#4caf7d',
                      border: '0.5px solid rgba(76,175,125,0.3)',
                    } : {
                      background: 'rgba(232,201,138,0.1)',
                      color: 'var(--accent-gold)',
                      border: '0.5px solid var(--border-accent)',
                    }),
                  }}>{badge}</span>

                  {/* Text */}
                  <div>
                    <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 15, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                      {label}
                    </p>
                    <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
                      {sub}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)', fontSize: 14 }}>↗</span>
                </a>
              ))}
            </div>
          </div>

        </div>{/* end 2-col grid */}
      </div>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 860px) {
          #profile .bento-main-flex { flex-direction: column !important; }
          #profile .bento-avatar    { width: 100% !important; padding: 24px 24px 0 !important; border-right: none !important; border-bottom: 0.5px solid var(--border-subtle) !important; }
          #profile .bento-stats     { grid-template-columns: repeat(2, 1fr) !important; }
          #profile .bento-bottom    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
