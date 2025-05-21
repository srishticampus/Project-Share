import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Search,
  Folder,
  Briefcase,
  MessageSquare,
  Users,
  User,
  LogOut,
  ChevronDown
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
import { useState } from "react";

const menuItems = [
  {
    text: "Dashboard",
    path: "/collaborator/dashboard",
    icon: LayoutDashboard,
  },
  {
    text: "Browse Projects",
    path: "/collaborator/browse-projects",
    icon: Search,
  },
  {
    text: "My Projects",
    icon: Folder,
    children: [
      {
        text: "Applied Projects",
        path: "/collaborator/my-projects/applied",
      },
      {
        text: "Active Projects",
        path: "/collaborator/my-projects/active",
      },
      {
        text: "Completed Projects",
        path: "/collaborator/my-projects/completed",
      },
    ],
  },
  {
    text: "Portfolio",
    path: "/collaborator/portfolio",
    icon: Briefcase,
  },
  {
    text: "Chat with Creators",
    path: "/collaborator/chat-with-creators",
    icon: MessageSquare,
  },
  {
    text: "Connect with Mentors",
    path: "/collaborator/connect-with-mentors",
    icon: Users,
  },
  {
    text: "Profile",
    path: "/collaborator/profile",
    icon: User,
  },
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
            <h1 className="text-xl font-bold text-gray-900">ProjectShare Collaborator</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 py-1 space-y-2">
              {menuItems.map((item) => (
                item.children ? (
                  <SidebarGroup key={item.text} collapsible="icon">
                    <SidebarGroupLabel className="flex items-center w-full px-4 text-gray-700 rounded-md transition-colors cursor-pointer">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.text}</span>
                      <ChevronDown className="w-4 h-4 ml-auto transition-transform group-[[data-collapsed=false]]:rotate-180" />
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      {item.children.map((child) => (
                        <SidebarMenuItem key={child.path}>
                          <SidebarMenuButton
                            size="md"
                            asChild
                            className="hover:bg-[#F8F6FF]"
                            isActive={pathname === child.path}
                          >
                            <Link
                              to={child.path}
                              className="flex items-center w-full px-4 text-gray-700 rounded-md transition-colors"
                            >
                              <span>{child.text}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarGroupContent>
                  </SidebarGroup>
                ) : (
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
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function CollaboratorLayout() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/'; // Redirect to home after logout
  };

  return (
    <SidebarProvider>
      <div className="flex w-full bg-[#F6F7F9]">
        <AppSidebar />




        <div className="flex h-[82vh] overflow-y-auto flex-col w-[calc(100%-var(--sidebar-width))] bg-sidebar border-sidebar-border rounded-lg border m-2  py-6 shadow-sm"> {/* Added flex-1 and overflow-y-auto */}
          {/* <header className="flex justify-between items-center p-4 m-6 bg-white rounded-lg shrink-0"> 
            <div className="flex items-center gap-4">
              <SidebarTrigger size="32" />
              <h1 className="text-xl text-gray-900">Collaborator Dashboard</h1>
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
          </header> */}
          <Outlet />
        </div>
      </div>

    </SidebarProvider>
  );
}
