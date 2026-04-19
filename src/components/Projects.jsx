// src/components/Projects.jsx
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCollection, orderBy } from '../hooks/useFirestore';

const FALLBACK_PROJECTS = [
  {
    id:'1', order:1,
    name:'Nyay-Saarthi', subtitle:'Digital Judiciary Platform',
    description:'Fine-tuned and orchestrated multiple LLMs (Gemini, Groq/Llama-3) with task-specific routing. Built custom NLP pipeline using Kanoon API to parse and resolve Indian legal queries. Engineered real-time AI avatar with lip-sync and voice interaction. Implemented multi-Indian language support. Built cryptographic document vault using SHA-256. Integrated face recognition login with JWT-based RBAC.',
    vision:'Accessible legal guidance for every Indian citizen regardless of language or literacy.',
    tech:['Spring Boot','React','Groq AI','Gemini','NLP','WebRTC','SHA-256','JWT'],
    github_url:'https://github.com/viru0909-dev/nyay-setu-working',
    live_url:'https://nyaysetu-lovat.vercel.app/',
    status:'Active', featured:true,
    contribution_guide:'We welcome contributions! Fork the repo, create a feature branch, and submit a PR against the `dev` branch. Please ensure all tests pass and follow the existing code style. Check open issues tagged `good-first-issue` for starting points.',
  },
  {
    id:'2', order:2,
    name:'SmartCampus AI', subtitle:'Intelligent Campus Management System',
    description:'AI-powered campus management platform with real-time attendance tracking via face recognition, smart scheduling, and predictive analytics for student performance. Designed Predictive Intervention Engine using Logistic Regression to calculate student dropout risk scores (0.0–1.0) in real-time. Implemented decoupled microservices: Spring Boot for core academic operations (Fees, Attendance) and Flask microservice for ML inference.',
    tech:['Java','Spring Boot','Python','React','Flask','Logistic Regression'],
    github_url:'', live_url:'', status:'In Progress', featured:false,
  },
];

export default function Projects() {
  const { data, loading } = useCollection('projects', [orderBy('order')]);
  const projects    = (data && data.length > 0) ? data : FALLBACK_PROJECTS;
  const animated    = useRef(false);
  const sectionRef  = useRef(null);




  useEffect(() => {
    if (loading || animated.current || !sectionRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        gsap.from('.project-featured', { scale: 0.93, opacity: 0, duration: 1.0, ease: 'power2.out' });
        gsap.from('.project-card', { y: 50, opacity: 0, stagger: 0.2, duration: 0.8, delay: 0.3, ease: 'power2.out' });
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [loading]);

  const featured    = projects.filter(p => p.featured);
  const nonFeatured = projects.filter(p => !p.featured);

  return (
    <section
      id="projects"
      ref={sectionRef}
      data-scroll-section
      className="section"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="container">
        <p className="section-label">// projects</p>
        <h2 className="section-heading">Things I've shipped</h2>

        {loading ? <ProjectsSkeleton /> : (
          <>
            {featured.map(p => <FeaturedCard key={p.id} project={p} />)}
            {nonFeatured.length > 0 && (
              <div className="grid-2" style={{ marginTop: '24px' }}>
                {nonFeatured.map(p => <SmallCard key={p.id} project={p} />)}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ project: p }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card project-featured" style={{ padding: '28px 32px', marginBottom: '24px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: 'var(--text-primary)', marginBottom: '5px' }}>
            {p.name}
          </h3>
          <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '15px' }}>{p.subtitle}</p>
        </div>
        <span style={{
          fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
          padding: '4px 14px', borderRadius: '20px', flexShrink: 0,
          background: p.status === 'Active' ? 'rgba(76,175,125,0.12)' : 'rgba(196,151,63,0.12)',
          color: p.status === 'Active' ? 'var(--green-merged)' : 'var(--accent-amber)',
          border: `1px solid ${p.status === 'Active' ? 'rgba(76,175,125,0.35)' : 'rgba(196,151,63,0.35)'}`,
        }}>
          {p.status === 'Active' ? '● ACTIVE' : p.status}
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.78, marginBottom: '18px' }}>
        {p.description}
      </p>

      {/* Vision quote */}
      {p.vision && (
        <blockquote style={{
          borderLeft: '4px solid var(--accent-rust)',
          paddingLeft: '20px', marginBottom: '18px',
          fontStyle: 'italic', color: 'var(--accent-gold)',
          fontSize: '16px', lineHeight: 1.7,
        }}>
          &ldquo;{p.vision}&rdquo;
        </blockquote>
      )}

      {/* Tech */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {(p.tech || []).map(t => <span key={t} className="pill">{t}</span>)}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: p.contribution_guide ? '20px' : 0 }}>
        {p.live_url && (
          <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm">
            Live demo ↗
          </a>
        )}
        {p.github_url && (
          <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            GitHub source ↗
          </a>
        )}
      </div>

      {/* Contribution guide accordion */}
      {p.contribution_guide && (
        <>
          <div className="divider" />
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', gap: '10px',
              fontFamily: "'Crimson Text', serif",
              fontSize: '11px', letterSpacing: '1.5px',
              textTransform: 'uppercase', color: 'var(--text-secondary)',
              cursor: 'pointer', padding: 0,
            }}
          >
            <span style={{ color: 'var(--accent-amber)', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none' }}>
              ▶
            </span>
            CONTRIBUTION GUIDE
          </button>
          <div style={{
            overflow: 'hidden',
            maxHeight: open ? '400px' : '0',
            transition: 'max-height 0.35s ease',
          }}>
            <pre style={{
              marginTop: '16px',
              background: 'var(--bg-deep)',
              border: '0.5px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '18px',
              color: 'var(--text-secondary)',
              fontSize: '14px', lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              fontFamily: "'Crimson Text', serif",
            }}>
              {p.contribution_guide}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

function SmallCard({ project: p }) {
  return (
    <div className="card project-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--text-primary)' }}>
          {p.name}
        </h3>
        <span style={{
          fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: '20px', flexShrink: 0,
          background: 'rgba(196,151,63,0.1)', color: 'var(--accent-amber)',
          border: '0.5px solid rgba(196,151,63,0.3)',
        }}>
          {p.status}
        </span>
      </div>
      {p.subtitle && <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '13px' }}>{p.subtitle}</p>}
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, flex: 1 }}>{p.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {(p.tech || []).map(t => <span key={t} className="pill pill-sm">{t}</span>)}
      </div>
      {(p.github_url || p.live_url) && (
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {p.live_url  && <a href={p.live_url}  target="_blank" rel="noreferrer" style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent-amber)' }}>Live ↗</a>}
          {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>GitHub ↗</a>}
        </div>
      )}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <>
      <div className="skeleton" style={{ height: '320px', borderRadius: '8px', marginBottom: '24px' }} />
      <div className="grid-2">
        {[1,2].map(i => <div key={i} className="skeleton skeleton-card" />)}
      </div>
    </>
  );
}
