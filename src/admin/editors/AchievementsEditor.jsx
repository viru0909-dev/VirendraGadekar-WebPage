// src/admin/editors/AchievementsEditor.jsx
import { useState } from 'react';
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCollection, orderBy } from '../../hooks/useFirestore';

const EMPTY = { title: '', org: '', result: '', date: '', order: 99 };

export default function AchievementsEditor() {
  const { data: achievements, loading } = useCollection('achievements', [orderBy('order')]);
  const [editingId, setEditingId] = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [adding,    setAdding]    = useState(false);
  const [msg,       setMsg]       = useState('');

  function flash(t) { setMsg(t); setTimeout(() => setMsg(''), 2500); }
  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function save() {
    if (editingId) {
      await updateDoc(doc(db, 'achievements', editingId), form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'achievements'), form);
      setAdding(false);
    }
    setForm(EMPTY);
    flash('Saved.');
  }

  async function remove(id) {
    if (!window.confirm('Delete this achievement?')) return;
    await deleteDoc(doc(db, 'achievements', id));
    flash('Deleted.');
  }

  function startEdit(a) {
    setForm({ ...EMPTY, ...a });
    setEditingId(a.id);
    setAdding(false);
  }

  if (loading) return <p style={{ color: 'var(--text-tertiary)' }}>Loading…</p>;

  return (
    <div>
      <h2 className="editor-heading">Achievements</h2>
      {msg && <div className="success-msg">{msg}</div>}

      {(achievements || []).map(a => (
        <div key={a.id} className="admin-list-item">
          <div style={{ flex: 1 }}>
            <p className="admin-list-item-title">{a.title}</p>
            <p className="admin-list-item-meta">{a.result} · {a.org} · {a.date}</p>
          </div>
          <div className="admin-item-actions">
            <button className="btn btn-outline btn-sm" onClick={() => startEdit(a)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(a.id)}>Delete</button>
          </div>
        </div>
      ))}

      {(adding || editingId) && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={e => update('title', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organisation</label>
              <input className="form-input" value={form.org} onChange={e => update('org', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Result / Badge</label>
              <input className="form-input" value={form.result} onChange={e => update('result', e.target.value)} placeholder="Hackathon Finalist" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" value={form.date} onChange={e => update('date', e.target.value)} placeholder="2025" />
            </div>
            <div className="form-group">
              <label className="form-label">Order</label>
              <input className="form-input" type="number" value={form.order} onChange={e => update('order', Number(e.target.value))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-gold btn-sm" onClick={save}>Save</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setAdding(false); setEditingId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {!adding && !editingId && (
        <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => { setForm(EMPTY); setAdding(true); }}>
          + Add Achievement
        </button>
      )}
    </div>
  );
}
