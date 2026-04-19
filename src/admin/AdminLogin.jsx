// src/admin/AdminLogin.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      const msgs = {
        'auth/user-not-found':  'No account found with that email.',
        'auth/wrong-password':  'Incorrect password.',
        'auth/invalid-email':   'Please enter a valid email.',
        'auth/invalid-credential': 'Invalid credentials. Check email and password.',
        'auth/too-many-requests': 'Too many failed attempts. Please wait a moment.',
      };
      setError(msgs[err.code] || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
                      color: 'var(--text-tertiary)', marginBottom: '12px' }}>
            Admin Access
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '32px',
            color: 'var(--accent-gold)',
          }}>
            Virendra G.
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '8px',
                      letterSpacing: '1px' }}>
            Portfolio CMS
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid var(--border-warm)',
            borderRadius: '12px',
            padding: '36px 32px',
          }}
        >
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', justifyContent: 'center',
                     opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px',
                    color: 'var(--text-tertiary)', letterSpacing: '1px' }}>
          <a href="/" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = 'var(--accent-gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}
          >
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
