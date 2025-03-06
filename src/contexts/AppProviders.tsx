// App provider combination
import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { MissionProvider } from './MissionContext';
import { StickerProvider } from './StickerContext';
import AuthProvider from './AuthContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <MissionProvider>
          <StickerProvider>
          {children}
          </StickerProvider>
        </MissionProvider>
      </UserProvider>
    </AuthProvider>
  );
};