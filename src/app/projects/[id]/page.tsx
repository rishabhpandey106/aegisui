"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Shield,
  Brain,
  Activity,
  Zap,
  ArrowLeft,
  BarChart3,
  Clock,
  Ban,
  Percent,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const ruleConfigs: Record<
  string,
  {
    label: string;
    desc: string;
    icon: typeof Shield;
    color: string;
    activeColor: string;
    activeBg: string;
    defaultEnabled: boolean;
  }
> = {
  waf: {
    label: "WAF Protection",
    desc: "Blocks SQL injection, XSS, and malicious payload patterns in real-time.",
    icon: Shield,
    color: "text-accent",
    activeColor: "text-accent",
    activeBg: "bg-accent/10 border-accent/20",
    defaultEnabled: true,
  },
  dlp: {
    label: "DLP Protection",
    desc: "Prevents sensitive data leaks (PII, secrets, tokens) in responses.",
    icon: Shield,
    color: "text-pink-500",
    activeColor: "text-pink-400",
    activeBg: "bg-pink-500/10 border-pink-500/20",
    defaultEnabled: true,
  },
  ai_blocker: {
    label: "AI Prompt Blocker",
    desc: "Detects and blocks malicious LLM injections in real-time.",
    icon: Brain,
    color: "text-purple-500",
    activeColor: "text-purple-400",
    activeBg: "bg-purple-500/10 border-purple-500/20",
    defaultEnabled: false,
  },
  rate_limit: {
    label: "DDoS Rate Limiting",
    desc: "Configure Redis-backed sliding window rate limits per client IP.",
    icon: Activity,
    color: "text-blue-500",
    activeColor: "text-blue-400",
    activeBg: "bg-blue-500/10 border-blue-500/20",
    defaultEnabled: true,
  },
  circuit_breaker: {
    label: "Upstream Circuit Breaker",
    desc: "Automatically block traffic to upstream server if it starts failing or timing out.",
    icon: Zap,
    color: "text-amber-500",
    activeColor: "text-amber-400",
    activeBg: "bg-amber-500/10 border-amber-500/20",
    defaultEnabled: true,
  },
  more: {
    label: "More features coming soon",
    desc: "Additional rules and integrations are in the works. Stay tuned for updates!",
    icon: Activity,
    color: "text-muted-foreground",
    activeColor: "text-muted-foreground",
    activeBg: "bg-muted/30 border-border",
    defaultEnabled: false,
  },
};

