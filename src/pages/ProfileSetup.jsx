import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Github, MapPin, User, Code, Briefcase, GraduationCap,
  Plus, X, ChevronRight, ChevronLeft, Check, Loader2, ExternalLink,
  Star, Link as LinkIcon, Image
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';

const API = import.meta.env.VITE_API_URL || 'https://devtinder-1-euv2.onrender.com';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const STEPS = [
  { id: 0, label: 'Photos', icon: Image },
  { id: 1, label: 'About', icon: User },
  { id: 2, label: 'GitHub', icon: Github },
  { id: 3, label: 'Skills', icon: Code },
  { id: 4, label: 'Experience', icon: Briefcase },
  { id: 5, label: 'Education', icon: GraduationCap },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, transition: { duration: 0.2 } }),
};

// ─── Image Upload Component ───────────────────────────────────────────
function ImageField({ label, bucket, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();

  const uploadFile = async (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, or WebP images allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { alert('Max file size is 5MB.'); return; }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      onChange(urlData.publicUrl);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const applyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <div className="flex gap-2 text-xs">
          <button type="button" onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${mode === 'upload' ? 'border-primary text-primary bg-primary/10' : 'border-border text-text-secondary'}`}>
            Upload
          </button>
          <button type="button" onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${mode === 'url' ? 'border-primary text-primary bg-primary/10' : 'border-border text-text-secondary'}`}>
            URL
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="input-field flex-1 text-sm" />
          <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={applyUrl}
            className="px-4 bg-primary/10 border border-primary/30 text-primary rounded-2xl text-sm font-semibold hover:bg-primary/20 transition-colors">
            Set
          </motion.button>
        </div>
      ) : (
        <motion.div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => { e.preventDefault(); setIsDragging(false); uploadFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          animate={{ borderColor: isDragging ? '#6366f1' : '#ffffff20', scale: isDragging ? 1.02 : 1 }}
          className="border-2 border-dashed rounded-2xl p-5 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[120px] bg-background/50 hover:border-primary/50 transition-colors overflow-hidden"
        >
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={e => uploadFile(e.target.files[0])} />
          {uploading ? (
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          ) : value ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
              <img src={value} alt="preview" className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/40" />
              <p className="text-xs text-green-400 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Uploaded</p>
            </motion.div>
          ) : (
            <>
              <Upload className="w-7 h-7 text-text-secondary" />
              <p className="text-sm font-medium text-text-primary text-center">Drag & drop or click</p>
              <p className="text-xs text-text-secondary">JPG, PNG, WebP · max 5MB</p>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Skills Input ─────────────────────────────────────────────────────
function SkillInput({ skills, onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    const s = input.trim();
    if (s && !skills.includes(s)) onChange([...skills, s]);
    setInput('');
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          className="input-field flex-1" placeholder="e.g. React, TypeScript" />
        <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={add}
          className="px-4 bg-primary/10 border border-primary/30 text-primary rounded-2xl text-sm font-semibold hover:bg-primary/20 transition-colors">
          Add
        </motion.button>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {skills.map(s => (
            <motion.span key={s} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-xl text-sm font-medium">
              {s}
              <button type="button" onClick={() => onChange(skills.filter(x => x !== s))} className="hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Experience Form ──────────────────────────────────────────────────
function ExperienceForm({ items, onChange }) {
  const blank = { role: '', company: '', duration: '', description: '' };
  const update = (i, field, val) => { const u = [...items]; u[i] = { ...u[i], [field]: val }; onChange(u); };
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.div key={i} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-background/60 border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">Experience {i + 1}</p>
              {items.length > 1 && (
                <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="text-text-secondary hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={item.role} onChange={e => update(i, 'role', e.target.value)} placeholder="Role / Title" className="input-field" />
              <input value={item.company} onChange={e => update(i, 'company', e.target.value)} placeholder="Company" className="input-field" />
              <input value={item.duration} onChange={e => update(i, 'duration', e.target.value)} placeholder="2022 – 2024" className="input-field col-span-2" />
            </div>
            <textarea value={item.description} onChange={e => update(i, 'description', e.target.value)}
              placeholder="Brief description..." rows={2} className="input-field w-full resize-none" />
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => onChange([...items, { ...blank }])}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl py-3 text-text-secondary hover:border-primary/50 hover:text-primary transition-all text-sm font-medium">
        <Plus className="w-4 h-4" /> Add Experience
      </motion.button>
    </div>
  );
}

// ─── Education Form ───────────────────────────────────────────────────
function EducationForm({ items, onChange }) {
  const blank = { degree: '', college_name: '', graduation_year: '', grade: '' };
  const update = (i, field, val) => { const u = [...items]; u[i] = { ...u[i], [field]: val }; onChange(u); };
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.div key={i} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-background/60 border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">Education {i + 1}</p>
              {items.length > 1 && (
                <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="text-text-secondary hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={item.degree} onChange={e => update(i, 'degree', e.target.value)} placeholder="Degree" className="input-field" />
              <input value={item.college_name} onChange={e => update(i, 'college_name', e.target.value)} placeholder="College / University" className="input-field" />
              <input value={item.graduation_year} onChange={e => update(i, 'graduation_year', e.target.value)} placeholder="Graduation Year" type="number" className="input-field" />
              <input value={item.grade} onChange={e => update(i, 'grade', e.target.value)} placeholder="Grade / CGPA" className="input-field" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => onChange([...items, { ...blank }])}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl py-3 text-text-secondary hover:border-primary/50 hover:text-primary transition-all text-sm font-medium">
        <Plus className="w-4 h-4" /> Add Education
      </motion.button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function ProfileSetup() {
  const { user, dbUser, getToken } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('info');

  const [profileImage, setProfileImage] = useState(dbUser?.profile_image_url || '');
  const [bgImage, setBgImage] = useState(dbUser?.background_image_url || '');
  const [bio, setBio] = useState(dbUser?.bio || '');
  const [address, setAddress] = useState(dbUser?.address || '');
  const [fullName, setFullName] = useState(dbUser?.full_name || user?.displayName || '');
  const [githubUrl, setGithubUrl] = useState(dbUser?.github_url || '');
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [skills, setSkills] = useState(dbUser?.skills || []);
  const [experience, setExperience] = useState(dbUser?.experience?.length ? dbUser.experience : [{ role: '', company: '', duration: '', description: '' }]);
  const [education, setEducation] = useState(dbUser?.education?.length ? dbUser.education : [{ degree: '', college_name: '', graduation_year: '', grade: '' }]);

  const showToast = (msg, type = 'info') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 3500);
  };

  const wordCount = bio.trim().split(/\s+/).filter(Boolean).length;

  const fetchGithubRepos = async () => {
    if (!githubUrl) { showToast('Enter your GitHub URL first', 'error'); return; }
    const username = githubUrl.split('/').filter(Boolean).pop();
    setGithubLoading(true);
    try {
      const res = await axios.get(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`);
      setGithubRepos(res.data);
      showToast(`Loaded ${res.data.length} repositories!`, 'success');
    } catch {
      showToast('Could not fetch GitHub repos', 'error');
    } finally {
      setGithubLoading(false);
    }
  };

  const goNext = () => {
    if (step === 1 && wordCount < 20) { showToast('Bio needs at least 20 words', 'error'); return; }
    if (step === 2 && !githubUrl) { showToast('GitHub URL is required', 'error'); return; }
    if (step < STEPS.length - 1) { setDirection(1); setStep(s => s + 1); }
  };
  const goBack = () => { if (step > 0) { setDirection(-1); setStep(s => s - 1); } };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      const payload = {
        full_name: fullName,
        bio,
        address,
        github_url: githubUrl,
        profile_image_url: profileImage || null,
        background_image_url: bgImage || null,
        skills,
        experience: experience.filter(e => e.role && e.company),
        education: education.filter(e => e.degree && e.college_name),
      };

      const res = await axios.post(`${API}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.success) throw new Error('Save failed');

      showToast('Profile saved! 🎉', 'success');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const stepContent = [
    // Step 0: Photos
    <div className="space-y-5">
      <ImageField label="Profile Photo" bucket="profile-images" value={profileImage} onChange={setProfileImage} />
      <ImageField label="Background / Banner" bucket="background-images" value={bgImage} onChange={setBgImage} />
    </div>,

    // Step 1: About
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-text-primary mb-1.5 block">Full Name</label>
        <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className="input-field w-full" />
      </div>
      <div>
        <label className="text-sm font-medium text-text-primary mb-1.5 block">Location</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-3 w-4 h-4 text-text-secondary" />
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="City, Country" className="input-field w-full pl-11" />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-text-primary">Bio *</label>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${wordCount >= 20 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {wordCount}/20 words
          </span>
        </div>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={5}
          placeholder="Tell developers who you are, what you build, and what you're looking for..."
          className="input-field w-full resize-none text-sm leading-relaxed" />
      </div>
    </div>,

    // Step 2: GitHub
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-text-primary mb-1.5 block">GitHub URL *</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Github className="absolute left-4 top-3 w-4 h-4 text-text-secondary" />
            <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/username" className="input-field w-full pl-11" />
          </div>
          <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={fetchGithubRepos} disabled={githubLoading}
            className="px-4 bg-primary/10 border border-primary/30 text-primary rounded-2xl text-sm font-semibold hover:bg-primary/20 transition-colors flex items-center gap-2">
            {githubLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />} Fetch
          </motion.button>
        </div>
      </div>
      {githubRepos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-sm font-medium text-text-primary">Top Repositories</p>
          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
            {githubRepos.map((repo, i) => (
              <motion.a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between bg-background border border-border rounded-xl px-4 py-2.5 hover:border-primary/40 transition-all group">
                <span className="text-sm font-medium text-text-primary truncate">{repo.name}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs text-text-secondary"><Star className="w-3 h-3" />{repo.stargazers_count}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </div>,

    // Step 3: Skills
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">Add your technical skills. Press Enter or comma to add.</p>
      <SkillInput skills={skills} onChange={setSkills} />
    </div>,

    // Step 4: Experience
    <ExperienceForm items={experience} onChange={setExperience} />,

    // Step 5: Education
    <EducationForm items={education} onChange={setEducation} />,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Set Up Your Profile</h1>
          <p className="text-text-secondary mt-2 text-sm">Stand out to the DevTinder community</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0" />
          <motion.div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-accent to-primary z-0"
            animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} transition={{ duration: 0.4 }} />
          {STEPS.map(s => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1 z-10">
                <motion.div animate={{
                  backgroundColor: done || active ? '#6366f1' : '#1e1e2e',
                  borderColor: done || active ? '#6366f1' : '#ffffff15',
                  scale: active ? 1.15 : 1,
                }} className="w-10 h-10 rounded-full border-2 flex items-center justify-center">
                  {done ? <Check className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-text-secondary'}`} />}
                </motion.div>
                <p className={`text-xs font-medium ${active ? 'text-primary' : 'text-text-secondary'}`}>{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-2xl overflow-hidden min-h-[300px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
                {React.createElement(STEPS[step].icon, { className: 'w-5 h-5 text-primary' })}
                {STEPS[step].label}
              </h2>
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between mt-6">
          <motion.button whileHover={{ scale: step > 0 ? 1.02 : 1 }} whileTap={{ scale: step > 0 ? 0.97 : 1 }}
            onClick={goBack} disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border text-text-secondary hover:text-text-primary hover:border-primary/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm">
            <ChevronLeft className="w-4 h-4" /> Back
          </motion.button>
          {step < STEPS.length - 1 ? (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={goNext}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent to-primary text-white font-bold shadow-lg shadow-primary/20 transition-all text-sm">
              Next <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent to-primary text-white font-bold shadow-lg shadow-primary/20 transition-all text-sm disabled:opacity-80">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </motion.button>
          )}
        </div>

        <p className="text-center text-xs text-text-secondary mt-4">
          <button onClick={() => navigate('/profile')} className="hover:text-primary transition-colors underline underline-offset-2">
            Skip for now
          </button>
        </p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 border rounded-2xl px-6 py-3 shadow-2xl text-sm font-semibold z-50 ${
              toastType === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : toastType === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-surface border-border text-text-primary'
            }`}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
