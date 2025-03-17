// src/components/layout/Layout.tsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        {/* Header */}
        <Header
          mobileMenuTrigger={
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden transition-colors hover:bg-primary/10">
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isSidebarOpen ? 'Close menu' : 'Open menu'}
                </span>
              </Button>
            </SheetTrigger>
          }
        />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 border-r shadow-sm shrink-0 overflow-y-auto">
            <div className="sticky top-0 max-h-screen overflow-y-auto scrollbar-thin">
              <Sidebar onItemClick={() => {}} />
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pt-2">
            <div className={cn(
              "container mx-auto px-4 py-6 md:px-6 md:py-8",
              "transition-all duration-200 ease-in-out"
            )}>
              <Outlet />
            </div>
          </main>
        </div>
        
        {/* Mobile Sidebar Sheet Content */}
        <SheetContent 
          side="left" 
          className="w-72 p-0 border-r shadow-md"
        >
          <SheetHeader className="py-4 px-6 border-b bg-muted/30">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto max-h-[calc(100vh-5rem)] scrollbar-thin">
            <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};