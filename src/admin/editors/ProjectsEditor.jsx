// src/admin/editors/ProjectsEditor.jsx
import { useState } from 'react';
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useCollection, orderBy } from '../../hooks/useFirestore';

const EMPTY = {
  name: '', subtitle: '', description: '', vision: '',
  tech: [], github_url: '', live_url: '', status: 'Active',
  featured: false, contribution_guide: '', order: 99, cover_url: '',
};

export default function ProjectsEditor() {
  const { data: projects, loading } = useCollection('projects', [orderBy('order')]);
  const [editingId,  setEditingId]  = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [adding,     setAdding]     = useState(false);
  const [msg,        setMsg]        = useState('');
  const [uploading,  setUploading]  = useState(false);

  function flash(t) { setMsg(t); setTimeout(() => setMsg(''), 2500); }
  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `projects/cover_${Date.now()}_${file.name}`);
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
      await updateDoc(doc(db, 'projects', editingId), form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'projects'), form);
      setAdding(false);
    }
    setForm(EMPTY);
    flash('Saved.');
  }

  async function remove(id) {
    if (!window.confirm('Delete this project?')) return;
    await deleteDoc(doc(db, 'projects', id));
    flash('Deleted.');
  }

  function startEdit(p) {
    setForm({ ...EMPTY, ...p, tech: p.tech || [] });
    setEditingId(p.id);
    setAdding(false);
  }

  function startAdd() {
    setForm(EMPTY);
    setEditingId(null);
    setAdding(true);
  }

  if (loading) return <p style={{ color: 'var(--text-tertiary)' }}>Loading…</p>;

  return (
    <div>
      <h2 className="editor-heading">Projects</h2>
      {msg && <div className="success-msg">{msg}</div>}

      {(projects || []).map(p => (
        <div key={p.id} className="admin-list-item">
          <div style={{ flex: 1 }}>
            <p className="admin-list-item-title">{p.name} {p.featured ? '⭐' : ''}</p>
            <p className="admin-list-item-meta">{p.status} · Order {p.order}</p>
          </div>
          <div className="admin-item-actions">
            <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Delete</button>
          </div>
        </div>
      ))}

      {(adding || editingId) && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input className="form-input" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Subtitle</label>
              <input className="form-input" value={form.subtitle} onChange={e => update('subtitle', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => update('description', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Vision (quote)</label>
            <input className="form-input" value={form.vision} onChange={e => update('vision', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Tech Stack (comma-separated)</label>
            <input className="form-input"
              value={form.tech.join(', ')}
              onChange={e => update('tech', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input className="form-input" value={form.github_url} onChange={e => update('github_url', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Live URL</label>
              <input className="form-input" value={form.live_url} onChange={e => update('live_url', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => update('status', e.target.value)}>
                <option>Active</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Archived</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Order</label>
              <input className="form-input" type="number" value={form.order} onChange={e => update('order', Number(e.target.value))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
            <label className="form-toggle">
              <span className="toggle-switch">
                <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} />
                <span className="toggle-slider" />
              </span>
              Featured project
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Contribution Guide</label>
            <textarea className="form-textarea" rows={6} value={form.contribution_guide} onChange={e => update('contribution_guide', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image</label>
            {form.cover_url && <img src={form.cover_url} alt="Cover" style={{ width: '100%', maxWidth: '300px', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />}
            <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ color: 'var(--text-secondary)', fontSize: '14px' }} />
            {uploading && <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Uploading…</p>}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-gold btn-sm" onClick={save}>Save</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setAdding(false); setEditingId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {!adding && !editingId && (
        <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={startAdd}>
          + Add Project
        </button>
      )}
    </div>
  );
}
