import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Share2, Users, Loader2, Code2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://devtinder-1-euv2.onrender.com';

// One curated sample post shown as community starter
const SAMPLE_POST = {
  id: 'sample',
  content: `Just shipped a new feature using Supabase + Firebase 🔥\n\nThe combination of Firebase Auth for identity and Supabase for relational data is genuinely underrated. Instant auth flows, real PostgreSQL queries, and a great developer experience across both.\n\nWhat's your current stack of choice? 👇\n\n#buildinpublic #supabase #firebase #devtinder`,
  likes: 24,
  comments: 7,
  isLiked: false,
  createdAt: '2h ago',
  user: {
    full_name: 'DevTinder Team',
    profile_image_url: null,
    bio: 'Building the future of developer networking',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

function Avatar({ dev, size = 'md' }) {
  const name = dev?.full_name || 'Dev';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const cls = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div className={`${cls} rounded-full overflow-hidden border border-border bg-zinc-800 flex items-center justify-center font-bold text-primary flex-shrink-0`}>
      {dev?.profile_image_url
        ? <img src={dev.profile_image_url} alt={name} className="w-full h-full object-cover" loading="lazy" />
        : initials
      }
    </div>
  );
}

function PostCard({ post, currentUser, currentDev }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const toggleLike = () => {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  const isOwn = post.id === 'sample';
  const dev = post.user;
  const name = dev?.full_name || 'Developer';
  const time = post.createdAt || new Date(post.created_at || Date.now()).toLocaleDateString();

  return (
    <motion.div variants={itemVariants}
      className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:border-border/80 transition-colors">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <button onClick={() => !isOwn && dev?.firebase_uid && navigate(`/profile/${dev.firebase_uid}`)}>
          <Avatar dev={dev} />
        </button>
        <div className="flex-1 min-w-0">
          <button
            onClick={() => !isOwn && dev?.firebase_uid && navigate(`/profile/${dev.firebase_uid}`)}
            className="font-bold text-text-primary text-sm hover:text-primary transition-colors">
            {name}
          </button>
          {dev?.bio && <p className="text-xs text-text-secondary truncate">{dev.bio.slice(0, 60)}</p>}
          <p className="text-xs text-text-secondary/60 mt-0.5">{time}</p>
        </div>
        {isOwn && (
          <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full font-medium">
            Pinned
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-5 border-t border-border pt-3 text-text-secondary">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors group ${liked ? 'text-primary' : 'hover:text-primary'}`}>
          <div className={`p-1.5 rounded-full transition-colors ${liked ? 'bg-primary/15' : 'group-hover:bg-primary/10'}`}>
            <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-primary text-primary' : ''}`} />
          </div>
          <span className="font-medium">{likeCount}</span>
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setShowComments(s => !s)}
          className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="font-medium">{post.comments}</span>
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex items-center gap-1.5 text-sm hover:text-green-400 transition-colors group ml-auto">
          <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
            <Share2 className="w-4 h-4" />
          </div>
        </motion.button>
      </div>

      {/* Comment Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 pt-4 border-t border-border flex gap-2">
              <Avatar dev={currentDev} size="sm" />
              <input value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-background border border-border rounded-full px-4 py-1.5 text-sm outline-none focus:border-primary transition-colors text-text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ConnectionMember({ conn, onClick }) {
  const dev = conn.partner;
  const name = dev?.full_name || 'Developer';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 bg-background border border-border rounded-2xl hover:border-primary/40 transition-all text-center group w-full">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-zinc-800 flex items-center justify-center font-bold text-primary text-sm">
        {dev?.profile_image_url
          ? <img src={dev.profile_image_url} alt={name} className="w-full h-full object-cover" />
          : initials
        }
      </div>
      <div className="min-w-0 w-full">
        <p className="font-semibold text-text-primary text-xs truncate group-hover:text-primary transition-colors">{name.split(' ')[0]}</p>
        <p className="text-xs text-text-secondary truncate">{dev?.bio?.slice(0, 20) || 'Developer'}…</p>
      </div>
    </motion.button>
  );
}

export default function Community() {
  const { getToken, isAuthenticated, user, dbUser } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [focused, setFocused] = useState(false);
  const [posts, setPosts] = useState([SAMPLE_POST]);

  useEffect(() => {
    const fetchMyCommunity = async () => {
      if (!isAuthenticated) { setLoading(false); return; }
      try {
        const token = await getToken();
        const res = await axios.get(`${API}/api/connections`, { headers: { Authorization: `Bearer ${token}` } });
        setConnections(res.data.connections || []);
      } catch (err) {
        console.error('Community fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCommunity();
  }, [isAuthenticated]);

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const p = {
      id: Date.now(),
      content: newPost,
      likes: 0, comments: 0, isLiked: false, createdAt: 'Just now',
      user: { full_name: dbUser?.full_name || user?.displayName || 'You', profile_image_url: dbUser?.profile_image_url, bio: dbUser?.bio || '' },
    };
    setPosts([p, ...posts]);
    setNewPost('');
    setFocused(false);
  };

  const currentDev = dbUser || { full_name: user?.displayName, profile_image_url: user?.photoURL };
  const displayName = dbUser?.full_name || user?.displayName || 'You';
  const userInitials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="max-w-2xl mx-auto space-y-5 pb-12 w-full pt-4 relative z-10">

      {/* Community Members Panel */}
      {isAuthenticated && (
        <motion.div variants={itemVariants} className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-text-primary text-sm">
              Your Network
              {connections.length > 0 && (
                <span className="ml-2 text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {connections.length}
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-3"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
          ) : connections.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-text-secondary text-xs">No connections yet.</p>
              <button onClick={() => navigate('/feed')} className="text-xs text-primary hover:underline mt-1">
                Discover developers →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {connections.map(conn => (
                <ConnectionMember
                  key={conn.connectionId}
                  conn={conn}
                  onClick={() => navigate(`/profile/${conn.partner.firebase_uid}`)}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Create Post */}
      {isAuthenticated && (
        <motion.div variants={itemVariants}
          className="bg-surface border border-border rounded-2xl p-4 shadow-sm focus-within:border-primary/40 transition-colors">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-zinc-800 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
              {user?.photoURL
                ? <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
                : userInitials
              }
            </div>
            <form onSubmit={handlePost} className="flex-1">
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => { if (!newPost) setFocused(false); }}
                placeholder="What are you building? Share with your network..."
                className="w-full bg-transparent resize-none outline-none text-text-primary placeholder:text-text-secondary text-sm leading-relaxed transition-all"
                style={{ height: focused || newPost ? '100px' : '40px' }}
              />
              <AnimatePresence>
                {(focused || newPost) && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                    className="flex justify-end items-center pt-3 border-t border-border mt-2">
                    <div className="flex gap-2">
                      <motion.button type="button" whileTap={{ scale: 0.96 }}
                        onClick={() => { setNewPost(''); setFocused(false); }}
                        className="px-4 py-1.5 rounded-full text-sm font-medium text-text-secondary border border-border hover:border-primary/30 transition-colors">
                        Cancel
                      </motion.button>
                      <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        disabled={!newPost.trim()}
                        className="px-5 py-1.5 rounded-full text-sm font-bold bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20">
                        Post
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      )}

      {/* Posts Feed */}
      <AnimatePresence>
        {posts.map(post => (
          <PostCard key={post.id} post={post} currentUser={user} currentDev={currentDev} />
        ))}
      </AnimatePresence>

      {!isAuthenticated && (
        <motion.div variants={itemVariants}
          className="flex flex-col items-center justify-center gap-4 py-10 text-center bg-surface/40 border border-border rounded-2xl">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Sign in to see your community</h3>
            <p className="text-text-secondary text-sm mt-1">Connect with developers and see their updates here.</p>
          </div>
          <button onClick={() => navigate('/login')}
            className="px-5 py-2 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-hover transition-colors shadow-md shadow-primary/20">
            Sign In
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
