import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL || 'https://devtinder-1-euv2.onrender.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);          // Firebase user
  const [dbUser, setDbUser] = useState(null);      // Supabase developers row
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  /** Bumps on every auth state change so stale sync responses cannot overwrite state (multi-account / fast switch). */
  const syncSeqRef = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const seq = ++syncSeqRef.current;

      if (!firebaseUser) {
        setUser(null);
        setDbUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);
      setIsAuthenticated(true);

      try {
        // Force a fresh ID token after account switch so backend always sees the current user.
        const token = await firebaseUser.getIdToken(true);
        const res = await axios.post(
          `${API}/api/auth/sync`,
          {
            full_name: firebaseUser.displayName,
            profile_image_url: firebaseUser.photoURL,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (seq !== syncSeqRef.current) return;
        const dev = res.data?.developer;
        if (dev?.firebase_uid !== firebaseUser.uid) return;
        setDbUser(dev);
      } catch (err) {
        console.error('Failed to sync user:', err);
        if (seq === syncSeqRef.current) setDbUser(null);
      } finally {
        if (seq === syncSeqRef.current) setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const getToken = async () => {
    if (!user) return null;
    return user.getIdToken();
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setDbUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, isAuthenticated, loading, getToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
