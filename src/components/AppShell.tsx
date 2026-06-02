"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { ShieldAlert, Menu } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <header className="sticky top-0 z-30 lg:hidden bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="flex items-center space-x-2">
                <ShieldAlert className="w-6 h-6 text-accent" />
                <span className="text-lg font-bold tracking-wider text-foreground">
                  AEGIS<span className="text-accent">_</span>
                </span>
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
