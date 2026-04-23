import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type AuthPendingAction = {
  type: 'CALL_GUIDE';
  payload?: Record<string, unknown>;
};

interface AuthFlowContextType {
  pendingAction: AuthPendingAction | null;
  requestAuth: (action: AuthPendingAction) => void;
  clearPendingAction: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthFlowContext = createContext<AuthFlowContextType | undefined>(undefined);

export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const [pendingAction, setPendingAction] = useState<AuthPendingAction | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const requestAuth = useCallback((action: AuthPendingAction) => {
    setPendingAction(action);
    setIsLoginModalOpen(true);
  }, []);

  const clearPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  useEffect(() => {
    if (isAuthenticated && isLoginModalOpen) {
      setIsLoginModalOpen(false);
    }
  }, [isAuthenticated, isLoginModalOpen]);

  const value = useMemo<AuthFlowContextType>(() => ({
    pendingAction,
    requestAuth,
    clearPendingAction,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  }), [pendingAction, requestAuth, clearPendingAction, isLoginModalOpen, openLoginModal, closeLoginModal]);

  return (
    <AuthFlowContext.Provider value={value}>
      {children}
    </AuthFlowContext.Provider>
  );
}

export function useAuthFlow() {
  const context = useContext(AuthFlowContext);
  if (!context) {
    throw new Error('useAuthFlow must be used within an AuthFlowProvider');
  }
  return context;
}
