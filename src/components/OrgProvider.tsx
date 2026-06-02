"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { fetchApi } from '@/lib/api';

interface OrgContextType {
  orgId: string | null;
  role: string | null;
  loading: boolean;
}

const OrgContext = createContext<OrgContextType>({
  orgId: null,
  role: null,
  loading: true,
});

export function useOrg() {
  return useContext(OrgContext);
}

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncAuth() {
      if (!isLoaded || !isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch("http://localhost:8081/api/v1/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const user = await res.json();
          setOrgId(user.org_id);
          setRole(user.role);
        } else {
          console.error("Failed to sync auth with backend", await res.text());
        }
      } catch (err) {
        console.error("Error syncing auth:", err);
      } finally {
        setLoading(false);
      }
    }

    syncAuth();
  }, [isLoaded, isSignedIn, getToken]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Workspace...</div>;
  }

  return (
    <OrgContext.Provider value={{ orgId, role, loading }}>
      {children}
    </OrgContext.Provider>
  );
}
