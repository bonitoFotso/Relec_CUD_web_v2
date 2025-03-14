// src/components/layout/Layout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        {/* Header */}
        <Header 
          mobileMenuTrigger={
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
          } 
        />

        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 border-r shrink-0 overflow-y-auto">
            <Sidebar onItemClick={() => {}} />
          </aside>

          {/* Mobile Sidebar */}
          <SheetContent side="left" className="w-72 p-0 border-r">
            <SheetHeader className="py-4 px-6 border-b">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
          </SheetContent>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6 bg-warning">
              <Outlet />
            </div>
          </main>
        </div>
      </Sheet>

      {/* Footer */}
      <Footer />
    </div>
  );
};