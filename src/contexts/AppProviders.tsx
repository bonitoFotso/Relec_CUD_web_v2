import React, { ReactNode, useState, useEffect } from "react";
import { UserProvider, useUsers } from "./UserContext";
import { MissionProvider, useMissions } from "./MissionContext";
import { StickerProvider, useStickers } from "./StickerContext";
import AuthProvider, { useAuth } from "./AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { DashboardProvider } from "./DashboardContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthProvider>
      <DashboardProvider>
        <UserProvider>
          <MissionProvider>
            <StickerProvider>
              <LoadingScreen isLoading={isLoading} setIsLoading={setIsLoading}>
                {children}
              </LoadingScreen>
            </StickerProvider>
          </MissionProvider>
        </UserProvider>
      </DashboardProvider>
    </AuthProvider>
  );
};
