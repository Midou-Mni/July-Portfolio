import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, affiliateApi } from '../services/api';
import { User } from '../types';

// Types

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAffiliate: boolean;
  isSuperAdmin: boolean;
  isAdminApproved: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, userType: string) => Promise<void>;
  logout: () => void;
  updateUserData: (userData: Partial<User>) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isAffiliate: false,
  isSuperAdmin: false,
  isAdminApproved: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateUserData: () => {},
});

// Keep MOCK_USERS for development fallback, but don't use them as primary authentication
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    isSuperAdmin: true,
    isAdminApproved: true,
    isActive: true,
    phone: '',
    country: '',
    state: '',
    city: '',
    address: '',
    confirmedEarnings: 0,
    paidOut: 0,
    assignedAffiliates: [],
    createdAt: new Date().toISOString(),
    payoutDetails: {
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      paypalEmail: '',
      bankAddress: '',
      cryptoAddress: '',
      preferredMethod: '',
    }
  },
  {
    id: '2',
    firstName: 'Affiliate',
    lastName: 'User',
    email: 'affiliate@example.com',
    password: 'password',
    role: 'affiliate',
    isActive: true,
    createdAt: new Date().toISOString(),
    phone: '',
    country: '',
    state: '',
    city: '',
    address: '',
    confirmedEarnings: 1250.50,
    paidOut: 500.00,
    payoutDetails: {
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      paypalEmail: '',
      bankAddress: '',
      cryptoAddress: '',
      preferredMethod: '',
    }
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved auth token on initial load
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token) {
        try {
          // Validate the token with the API
          const response = await authApi.getProfile();
          if (response.data.success) {
            setUser(response.data.data.user);
          } else {
            // If token is invalid, clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Function to update user data in context
  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Real login function using API
  const login = async (email: string, password: string, userType: string) => {
    setIsLoading(true);
    
    try {
      // Call the real login API
      const response = await authApi.login(email, password);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      const { token, user: userData } = response.data.data;
      
      // Verify user has the correct role
      if (userData.role !== userType) {
        throw new Error(`Invalid account type. This account is not a ${userType}.`);
      }
      
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
    } catch (error: any) {
      // Fallback to mock login during development (can be removed in production)
      if (process.env.NODE_ENV === 'development') {
        try {
          // Find user with matching credentials in mock data
          const foundUser = MOCK_USERS.find(
            (u) => u.email === email && u.password === password && u.role === userType
          );
          
          if (!foundUser) {
            throw new Error('Invalid credentials or user not found');
          }
          
          // Create user object without the password
          const { password: _, ...userWithoutPassword } = foundUser;
          
          // Save to state and localStorage
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          console.warn('Using mock authentication - not connected to backend');
          setIsLoading(false);
          return;
        } catch (mockError) {
          // If mock login fails too, throw the original error
          throw error;
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Real signup function using API
  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    userType: string
  ) => {
    setIsLoading(true);
    
    try {
      // Call the real register API 
      const response = await authApi.register(
        firstName,
        lastName,
        email,
        password,
        userType as 'admin' | 'affiliate'
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      // We could auto-login here by saving the token and user data,
      // but for now we'll just return to match the existing behavior
      setIsLoading(false);
    } catch (error: any) {
      // Fallback to mock signup during development (can be removed in production)
      if (process.env.NODE_ENV === 'development') {
        try {
          // Check if user already exists in mock data
          if (MOCK_USERS.some(u => u.email === email)) {
            throw new Error('User with this email already exists');
          }
          
          // Create mock user
          const baseUser = {
            id: Math.random().toString(36).substring(2, 9),
            firstName,
            lastName,
            email,
            password,
            isActive: true,
            createdAt: new Date().toISOString(),
            role: userType as 'admin' | 'affiliate',
          };
          
          // Add role-specific properties
          let newUser: User & { password: string };
          if (userType === 'admin') {
            newUser = {
              ...baseUser,
              role: 'admin',
              isSuperAdmin: false,
              isAdminApproved: false,
              phone: '',
              country: '',
              state: '',
              city: '',
              address: '',
              assignedAffiliates: [],
              payoutDetails: {
                preferredMethod: '',
                bankName: '',
                accountNumber: '',
                routingNumber: '',
                paypalEmail: '',
                bankAddress: '',
                cryptoAddress: '',
              },
            };
          } else {
            newUser = {
              ...baseUser,
              role: 'affiliate',
              phone: '',
              country: '',
              state: '',
              city: '',
              address: '',
              payoutDetails: {
                preferredMethod: '',
                bankName: '',
                accountNumber: '',
                routingNumber: '',
                paypalEmail: '',
                bankAddress: '',
                cryptoAddress: '',
              },
            };
          }
          
          // Add to mock data
          MOCK_USERS.push(newUser);
          
          console.warn('Using mock registration - not connected to backend');
          setIsLoading(false);
          return;
        } catch (mockError) {
          // If mock signup fails too, throw the original error
          throw error;
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAffiliate: user?.role === 'affiliate',
    isSuperAdmin: user?.isSuperAdmin === true,
    isAdminApproved: user?.isAdminApproved === true,
    isLoading,
    login,
    signup,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 
