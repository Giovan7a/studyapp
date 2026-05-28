import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Role = 'admin' | 'usuario';

interface User {
  username: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('studyapp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('studyapp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('studyapp_user');
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    // Hardcoded users
    if (username === 'admin' && password === '123456') {
      setUser({ username, role: 'admin' });
      return true;
    } else if (username === 'usuario' && password === '123456') {
      setUser({ username, role: 'usuario' });
      return true;
    }
    
    // Check localStorage users
    const usersStr = localStorage.getItem('studyapp_users_db');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      if (users[username] && users[username] === password) {
        setUser({ username, role: 'usuario' });
        return true;
      }
    }

    return false;
  };

  const register = (username: string, password: string): boolean => {
    if (username === 'admin' || username === 'usuario') return false; // Reserved

    const usersStr = localStorage.getItem('studyapp_users_db');
    const users = usersStr ? JSON.parse(usersStr) : {};

    if (users[username]) {
      return false; // User already exists
    }

    users[username] = password;
    localStorage.setItem('studyapp_users_db', JSON.stringify(users));
    setUser({ username, role: 'usuario' });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
