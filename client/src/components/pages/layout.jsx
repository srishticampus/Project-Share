import { Link, Outlet } from "react-router";
import { Code,  ChevronDown, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
                  <DropdownMenuItem asChild>
                    <Link to="/register/admin" prefetch="false">Admin</Link>
                  </DropdownMenuItem>
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
                    <DropdownMenuItem asChild>
                      <Link to="/register/admin" prefetch="false" onClick={toggleMobileMenu}>Admin</Link>
                    </DropdownMenuItem>
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
              </div>
            </div>
          )}
        </header>

        <Outlet/>

          {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-between px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&amp;copy; {new Date().getFullYear()} ProjectShare. All rights reserved.</p>
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