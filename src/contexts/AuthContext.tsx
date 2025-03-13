
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  subscription?: 'free' | 'pro';
}

// Define context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse stored user data', error);
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };
    
    checkUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This is a mock login for MVP purposes
      // In a real app, this would call an API
      
      // For demo: admin login with admin@example.com/password
      const isAdmin = email === 'admin@example.com';
      
      // Create a mock user
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        role: isAdmin ? 'admin' : 'user',
        subscription: isAdmin ? 'pro' : 'free'
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      // Redirect based on role
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This is a mock signup for MVP purposes
      // In a real app, this would call an API
      
      // Create a mock user
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        role: 'user',
        subscription: 'free'
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Signup successful",
        description: `Welcome to KnowledgeBites, ${name}!`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      toast({
        title: "Signup failed",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
    navigate('/');
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
