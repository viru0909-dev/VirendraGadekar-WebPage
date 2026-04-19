// src/admin/editors/OpenSourceEditor.jsx
import { useState } from 'react';
import {
  doc, addDoc, updateDoc, deleteDoc, collection,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCollection, orderBy } from '../../hooks/useFirestore';

const EMPTY = {
  repo: '', pr_number: '', pr_url: '', description: '',
  tags: [], merged: true, date: '', order: 99,
};

export default function OpenSourceEditor() {
  const { data: contributions, loading } = useCollection('opensource', [orderBy('order')]);
  const [editingId, setEditingId] = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [adding,    setAdding]    = useState(false);
  const [msg,       setMsg]       = useState('');

  function flash(t) { setMsg(t); setTimeout(() => setMsg(''), 2500); }

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function save() {
    if (editingId) {
      await updateDoc(doc(db, 'opensource', editingId), form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'opensource'), form);
      setAdding(false);
    }
    setForm(EMPTY);
    flash('Saved.');
  }

  async function remove(id) {
    if (!window.confirm('Delete this contribution?')) return;
    await deleteDoc(doc(db, 'opensource', id));
    flash('Deleted.');
  }

  function startEdit(c) {
    setForm({ ...EMPTY, ...c, tags: c.tags || [] });
    setEditingId(c.id);
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
      <h2 className="editor-heading">Open Source Contributions</h2>
      {msg && <div className="success-msg">{msg}</div>}

      {/* List */}
      {(contributions || []).map(c => (
        <div key={c.id} className="admin-list-item">
          <div style={{ flex: 1 }}>
            <p className="admin-list-item-title">{c.repo}</p>
            <p className="admin-list-item-meta">{c.pr_number} · {c.merged ? 'Merged' : 'Open'} · {c.date}</p>
          </div>
          <div className="admin-item-actions">
            <button className="btn btn-outline btn-sm" onClick={() => startEdit(c)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Form */}
      {(adding || editingId) && <ContributionForm form={form} update={update} onSave={save} onCancel={() => { setAdding(false); setEditingId(null); }} />}

      {!adding && !editingId && (
        <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={startAdd}>
          + Add Contribution
        </button>
      )}
    </div>
  );
}

function ContributionForm({ form, update, onSave, onCancel }) {
  return (
    <div className="card" style={{ marginTop: '16px' }}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Repository</label>
          <input className="form-input" value={form.repo} onChange={e => update('repo', e.target.value)} placeholder="org/repo-name" />
        </div>
        <div className="form-group">
          <label className="form-label">PR Number</label>
          <input className="form-input" value={form.pr_number} onChange={e => update('pr_number', e.target.value)} placeholder="PR #1428" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">PR URL</label>
        <input className="form-input" value={form.pr_url} onChange={e => update('pr_url', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={form.description} onChange={e => update('description', e.target.value)} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input className="form-input"
            value={form.tags.join(', ')}
            onChange={e => update('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Date (YYYY-MM)</label>
          <input className="form-input" value={form.date} onChange={e => update('date', e.target.value)} placeholder="2025-11" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Order</label>
          <input className="form-input" type="number" value={form.order} onChange={e => update('order', Number(e.target.value))} />
        </div>
        <div className="form-group" style={{ paddingTop: '28px' }}>
          <label className="form-toggle">
            <span className="toggle-switch">
              <input type="checkbox" checked={form.merged} onChange={e => update('merged', e.target.checked)} />
              <span className="toggle-slider" />
            </span>
            Merged
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-gold btn-sm" onClick={onSave}>Save</button>
        <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
