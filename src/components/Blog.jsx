// src/components/Blog.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useCollection, orderBy, where } from '../hooks/useFirestore';

const FALLBACK_BLOG = [
  {
    id:'1',
    title:'How I got a PR merged into Jenkins as a BCA student',
    slug:'jenkins-pr-merged-bca',
    content:'<h2>The backstory</h2><p>Getting a pull request merged into Jenkins — one of the most widely used CI/CD platforms in the world — as a first-year BCA student felt like an impossible dream. This is the story of how it happened, the resistance I didn\'t expect, and what it taught me about open source.</p><h2>The contribution</h2><p>I implemented idempotent PR creation logic to prevent API 422 errors on repeated runs of the plugin-modernizer-tool. The solution used a configurable Strategy Pattern (SKIP, UPDATE, IGNORE) selectable via CLI flags, with full Mockito test coverage for all three strategies.</p><h2>What it took</h2><p>Reading the existing codebase thoroughly before writing a single line. Understanding the existing patterns. Writing clean tests. Communicating clearly in PR comments. The open source community rewards genuine, thoughtful contribution.</p><h2>Lessons learned</h2><p>The best first issue is the one you actually understand. Don\'t try to find something "easy" — find something you can reason about deeply. Academic credentials matter far less than code quality when the diff speaks for itself.</p>',
    tags:['Jenkins','Open Source','Java','Career'],
    published:true,
    created_at:'2026-04-19T00:00:00Z',
    cover_url:'', video_url:'',
  },
];

export default function Blog() {
  const { data, loading } = useCollection('blog', [where('published', '==', true), orderBy('created_at', 'desc')]);
  const posts     = (data && data.length > 0) ? data : FALLBACK_BLOG;
  const [modal,   setModal]   = useState(null);
  const animated  = useRef(false);
  const sectionRef= useRef(null);
  const modalRef  = useRef(null);

  const closeModal = useCallback(() => setModal(null), []);

  /* ── Keyboard close ── */
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') closeModal(); };
    if (modal) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      if (modalRef.current) {
        gsap.fromTo(modalRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
        );
      }
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [modal, closeModal]);

  /* ── Blog card stagger GSAP ── */
  useEffect(() => {
    if (loading || animated.current || !sectionRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        gsap.from('.blog-card', {
          y: 40, opacity: 0, rotate: -1.5,
          stagger: 0.12, duration: 0.7,
          ease: 'power2.out',
        });
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [loading]);


  return (
    <section
      id="blog"
      ref={sectionRef}
      data-scroll-section
      className="section"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="container">
        <p className="section-label">// blog</p>
        <h2 className="section-heading">Words from the workshop</h2>

        {loading ? (
          <div className="grid-3">
            {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '200px' }} />)}
          </div>
        ) : posts.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '56px 0', fontSize: '16px' }}>
            The workshop is warming up…
          </p>
        ) : (
          <div className="grid-3">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} onClick={() => setModal(post)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          role="dialog"
          aria-modal="true"
        >
          <div ref={modalRef} className="modal-box">
            <button className="modal-close" onClick={closeModal}>×</button>

            {modal.cover_url && (
              <img
                src={modal.cover_url}
                alt={modal.title}
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
              />
            )}

            <div style={{ padding: '40px 44px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-gold)', opacity: 0.8, marginBottom: '12px' }}>
                {formatDate(modal.created_at)}
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px', color: 'var(--text-primary)', marginBottom: '18px', lineHeight: 1.3,
              }}>
                {modal.title}
              </h2>
              {modal.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                  {modal.tags.map(t => <span key={t} className="pill pill-sm">{t}</span>)}
                </div>
              )}
              <div className="divider" />
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: modal.content }}
                style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.85, marginTop: '24px' }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          #blog .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function BlogCard({ post, onClick }) {
  return (
    <div
      className="card blog-card"
      onClick={onClick}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      {post.cover_url && (
        <div style={{ position: 'relative', marginBottom: '4px' }}>
          <img
            src={post.cover_url}
            alt={post.title}
            style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px 6px 0 0' }}
          />
          {post.video_url && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(10,7,3,0.4)', borderRadius: '6px 6px 0 0',
            }}>
              <span style={{ fontSize: '34px' }}>▶</span>
            </div>
          )}
        </div>
      )}
      <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-gold)', opacity: 0.7 }}>
        {formatDate(post.created_at)}
      </p>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1.45,
      }}>
        {post.title}
      </h3>
      {post.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {post.tags.map(t => <span key={t} className="pill pill-sm">{t}</span>)}
        </div>
      )}
      <p style={{
        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
        color: 'var(--accent-gold)', marginTop: 'auto',
      }}>
        READ MORE →
      </p>
    </div>
  );
}

function formatDate(str) {
  if (!str) return '';
  try { return new Date(str).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' }); }
  catch { return str; }
}
