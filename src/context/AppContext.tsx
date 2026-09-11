import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, Language, Farmer, NotificationItem } from '../types';
import { StorageService } from '../services/storageService';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeFarmer: Farmer | null;
  setActiveFarmerId: (id: string) => void;
  isAuthenticated: boolean;
  login: (role: UserRole, farmerId?: string) => void;
  logout: () => void;
  setAuthenticated: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  largeFont: boolean;
  setLargeFont: (val: boolean | ((prev: boolean) => boolean)) => void;
  unreadCount: number;
  lastUpdated: string;
  triggerRefresh: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('farmer');
  const [activeFarmer, setActiveFarmerState] = useState<Farmer | null>(null);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(true);
  const [language, setLanguageState] = useState<Language>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeFont, setLargeFont] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString('en-IN'));
  const [version, setVersion] = useState<number>(0);

  const refreshState = useCallback(() => {
    StorageService.initStorage();
    const storedRole = StorageService.getUserRole();
    const storedLang = StorageService.getLanguage();
    const isAuth = StorageService.isAuthenticated();
    const farmerId = StorageService.getActiveFarmerId();
    const farmer = StorageService.getFarmerById(farmerId) || StorageService.getFarmers()[0] || null;

    setRoleState(storedRole);
    setLanguageState(storedLang);
    setIsAuthenticatedState(isAuth);
    setActiveFarmerState(isAuth ? farmer : null);

    const notifs = StorageService.getNotifications(storedRole === 'farmer' && farmer ? farmer.id : undefined);
    const unread = notifs.filter((n: NotificationItem) => !n.isRead).length;
    setUnreadCount(unread);
    setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, []);

  useEffect(() => {
    refreshState();
    const handleStorageChange = () => {
      refreshState();
    };
    window.addEventListener('kisansetu_storage_change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('kisansetu_storage_change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshState, version]);

  const setRole = (newRole: UserRole) => {
    StorageService.setAuthenticated(true);
    StorageService.setUserRole(newRole);
    setRoleState(newRole);
    refreshState();
  };

  const login = (newRole: UserRole, farmerId?: string) => {
    StorageService.setAuthenticated(true);
    StorageService.setUserRole(newRole);
    if (farmerId) {
      StorageService.setActiveFarmerId(farmerId);
    }
    refreshState();
  };

  const logout = () => {
    StorageService.setAuthenticated(false);
    StorageService.setUserRole('farmer');
    refreshState();
  };

  const setAuthenticated = (val: boolean) => {
    StorageService.setAuthenticated(val);
    refreshState();
  };

  const setActiveFarmerId = (id: string) => {
    StorageService.setActiveFarmerId(id);
    const f = StorageService.getFarmerById(id) || null;
    setActiveFarmerState(f);
    refreshState();
  };

  const setLanguage = (newLang: Language) => {
    StorageService.setLanguage(newLang);
    setLanguageState(newLang);
  };

  const triggerRefresh = () => {
    setVersion(v => v + 1);
  };

  const resetDemoData = () => {
    StorageService.resetToDemoDefaults();
    StorageService.setAuthenticated(true);
    refreshState();
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeFarmer,
        setActiveFarmerId,
        isAuthenticated,
        login,
        logout,
        setAuthenticated,
        language,
        setLanguage,
        highContrast,
        setHighContrast,
        largeFont,
        setLargeFont,
        unreadCount,
        lastUpdated,
        triggerRefresh,
        resetDemoData,
      }}
    >
      <div className={`${highContrast ? 'contrast-125 saturate-150' : ''} ${largeFont ? 'text-[17px]' : 'text-[15px]'}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
