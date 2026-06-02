import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { OrgProvider } from "@/components/OrgProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aegis Security Firewall",
  description: "Enterprise-grade API security and AI protection",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full">
          <ThemeProvider>
            {!userId ? (
              <div className="min-h-screen flex items-center justify-center bg-background">
                <SignIn routing="hash" />
              </div>
            ) : (
              <OrgProvider>
                <AppShell>{children}</AppShell>
              </OrgProvider>
            )}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
