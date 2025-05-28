import { Link, Outlet } from "react-router";
import { Code,  ChevronDown, Menu, User, Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import Notifications from '../Notifications';
export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Check if the token exists in local storage on component mount
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise

    // Get user role from local storage
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getProfileLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/profile';
      case 'creator':
        return '/creator/profile';
      case 'collaborator':
        return '/collaborator/profile';
      case 'mentor':
        return '/mentor/profile';
      default:
        return '/profile'; // Default profile page
    }
  };

    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <Link to="/" className="flex items-center space-x-2" prefetch="false">
              <Code className="h-6 w-6 text-primary" />
              <span className="font-bold inline-block">ProjectShare</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false">
                Home
              </Link>
              <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false">
                About
              </Link>
               <Link to="/features" className="transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false">
                Features
              </Link>
              <Link to="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false">
                Contact Us
              </Link>
              <Link to="/projects" className="transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false">
                Projects
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground hover:text-foreground/80"
              onClick={toggleMobileMenu}
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications Dropdown */}
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  {/* Notifications component will be rendered here */}
                  <Notifications onNotificationClick={() => setShowNotifications(false)} />
                </DropdownMenuContent>
              </DropdownMenu>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={getProfileLink()} prefetch="false">
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" prefetch="false">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        setIsLoggedIn(false);
                        setUserRole(null);
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-1">
                        Login
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/login/admin" prefetch="false">Admin</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/login/creator" prefetch="false">Project Creator</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/login/collaborator" prefetch="false">Collaborator</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/login/mentor" prefetch="false">Mentor/Expert</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-1">
                        Sign Up
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* <DropdownMenuItem asChild>
                        <Link to="/register/admin" prefetch="false">Admin</Link>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem asChild>
                        <Link to="/register/creator" prefetch="false">Project Creator</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register/collaborator" prefetch="false">Collaborator</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register/mentor" prefetch="false">Mentor/Expert</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-14 left-0 w-full bg-background border-b z-50">
              <div className="flex flex-col p-4 space-y-2">
                <Link to="/" className="block transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false" onClick={toggleMobileMenu}>
                  Home
                </Link>
                <Link to="/about" className="block transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false" onClick={toggleMobileMenu}>
                  About
                </Link>
                <Link to="/features" className="block transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false" onClick={toggleMobileMenu}>
                  Features
                </Link>
                <Link to="/contact" className="block transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false" onClick={toggleMobileMenu}>
                  Contact Us
                </Link>
                <Link to="/projects" className="block transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false" onClick={toggleMobileMenu}>
                  Projects
                </Link>
                {/* Notifications Dropdown (Mobile) */}
                <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 w-full justify-center">
                      <Bell className="h-6 w-6" />
                      Notifications
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-full">
                    {/* Notifications component will be rendered here */}
                    <Notifications onNotificationClick={() => setShowNotifications(false)} />
                  </DropdownMenuContent>
                </DropdownMenu>

                {isLoggedIn ? (
                  <>
                    <Link to={getProfileLink(userRole)} className="block transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false" onClick={toggleMobileMenu}>
                      My Profile
                    </Link>
                    <Link to="/settings" className="block transition-colors hover:text-foreground/80 text-foreground/60" prefetch="false" onClick={toggleMobileMenu}>
                      Settings
                    </Link>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1 w-full justify-center"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        setIsLoggedIn(false);
                        setUserRole(null);
                        window.location.href = '/'; // Redirect to home after logout
                        toggleMobileMenu();
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1 w-full justify-center">
                          Login
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/login/admin" prefetch="false" onClick={toggleMobileMenu}>Admin</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/login/creator" prefetch="false" onClick={toggleMobileMenu}>Project Creator</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/login/collaborator" prefetch="false" onClick={toggleMobileMenu}>Collaborator</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/login/mentor" prefetch="false" onClick={toggleMobileMenu}>Mentor/Expert</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1 w-full justify-center">
                          Sign Up
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* <DropdownMenuItem asChild>
                          <Link to="/register/admin" prefetch="false" onClick={toggleMobileMenu}>Admin</Link>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem asChild>
                          <Link to="/register/creator" prefetch="false" onClick={toggleMobileMenu}>Project Creator</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/register/collaborator" prefetch="false" onClick={toggleMobileMenu}>Collaborator</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/register/mentor" prefetch="false" onClick={toggleMobileMenu}>Mentor/Expert</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1"> {/* Make the main content area flexible */}
          <Outlet/>
        </div>

          {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-between px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ProjectShare. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
          <Link to="/terms" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch="false">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch="false">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
    );
  }