function RuleCard({
  ruleType,
  rules,
  toggleRule,
}: {
  ruleType: string;
  rules: any[];
  toggleRule: (ruleType: string, config: any, action: string) => void;
}) {
  const config = ruleConfigs[ruleType];
  if (!config) return null;

  const { label, desc, icon: Icon, activeColor, activeBg, defaultEnabled } = config;
  const rule = rules.find((r) => r.rule_type === ruleType);
  const isActive = rule?.configuration?.enabled ?? defaultEnabled;

  return (
    <div className="bg-card border border-border rounded-xl p-5 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0">
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.color} shrink-0`} />
          <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
            {label}
          </h3>
          <span
            className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded-md ${
              isActive
                ? "bg-accent/10 text-accent"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isActive ? "ACTIVE" : "DISABLED"}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-5">{desc}</p>

      {ruleType === "waf" && (
        <div
          className={`p-4 rounded-lg border ${
            isActive
              ? activeBg
              : "bg-muted/50 border-border"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              isActive ? activeColor : "text-muted-foreground"
            }`}
          >
            {isActive ? "Engine Status: ONLINE" : "WAF Disabled"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isActive
              ? "Filtering malicious HTTP requests."
              : "Requests are not being filtered."}
          </p>
          <button
            onClick={() =>
              toggleRule("waf", { enabled: !isActive }, "block")
            }
            className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-muted hover:bg-muted-foreground/20 text-foreground"
                : "bg-accent hover:bg-accent/90 text-accent-foreground"
            }`}
          >
            {isActive ? "Disable WAF" : "Enable WAF"}
          </button>
        </div>
      )}

      {ruleType === "dlp" && (
        <div
          className={`p-4 rounded-lg border ${
            isActive
              ? activeBg
              : "bg-muted/50 border-border"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              isActive ? activeColor : "text-muted-foreground"
            }`}
          >
            {isActive ? "Engine Status: ONLINE" : "DLP Disabled"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isActive
              ? "Scanning outbound responses for sensitive data."
              : "Sensitive data is not being inspected."}
          </p>
          <button
            onClick={() =>
              toggleRule("dlp", { enabled: !isActive }, "block")
            }
            className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-muted hover:bg-muted-foreground/20 text-foreground"
                : "bg-pink-500 hover:bg-pink-400 text-white"
            }`}
          >
            {isActive ? "Disable DLP" : "Enable DLP"}
          </button>
        </div>
      )}

      {ruleType === "ai_blocker" && (
        <div
          className={`p-4 rounded-lg border ${
            isActive
              ? activeBg
              : "bg-muted/50 border-border"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              isActive ? activeColor : "text-muted-foreground"
            }`}
          >
            {isActive
              ? "Engine Status: ONLINE"
              : "Engine Status: DISABLED"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isActive
              ? "Blocking malicious LLM prompts in real-time."
              : "AI prompt analysis is currently bypassed."}
          </p>
          <button
            onClick={() =>
              toggleRule(
                "ai_blocker",
                { enabled: !isActive },
                "block"
              )
            }
            className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-muted hover:bg-muted-foreground/20 text-foreground"
                : "bg-purple-500 hover:bg-purple-400 text-white"
            }`}
          >
            {isActive ? "Disable Engine" : "Enable Engine"}
          </button>
        </div>
      )}

      {ruleType === "rate_limit" && (
        <div
          className={`p-4 rounded-lg border ${
            isActive
              ? activeBg
              : "bg-muted/50 border-border"
          }`}
        >
          {isActive ? (
            <>
              <p className="text-sm font-medium text-blue-400">
                Configured: {rule?.configuration?.limit ?? 10} requests per{" "}
                {rule?.configuration?.window ?? 60}s
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Action upon trigger:{" "}
                {(rule?.action ?? "block").toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() =>
                    toggleRule(
                      "rate_limit",
                      { enabled: true, limit: 5, window: 60 },
                      "block"
                    )
                  }
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Strict (5/min)
                </button>
                <button
                  onClick={() =>
                    toggleRule(
                      "rate_limit",
                      { enabled: true, limit: 10, window: 60 },
                      "block"
                    )
                  }
                  className="px-3 py-1.5 bg-muted hover:bg-muted-foreground/20 text-foreground rounded-lg text-xs font-medium transition-colors"
                >
                  Default (10/min)
                </button>
                <button
                  onClick={() =>
                    toggleRule(
                      "rate_limit",
                      { enabled: true, limit: 100, window: 60 },
                      "block"
                    )
                  }
                  className="px-3 py-1.5 bg-muted hover:bg-muted-foreground/20 text-foreground rounded-lg text-xs font-medium transition-colors"
                >
                  Relaxed (100/min)
                </button>
                <button
                  onClick={() =>
                    toggleRule(
                      "rate_limit",
                      { enabled: false },
                      "allow"
                    )
                  }
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Disable
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground">
                Rate Limiting Disabled
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Requests will no longer be throttled.
              </p>
              <button
                onClick={() =>
                  toggleRule(
                    "rate_limit",
                    { enabled: true, limit: 10, window: 60 },
                    "block"
                  )
                }
                className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Enable Rate Limiting
              </button>
            </>
          )}
        </div>
      )}

      {ruleType === "circuit_breaker" && (
        <div
          className={`p-4 rounded-lg border ${
            isActive
              ? activeBg
              : "bg-muted/50 border-border"
          }`}
        >
          {isActive ? (
            <>
              <p className="text-sm font-medium text-amber-400">
                Configured: Trips after{" "}
                {rule?.configuration?.max_failures ?? 5} consecutive
                failures. Resets after {rule?.configuration?.timeout ?? 60}
                s.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Action upon trip: 503 Service Unavailable
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() =>
                    toggleRule(
                      "circuit_breaker",
                      { enabled: true, max_failures: 2, timeout: 60 },
                      "block"
                    )
                  }
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-lg text-xs font-medium transition-colors"
                >
                  Aggressive (2 Fails)
                </button>
                <button
                  onClick={() =>
                    toggleRule(
                      "circuit_breaker",
                      { enabled: true, max_failures: 5, timeout: 60 },
                      "block"
                    )
                  }
                  className="px-3 py-1.5 bg-muted hover:bg-muted-foreground/20 text-foreground rounded-lg text-xs font-medium transition-colors"
                >
                  Default (5 Fails)
                </button>
                <button
                  onClick={() =>
                    toggleRule(
                      "circuit_breaker",
                      { enabled: true, max_failures: 10, timeout: 60 },
                      "block"
                    )
                  }
                  className="px-3 py-1.5 bg-muted hover:bg-muted-foreground/20 text-foreground rounded-lg text-xs font-medium transition-colors"
                >
                  Lenient (10 Fails)
                </button>
                <button
                  onClick={() =>
                    toggleRule(
                      "circuit_breaker",
                      { enabled: false },
                      "allow"
                    )
                  }
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Disable
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground">
                Circuit Breaker Disabled
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upstream failures will no longer be isolated.
              </p>
              <button
                onClick={() =>
                  toggleRule(
                    "circuit_breaker",
                    { enabled: true },
                    "block"
                  )
                }
                className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-lg text-sm font-medium transition-colors"
              >
                Enable Circuit Breaker
              </button>
            </>
          )}
        </div>
      )}

      {ruleType === "more" && (
        <div className="p-8 rounded-lg border border-dashed border-border bg-muted/30 text-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <Activity className="w-5 h-5 text-muted-foreground/60" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            More security rules coming soon
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Additional integrations and rule types are in development.
          </p>
        </div>
      )}
    </div>
  );
}

