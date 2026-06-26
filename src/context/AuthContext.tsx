import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { studyApi } from '../api';

export type Role = 'admin' | 'usuario';
export type EducationLevel = 'fundamental1' | 'fundamental2_medio' | 'faculdade';

interface User {
  username: string;
  role: Role;
  educationLevel?: EducationLevel;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, educationLevel: EducationLevel) => Promise<boolean>;
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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await studyApi.login(username, password);
      const { token, role, educationLevel } = response.data;
      
      localStorage.setItem('studyapp_token', token);
      setUser({ username, role, educationLevel: educationLevel as EducationLevel });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const register = async (username: string, password: string, educationLevel: EducationLevel): Promise<boolean> => {
    try {
      const response = await studyApi.register(username, password, educationLevel);
      const { token, role } = response.data;
      
      localStorage.setItem('studyapp_token', token);
      setUser({ username, role, educationLevel });
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studyapp_token');
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
