import React, { ReactNode, useEffect } from "react";
import { useDashboard } from "@/contexts/DashboardContext";

const LoadingScreen: React.FC<{
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  children: ReactNode;
}> = ({ isLoading, setIsLoading, children }) => {
  const { loading } = useDashboard(); // Utilisation du DashboardContext

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading, setIsLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background">
        <div className="relative h-48 md:h-64 w-48 md:w-64 flex justify-center items-center">
          <div>
            <div className="absolute top-0 right-0 w-full h-full border-t-8 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div>
              <img
                width={300}
                height={200}
                className="h-28 md:h-36 w-44 md:w-60"
                src="/logo.png"
                alt="Logo"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingScreen;
