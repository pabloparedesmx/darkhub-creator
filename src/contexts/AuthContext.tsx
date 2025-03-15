import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authChecked: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to clear authentication errors
  const clearAuthError = () => {
    setAuthError(null);
  };

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

  // Logout function
  const logout = async () => {
    if (!authChecked) {
      console.warn('Cannot logout before auth initialization');
      return;
    }
    
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
    } catch (error: any) {
      console.error('Logout failed:', error);
      setAuthError(error.message || "Failed to log out");
      toast({
        title: "Logout failed",
        description: "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize authentication state
  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    let sessionCheckInterval: NodeJS.Timeout | null = null;

    const initializeAuth = async () => {
      if (!mounted) return;
      
      setIsLoading(true);
      console.log('Initializing auth state...');
      
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (mounted) {
            setAuthChecked(true);
            setIsLoading(false);
          }
          return;
        }

        // Set up auth state change listener - only listen for critical auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log(`Auth state changed: ${event}`, currentSession ? 'Session exists' : 'No session');
          
          if (!mounted) return;

          // Only process these specific auth events to avoid loops
          const criticalEvents = ['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED', 'USER_DELETED', 'PASSWORD_RECOVERY'];
          
          if (!criticalEvents.includes(event) && event !== 'INITIAL_SESSION') {
            console.log(`Ignoring non-critical auth event: ${event}`);
            return;
          }
          
          // Avoid processing duplicate INITIAL_SESSION events
          if (event === 'INITIAL_SESSION' && authChecked) {
            console.log('Ignoring duplicate INITIAL_SESSION event');
            return;
          }

          if (currentSession?.user) {
            setIsLoading(true);
            
            try {
              // Avoid unnecessary profile fetches if we already have this user
              if (user?.id === currentSession.user.id && event !== 'USER_UPDATED') {
                console.log('User already loaded, skipping profile fetch');
                setIsLoading(false);
                return;
              }
              
              const profile = await getProfile(currentSession.user.id);
              
              if (mounted) {
                if (profile) {
                  setUser(profile);
                } else {
                  const tempUser: User = {
                    id: currentSession.user.id,
                    email: currentSession.user.email || '',
                    name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
                    role: 'user'
                  };
                  setUser(tempUser);

                  // Try to create profile in background
                  supabase.from('profiles').insert([{
                    id: currentSession.user.id,
                    email: currentSession.user.email || '',
                    name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
                    role: 'user',
                    subscription: 'free'
                  }]).then(() => {
                    if (mounted) {
                      getProfile(currentSession.user.id).then(newProfile => {
                        if (mounted && newProfile) setUser(newProfile);
                      });
                    }
                  });
                }
              }

              // Navigate to courses page after login or signup
              if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                navigate('/courses');
              }
            } catch (error) {
              console.error('Error in auth state change:', error);
              if (mounted) {
                const fallbackUser: User = {
                  id: currentSession.user.id,
                  email: currentSession.user.email || '',
                  name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
                  role: 'user'
                };
                setUser(fallbackUser);
                
                toast({
                  title: "Profile Error",
                  description: "There was an error loading your profile. Some features may be limited.",
                  variant: "destructive",
                });
              }
            } finally {
              if (mounted) {
                setIsLoading(false);
                setAuthChecked(true);
              }
            }
          } else {
            if (mounted) {
              console.log('No session, setting user to null');
              setUser(null);
              setIsLoading(false);
              setAuthChecked(true);
              
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
          }
        });

        authSubscription = { unsubscribe: subscription.unsubscribe };

        // Handle initial session
        if (session?.user) {
          try {
            const profile = await getProfile(session.user.id);
            if (mounted) {
              if (profile) {
                setUser(profile);
              } else {
                const tempUser: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                  role: 'user'
                };
                setUser(tempUser);
              }
            }
          } catch (error) {
            console.error('Error handling initial session:', error);
            if (mounted) {
              setUser(null);
              toast({
                title: "Authentication Error",
                description: "Failed to load your profile. Please try logging in again.",
                variant: "destructive",
              });
            }
          }
        }
        
        // Set up session refresh mechanism
        if (session) {
          // Check session validity every minute
          sessionCheckInterval = setInterval(async () => {
            if (!mounted) return;
            
            try {
              // Refresh the session to keep it active
              const { data, error } = await supabase.auth.refreshSession();
              
              if (error) {
                console.warn('Session refresh failed:', error);
                // If refresh fails, check if we still have a valid session
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                
                if (!currentSession && mounted) {
                  console.log('Session expired, logging out');
                  clearInterval(sessionCheckInterval!);
                  sessionCheckInterval = null;
                  setUser(null);
                  setAuthChecked(true);
                  
                  // Only navigate if on a protected route
                  const protectedRoutes = ['/courses', '/profile', '/admin', '/dashboard'];
                  const isOnProtectedRoute = protectedRoutes.some(route => 
                    window.location.pathname.startsWith(route)
                  );
                  
                  if (isOnProtectedRoute) {
                    navigate('/', { replace: true });
                  }
                }
              } else {
                console.log('Session refreshed successfully');
              }
            } catch (refreshError) {
              console.error('Error during session refresh:', refreshError);
            }
          }, 60000); // Check every minute
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        if (mounted) {
          toast({
            title: "Authentication Error",
            description: "Failed to initialize authentication. Please refresh the page.",
            variant: "destructive",
          });
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthChecked(true);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
    };
  }, [navigate, toast, user?.id]);

  // Login function
  const login = async (email: string, password: string) => {
    console.log(`Attempting login for email: ${email}`);
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Check if we can access storage before attempting login
      try {
        localStorage.getItem('test-storage-access');
      } catch (storageError) {
        console.warn('Storage access issue detected before login attempt:', storageError);
        // Continue anyway, our custom storage handler should handle this
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        setAuthError(error.message);
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
      
      // Check if this is a storage access error
      if (error.message && (
        error.message.includes('storage') || 
        error.message.includes('localStorage') || 
        error.message.includes('Access') ||
        error.message.includes('permission')
      )) {
        setAuthError("Browser storage access denied. Try disabling private browsing or browser extensions.");
        toast({
          title: "Storage access error",
          description: "Your browser is blocking storage access. Try disabling private browsing or browser extensions.",
          variant: "destructive",
        });
      } else {
        setAuthError(error.message || "Invalid email or password");
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      }
      
      throw error; // Re-throw to allow component to handle error state
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In function
  const signInWithGoogle = async () => {
    console.log('Attempting to sign in with Google');
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Check if we can access storage before attempting Google sign-in
      try {
        localStorage.getItem('test-storage-access');
      } catch (storageError) {
        console.warn('Storage access issue detected before Google sign-in attempt:', storageError);
        // Continue anyway, our custom storage handler should handle this
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/courses`
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        setAuthError(error.message);
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
      
      // Check if this is a storage access error
      if (error.message && (
        error.message.includes('storage') || 
        error.message.includes('localStorage') || 
        error.message.includes('Access') ||
        error.message.includes('permission')
      )) {
        setAuthError("Browser storage access denied. Try disabling private browsing or browser extensions.");
        toast({
          title: "Storage access error",
          description: "Your browser is blocking storage access. Try disabling private browsing or browser extensions.",
          variant: "destructive",
        });
      } else {
        setAuthError(error.message || "Could not sign in with Google");
        toast({
          title: "Google sign-in failed",
          description: error.message || "Could not sign in with Google",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    console.log(`Attempting signup for email: ${email}`);
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Check if we can access storage before attempting signup
      try {
        localStorage.getItem('test-storage-access');
      } catch (storageError) {
        console.warn('Storage access issue detected before signup attempt:', storageError);
        // Continue anyway, our custom storage handler should handle this
      }
      
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
        setAuthError(error.message);
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
      
      // Check if this is a storage access error
      if (error.message && (
        error.message.includes('storage') || 
        error.message.includes('localStorage') || 
        error.message.includes('Access') ||
        error.message.includes('permission')
      )) {
        setAuthError("Browser storage access denied. Try disabling private browsing or browser extensions.");
        toast({
          title: "Storage access error",
          description: "Your browser is blocking storage access. Try disabling private browsing or browser extensions.",
          variant: "destructive",
        });
      } else {
        setAuthError(error.message || "Failed to create account");
        toast({
          title: "Signup failed",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    authError,
    clearAuthError,
    login,
    signInWithGoogle,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    authChecked
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
