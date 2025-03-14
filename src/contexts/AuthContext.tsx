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
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
}

// Define context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout
  isAuthenticated: boolean;
  isAdmin: boolean;
  checkAuth: () => Promise<void>;
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
        .maybeSingle(); // Using maybeSingle instead of single to avoid error if profile doesn't exist

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
          role: data.role as 'user' | 'admin', // Add type assertion here
          subscription: data.subscription as 'free' | 'pro' | undefined,
          user_metadata: {
            avatar_url: data.avatar_url as string,
            full_name: data.full_name as string,
            name: data.name as string,
          }
        } as User;
      }
      
      console.warn('No profile found for user ID:', userId);
      
      // Create a profile if it doesn't exist
      console.log('Attempting to create a profile for user ID:', userId);
      const authUserResponse = await supabase.auth.getUser();
      const authUser = authUserResponse.data.user;
      
      if (!authUser) {
        console.error('No auth user found for profile creation');
        return null;
      }
      
      const newProfile = {
        id: userId,
        email: authUser.email || 'user@example.com',
        name: authUser.user_metadata?.name || 'User',
        role: 'user' as 'user', // Fix type here
        subscription: 'free' as 'free'
      };
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile]);
        
      if (insertError) {
        console.error('Error creating profile:', insertError);
        // Still return the profile even if insert fails
      } else {
        console.log('Created new profile successfully');
      }
      
      return newProfile as User;
    } catch (error) {
      console.error('Failed to get profile, using fallback:', error);
      // Return a fallback user object with explicitly typed role
      return {
        id: userId,
        email: 'user@example.com',
        name: 'User',
        role: 'user' as 'user' // Fix type here
      } as User;
    }
  };

  // Attempt to update user email from session
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

  // Check authentication status - new function
  const checkAuth = async (): Promise<void> => {
    setIsLoading(true);
    console.log('Checking auth status...');
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Session found, user is logged in:', session.user.id);
        const profile = await getProfile(session.user.id);
        
        // Add user_metadata from auth user if available
        if (profile) {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            profile.user_metadata = {
              avatar_url: authUser.user_metadata?.avatar_url as string,
              full_name: authUser.user_metadata?.full_name as string,
              name: authUser.user_metadata?.name as string,
            };
          }
          
          setUser(profile);
        } else {
          setUser(null);
        }
      } else {
        console.log('No session found, user is not logged in');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
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
          handleUserSession(session.user.id);
        } else {
          console.log('No session found, user is not logged in');
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication. Please refresh the page.",
          variant: "destructive",
        });
        setUser(null);
        setIsLoading(false);
      }
    };
    
    // Helper function to handle user session to reduce duplication
    const handleUserSession = async (userId: string) => {
      // Set a timeout to prevent getting stuck
      const timeoutId = setTimeout(() => {
        console.warn('Profile fetch timeout, continuing with basic user');
        setIsLoading(false);
        
        // Create a basic user object if timed out with proper typing
        const basicUser: User = {
          id: userId,
          email: 'user@example.com',
          name: 'User',
          role: 'user'
        };
        
        setUser(basicUser);
        
        // Navigate to courses if needed
        if (window.location.pathname === '/login') {
          navigate('/courses');
        }
      }, 3000); // 3 second timeout
      
      try {
        let profile = await getProfile(userId);
        
        // Clear timeout as we got the profile or error
        clearTimeout(timeoutId);
        
        // If profile is using fallback values, try to update the email
        if (profile && profile.email === 'user@example.com') {
          profile = await updateUserEmailFromSession(userId, profile);
        }
        
        console.log('Setting user state with profile:', profile);
        setUser(profile);
      } catch (error) {
        // Clear timeout as we got an error
        clearTimeout(timeoutId);
        
        console.error('Error during profile handling:', error);
        toast({
          title: "Profile Error",
          description: "Failed to load user profile, using basic data.",
          variant: "destructive",
        });
        
        // Still set a basic user to prevent being stuck with proper typing
        setUser({
          id: userId,
          email: 'user@example.com',
          name: 'User',
          role: 'user'
        });
      } finally {
        setIsLoading(false);
        
        // Force navigation if on login page
        if (window.location.pathname === '/login') {
          navigate('/courses');
        }
      }
    };
    
    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state changed: ${event}`, session ? 'Session exists' : 'No session');
        
        if (session && session.user) {
          handleUserSession(session.user.id);
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
          
          setIsLoading(false);
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  // Login function with timeout and better error handling
  const login = async (email: string, password: string) => {
    console.log(`Attempting login for email: ${email}`);
    setIsLoading(true);
    
    // Set a global timeout for the entire login process
    const loginTimeout = setTimeout(() => {
      console.warn('Login process timeout, resetting loading state');
      setIsLoading(false);
      toast({
        title: "Login Timeout",
        description: "Login process took too long. Please try again.",
        variant: "destructive",
      });
    }, 5000); // 5 second timeout for entire login process
    
    try {
      // First, try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Clear the login timeout since we got a response
      clearTimeout(loginTimeout);
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      if (data.user) {
        console.log('Sign in successful, getting profile for:', data.user.id);
        
        // Navigate to courses immediately after successful sign-in
        // We don't need to wait for profile fetch to complete
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Force navigation to courses page
        navigate('/courses');
        
        // The profile fetch will continue in the background
        // Profile will be set by the auth state change listener
      }
    } catch (error: any) {
      // Clear the login timeout since we got an error
      clearTimeout(loginTimeout);
      
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
      
      // No need to navigate or set user here as Supabase will handle the redirect
      // and the onAuthStateChange listener will handle the session
    } catch (error: any) {
      console.error('Google sign-in process failed:', error);
      toast({
        title: "Google sign-in failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
    } finally {
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

  const signOut = async () => {
    return logout();
  };

  const value = {
    user,
    isLoading,
    login,
    signInWithGoogle,
    signup,
    logout,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    checkAuth
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
