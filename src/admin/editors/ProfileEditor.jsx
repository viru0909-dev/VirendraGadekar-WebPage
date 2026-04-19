// src/admin/editors/ProfileEditor.jsx
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useDocument } from '../../hooks/useFirestore';

const DEFAULT = {
  name: 'Virendra Gadekar',
  tagline: 'Open source by conviction, full stack by craft',
  bio: '',
  photo_url: '',
  email: '',
  phone: '',
  location: 'Pune, Maharashtra',
  github: 'https://github.com/viru0909-dev',
  linkedin: 'https://www.linkedin.com/in/virendragadekar/',
  resume_url: '',
  education: [
    {
      institution: 'Dr. D.Y. Patil School of Science and Technology',
      degree: 'Bachelor of Computer Applications (BCA)',
      year_range: '2024 – 2027',
      semesters: [
        { sem: 'Semester 1', cgpa: '9.27' },
        { sem: 'Semester 2', cgpa: '8.91' },
        { sem: 'Semester 3', cgpa: '9.27' },
      ],
      overall_cgpa: '9.09',
    },
  ],
};

export default function ProfileEditor() {
  const { data, loading } = useDocument('profile', 'main');
  const [form,    setForm]    = useState(DEFAULT);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data) setForm({ ...DEFAULT, ...data });
  }, [data]);

  function update(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function updateEdu(field, value) {
    setForm(f => ({
      ...f,
      education: [{ ...f.education[0], [field]: value }],
    }));
  }

  function updateSemester(idx, field, value) {
    const sems = [...form.education[0].semesters];
    sems[idx] = { ...sems[idx], [field]: value };
    updateEdu('semesters', sems);
  }

  function addSemester() {
    const sems = [...form.education[0].semesters, { sem: `Semester ${form.education[0].semesters.length + 1}`, cgpa: '' }];
    updateEdu('semesters', sems);
  }

  function removeSemester(idx) {
    const sems = form.education[0].semesters.filter((_, i) => i !== idx);
    updateEdu('semesters', sems);
  }

  async function uploadFile(file, path) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, `profile/photo_${Date.now()}_${file.name}`);
      update('photo_url', url);
    } catch (err) {
      setError('Photo upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, `profile/resume_${Date.now()}_${file.name}`);
      update('resume_url', url);
    } catch (err) {
      setError('Resume upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');
    try {
      await setDoc(doc(db, 'profile', 'main'), form);
      setMsg('Profile saved successfully.');
    } catch (err) {
      setError('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ color: 'var(--text-tertiary)' }}>Loading profile…</p>;

  const edu = form.education[0] || {};

  return (
    <form onSubmit={handleSave}>
      <h2 className="editor-heading">Edit Profile</h2>
      {error && <div className="error-msg">{error}</div>}
      {msg   && <div className="success-msg">{msg}</div>}

      {/* Basic info */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" value={form.name} onChange={e => update('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" value={form.location} onChange={e => update('location', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tagline</label>
        <input className="form-input" value={form.tagline} onChange={e => update('tagline', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Bio</label>
        <textarea className="form-textarea" rows={5} value={form.bio} onChange={e => update('bio', e.target.value)} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={form.phone} onChange={e => update('phone', e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">GitHub URL</label>
          <input className="form-input" value={form.github} onChange={e => update('github', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">LinkedIn URL</label>
          <input className="form-input" value={form.linkedin} onChange={e => update('linkedin', e.target.value)} />
        </div>
      </div>

      {/* Photo upload */}
      <div className="form-group">
        <label className="form-label">Profile Photo</label>
        {form.photo_url && (
          <img src={form.photo_url} alt="Profile" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '2px solid var(--border-accent)' }} />
        )}
        <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ color: 'var(--text-secondary)', fontSize: '14px' }} />
        {uploading && <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '6px' }}>Uploading…</p>}
      </div>

      {/* Resume upload */}
      <div className="form-group">
        <label className="form-label">Resume (PDF)</label>
        {form.resume_url && (
          <a href={form.resume_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-amber)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Current résumé ↗
          </a>
        )}
        <input type="file" accept=".pdf" onChange={handleResumeUpload} style={{ color: 'var(--text-secondary)', fontSize: '14px' }} />
      </div>

      <div className="divider" />

      {/* Education */}
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px' }}>
        Education
      </h3>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Institution</label>
          <input className="form-input" value={edu.institution || ''} onChange={e => updateEdu('institution', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Degree</label>
          <input className="form-input" value={edu.degree || ''} onChange={e => updateEdu('degree', e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Year Range</label>
          <input className="form-input" value={edu.year_range || ''} onChange={e => updateEdu('year_range', e.target.value)} placeholder="2024 – 2027" />
        </div>
        <div className="form-group">
          <label className="form-label">Overall CGPA</label>
          <input className="form-input" value={edu.overall_cgpa || ''} onChange={e => updateEdu('overall_cgpa', e.target.value)} />
        </div>
      </div>

      {/* Semesters */}
      <p className="form-label" style={{ marginBottom: '12px' }}>Semesters</p>
      {(edu.semesters || []).map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
          <input className="form-input" style={{ flex: 2 }} value={s.sem} onChange={e => updateSemester(i, 'sem', e.target.value)} placeholder="Semester name" />
          <input className="form-input" style={{ flex: 1 }} value={s.cgpa} onChange={e => updateSemester(i, 'cgpa', e.target.value)} placeholder="CGPA" />
          <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSemester(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={addSemester} style={{ marginBottom: '24px' }}>
        + Add Semester
      </button>

      <div className="divider" />

      <button type="submit" className="btn btn-gold" disabled={saving || uploading} style={{ opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  );
}
