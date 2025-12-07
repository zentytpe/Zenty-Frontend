import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Merchant } from '../types';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface AuthContextType {
  user: User | null;
  merchant: Merchant | null;
  userType: 'customer' | 'merchant' | null;
  login: (email: string, password: string, type: 'customer' | 'merchant') => Promise<boolean>;
  register: (data: any, type: 'customer' | 'merchant') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [userType, setUserType] = useState<'customer' | 'merchant' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('zenty_token');
      const savedUserType = localStorage.getItem('zenty_user_type') as 'customer' | 'merchant' | null;

      if (savedToken && savedUserType) {
        await fetchUserProfile(savedToken, savedUserType);
        setUserType(savedUserType);
      }

      setIsLoading(false);
    };

    void initializeAuth();
  }, []);

  const login = async (email: string, password: string, type: 'customer' | 'merchant'): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('zenty_token', data.token);
      localStorage.setItem('zenty_user_type', type);
      setUserType(type);

      if (type === 'customer') {
        await fetchUserProfile(data.token, 'customer');
      } else {
        await fetchUserProfile(data.token, 'merchant');
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (formData: any, type: 'customer' | 'merchant'): Promise<boolean> => {
    setIsLoading(true);

    try {
      const payload = {
        ...(type === 'customer'
          ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          }
          : {
            companyName: formData.companyName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
          }),
      };
      const endpoint = type === 'customer' ? '/api/v1/users' : '/api/v1/merchants/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      localStorage.setItem('zenty_token', result.token);
      localStorage.setItem('zenty_user_type', type);
      setUserType(type);

      if (type === 'customer') {
        await fetchUserProfile(result.token, 'customer');
      } else {
        await fetchUserProfile(result.token, 'merchant');
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setMerchant(null);
    setUserType(null);
    localStorage.removeItem('zenty_token');
    localStorage.removeItem('zenty_user_type');
    localStorage.removeItem('zenty_user');
    localStorage.removeItem('zenty_merchant');
  };

  const fetchUserProfile = async (token: string, type: 'customer' | 'merchant') => {
    try {
      const endpoint = type === 'merchant' ? '/api/v1/merchants/me' : '/api/v1/auth';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (type === 'customer') {
        setUser(data);
        localStorage.setItem('zenty_user', JSON.stringify(data));
      } else {
        setMerchant(data);
        localStorage.setItem('zenty_merchant', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout(); // Clear token on error
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      merchant,
      userType,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};