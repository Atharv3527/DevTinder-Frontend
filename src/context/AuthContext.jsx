import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        await syncUser(firebaseUser);
      } else {
        setUser(null);
        setDbUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const syncUser = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await axios.post(
        `${API}/api/auth/sync`,
        {
          full_name: firebaseUser.displayName,
          profile_image_url: firebaseUser.photoURL,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDbUser(res.data.developer);
    } catch (err) {
      console.error('Failed to sync user:', err);
    }
  };

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
