
import React from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { 
  Package, 
  Boxes, 
  LineChart, 
  TrendingUp, 
  AlertTriangle, 
  CloudSun, 
  MessageCircle,
  LayoutDashboard,
  FileBarChart,
  Settings,
  HelpCircle,
  Bell,
  Search,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar className="bg-sidebar-background border-sidebar-border">
          <SidebarHeader className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl text-sidebar-foreground">StockSavvy</span>
            </Link>
          </SidebarHeader>
          
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-sidebar-muted" />
              <Input 
                placeholder="Search..." 
                className="pl-8 bg-sidebar-background/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-muted focus-visible:ring-primary"
              />
            </div>
          </div>
          
          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-muted">Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-sidebar-foreground">
                      <Link to="/" className="gap-3">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-sidebar-foreground">
                      <Link to="/inventory-monitoring" className="gap-3">
                        <Boxes className="h-4 w-4" />
                        <span>Inventory</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-sidebar-foreground">
                      <Link to="/demand-forecasting" className="gap-3">
                        <LineChart className="h-4 w-4" />
                        <span>Demand Forecasting</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-sidebar-foreground">
                      <Link to="/reordering-system" className="gap-3">
                        <TrendingUp className="h-4 w-4" />
                        <span>Reordering</span>
                        <Badge variant="outline" className="ml-auto text-xs bg-primary/20 text-primary-foreground border-none">
                          5
                        </Badge>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-muted">Advanced</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-sidebar-foreground">
                      <Link to="/weather-impact" className="gap-3">
                        <CloudSun className="h-4 w-4" />
                        <span>Weather Impact</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-sidebar-foreground">
                      <Link to="/sentiment-tracking" className="gap-3">
                        <MessageCircle className="h-4 w-4" />
                        <span>Market Sentiment</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-sidebar-foreground">
                      <Link to="/reports" className="gap-3">
                        <FileBarChart className="h-4 w-4" />
                        <span>Reports & Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="mt-auto border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between mb-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-white/10">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-primary/20 text-primary-foreground">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-muted truncate">john.doe@example.com</p>
              </div>
              <Button variant="ghost" size="icon" className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-white/10">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-subtle">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            
            <div className="flex-1">
              <nav className="hidden md:flex items-center space-x-4">
                <Link to="/inventory-monitoring" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Inventory</Link>
                <Link to="/demand-forecasting" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Forecasting</Link>
                <Link to="/reordering-system" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reordering</Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                <span className="sr-only">Notifications</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </Button>
              
              <span className="h-6 w-px bg-border"></span>
              
              <Button variant="outline" size="sm" className="hidden md:flex">
                <HelpCircle className="h-4 w-4 mr-2" />
                Support
              </Button>
              <Button size="sm">Admin Panel</Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto bg-background/80">
            <div className={cn("pt-2")}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AppLayout;
