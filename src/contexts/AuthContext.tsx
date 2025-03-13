
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

  // Get profile data from Supabase with fallback mechanism
  const getProfile = async (userId: string): Promise<User | null> => {
    console.log(`Fetching profile for user ID: ${userId}`);
    
    try {
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
        console.log('Profile data retrieved successfully:', data);
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          subscription: data.subscription
        } as User;
      }
      
      console.warn('No profile found for user ID:', userId);
      
      // Fallback: Create a basic user object if profile doesn't exist
      return {
        id: userId,
        email: 'user@example.com', // This will be overwritten by auth user email
        name: 'User',
        role: 'user'
      } as User;
    } catch (error) {
      console.error('Failed to get profile, using fallback:', error);
      // Return a fallback user object
      return {
        id: userId,
        email: 'user@example.com',
        name: 'User',
        role: 'user'
      } as User;
    }
  };

  // Attempt to update user email from auth session
  const updateUserEmailFromSession = async (userId: string, userObj: User): Promise<User> => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser && authUser.email) {
        console.log(`Updating user email from auth session: ${authUser.email}`);
        return { ...userObj, email: authUser.email };
      }
    } catch (error) {
      console.error('Error getting auth user email:', error);
    }
    return userObj;
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      console.log('Initializing auth state...');
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Session found, user is logged in:', session.user.id);
          try {
            let profile = await getProfile(session.user.id);
            
            // If profile is using fallback values, try to update the email
            if (profile && profile.email === 'user@example.com') {
              profile = await updateUserEmailFromSession(session.user.id, profile);
            }
            
            if (profile) {
              console.log('Setting user state with profile:', profile);
              setUser(profile);
            } else {
              console.warn('No profile returned, user will be null');
            }
          } catch (error) {
            console.error('Error during profile initialization:', error);
            toast({
              title: "Authentication Error",
              description: "Failed to load user profile. Please try logging in again.",
              variant: "destructive",
            });
          }
        } else {
          console.log('No session found, user is not logged in');
          setUser(null);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        console.log('Auth initialization completed');
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state changed: ${event}`, session ? 'Session exists' : 'No session');
        
        if (session && session.user) {
          try {
            let profile = await getProfile(session.user.id);
            
            // If profile is using fallback values, try to update the email
            if (profile && profile.email === 'user@example.com') {
              profile = await updateUserEmailFromSession(session.user.id, profile);
            }
            
            console.log('Auth change: Setting user with profile:', profile);
            setUser(profile);
          } catch (error) {
            console.error('Error handling auth state change:', error);
            // Still set user to null on error to avoid being stuck
            setUser(null);
          }
        } else {
          console.log('Auth change: No session, setting user to null');
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [toast]);

  // Login function with timeout and better error handling
  const login = async (email: string, password: string) => {
    console.log(`Attempting login for email: ${email}`);
    setIsLoading(true);
    
    try {
      // First, try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      if (data.user) {
        console.log('Sign in successful, getting profile for:', data.user.id);
        
        // Set a timeout to avoid getting stuck
        const profileTimeout = setTimeout(() => {
          console.warn('Profile fetch timeout, continuing with navigation');
          setIsLoading(false);
          toast({
            title: "Partial Login Successful",
            description: "Profile data couldn't be loaded in time, but you're logged in.",
          });
          
          // Force navigation even if profile fetch is slow
          if (data.user) {
            navigate('/courses');
          }
        }, 3000); // 3 second timeout
        
        try {
          // Try to get the profile
          const profile = await getProfile(data.user.id);
          
          // Clear timeout as we got the profile
          clearTimeout(profileTimeout);
          
          if (profile) {
            console.log('Login successful with profile:', profile);
            toast({
              title: "Login successful",
              description: `Welcome back, ${profile.name || 'User'}!`,
            });
            
            // Redirect to appropriate page
            if (profile.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/courses');
            }
          } else {
            console.warn('No profile found after login, navigating anyway');
            toast({
              title: "Login successful",
              description: "Welcome back!",
            });
            navigate('/courses');
          }
        } catch (profileError) {
          // Clear timeout as we got an error
          clearTimeout(profileTimeout);
          
          console.error('Error getting profile after login:', profileError);
          toast({
            title: "Login partially successful",
            description: "Logged in, but could not load your profile data.",
          });
          
          // Still navigate to courses page
          navigate('/courses');
        }
      }
    } catch (error: any) {
      console.error('Login process failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      console.log('Login process completed');
      setIsLoading(false);
    }
  };

  // Signup function with better error handling
  const signup = async (name: string, email: string, password: string) => {
    console.log(`Attempting signup for email: ${email}`);
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
        console.error('Signup error:', error);
        throw error;
      }
      
      console.log('Signup successful');
      toast({
        title: "Signup successful",
        description: `Welcome to KnowledgeBites, ${name}!`,
      });
      
      navigate('/courses');
    } catch (error: any) {
      console.error('Signup process failed:', error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      console.log('Signup process completed');
      setIsLoading(false);
    }
  };

  // Logout function with better error handling
  const logout = async () => {
    console.log('Attempting logout');
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log('Logout successful');
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
