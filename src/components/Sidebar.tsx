"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { LayoutDashboard, Network, Users, Settings, ShieldAlert, X, Sun, Moon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Network },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 h-16 border-b border-sidebar-border shrink-0">
        <Link href="/" className="flex items-center space-x-3">
          <ShieldAlert className="w-7 h-7 text-accent" />
          <span className="text-lg font-bold tracking-wider text-foreground">
            AEGIS<span className="text-accent">_</span>
          </span>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                isActive
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border shrink-0">
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      <div className="px-6 py-3 border-t border-sidebar-border shrink-0 flex items-center justify-between">
        <UserButton afterSignOutUrl="/" />
        <p className="text-xs text-muted-foreground/60 text-center">v0.1.0-alpha</p>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar-bg border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar-bg border-r border-sidebar-border backdrop-blur-xl">
        {sidebarContent}
      </aside>
    </>
  );
}
