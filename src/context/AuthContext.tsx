import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/apiService';
import { User, AuthResponse, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Verify token is still valid
        try {
          const response = await ApiService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
            await AsyncStorage.setItem('userData', JSON.stringify(response.data));
          }
        } catch (error) {
          // Token expired or invalid, clear auth state
          await clearAuthState();
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      await clearAuthState();
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  };

  const clearAuthState = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response: any = await ApiService.login(email, password);

      // Handle both response formats: 
      // 1. Standard API format: { success: true, data: { user, token } }
      // 2. Direct format: { user, token }
      const user = response.data?.user || response.user;
      const token = response.data?.token || response.token;

      if (user && token) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        setUser(user);
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error occurred' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Call logout endpoint to invalidate token on server
      try {
        await ApiService.logout();
      } catch (error) {
        // Continue with local logout even if server call fails
        console.warn('Server logout failed:', error);
      }
      
      await clearAuthState();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await ApiService.forgotPassword(email);
      
      return { 
        success: response.success, 
        message: response.message || 'Reset email sent successfully' 
      };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to send reset email' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    user_group_id?: number;
    tier_id?: number;
  }): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response: any = await ApiService.register(data);

      // Handle both response formats: 
      // 1. Standard API format: { success: true, data: { user, token } }
      // 2. Direct format: { user, token }
      const user = response.data?.user || response.user;
      const token = response.data?.token || response.token;

      if (user && token) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        setUser(user);
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error occurred' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    forgotPassword,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;