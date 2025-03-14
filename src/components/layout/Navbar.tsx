import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Menu, X, ChevronDown, Bell, LogOut, User, Settings, CreditCard } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Navbar = () => {
  const {
    user,
    logout,
    isAuthenticated,
    isAdmin
  } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboardArea = location.pathname.match(/^\/(dashboard|courses|profile|admin)/);
  
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
  
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 dark ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/a1eb8418-2a78-4ec8-b3f9-ac0807a34936.png" alt="AI Makers" className="h-10" />
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
            
          </div>
          
          {isAuthenticated ?
        // User is logged in
        <div className="flex items-center ml-4 space-x-2">
              {/* Theme Toggle - Only show in dashboard area */}
              {isDashboardArea && <ThemeToggle />}
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>}
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscription" className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscription
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> :
        // User is not logged in
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
            </div>}
        </div>

        <button className="md:hidden flex items-center justify-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg animate-slide-down">
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
              {/* Add theme toggle to mobile menu if in dashboard area */}
              {isDashboardArea && <div className="flex items-center justify-between py-2 px-3">
                  <span className="text-sm">Theme</span>
                  <ThemeToggle />
                </div>}
              
              <div className="relative my-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search KnowledgeBites" className="w-full pl-10 pr-4 py-2 bg-secondary/50 hover:bg-secondary/80 focus:bg-secondary focus:ring-1 focus:ring-primary/50 rounded-full text-sm text-foreground placeholder:text-muted-foreground transition-all" />
              </div>
              
              {isAuthenticated ?
          // Mobile logged in user options
          <div className="space-y-2 mt-2">
                  <Link to="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-md">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  {isAdmin && <Link to="/admin" className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-md">
                      <Settings className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>}
                  <Link to="/settings" className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-md">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button onClick={logout} className="flex items-center space-x-2 p-2 w-full text-left hover:bg-secondary/50 rounded-md">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div> :
          // Mobile login/signup
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
                </div>}
            </div>
          </div>
        </div>}
    </header>;
};

export default Navbar;
