"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Shield, Users, AlertTriangle, Activity, RefreshCw } from "lucide-react";
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
  {
    key: "avgLatency",
    label: "Avg. Latency",
    icon: Activity,
    gradient: "from-purple-500/10 to-purple-500/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    valueColor: "",
  },
];

export default function GlobalDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalUsers: 0,
    activeThreats: 0,
    avgLatency: "0ms",
    recentBlocks: [] as any[],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { orgId } = useOrg();

  const loadData = async () => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const [usersResult, projectsResult, analyticsResult] = await Promise.allSettled([
        fetchApi(`/organizations/${orgId}/users`, {}, token),
        fetchApi(`/organizations/${orgId}/projects`, {}, token),
        fetchApi(`/organizations/${orgId}/analytics`, {}, token),
      ]);

      const users = usersResult.status === "fulfilled" ? usersResult.value : null;
      const projects = projectsResult.status === "fulfilled" ? projectsResult.value : null;
      const analytics = analyticsResult.status === "fulfilled" ? analyticsResult.value : null;

      setStats({
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        totalUsers: Array.isArray(users) ? users.length : 0,
        activeThreats: analytics?.blocked_requests || 0,
        avgLatency: analytics?.avg_latency_ms ? `${Math.round(analytics.avg_latency_ms)}ms` : "0ms",
        recentBlocks: analytics?.recent_blocks || [],
      });

      if (usersResult.status === "rejected" || projectsResult.status === "rejected" || analyticsResult.status === "rejected") {
        setError("Some data failed to load. Showing partial results.");
      }
    } catch (err) {
      setError("Failed to load dashboard data. The backend may be unavailable.");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orgId, getToken]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Real-time overview of your Aegis Firewall cluster.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-card-hover border border-border rounded-lg text-sm font-medium transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-5 py-3 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-500">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Recent Blocked Threats
          </h3>
        </div>
        <div className="divide-y divide-border">
          {stats.recentBlocks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No recent threats detected.
            </div>
          ) : (
            stats.recentBlocks.map((block, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-card-hover transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{block.block_reason}</p>
                    <p className="text-xs text-muted-foreground mt-1">Source IP: {block.client_ip}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(block.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
