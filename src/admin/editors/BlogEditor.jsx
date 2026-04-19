// src/admin/editors/BlogEditor.jsx
import { useState } from 'react';
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useCollection, orderBy } from '../../hooks/useFirestore';

const EMPTY = {
  title: '', slug: '', content: '', cover_url: '',
  tags: [], published: false, created_at: new Date().toISOString(), video_url: '',
};

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function BlogEditor() {
  const { data: posts, loading } = useCollection('blog', [orderBy('created_at', 'desc')]);
  const [editingId,  setEditingId] = useState(null);
  const [form,       setForm]      = useState(EMPTY);
  const [adding,     setAdding]    = useState(false);
  const [msg,        setMsg]       = useState('');
  const [uploading,  setUploading] = useState(false);

  function flash(t) { setMsg(t); setTimeout(() => setMsg(''), 2500); }
  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleTitle(val) {
    update('title', val);
    if (!editingId) update('slug', slugify(val));
  }

  async function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `blog/cover_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      update('cover_url', url);
    } catch (err) {
      flash('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (editingId) {
      await updateDoc(doc(db, 'blog', editingId), form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'blog'), form);
      setAdding(false);
    }
    setForm(EMPTY);
    flash('Post saved.');
  }

  async function remove(id) {
    if (!window.confirm('Delete this post?')) return;
    await deleteDoc(doc(db, 'blog', id));
    flash('Deleted.');
  }

  async function togglePublish(post) {
    await updateDoc(doc(db, 'blog', post.id), { published: !post.published });
    flash(post.published ? 'Post unpublished.' : 'Post published.');
  }

  function startEdit(p) {
    setForm({ ...EMPTY, ...p, tags: p.tags || [] });
    setEditingId(p.id);
    setAdding(false);
  }

  function formatDate(dateStr) {
    try { return new Date(dateStr).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' }); }
    catch { return dateStr; }
  }

  if (loading) return <p style={{ color: 'var(--text-tertiary)' }}>Loading…</p>;

  return (
    <div>
      <h2 className="editor-heading">Blog Posts</h2>
      {msg && <div className="success-msg">{msg}</div>}

      {(posts || []).map(p => (
        <div key={p.id} className="admin-list-item">
          <div style={{ flex: 1 }}>
            <p className="admin-list-item-title">{p.title}</p>
            <p className="admin-list-item-meta">
              {formatDate(p.created_at)} ·{' '}
              <span style={{ color: p.published ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                {p.published ? 'Published' : 'Draft'}
              </span>
            </p>
          </div>
          <div className="admin-item-actions">
            <button className="btn btn-outline btn-sm" onClick={() => togglePublish(p)} style={{ fontSize: '11px' }}>
              {p.published ? 'Unpublish' : 'Publish'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Delete</button>
          </div>
        </div>
      ))}

      {(adding || editingId) && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={e => handleTitle(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input className="form-input" value={form.slug} onChange={e => update('slug', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="datetime-local"
                value={form.created_at ? form.created_at.slice(0, 16) : ''}
                onChange={e => update('created_at', new Date(e.target.value).toISOString())}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input className="form-input"
              value={form.tags.join(', ')}
              onChange={e => update('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content (HTML or Markdown)</label>
            <textarea className="form-textarea" rows={14} value={form.content}
              onChange={e => update('content', e.target.value)}
              placeholder="<h2>My Section</h2><p>My paragraph...</p>"
              style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.6 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Video URL (optional)</label>
            <input className="form-input" value={form.video_url} onChange={e => update('video_url', e.target.value)} placeholder="https://youtube.com/..." />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image</label>
            {form.cover_url && (
              <img src={form.cover_url} alt="Cover" style={{ width: '100%', maxWidth: '300px', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
            )}
            <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ color: 'var(--text-secondary)', fontSize: '14px' }} />
            {uploading && <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Uploading…</p>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-toggle">
              <span className="toggle-switch">
                <input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} />
                <span className="toggle-slider" />
              </span>
              Published
            </label>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-gold btn-sm" onClick={save}>Save Post</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setAdding(false); setEditingId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {!adding && !editingId && (
        <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => { setForm({ ...EMPTY, created_at: new Date().toISOString() }); setAdding(true); }}>
          + New Post
        </button>
      )}
    </div>
  );
}
