import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Github, MapPin, Code2, Briefcase, GraduationCap,
  Edit3, ExternalLink, Loader2, Star, Share2, ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://devtinder-1-euv2.onrender.com';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

function SkeletonProfile() {
  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-5 animate-pulse">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="h-44 bg-border/40" />
        <div className="px-6 pb-6">
          <div className="w-28 h-28 rounded-full -mt-14 bg-border/40 border-4 border-surface" />
          <div className="mt-4 space-y-2">
            <div className="h-7 w-48 bg-border/40 rounded-xl" />
            <div className="h-4 w-32 bg-border/40 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-surface border border-border rounded-2xl p-6 h-40 bg-border/20" />
        <div className="bg-surface border border-border rounded-2xl p-6 h-40 bg-border/20" />
      </div>
    </div>
  );
}

export default function Profile() {
  const { uid } = useParams();                  // present when viewing someone else
  const { user, dbUser, getToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = !uid || uid === user?.uid;

  const [developer, setDeveloper] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const endpoint = isOwnProfile ? `${API}/api/profile` : `${API}/api/profile/${uid}`;
        const res = await axios.get(endpoint, { headers });
        const dev = isOwnProfile ? res.data.developer : res.data.developer;
        setDeveloper(dev);

        if (dev?.github_url) {
          const username = dev.github_url.split('/').filter(Boolean).pop();
          try {
            const repoRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`);
            setRepos(repoRes.data);
          } catch { /* silently fail */ }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [uid]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <SkeletonProfile />;

  if (!developer && isOwnProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-5">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
          <Edit3 className="w-9 h-9 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Profile Not Set Up</h2>
          <p className="text-text-secondary mt-2 text-sm">Complete your profile to appear in the developer feed.</p>
        </div>
        <Link to="/profile-setup">
          <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 cursor-pointer">
            Set Up Profile
          </motion.span>
        </Link>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Developer Not Found</h2>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  const displayName = developer.full_name || 'Developer';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const skills = Array.isArray(developer.skills) ? developer.skills : [];
  const experience = Array.isArray(developer.experience) ? developer.experience : [];
  const education = Array.isArray(developer.education) ? developer.education : [];

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto pb-16 space-y-5">

      {/* Back button for public profiles */}
      {!isOwnProfile && (
        <motion.button variants={sectionVariants} onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </motion.button>
      )}

      {/* Header Card */}
      <motion.div variants={sectionVariants} className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-44 relative overflow-hidden">
          {developer.background_image_url
            ? <img src={developer.background_image_url} alt="banner" className="w-full h-full object-cover" loading="lazy" />
            : <div className="w-full h-full bg-gradient-to-br from-accent/70 to-primary/70" />
          }
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleShare}
            className="absolute top-4 right-4 bg-background/50 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:bg-background/80 transition-colors" title="Copy link">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          </motion.button>
        </div>

        <div className="px-6 pb-6 relative">
          {/* Avatar */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-28 h-28 rounded-full -mt-14 border-4 border-surface shadow-lg overflow-hidden bg-zinc-800 flex items-center justify-center text-3xl font-bold text-primary">
            {developer.profile_image_url
              ? <img src={developer.profile_image_url} alt={displayName} className="w-full h-full object-cover" loading="lazy" />
              : initials
            }
          </motion.div>

          <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{displayName}</h1>
              {developer.address && (
                <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {developer.address}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              {isOwnProfile && (
                <Link to="/profile-setup">
                  <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary px-5 py-2 rounded-2xl font-semibold text-sm hover:bg-primary/20 transition-colors cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </motion.span>
                </Link>
              )}
              {developer.github_url && (
                <a href={developer.github_url} target="_blank" rel="noreferrer">
                  <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center w-9 h-9 bg-background border border-border rounded-2xl hover:border-primary/40 transition-colors cursor-pointer">
                    <Github className="w-4 h-4 text-text-secondary" />
                  </motion.span>
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-5 border-t border-border flex gap-8">
            <div>
              <span className="block font-bold text-lg text-text-primary">{skills.length}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Skills</span>
            </div>
            <div>
              <span className="block font-bold text-lg text-text-primary">{repos.length}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Repositories</span>
            </div>
            <div>
              <span className="block font-bold text-lg text-text-primary">{experience.length}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Roles</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">

          {/* Bio */}
          {developer.bio && (
            <motion.div variants={sectionVariants} className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary mb-3">About</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{developer.bio}</p>
            </motion.div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <motion.div variants={sectionVariants} className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Experience
              </h2>
              <div className="space-y-5">
                {experience.filter(e => e.role).map((exp, i) => (
                  <motion.div key={i} whileHover={{ x: 4 }} className="flex gap-4 cursor-default">
                    <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center font-bold text-primary flex-shrink-0 text-sm">
                      {exp.company?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm">{exp.role}</h3>
                      <p className="text-xs text-text-secondary">{exp.company}</p>
                      {exp.duration && <p className="text-xs text-text-secondary/60 mt-0.5">{exp.duration}</p>}
                      {exp.description && <p className="text-xs text-text-secondary mt-2 leading-relaxed">{exp.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* GitHub Repos */}
          {repos.length > 0 && (
            <motion.div variants={sectionVariants} className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                <Github className="w-4 h-4 text-primary" /> Repositories
              </h2>
              <div className="space-y-2">
                {repos.map(repo => (
                  <motion.a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.01, x: 3 }}
                    className="flex items-center justify-between bg-background border border-border rounded-xl px-4 py-3 hover:border-primary/40 transition-all group">
                    <div className="flex items-center gap-2 min-w-0">
                      <Code2 className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                      <span className="text-sm font-medium text-text-primary truncate">{repo.name}</span>
                      {repo.language && (
                        <span className="hidden sm:block text-xs text-text-secondary/60 bg-background border border-border px-2 py-0.5 rounded-full">{repo.language}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs text-text-secondary"><Star className="w-3 h-3" />{repo.stargazers_count}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary transition-colors" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Skills */}
          {skills.length > 0 && (
            <motion.div variants={sectionVariants} className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" /> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <motion.span key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.08 }}
                    className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-medium text-text-primary hover:border-primary/50 hover:text-primary transition-colors cursor-default">
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <motion.div variants={sectionVariants} className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" /> Education
              </h2>
              <div className="space-y-4">
                {education.filter(e => e.degree).map((edu, i) => (
                  <motion.div key={i} whileHover={{ x: 4 }} className="flex gap-3 cursor-default">
                    <div className="w-9 h-9 bg-background border border-border rounded-xl flex items-center justify-center font-bold text-primary flex-shrink-0 text-sm">
                      {edu.college_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">{edu.college_name}</h3>
                      <p className="text-xs text-text-secondary">{edu.degree}</p>
                      <p className="text-xs text-text-secondary/60 mt-0.5">
                        {edu.graduation_year}{edu.grade ? ` · ${edu.grade}` : ''}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
