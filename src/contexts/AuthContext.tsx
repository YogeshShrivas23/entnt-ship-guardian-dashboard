
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  role: 'Admin' | 'Inspector' | 'Engineer';
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@entnt.in',
    password: 'admin123',
    user: { id: '1', role: 'Admin', email: 'admin@entnt.in', name: 'Admin User' }
  },
  {
    email: 'inspector@entnt.in',
    password: 'inspect123',
    user: { id: '2', role: 'Inspector', email: 'inspector@entnt.in', name: 'John Inspector' }
  },
  {
    email: 'engineer@entnt.in',
    password: 'engine123',
    user: { id: '3', role: 'Engineer', email: 'engineer@entnt.in', name: 'Mike Engineer' }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const matchedUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (matchedUser) {
      setUser(matchedUser.user);
      localStorage.setItem('currentUser', JSON.stringify(matchedUser.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
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
