
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
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);

  // Clear timeout error when user makes changes to form
  useEffect(() => {
    if (timeoutError) {
      setTimeoutError(false);
    }
  }, [email, password]);

  // Add a safety timeout to reset loading state if stuck
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (loginAttempted && isLoading) {
      timeoutId = setTimeout(() => {
        if (isLoading) {
          console.log("Login timeout reached, resetting loading state");
          setLoginAttempted(false);
          setTimeoutError(true);
          
          toast({
            title: "Login timeout",
            description: "Login is taking too long. Please try again.",
            variant: "destructive",
          });
        }
      }, 10000); // 10-second timeout
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loginAttempted, isLoading, toast]);

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
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error in component:", error);
      setLoginAttempted(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {timeoutError && (
        <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/30 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Login timed out. Please try again or refresh the page if the issue persists.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-blue-100">Email</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-blue-950/40 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50 pl-10"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-blue-100">Password</Label>
            <a href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-blue-950/40 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
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
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
            disabled={isLoading}
            className="border-blue-500/50 data-[state=checked]:bg-blue-600"
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none text-blue-100/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium rounded-xl h-11 shadow-lg shadow-blue-500/20" 
          disabled={isLoading}
        >
          {isLoading ? (
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
        
        {isLoading && loginAttempted && (
          <p className="text-xs text-center text-blue-400 animate-pulse">
            Login in progress, please wait...
          </p>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
