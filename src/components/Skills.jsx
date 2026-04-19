// src/components/Skills.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCollection, orderBy } from '../hooks/useFirestore';

const HOT_SKILLS = new Set(['Java', 'Spring Boot', 'React', 'System Design', 'JavaScript']);

const FALLBACK_SKILLS = [
  { id:'1', order:1, category:'Languages',        items:['Java','JavaScript','SQL','C++','Python'],                              hot:['Java','JavaScript'] },
  { id:'2', order:2, category:'Frameworks & Web', items:['Spring Boot','React','REST APIs','Hibernate','Maven','Flask','HTML','CSS'], hot:['Spring Boot','React'] },
  { id:'3', order:3, category:'Tools & DevOps',   items:['Git','GitHub','Docker','Jenkins','Firebase','Postman','IntelliJ','Linux'], hot:[] },
  { id:'4', order:4, category:'CS Fundamentals',  items:['System Design','Data Structures','Algorithms','OOP','DBMS','OS','Design Patterns'], hot:['System Design'] },
  { id:'5', order:5, category:'Soft Skills',      items:['Open Source Contribution','Problem Solving','Technical Writing','Team Collaboration'], hot:[] },
];

export default function Skills() {
  const { data, loading } = useCollection('skills', [orderBy('order')]);
  const skills    = (data && data.length > 0) ? data : FALLBACK_SKILLS;
  const animated  = useRef(false);
  const sectionRef= useRef(null);


  /* ── Wave stagger GSAP ── */
  useEffect(() => {
    if (loading || animated.current || !sectionRef.current) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        gsap.from('.skill-pill', {
          scale: 0, opacity: 0,
          duration: 0.4,
          stagger: { each: 0.04, from: 'start' },
          ease: 'back.out(1.6)',
        });
        obs.disconnect();
      }
    }, { threshold: 0.2 });

    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [loading]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      data-scroll-section
      className="section"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="container">
        <p className="section-label">// skills</p>
        <h2 className="section-heading">What I wield</h2>

        {loading ? (
          <SkillsSkeleton />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {skills.map(cat => {
              const hotSet = new Set(cat.hot || []);
              return (
                <div key={cat.id}>
                  <p style={{
                    fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
                    color: 'var(--text-tertiary)', marginBottom: '14px',
                    fontFamily: "'Crimson Text', serif",
                  }}>
                    {cat.category}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(cat.items || []).map(skill => {
                      const isHot = hotSet.has(skill) || HOT_SKILLS.has(skill);
                      return (
                        <span
                          key={skill}
                          className={`pill skill-pill${isHot ? ' hot' : ''}`}
                        >
                          {skill}
                          {isHot && <span style={{ marginLeft: '5px', fontSize: '9px', opacity: 0.6 }}>✦</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function SkillsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {[1,2,3].map(i => (
        <div key={i}>
          <div className="skeleton skeleton-line" style={{ width: '100px', height: '12px', marginBottom: '14px' }} />
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[1,2,3,4,5].map(j => (
              <div key={j} className="skeleton" style={{ width: `${60 + j*18}px`, height: '34px', borderRadius: '20px' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
