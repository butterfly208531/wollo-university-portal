import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wu_admin_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('wu_admin_user', JSON.stringify(userData));
    localStorage.setItem('wu_admin_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('wu_admin_user');
    localStorage.removeItem('wu_admin_token');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isSuperAdmin, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
