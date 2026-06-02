import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Role = 'admin' | 'usuario';
export type EducationLevel = 'fundamental1' | 'fundamental2_medio' | 'faculdade';

interface User {
  username: string;
  role: Role;
  educationLevel?: EducationLevel;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, educationLevel: EducationLevel) => boolean;
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
      const userRecord = users[username];
      
      if (userRecord) {
        // Handle legacy format (just password string)
        if (typeof userRecord === 'string' && userRecord === password) {
          setUser({ username, role: 'usuario', educationLevel: 'faculdade' });
          return true;
        } 
        // Handle new format
        else if (typeof userRecord === 'object' && userRecord.password === password) {
          setUser({ username, role: 'usuario', educationLevel: userRecord.educationLevel });
          return true;
        }
      }
    }

    return false;
  };

  const register = (username: string, password: string, educationLevel: EducationLevel): boolean => {
    if (username === 'admin' || username === 'usuario') return false; // Reserved

    const usersStr = localStorage.getItem('studyapp_users_db');
    const users = usersStr ? JSON.parse(usersStr) : {};

    if (users[username]) {
      return false; // User already exists
    }

    users[username] = { password, educationLevel };
    localStorage.setItem('studyapp_users_db', JSON.stringify(users));
    setUser({ username, role: 'usuario', educationLevel });
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
