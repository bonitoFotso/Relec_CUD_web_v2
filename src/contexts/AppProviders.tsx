import React, { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { MissionProvider } from "./MissionContext";
import { StickerProvider } from "./StickerContext";
import AuthProvider from "./AuthContext";
import { PermissionProvider } from "./PermissionContext";
import { EquipementProvider } from "./EquipementContext";
import { CompanieProvider } from "./CompagnieContext";

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
                <CompanieProvider>
                  {children}
                </CompanieProvider>
              </EquipementProvider>
            </PermissionProvider>
          </StickerProvider>
        </MissionProvider>
      </UserProvider>
    </AuthProvider>
  );
};
