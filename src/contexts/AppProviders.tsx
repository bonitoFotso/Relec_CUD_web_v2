import React, { ReactNode, useState, useEffect } from "react";
import { UserProvider, useUsers } from "./UserContext";
import { MissionProvider, useMissions } from "./MissionContext";
import { StickerProvider, useStickers } from "./StickerContext";
import AuthProvider, { useAuth } from "./AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { PermissionProvider } from "./PermissionContext";
import { EquipementProvider } from "./EquipementContext";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <MissionProvider>
          <StickerProvider>
            <PermissionProvider>
              <EquipementProvider>
                {children}
              </EquipementProvider>
            </PermissionProvider>
          </StickerProvider>
        </MissionProvider>
      </UserProvider>
    </AuthProvider>
  );
};
