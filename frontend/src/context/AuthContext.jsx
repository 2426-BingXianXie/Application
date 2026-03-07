import { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    const handler = () => loadUser();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  /**
   * Log in with token and optional user payload. If user payload is provided (e.g. from login
   * response), set user immediately so the next page doesn't see stale null and prompt "log in" again.
   * When payload is provided we don't wait for /auth/me so navigation can happen right away.
   */
  const login = (token, userPayload = null) => {
    localStorage.setItem('token', token);
    if (userPayload && typeof userPayload === 'object') {
      setUser({
        email: userPayload.email ?? '',
        name: userPayload.name ?? '',
        role: userPayload.role ?? 'APPLICANT',
      });
      setLoading(false);
      loadUser(); // verify token in background; do not await so navigation isn't delayed
      return Promise.resolve();
    }
    return loadUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
