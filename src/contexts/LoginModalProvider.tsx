"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import DiscordLoginModal from "@/components/DiscordLoginModal";

type LoginModalContextType = {
  openLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextType>({ openLoginModal: () => {} });

export function LoginModalProvider({ children, onLogin }: { children: ReactNode; onLogin: () => void }) {
  const [open, setOpen] = useState(false);

  const openLoginModal = useCallback(() => setOpen(true), []);

  return (
    <LoginModalContext.Provider value={{ openLoginModal }}>
      {children}
      <DiscordLoginModal open={open} onClose={() => setOpen(false)} onLogin={onLogin} />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  return useContext(LoginModalContext);
}
