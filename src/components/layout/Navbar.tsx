import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
const Navbar = () => {
  const location = useLocation();
  const {
    user,
    logout
  } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  const isHome = location.pathname === '/';
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  // Check if we are on public routes
  const isPublicRoute = isHome || isAuthPage;
  return <header className={cn('fixed top-0 z-50 w-full border-b transition-all duration-200', isScrolled || !isPublicRoute ? 'border-border/40 bg-background/95 backdrop-blur-md' : 'border-transparent bg-transparent')}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L3 9L16 16L29 9L16 2Z" className={isHome ? "fill-white" : "fill-current"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 23L16 30L29 23" className={isHome ? "stroke-white" : "stroke-current"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 16L16 23L29 16" className={isHome ? "stroke-white" : "stroke-current"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={cn("font-semibold", isHome && "text-white")}>AI MAKERS</span>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/courses" className={cn("text-sm font-medium hover:text-primary transition-colors", isHome && "text-white hover:text-white/80", location.pathname.startsWith('/courses') && "text-primary")}>
            Cursos
          </Link>
          <Link to="/prompts" className={cn("text-sm font-medium hover:text-primary transition-colors", isHome && "text-white hover:text-white/80", location.pathname.startsWith('/prompts') && "text-primary")}>
            Prompts
          </Link>
          <Link to="/tools" className={cn("text-sm font-medium hover:text-primary transition-colors", isHome && "text-white hover:text-white/80", location.pathname.startsWith('/tools') && "text-primary")}>
            Herramientas
          </Link>
          {user && user.role === 'admin' && <Link to="/admin" className={cn("text-sm font-medium hover:text-primary transition-colors", isHome && "text-white hover:text-white/80", location.pathname.startsWith('/admin') && "text-primary")}>
              Admin
            </Link>}
          
          {/* Rest of nav items */}
          <div className="space-x-2">
            {user ? <>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Salir
                </Button>
                <Button variant={isHome ? "outline" : "default"} size="sm" asChild>
                  <Link to="/profile">Mi Perfil</Link>
                </Button>
              </> : <>
                <Button variant="ghost" size="sm" asChild className={isHome ? "text-white hover:text-white/80 hover:bg-white/10" : ""}>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button variant={isHome ? "outline" : "default"} size="sm" asChild className={isHome ? "text-white bg-white/10 hover:bg-white/20 border-white/10" : ""}>
                  <Link to="/signup">Registrarse</Link>
                </Button>
              </>}
          </div>
          
          {/* Theme toggle - always visible */}
          <ThemeToggle />
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button className="ml-2 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden bg-background border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/courses" className="text-sm font-medium hover:text-primary">
              Cursos
            </Link>
            <Link to="/prompts" className="text-sm font-medium hover:text-primary">
              Prompts
            </Link>
            <Link to="/tools" className="text-sm font-medium hover:text-primary">
              Herramientas
            </Link>
            {user && user.role === 'admin' && <Link to="/admin" className="text-sm font-medium hover:text-primary">
                Admin
              </Link>}
            
            <div className="pt-2 border-t">
              {user ? <div className="space-y-2">
                  <Button variant="secondary" size="sm" className="w-full" asChild>
                    <Link to="/profile">Mi Perfil</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                    Salir
                  </Button>
                </div> : <div className="space-y-2">
                  <Button variant="default" size="sm" className="w-full" asChild>
                    <Link to="/signup">Registrarse</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                </div>}
            </div>
          </nav>
        </div>}
    </header>;
};
export default Navbar;