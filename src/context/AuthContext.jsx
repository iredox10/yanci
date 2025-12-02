import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const USERS = [
  { id: 'super', name: 'Babban Admin', role: 'super_admin', category: null, label: 'Super Admin' },
  { id: 'news', name: 'Editan Labarai', role: 'editor', category: 'news', label: 'Labarai & Siyasa (News/Politics)' },
  { id: 'sport', name: 'Editan Wasanni', role: 'editor', category: 'sport', label: 'Wasanni (Sport)' },
  { id: 'opinion', name: 'Editan Ra\'ayi', role: 'editor', category: 'opinion', label: 'Ra\'ayi (Opinion)' },
  { id: 'culture', name: 'Editan Al\'adu', role: 'editor', category: 'culture', label: 'Al\'adu (Culture)' },
  { id: 'lifestyle', name: 'Editan Rayuwa', role: 'editor', category: 'lifestyle', label: 'Kasuwanci & Rayuwa (Business/Lifestyle)' },
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('yanci_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('yanci_admin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yanci_admin_user');
    }
  }, [user]);

  const login = (userId) => {
    const foundUser = USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, USERS }}>
      {children}
    </AuthContext.Provider>
  );
};
