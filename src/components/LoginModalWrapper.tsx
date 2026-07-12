"use client";

import { type ReactNode } from "react";
import { LoginModalProvider } from "@/contexts/LoginModalProvider";
import { useDiscordAuth } from "@/contexts/DiscordAuthProvider";

export default function LoginModalWrapper({ children }: { children: ReactNode }) {
  const { login } = useDiscordAuth();
  return <LoginModalProvider onLogin={login}>{children}</LoginModalProvider>;
}
