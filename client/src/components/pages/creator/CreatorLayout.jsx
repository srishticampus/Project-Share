import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  LogOut,
  ListChecks,
  MessageSquarePlus,
  Users,
  UserPlus,
  Sparkles
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    text: "Dashboard",
    path: "/creator/dashboard",
    icon: LayoutDashboard,
  },
  {
    text: "Project Management",
    path: "/creator/projects",
    icon: FileText,
  },
  {
    text: "Tasks",
    path: "/creator/tasks",
    icon: ListChecks,
  },
  {
    text: "Applications",
    path: "/creator/applications",
    icon: Users,
  },
  {
    text: "Chat",
    path: "/creator/chat", // This will now point to ChatWithCollaborators
    icon: MessageSquarePlus,
  },
  {
    text: "Mentors",
    path: "/creator/mentors",
    icon: UserPlus,
  },
  {
    text:"ProjectShare AI",
    path: "/creator/projectshare-ai-chat",
    icon: Sparkles,
  }
];

function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar className="border-none h-[84vh] overflow-y-auto" collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="p-4 flex justify-center items-center gap-2 my-4">
            <div className="text-primary">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">ProjectShare Creator</h1>
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

export default function CreatorLayout() {
  const handleLogout = () => {
    alert("Logging out...");
    // Add actual logout logic here
  };

  return (
    <SidebarProvider>
      <div className="flex w-full bg-[#F6F7F9]">
        <AppSidebar />

        <div className="flex h-[82vh] overflow-auto flex-col w-[calc(100%-var(--sidebar-width))] bg-sidebar border-sidebar-border rounded-lg border m-2  p-4 shadow-sm">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}