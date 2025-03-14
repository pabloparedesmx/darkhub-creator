
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { toast } = useToast();
  const { login, signInWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted with email:", email);
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error in component:", error);
    }
  };

  // Add a safety timeout to reset loading state if stuck
  if (loginAttempted && isLoading) {
    setTimeout(() => {
      if (isLoading) {
        console.log("Login timeout reached, resetting loading state");
        setLoginAttempted(false);
        toast({
          title: "Tiempo de espera excedido",
          description: "El inicio de sesión está tardando demasiado. Por favor, inténtelo de nuevo.",
          variant: "destructive",
        });
      }
    }, 10000); // 10-second timeout
  }

  return (
    <div className="min-h-screen flex flex-col bg-background ai-neural-bg">
      <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm"></div>
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="ai-card p-8 border-blue-400/20"
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
            
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-100">Bienvenido de nuevo</h1>
            
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-100">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-blue-950/50 border-blue-500/30 text-blue-100 placeholder:text-blue-400/70"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-blue-100">Contraseña</Label>
                    <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
                      ¿Olvidó su contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-blue-950/50 border-blue-500/30 text-blue-100 placeholder:text-blue-400/70"
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
                    Recordarme
                  </label>
                </div>
                
                <Button type="submit" className="w-full ai-button" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
                
                {isLoading && loginAttempted && (
                  <p className="text-xs text-center text-blue-400 animate-pulse">
                    Inicio de sesión en progreso, por favor espere...
                  </p>
                )}
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-500/30"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-secondary px-2 text-blue-300">O continuar con</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500/30 text-blue-100 hover:bg-blue-900/30" 
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
                  Google
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-blue-100/70">
              ¿No tiene una cuenta?{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 hover:underline">
                Regístrese
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Login;
