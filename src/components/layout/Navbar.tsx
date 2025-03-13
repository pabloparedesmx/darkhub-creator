
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-sm">
            <span className="text-white font-bold text-xs">KB</span>
          </div>
          <span className="font-bold text-xl text-foreground">KnowledgeBites</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/courses" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Course catalog
          </Link>
          <Link to="/workshops" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Workshops
          </Link>
          <Link to="/blog" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Blog
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground">
                Community
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-morphism">
              <DropdownMenuItem asChild>
                <Link to="/community/forums" className="cursor-pointer">Forums</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/community/events" className="cursor-pointer">Events</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/community/discord" className="cursor-pointer">Discord</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search KnowledgeBites"
              className="pl-10 pr-4 py-2 w-64 bg-secondary/50 hover:bg-secondary/80 focus:bg-secondary focus:ring-1 focus:ring-primary/50 rounded-full text-sm text-foreground placeholder:text-muted-foreground transition-all"
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="default" size="sm" className="text-sm">
                Sign up
              </Button>
            </Link>
          </div>
        </div>

        <button 
          className="md:hidden flex items-center justify-center" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg animate-slide-down">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-2 pb-2">
              <Link to="/courses" className="px-3 py-2 text-sm font-medium hover:bg-secondary/50 rounded-md">
                Course catalog
              </Link>
              <Link to="/workshops" className="px-3 py-2 text-sm font-medium hover:bg-secondary/50 rounded-md">
                Workshops
              </Link>
              <Link to="/blog" className="px-3 py-2 text-sm font-medium hover:bg-secondary/50 rounded-md">
                Blog
              </Link>
              <details className="group">
                <summary className="px-3 py-2 text-sm font-medium hover:bg-secondary/50 rounded-md list-none flex justify-between items-center cursor-pointer">
                  Community
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="ml-4 mt-1 flex flex-col space-y-1">
                  <Link to="/community/forums" className="px-3 py-2 text-sm hover:bg-secondary/50 rounded-md">
                    Forums
                  </Link>
                  <Link to="/community/events" className="px-3 py-2 text-sm hover:bg-secondary/50 rounded-md">
                    Events
                  </Link>
                  <Link to="/community/discord" className="px-3 py-2 text-sm hover:bg-secondary/50 rounded-md">
                    Discord
                  </Link>
                </div>
              </details>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="relative my-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search KnowledgeBites"
                  className="w-full pl-10 pr-4 py-2 bg-secondary/50 hover:bg-secondary/80 focus:bg-secondary focus:ring-1 focus:ring-primary/50 rounded-full text-sm text-foreground placeholder:text-muted-foreground transition-all"
                />
              </div>
              <div className="flex space-x-2 mt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
