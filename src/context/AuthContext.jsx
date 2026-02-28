import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// Seed staff — these are always present as the baseline.
// New staff added via AdminStaff are merged in from localStorage.
export const SEED_STAFF = [
  { id: 'super',     name: 'Babban Admin',     role: 'super_admin', category: null,        label: 'Super Admin',                              pin: null, email: 'admin@yanci.ng',     status: 'active', lastActive: null, createdAt: null },
  { id: 'news',      name: 'Editan Labarai',   role: 'editor',      category: 'news',      label: 'Labarai & Siyasa (News/Politics)',          pin: null, email: 'labarai@yanci.ng',   status: 'active', lastActive: null, createdAt: null },
  { id: 'sport',     name: 'Editan Wasanni',   role: 'editor',      category: 'sport',     label: 'Wasanni (Sport)',                           pin: null, email: 'wasanni@yanci.ng',   status: 'active', lastActive: null, createdAt: null },
  { id: 'opinion',   name: "Editan Ra'ayi",    role: 'editor',      category: 'opinion',   label: "Ra'ayi (Opinion)",                          pin: null, email: 'raayi@yanci.ng',     status: 'active', lastActive: null, createdAt: null },
  { id: 'culture',   name: "Editan Al'adu",    role: 'editor',      category: 'culture',   label: "Al'adu (Culture)",                          pin: null, email: 'aladu@yanci.ng',     status: 'active', lastActive: null, createdAt: null },
  { id: 'lifestyle', name: 'Editan Rayuwa',    role: 'editor',      category: 'lifestyle', label: 'Kasuwanci & Rayuwa (Business/Lifestyle)',   pin: null, email: 'rayuwa@yanci.ng',    status: 'active', lastActive: null, createdAt: null },
];

// Keep backward-compat export
export const USERS = SEED_STAFF;

const STAFF_STORAGE_KEY = 'yanci_staff_list';

function loadStaffFromStorage() {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) return SEED_STAFF;
    const saved = JSON.parse(raw);
    // Merge: seed entries can be overridden by saved entries with same id
    const savedMap = Object.fromEntries(saved.map(s => [s.id, s]));
    const merged = SEED_STAFF.map(s => savedMap[s.id] ? { ...s, ...savedMap[s.id] } : s);
    // Append any custom staff not in seed
    const seedIds = new Set(SEED_STAFF.map(s => s.id));
    const extras = saved.filter(s => !seedIds.has(s.id));
    return [...merged, ...extras];
  } catch {
    return SEED_STAFF;
  }
}

function saveStaffToStorage(list) {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

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

  const [staffList, setStaffList] = useState(() => loadStaffFromStorage());

  // Persist user session
  useEffect(() => {
    if (user) {
      localStorage.setItem('yanci_admin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yanci_admin_user');
    }
  }, [user]);

  // Persist staff list
  useEffect(() => {
    saveStaffToStorage(staffList);
  }, [staffList]);

  // Login — accepts userId + optional PIN.
  // Returns { ok: true } or { ok: false, error: string }
  const login = useCallback((userId, pin) => {
    const found = staffList.find(u => u.id === userId);
    if (!found) return { ok: false, error: 'Ba a sami mai amfani ba.' };
    if (found.status === 'suspended') return { ok: false, error: 'An dakatar da wannan asusu.' };
    if (found.status === 'on_leave') return { ok: false, error: 'Wannan mai amfani yana hutawa.' };
    if (found.pin) {
      if (!pin || String(pin) !== String(found.pin)) {
        return { ok: false, error: 'Lamba PIN ba daidai ba ce.' };
      }
    }
    const sessionUser = { ...found, lastActive: new Date().toISOString() };
    setUser(sessionUser);
    // Update lastActive in staffList
    setStaffList(prev => prev.map(u => u.id === userId ? { ...u, lastActive: sessionUser.lastActive } : u));
    return { ok: true };
  }, [staffList]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addStaffMember = useCallback((data) => {
    const id = 'staff_' + Date.now();
    const newMember = {
      id,
      name: data.name,
      email: data.email,
      role: data.role,
      category: data.role === 'editor' ? data.category : null,
      label: data.name,
      pin: data.pin || null,
      status: data.status || 'active',
      lastActive: null,
      createdAt: new Date().toISOString(),
    };
    setStaffList(prev => [...prev, newMember]);
    return newMember;
  }, []);

  const updateStaffMember = useCallback((id, data) => {
    setStaffList(prev => prev.map(u => {
      if (u.id !== id) return u;
      const updated = { ...u, ...data };
      // If role changed to super_admin, clear category
      if (data.role === 'super_admin') updated.category = null;
      return updated;
    }));
  }, []);

  const removeStaffMember = useCallback((id) => {
    // Cannot remove seed staff
    const isSeed = SEED_STAFF.some(s => s.id === id);
    if (isSeed) return false;
    setStaffList(prev => prev.filter(u => u.id !== id));
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      USERS: staffList,
      staffList,
      addStaffMember,
      updateStaffMember,
      removeStaffMember,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
