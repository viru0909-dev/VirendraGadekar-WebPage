// src/admin/editors/SkillsEditor.jsx
import { useState } from 'react';
import {
  doc, setDoc, deleteDoc, collection, addDoc, updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCollection, orderBy } from '../../hooks/useFirestore';

export default function SkillsEditor() {
  const { data: categories, loading } = useCollection('skills', [orderBy('order')]);
  const [editingId,  setEditingId]  = useState(null);
  const [editForm,   setEditForm]   = useState(null);
  const [adding,     setAdding]     = useState(false);
  const [addForm,    setAddForm]    = useState({ category: '', order: 99, items: [] });
  const [newSkill,   setNewSkill]   = useState('');
  const [msg,        setMsg]        = useState('');

  function flash(text) {
    setMsg(text);
    setTimeout(() => setMsg(''), 2500);
  }

  /* ── Save existing category ── */
  async function saveCategory(id) {
    await updateDoc(doc(db, 'skills', id), editForm);
    setEditingId(null);
    flash('Category saved.');
  }

  /* ── Add new category ── */
  async function addCategory() {
    if (!addForm.category.trim()) return;
    await addDoc(collection(db, 'skills'), addForm);
    setAdding(false);
    setAddForm({ category: '', order: 99, items: [] });
    flash('Category added.');
  }

  /* ── Delete category ── */
  async function deleteCategory(id) {
    if (!window.confirm('Delete this skill category?')) return;
    await deleteDoc(doc(db, 'skills', id));
    flash('Category deleted.');
  }

  /* ── Order shift ── */
  async function shiftOrder(cat, direction) {
    const cats = [...(categories || [])].sort((a, b) => a.order - b.order);
    const idx = cats.findIndex(c => c.id === cat.id);
    const target = cats[idx + direction];
    if (!target) return;
    await updateDoc(doc(db, 'skills', cat.id),    { order: target.order });
    await updateDoc(doc(db, 'skills', target.id), { order: cat.order });
  }

  if (loading) return <p style={{ color: 'var(--text-tertiary)' }}>Loading skills…</p>;

  return (
    <div>
      <h2 className="editor-heading">Manage Skills</h2>
      {msg && <div className="success-msg">{msg}</div>}

      {(categories || []).map(cat => (
        <div key={cat.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          {editingId === cat.id ? (
            <div>
              <div className="form-row" style={{ marginBottom: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category Name</label>
                  <input className="form-input" value={editForm.category}
                    onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Order</label>
                  <input className="form-input" type="number" value={editForm.order}
                    onChange={e => setEditForm(f => ({ ...f, order: Number(e.target.value) }))} />
                </div>
              </div>

              {/* Skills inline edit */}
              <p className="form-label">Skills (click × to remove)</p>
              <div className="pill-row" style={{ marginBottom: '12px' }}>
                {(editForm.items || []).map(skill => (
                  <span key={skill} className="pill" style={{ cursor: 'pointer' }}
                    onClick={() => setEditForm(f => ({ ...f, items: f.items.filter(s => s !== skill) }))}>
                    {skill} ×
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input className="form-input" placeholder="Add skill" value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSkill.trim() && !editForm.items.includes(newSkill.trim())) {
                        setEditForm(f => ({ ...f, items: [...f.items, newSkill.trim()] }));
                        setNewSkill('');
                      }
                    }
                  }}
                />
                <button type="button" className="btn btn-outline btn-sm" onClick={() => {
                  if (newSkill.trim() && !editForm.items.includes(newSkill.trim())) {
                    setEditForm(f => ({ ...f, items: [...f.items, newSkill.trim()] }));
                    setNewSkill('');
                  }
                }}>
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-gold btn-sm" onClick={() => saveCategory(cat.id)}>Save</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="admin-list-item-title">{cat.category}</span>
                <div className="admin-item-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => shiftOrder(cat, -1)}>↑</button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => shiftOrder(cat, 1)}>↓</button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditingId(cat.id); setEditForm({ ...cat }); setNewSkill(''); }}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteCategory(cat.id)}>Delete</button>
                </div>
              </div>
              <div className="pill-row" style={{ marginTop: 0 }}>
                {(cat.items || []).map(s => <span key={s} className="pill">{s}</span>)}
              </div>
            </>
          )}
        </div>
      ))}

      {/* ── Add new category ── */}
      {adding ? (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input className="form-input" value={addForm.category}
                onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Order</label>
              <input className="form-input" type="number" value={addForm.order}
                onChange={e => setAddForm(f => ({ ...f, order: Number(e.target.value) }))} />
            </div>
          </div>
          <p className="form-label">Skills (comma-separated)</p>
          <input className="form-input" placeholder="Java, Spring Boot, React"
            onChange={e => setAddForm(f => ({ ...f, items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-gold btn-sm" onClick={addCategory}>Add Category</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => setAdding(true)}>
          + Add Category
        </button>
      )}
    </div>
  );
}
