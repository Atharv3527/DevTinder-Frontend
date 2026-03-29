import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Clock, Loader2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://devtinder-1-euv2.onrender.com';

function timeAgo(iso) {
  const d = iso ? new Date(iso) : new Date();
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export default function Notifications() {
  const { isAuthenticated, getToken } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState(() => new Set());
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 mb-6 shadow-lg shadow-primary/10">
          <Bell className="w-9 h-9 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to see notifications</h2>
        <p className="text-zinc-400 mb-6 max-w-xs">You need to be logged in to view your connection notifications.</p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  useEffect(() => {
    let active = true;

    const fetchPending = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await getToken();
        const res = await axios.get(`${API}/api/connections/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!active) return;
        setRequests(res.data.requests || []);
      } catch (e) {
        if (!active) return;
        console.error('Pending requests fetch error:', e);
        setError(e?.response?.data?.error || e.message || 'Failed to load requests');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPending();
    return () => { active = false; };
  }, [getToken]);

  const unreadCount = requests.length;

  const markAllRead = () => {
    // Pending requests are actionable; we don't persist read-state yet.
    // Keeping a no-op button would be confusing; so we route users to Community instead.
    navigate('/community');
  };

  const setBusy = (id, isBusy) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (isBusy) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const acceptRequest = async (connectionId) => {
    setBusy(connectionId, true);
    setError('');
    try {
      const token = await getToken();
      await axios.post(`${API}/api/request/accept/${connectionId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) => prev.filter((r) => r.id !== connectionId));
    } catch (e) {
      console.error('Accept request error:', e);
      setError(e?.response?.data?.error || e.message || 'Failed to accept request');
    } finally {
      setBusy(connectionId, false);
    }
  };

  const rejectRequest = async (connectionId) => {
    setBusy(connectionId, true);
    setError('');
    try {
      const token = await getToken();
      await axios.post(`${API}/api/request/reject/${connectionId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) => prev.filter((r) => r.id !== connectionId));
    } catch (e) {
      console.error('Reject request error:', e);
      setError(e?.response?.data?.error || e.message || 'Failed to decline request');
    } finally {
      setBusy(connectionId, false);
    }
  };

  const cards = useMemo(() => {
    return requests.map((r) => {
      const dev = r.developers;
      const name = dev?.full_name || 'Developer';
      const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
      return {
        id: r.id,
        connectionId: r.id,
        createdAt: r.created_at,
        dev,
        name,
        initials,
        bio: dev?.bio || '',
        uid: dev?.firebase_uid,
      };
    });
  }, [requests]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center border border-primary/25">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Notifications</h1>
            <p className="text-zinc-500 text-sm">
              {loading ? 'Loading…' : unreadCount > 0 ? `${unreadCount} pending request${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && !loading && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-primary hover:bg-primary/10 border border-primary/20 transition-all"
          >
            <Check className="w-4 h-4" />
            Go to Community
          </motion.button>
        )}
      </motion.div>

      {error && (
        <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Notification List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading requests…</span>
              </div>
            </motion.div>
          ) : cards.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-zinc-800/60 rounded-full flex items-center justify-center border border-white/10 mb-4">
                <Users className="w-7 h-7 text-zinc-600" />
              </div>
              <p className="text-zinc-400 font-medium">No pending requests</p>
              <p className="text-zinc-600 text-sm mt-1">When someone connects with you, it’ll show up here.</p>
            </motion.div>
          ) : (
            cards.map((c, idx) => {
              const isBusy = busyIds.has(c.connectionId);
              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                  transition={{ delay: idx * 0.04, duration: 0.35 }}
                  className="relative group flex items-start gap-4 p-4 rounded-2xl border bg-surface/60 border-white/10 hover:bg-surface/80 shadow-lg shadow-black/20 transition-all duration-200"
                >
                  <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full shadow-sm shadow-primary/50" />

                  {/* Avatar */}
                  <button
                    onClick={() => c.uid && navigate(`/profile/${c.uid}`)}
                    className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center font-black text-white text-sm shrink-0 shadow-md"
                    disabled={!c.uid}
                    title={c.uid ? 'View profile' : 'Profile unavailable'}
                  >
                    {c.dev?.profile_image_url ? (
                      <img src={c.dev.profile_image_url} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      c.initials
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => c.uid && navigate(`/profile/${c.uid}`)}
                        className="font-bold text-white text-sm hover:text-primary transition-colors"
                        disabled={!c.uid}
                      >
                        {c.name}
                      </button>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/15 text-primary border border-primary/20">
                        New Request
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mt-0.5">
                      {c.bio ? c.bio : 'Wants to connect with you.'}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      <span className="text-zinc-600 text-xs">{timeAgo(c.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => acceptRequest(c.connectionId)}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold hover:bg-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => rejectRequest(c.connectionId)}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-semibold hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-3.5 h-3.5" />
                        Decline
                      </motion.button>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setRequests((p) => p.filter((r) => r.id !== c.connectionId)); }}
                    className="absolute top-3 right-8 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/10 text-zinc-600 hover:text-zinc-300"
                    title="Hide"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
