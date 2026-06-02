"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Shield, Users, AlertTriangle, Activity } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useOrg } from "@/components/OrgProvider";

const statCards = [
  {
    key: "totalProjects",
    label: "Protected Projects",
    icon: Shield,
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    valueColor: "",
  },
  {
    key: "totalUsers",
    label: "Team Members",
    icon: Users,
    gradient: "from-blue-500/10 to-blue-500/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    valueColor: "",
  },
  {
    key: "activeThreats",
    label: "Active Threats Blocked",
    icon: AlertTriangle,
    gradient: "from-rose-500/10 to-rose-500/5",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    valueColor: "text-rose-500",
  },
];

export default function GlobalDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalUsers: 0,
    activeThreats: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { orgId } = useOrg();

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (!orgId) return;
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const [usersResult, projectsResult] = await Promise.allSettled([
          fetchApi(`/organizations/${orgId}/users`, {}, token),
          fetchApi(`/organizations/${orgId}/projects`, {}, token),
        ]);

        if (!mounted) return;

        const users = usersResult.status === "fulfilled" ? usersResult.value : null;
        const projects = projectsResult.status === "fulfilled" ? projectsResult.value : null;

        setStats({
          totalProjects: Array.isArray(projects) ? projects.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          activeThreats: 0,
        });

        if (usersResult.status === "rejected" || projectsResult.status === "rejected") {
          setError("Some data failed to load. Showing partial results.");
        }
      } catch (err) {
        if (!mounted) return;
        setError("Failed to load dashboard data. The backend may be unavailable.");
        console.error("Dashboard load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [orgId, getToken]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
          Real-time overview of your Aegis Firewall cluster.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-5 py-3 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-500">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map(({ key, label, icon: Icon, iconBg, iconColor, valueColor }) => (
          <div
            key={key}
            className="relative group bg-card border border-border rounded-xl p-5 sm:p-6 hover:bg-card-hover transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className={`text-3xl sm:text-4xl font-bold tracking-tight ${valueColor || "text-foreground"}`}>
                  {stats[key as keyof typeof stats]}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Global Traffic Map</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Connect a live analytics stream to view traffic patterns across all your protected projects.
          </p>
        </div>
      </div>
    </div>
  );
}
