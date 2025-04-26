import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  User,
  Users,
  FileText,
  BarChart3,
  LogOut
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
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    text: "Mentor/Expert Requests",
    path: "/admin/mentor-requests",
    icon: FileText,
  },
  {
    text: "Projects",
    path: "/admin/projects",
    icon: FileText,
  },
  {
    text: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    text: "Content Moderation",
    path: "/admin/content-moderation",
    icon: LayoutDashboard,
  },
  {
    text: "Platform Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    text: "Contact Submissions",
    path: "/admin/contact-submissions",
    icon: FileText,
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
            <h1 className="text-xl font-bold text-gray-900">ProjectShare Admin</h1>
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

export default function AdminLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('admin');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/'; // Redirect to home after logout
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#F6F7F9]">
        <AppSidebar />

        <div className="flex flex-col w-[calc(100%-var(--sidebar-width))]">
          <header className="flex justify-between items-center p-4 m-6 bg-white rounded-lg">
            <div className="flex items-center gap-4">
              <SidebarTrigger size="32" />
              <h1 className="text-xl text-gray-900">Admin Dashboard</h1>
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
                    Cancel
                  </Button>
                  <Button className="w-28 bg-red-600 hover:bg-red-700" onClick={handleLogout}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </header>

          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}