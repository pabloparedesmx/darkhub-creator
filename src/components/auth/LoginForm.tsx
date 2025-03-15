import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowRight, Mail, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  isLoading: boolean;
}

const LoginForm = ({ isLoading }: LoginFormProps) => {
  const { toast } = useToast();
  const { login, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  // Reset form state when global loading state changes
  useEffect(() => {
    if (!isLoading && loginAttempted) {
      setLoginAttempted(false);
      setInternalLoading(false);
    }
  }, [isLoading, loginAttempted]);

  // Clear errors when user makes changes to form
  useEffect(() => {
    if (timeoutError) {
      setTimeoutError(false);
    }
    if (authError) {
      clearAuthError();
    }
  }, [email, password, authError, clearAuthError]);

  // Add a safety timeout to reset loading state if stuck
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (loginAttempted && (isLoading || internalLoading)) {
      timeoutId = setTimeout(() => {
        if (isLoading || internalLoading) {
          console.log("Login timeout reached, resetting loading state");
          setLoginAttempted(false);
          setInternalLoading(false);
          setTimeoutError(true);
          
          toast({
            title: "Login timeout",
            description: "Login is taking too long. Please try again.",
            variant: "destructive",
          });
        }
      }, 8000); // 8-second timeout, shorter than before
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loginAttempted, isLoading, internalLoading, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted with email:", email);
    
    // Reset states
    setTimeoutError(false);
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoginAttempted(true);
    setInternalLoading(true);
    
    try {
      await login(email, password);
      // Note: We don't reset loading state here as it will be handled by the auth context
    } catch (error) {
      console.error("Login error in component:", error);
      setLoginAttempted(false);
      setInternalLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} autoComplete="off">
      {timeoutError && (
        <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/30 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Login timed out. Please try again or refresh the page if the issue persists.
          </AlertDescription>
        </Alert>
      )}
      
      {authError && (
        <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/30 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {authError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="app_email" className="text-blue-100">Email</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="app_email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-blue-950/40 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50 pl-10"
              disabled={isLoading || internalLoading}
              autoComplete="off"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="app_password" className="text-blue-100">Password</Label>
            <a href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="app_password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-blue-950/40 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50"
              disabled={isLoading || internalLoading}
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading || internalLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="app_remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
            disabled={isLoading || internalLoading}
            className="border-blue-500/50 data-[state=checked]:bg-blue-600"
          />
          <label
            htmlFor="app_remember"
            className="text-sm font-medium leading-none text-blue-100/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium rounded-xl h-11 shadow-lg shadow-blue-500/20" 
          disabled={isLoading || internalLoading}
        >
          {(isLoading || internalLoading) ? (
            <span className="flex items-center justify-center">
              <span className="mr-2">Logging in</span>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="mr-2">Log in</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
        
        {(isLoading || internalLoading) && loginAttempted && (
          <p className="text-xs text-center text-blue-400 animate-pulse">
            Login in progress, please wait...
          </p>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
