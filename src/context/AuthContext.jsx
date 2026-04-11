import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { account } from '../lib/appwrite';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        setUser({
          id: session.$id,
          name: session.name,
          email: session.email,
          role: session.labels?.includes('superadmin') ? 'super_admin' : 'editor',
          category: session.labels?.find(l => !['superadmin'].includes(l)) || null,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      const userData = {
        id: session.$id,
        name: session.name,
        email: session.email,
        role: session.labels?.includes('super_admin') ? 'super_admin' : 'editor',
        category: session.labels?.find(l => !['super_admin'].includes(l)) || null,
      };
      setUser(userData);
      return { ok: true, user: userData };
    } catch (error) {
      return { ok: false, error: error.message || 'An sami matsala.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession('current');
    } catch {}
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
