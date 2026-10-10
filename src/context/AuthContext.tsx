import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LibraryItem, Bookmark, UserStats } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  library: LibraryItem[];
  bookmarks: Bookmark[];
  stats: UserStats | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleLibraryItem: (bookId: string, status?: 'listening' | 'saved' | 'favorite' | 'completed') => Promise<void>;
  removeFromLibrary: (bookId: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('aurabooks_token') || 'token_demo_eleanor');
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }, [token]);

  const refreshUserData = useCallback(async () => {
    try {
      // Fetch user profile
      const userRes = await fetch('/api/auth/me', { headers: getHeaders() });
      if (userRes.ok) {
        const uData = await userRes.json();
        setUser(uData.user);
      }

      // Fetch library
      const libRes = await fetch('/api/user/library', { headers: getHeaders() });
      if (libRes.ok) {
        const lData = await libRes.json();
        setLibrary(lData.library || []);
      }

      // Fetch bookmarks
      const bmRes = await fetch('/api/user/bookmarks', { headers: getHeaders() });
      if (bmRes.ok) {
        const bData = await bmRes.json();
        setBookmarks(bData.bookmarks || []);
      }

      // Fetch stats
      const stRes = await fetch('/api/user/stats', { headers: getHeaders() });
      if (stRes.ok) {
        const sData = await stRes.json();
        setStats(sData.stats);
      }
    } catch (err) {
      console.warn('Error refreshing user data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('aurabooks_token', data.token);
        await refreshUserData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('aurabooks_token', data.token);
        await refreshUserData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('aurabooks_token');
    setToken(null);
    setUser(null);
    setLibrary([]);
    setBookmarks([]);
  };

  const toggleLibraryItem = async (bookId: string, status: 'listening' | 'saved' | 'favorite' | 'completed' = 'saved') => {
    try {
      const existing = library.find((i) => i.bookId === bookId);
      const targetStatus = existing?.status === status ? 'listening' : status;

      const res = await fetch('/api/user/library', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ bookId, status: targetStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setLibrary(data.library);
      }
    } catch (err) {
      console.warn('Failed to update library item:', err);
    }
  };

  const removeFromLibrary = async (bookId: string) => {
    try {
      const res = await fetch(`/api/user/library/${bookId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setLibrary((prev) => prev.filter((i) => i.bookId !== bookId));
      }
    } catch (err) {
      console.warn('Failed to remove from library:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        library,
        bookmarks,
        stats,
        isLoading,
        login,
        register,
        logout,
        toggleLibraryItem,
        removeFromLibrary,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