interface Analytics {
  total_requests: number;
  blocked_requests: number;
  avg_latency_ms: number;
  recent_blocks: {
    timestamp: string;
    client_ip: string;
    block_reason: string;
  }[];
}

interface BlockReasonCount {
  reason: string;
  count: number;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const loadProject = async (token: string | null) => {
    const p = await fetchApi(`/projects/${id}`, {}, token);
    setProject(p);
  };

  const loadRules = async (token: string | null) => {
    try {
      const r = await fetchApi(`/projects/${id}/rules`, {}, token);
      setRules(Array.isArray(r) ? r : []);
    } catch (err) {
      console.error("Failed to load rules", err);
    }
  };

  const loadAnalytics = async (token: string | null) => {
    try {
      const a = await fetchApi(`/projects/${id}/analytics`, {}, token);
      setAnalytics(a);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        await loadProject(token);
        if (!mounted) return;
        loadRules(token);
        loadAnalytics(token);
      } catch (err) {
        if (!mounted) return;
        setError("Failed to load project. The backend may be unavailable.");
        console.error("Project load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, [id]);

  const toggleRule = async (
    ruleType: string,
    currentConfig: any,
    action: string
  ) => {
    try {
      const token = await getToken();
      await fetchApi(`/projects/${id}/rules`, {
        method: "POST",
        body: JSON.stringify({
          rule_type: ruleType,
          configuration: currentConfig,
          action: action,
        }),
      }, token);
      loadRules(token);
    } catch (err) {
      alert("Failed to apply rule");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading project configuration...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm mb-4">{error || "Project not found."}</p>
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  const ruleTypes = ["waf", "dlp", "ai_blocker", "rate_limit", "circuit_breaker", "more"];

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex items-center space-x-4">
        <Link
          href="/projects"
          className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2 sm:p-3 bg-accent/10 rounded-xl shrink-0">
            <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
              {project.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
              {project.upstream_url}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Total Requests</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {analytics ? analytics.total_requests.toLocaleString() : "—"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <Ban className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Blocked</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-rose-500">
            {analytics ? analytics.blocked_requests.toLocaleString() : "—"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Avg Latency</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {analytics ? <>{Math.round(analytics.avg_latency_ms)}<span className="text-sm font-normal text-muted-foreground">ms</span></> : "—"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <Percent className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Block Rate</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">
            {analytics && analytics.total_requests > 0
              ? <>{((analytics.blocked_requests / analytics.total_requests) * 100).toFixed(1)}<span className="text-sm font-normal text-muted-foreground">%</span></>
              : "—"}
          </p>
        </div>
      </div>

      {analytics && analytics.recent_blocks.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-border">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center space-x-2">
              <Ban className="w-4 h-4 text-rose-500" />
              <span>Recent Blocks</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 sm:px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                  <th className="px-5 sm:px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Client IP</th>
                  <th className="px-5 sm:px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analytics.recent_blocks.map((block, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 sm:px-6 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(block.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-sm font-mono text-foreground">
                      {block.client_ip}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-500">
                        {block.block_reason}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {ruleTypes.map((type) => (
          <RuleCard
            key={type}
            ruleType={type}
            rules={rules}
            toggleRule={toggleRule}
          />
        ))}
      </div>
    </div>
  );
}
