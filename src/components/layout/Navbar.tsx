
import React, { useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react';

// Create a custom ModeToggle component since the import is missing
const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {theme === 'dark' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

const NavLink = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<React.ComponentProps<typeof RouterNavLink>>
>(({ children, ...props }, ref) => {
  return (
    <RouterNavLink
      {...props}
      ref={ref}
      className={({ isActive }) =>
        `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-secondary hover:text-secondary-foreground px-3 py-2 ${isActive ? 'bg-secondary text-secondary-foreground' : ''}`
      }
    >
      {children}
    </RouterNavLink>
  );
});
NavLink.displayName = "NavLink";

const MobileNavLink = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<React.ComponentProps<typeof RouterNavLink>>
>(({ children, ...props }, ref) => {
  return (
    <RouterNavLink
      {...props}
      ref={ref}
      className={({ isActive }) =>
        `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-secondary hover:text-secondary-foreground px-3 py-2 ${isActive ? 'bg-secondary text-secondary-foreground' : ''}`
      }
    >
      {children}
    </RouterNavLink>
  );
});
MobileNavLink.displayName = "MobileNavLink";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-6">
            <span className="font-bold text-xl">AI Learning</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/courses">Courses</NavLink>
            <NavLink to="/workshops">Workshops</NavLink>
          </nav>
        </div>
        
        {user ? (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {user.name && (
                      <>
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
            <ModeToggle />
          </div>
        )}
        
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Explore the platform
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col p-4">
              <MobileNavLink to="/courses" onClick={closeMobileMenu}>Courses</MobileNavLink>
              <MobileNavLink to="/workshops" onClick={closeMobileMenu}>Workshops</MobileNavLink>
              {user ? (
                <>
                  <MobileNavLink to="/profile" onClick={closeMobileMenu}>Profile</MobileNavLink>
                  <Button variant="destructive" size="sm" onClick={() => { logout(); closeMobileMenu(); }}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </nav>
            <ModeToggle />
          </SheetContent>
        </Sheet>
        
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg">
            <nav className="flex flex-col p-4">
              <MobileNavLink to="/courses" onClick={closeMobileMenu}>Courses</MobileNavLink>
              <MobileNavLink to="/workshops" onClick={closeMobileMenu}>Workshops</MobileNavLink>
              {user ? (
                <>
                  <MobileNavLink to="/profile" onClick={closeMobileMenu}>Profile</MobileNavLink>
                  <Button variant="destructive" size="sm" onClick={() => { logout(); closeMobileMenu(); }}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
