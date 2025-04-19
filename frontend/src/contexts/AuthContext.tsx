'use client';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import api, { getApiHeaders } from '../lib/api';
import { useTenant } from '../hooks/useTenant';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface UserInfo {
  id: string;
  email: string;
  name?: string;
  role?: string;
  exp?: number;
}

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userPermissions: string[];
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const tenant = useTenant();
  const router = useRouter();

  const processToken = (accessToken: string) => {
    try {
      const decoded = jwtDecode<{ permissions: string[], sub: string, email: string, name?: string, role?: string, exp?: number }>(accessToken);
      setUserPermissions(decoded.permissions || []);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        exp: decoded.exp
      });
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const isValid = processToken(storedToken);
          if (isValid) {
            setToken(storedToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const checkAuthStatus = async (): Promise<boolean> => {
    if (!token) return false;
    try {
      await api.get('/auth/validate', {
        headers: getApiHeaders(tenant, token)
      });
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
      router.push('/login');
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password 
      }, {
        headers: getApiHeaders(tenant)
      });
      const accessToken = response.data.access_token;
      processToken(accessToken);
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserPermissions([]);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ 
      token, 
      login, 
      logout, 
      isAuthenticated, 
      userPermissions, 
      hasPermission,
      isLoading,
      user,
      checkAuthStatus
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