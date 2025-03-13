import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

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
  logout: () => Promise<void>;
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

  // Get profile data from Supabase
  const getProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('Profile data retrieved:', data);
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          subscription: data.subscription
        } as User;
      }
      
      console.warn('No profile data found for user:', userId);
      return null;
    } catch (error) {
      console.error('Error getting profile', error);
      return null;
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        console.log('Initializing auth state...');
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          console.log('Session found:', session.user.id);
          const profile = await getProfile(session.user.id);
          if (profile) {
            console.log('Setting user from session:', profile);
            setUser(profile);
          } else {
            console.warn('No profile found for session user');
          }
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session && session.user) {
          const profile = await getProfile(session.user.id);
          if (profile) {
            console.log('Profile set after auth change:', profile);
            setUser(profile);
          } else {
            console.warn('No profile found after auth change');
            setUser(null);
          }
        } else {
          console.log('No session in auth change, clearing user');
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error from Supabase:', error);
        throw error;
      }
      
      if (data.user) {
        console.log('User authenticated successfully:', data.user.id);
        
        // Set a timeout to prevent hanging if profile fetch fails
        const loginTimeout = setTimeout(() => {
          console.log('Login timeout reached, continuing anyway');
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          navigate('/courses');
          setIsLoading(false);
        }, 5000);
        
        try {
          const profile = await getProfile(data.user.id);
          
          // Clear the timeout since we got a response
          clearTimeout(loginTimeout);
          
          if (profile) {
            console.log('Login successful with profile:', profile);
            setUser(profile);
            
            toast({
              title: "Login successful",
              description: `Welcome back, ${profile.name}!`,
            });
            
            // Redirect to courses page instead of dashboard
            if (profile.role === 'admin') {
              console.log('Redirecting admin to /admin');
              navigate('/admin');
            } else {
              console.log('Redirecting user to /courses');
              navigate('/courses');
            }
          } else {
            console.warn('No profile found after login, redirecting anyway');
            toast({
              title: "Login successful",
              description: "Welcome back!",
            });
            navigate('/courses');
          }
        } catch (profileError) {
          console.error('Error fetching profile after login:', profileError);
          // Clear the timeout and continue with login
          clearTimeout(loginTimeout);
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          navigate('/courses');
        }
      } else {
        console.error('No user data returned from login');
        throw new Error('Login failed: No user data returned');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
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
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signup successful",
        description: `Welcome to KnowledgeBites, ${name}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
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
