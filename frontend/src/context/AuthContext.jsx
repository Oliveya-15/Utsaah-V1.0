import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('utsaah_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('utsaah_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('utsaah_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('utsaah_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // Sends the reset-password email. Backend always resolves with a generic
  // message (whether or not the email is registered), so there's nothing
  // user-specific to store here — the caller just shows that message.
  const forgotPassword = useCallback(async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  }, []);

  // Submits a new password for the given reset token. On success the backend
  // returns a fresh JWT + user, same shape as login/register, so we log the
  // person straight in instead of sending them back to the login form.
  const resetPassword = useCallback(async (token, password) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    localStorage.setItem('utsaah_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('utsaah_token');
    setUser(null);
  }, []);

  const updateUserLocal = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, updateUserLocal, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};