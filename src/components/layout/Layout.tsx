// src/components/layout/Layout.tsx
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 border-r shadow-sm shrink-0 overflow-y-auto">
            <div className="sticky top-0 max-h-screen overflow-y-auto scrollbar-thin">
              <Sidebar onItemClick={() => {}} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-blue-50 dark:bg-gray-900">
            {/* Header */}
            <div className="fixed z-20 w-full lg:w-[calc(100%-15rem)]">
              <Header
                mobileMenuTrigger={
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden transition-colors hover:bg-primary/10"
                    >
                      {isSidebarOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Menu className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {isSidebarOpen ? "Close menu" : "Open menu"}
                      </span>
                    </Button>
                  </SheetTrigger>
                }
              />
            </div>
            <div
              className={cn(
                "mt-12 md:px-6 md:py-8",
                "transition-all duration-200 ease-in-out"
              )}
            >
              <Outlet />
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Sheet Content */}
        <SheetContent side="left" className="w-60 p-0 border-r shadow-md">
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
