import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Tajawal } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/SoundProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { DiscordAuthProvider } from "@/contexts/DiscordAuthProvider";
import SettingsPanel from "@/components/SettingsPanel";
import FloatingLoginButton from "@/components/FloatingLoginButton";
import LoginModalWrapper from "@/components/LoginModalWrapper";
import LogoutOverlay from "@/components/LogoutOverlay";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aethercoreserver.vercel.app"),
  title: "AETHRECORE | Gaming Community",
  description: "العب. تنافس. تواصل. — WHERE LEGENDS COLLIDE: PLAY. COMPETE. CONNECT.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "AETHRECORE | Gaming Community",
    description: "العب. تنافس. تواصل. — WHERE LEGENDS COLLIDE: PLAY. COMPETE. CONNECT.",
    siteName: "AETHRECORE",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AETHRECORE | Gaming Community",
    description: "العب. تنافس. تواصل. — WHERE LEGENDS COLLIDE: PLAY. COMPETE. CONNECT.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${tajawal.variable} antialiased`}
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
        <ThemeProvider>
          <LanguageProvider>
            <DiscordAuthProvider>
              <SoundProvider>
                <LoginModalWrapper>
                  <PageTransition>
                    {children}
                  </PageTransition>
                  <SettingsPanel />
                  <FloatingLoginButton />
                </LoginModalWrapper>
                <LogoutOverlay />
              </SoundProvider>
            </DiscordAuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
