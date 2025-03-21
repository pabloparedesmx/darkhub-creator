import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowRight, User, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const { toast } = useToast();
  const { signup, signInWithGoogle, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!fullName || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Pass the user's full name to the signup function
      await signup(fullName, email, password);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error in component:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#051526] bg-gradient-to-b from-[#051526] to-[#0a2540]">
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="flex justify-center mb-8">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/a1eb8418-2a78-4ec8-b3f9-ac0807a34936.png" 
                  alt="AI Makers" 
                  className="h-12" 
                />
              </Link>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
              <p className="text-blue-100/70 text-sm">Sign up to get started with AI Makers</p>
            </div>
            
            <form onSubmit={handleSignup} autoComplete="off">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app_fullName" className="text-blue-100">Full Name</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <User className="h-4 w-4" />
                    </div>
                    <Input
                      id="app_fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-blue-950/40 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50 pl-10"
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>
                </div>
                
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
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="app_password" className="text-blue-100">Password</Label>
                  <div className="relative">
                    <Input
                      id="app_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-blue-950/40 border-blue-500/30 text-blue-100 placeholder:text-blue-400/50"
                      disabled={isLoading}
                      autoComplete="off"
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
                    id="app_terms" 
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                    disabled={isLoading}
                    className="border-blue-500/50 data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor="app_terms"
                    className="text-sm font-medium leading-none text-blue-100/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">Privacy Policy</Link>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium rounded-xl h-11 shadow-lg shadow-blue-500/20" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Creating account</span>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Sign up</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-500/30"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-blue-300 bg-[#0a1e36]">OR</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500/30 text-blue-100 hover:bg-blue-900/30 rounded-xl" 
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="mr-2 h-4 w-4">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    <path d="M1 1h22v22H1z" fill="none"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-blue-100/70">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
                Log in
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
