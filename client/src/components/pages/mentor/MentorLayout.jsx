import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  User,
  Users,
  FileText,
  BarChart3,
  LogOut,
  MessageSquare,
  BookOpen,
  Briefcase,
  Handshake,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const menuItems = [
  {
    text: "Dashboard",
    path: "/mentor",
    icon: LayoutDashboard,
  },
  {
    text: "Mentorship Requests",
    path: "/mentor/mentorship-requests",
    icon: Handshake,
  },
  {
    text: "Active Mentorships",
    path: "/mentor/active-mentorships",
    icon: Users,
  },
  {
    text: "Browse Projects",
    path: "/mentor/browse-projects",
    icon: Briefcase,
  },
  {
    text: "Chat with Mentees",
    path: "/mentor/chat-with-mentees",
    icon: MessageSquare,
  },
  {
    text: "Create Article",
    path: "/mentor/create-article",
    icon: FileText,
  },
  {
    text: "View Articles",
    path: "/mentor/articles",
    icon: BookOpen,
  },
  {
    text: "Profile",
    path: "/mentor/profile",
    icon: User,
  },
];

function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar className="border-none" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="p-4 flex justify-center items-center gap-2 my-4">
            <div className="text-primary">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">ProjectShare Mentor</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 py-1 space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    size="md"
                    asChild
                    className="hover:bg-[#F8F6FF]"
                    isActive={pathname === item.path}
                  >
                    <Link
                      to={item.path}
                      className="flex items-center w-full px-4 text-gray-700 rounded-md transition-colors"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.text}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function MentorLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('mentor');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#F6F7F9]">
        <AppSidebar />

        <div className="flex flex-col w-full">
          <header className="flex justify-between items-center p-4 m-6 bg-white rounded-lg">
            <div className="flex items-center gap-4">
              <SidebarTrigger size="32" />
              <h1 className="text-xl text-gray-900">Mentor Dashboard</h1>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Logout Confirmation</DialogTitle>
                </DialogHeader>
                <DialogFooter className="flex justify-center gap-4">
                  <Button variant="outline" className="w-28">
                    <DialogClose>
                      Cancel
                    </DialogClose>
                  </Button>
                  <Button className="w-28 bg-red-600 hover:bg-red-700" onClick={handleLogout}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </header>

          <div className="flex h-[82vh] overflow-auto flex-col w- bg-sidebar border-sidebar-border rounded-lg border m-2  p-4 shadow-sm">
          <Outlet />
        </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
