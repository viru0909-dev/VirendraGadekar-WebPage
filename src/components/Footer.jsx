// src/components/Footer.jsx
export default function Footer() {
  function scrollToTop() {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer style={{
      background: 'var(--bg-deep)',
      borderTop: '0.5px solid var(--border-subtle)',
      padding: '64px 24px',
      textAlign: 'center',
    }}>
      {/* Name */}
      <p onClick={scrollToTop} style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '22px', marginBottom: '6px', cursor: 'pointer',
      }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 400 }}>Virendra </span>
        <em style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>Gadekar</em>
      </p>

      {/* Tagline */}
      <p style={{
        fontFamily: "'Crimson Text', serif",
        fontSize: '11px', letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        marginBottom: '28px',
      }}>
        Open source by conviction, full stack by craft
      </p>

      {/* Links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', marginBottom: '36px' }}>
        {[
          { label: 'GitHub ↗',   href: 'https://github.com/viru0909-dev' },
          { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/virendragadekar/' },
        ].map(({ label, href }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
            color: 'var(--text-tertiary)', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--accent-gold)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}
          >
            {label}
          </a>
        ))}
      </div>

      <p style={{ fontFamily: "'Crimson Text', serif", fontSize: '12px', color: 'var(--text-tertiary)' }}>
        © 2026 Virendra Gadekar · Built with conviction
      </p>
    </footer>
  );
}
