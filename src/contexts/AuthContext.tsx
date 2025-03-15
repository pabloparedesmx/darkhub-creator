
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
  signInWithGoogle: () => Promise<void>;
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
  const getProfile = async (userId: string): Promise<User | null> => {
    console.log(`Fetching profile for user ID: ${userId}`);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

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
          role: data.role as 'user' | 'admin',
          subscription: data.subscription as 'free' | 'pro' | undefined
        } as User;
      }
      
      console.warn('No profile found for user ID:', userId);
      return null;
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
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
          const profile = await getProfile(session.user.id);
          
          if (profile) {
            setUser(profile);
          } else {
            // If no profile found but session exists, create a temporary basic profile
            // This will be updated when the database trigger creates the actual profile
            const tempUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: 'user' // Default role is always 'user'
            };
            setUser(tempUser);
            
            // Try to create a profile if it doesn't exist
            try {
              await supabase.from('profiles').insert([{
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                role: 'user',
                subscription: 'free'
              }]);
            } catch (insertError) {
              console.error('Error creating profile:', insertError);
            }
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
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state changed: ${event}`, session ? 'Session exists' : 'No session');
        
        if (session && session.user) {
          // Always get a fresh profile after auth changes
          const profile = await getProfile(session.user.id);
          
          if (profile) {
            setUser(profile);
          } else {
            // Create a temporary user object if profile not found
            const tempUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: 'user' // Default role is always 'user'
            };
            setUser(tempUser);
          }
          
          // Navigate to courses page after login or signup
          if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
            navigate('/courses');
          }
        } else {
          console.log('Auth change: No session, setting user to null');
          setUser(null);
          
          // Force redirect to home page if on a protected route
          const protectedRoutes = ['/courses', '/profile', '/admin', '/dashboard'];
          const isOnProtectedRoute = protectedRoutes.some(route => 
            window.location.pathname.startsWith(route)
          );
          
          if (isOnProtectedRoute) {
            console.log('User is on protected route, redirecting to home');
            navigate('/', { replace: true });
          }
        }
        
        setIsLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  // Login function
  const login = async (email: string, password: string) => {
    console.log(`Attempting login for email: ${email}`);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Sign in successful');
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigation will be handled by the onAuthStateChange listener
    } catch (error: any) {
      console.error('Login process failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Google Sign In function
  const signInWithGoogle = async () => {
    console.log('Attempting to sign in with Google');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/courses`
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
      
      console.log('Google sign-in initiated successfully');
      toast({
        title: "Google sign-in initiated",
        description: "You'll be redirected to Google for authentication",
      });
      
      // Navigation will be handled by the onAuthStateChange listener
    } catch (error: any) {
      console.error('Google sign-in process failed:', error);
      toast({
        title: "Google sign-in failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Signup function
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
            name, // Store name in user metadata
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
        description: `Welcome, ${name}!`,
      });
      
      // The database trigger should create the profile with 'user' role
      // Navigation will be handled by the onAuthStateChange listener
    } catch (error: any) {
      console.error('Signup process failed:', error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    console.log('Attempting logout');
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log('Logout successful');
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signInWithGoogle,
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
