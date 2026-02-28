import React from 'react';

export interface User {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;      // data URL
  homepageRedirect?: string;  // e.g. "/dashboard" or "https://example.com"
}

export interface ProfileInput {
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  homepageRedirect: string;
}

interface AuthContextType {
  user: User | null;
  register: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  completeProfile: (profile: ProfileInput) => Promise<User>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const register = React.useCallback(
    async (email: string, password: string): Promise<User> => {
      // Simple demo: only one user stored in localStorage
      const newUser: User = { email, password };
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    },
    [],
  );

  const login = React.useCallback(
    async (email: string, password: string): Promise<User> => {
      const stored = localStorage.getItem('user');
      if (!stored) {
        throw new Error('No user registered yet');
      }
      const existing = JSON.parse(stored) as User;
      if (existing.email !== email || existing.password !== password) {
        throw new Error('Invalid email or password');
      }
      setUser(existing);
      return existing;
    },
    [],
  );

  const completeProfile = React.useCallback(
    async (profile: ProfileInput): Promise<User> => {
      const stored = localStorage.getItem('user');
      if (!stored) {
        throw new Error('No user registered yet');
      }
      const existing = JSON.parse(stored) as User;
      const updated: User = { ...existing, ...profile };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      return updated;
    },
    [],
  );

  const logout = React.useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value: AuthContextType = { user, register, login, completeProfile, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};