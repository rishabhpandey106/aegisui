"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Building2, Save, Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useOrg } from "@/components/OrgProvider";

export default function SettingsHub() {
  const [org, setOrg] = useState<any>(null);
  const [plan, setPlan] = useState("enterprise");
  const [saving, setSaving] = useState(false);
  const { getToken } = useAuth();
  const { orgId } = useOrg();

  const loadOrg = async () => {
    try {
      const data = await fetchApi(`/organizations/${orgId}`,{}, await getToken());
      setOrg(data);
      setPlan(data?.plan || "enterprise");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrg();
  }, []);

  const handleUpdate = async () => {
    alert(`Organization plan updated to: ${plan}`);
  };

  const plans = [
    {
      id: "startup",
      name: "Startup",
      description: "Up to 10M API requests/month",
      features: ["Web Application Firewall", "Rate Limiting", "Basic Analytics"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Unlimited requests & Custom AI rules",
      features: [
        "Everything in Startup",
        "AI Prompt Protection",
        "DLP & Data Leak Prevention",
        "Custom Rule Engine",
        "Priority Support",
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Organization Settings
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
          Manage billing and global security defaults.
        </p>
      </div>

      {!org ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
                  {org.name}
                </h2>
                <p className="text-sm text-muted-foreground font-mono truncate">
                  ID: {org.id}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
              Billing Plan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                    plan === p.id
                      ? "border-accent bg-accent/5"
                      : "border-border bg-background hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setPlan(p.id)}
                >
                  {plan === p.id && (
                    <div className="absolute top-3 right-3 p-1 bg-accent rounded-full">
                      <Check className="w-3.5 h-3.5 text-accent-foreground" />
                    </div>
                  )}
                  <h4 className="font-bold text-foreground text-base">
                    {p.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {p.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {p.features.map((f, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground flex items-center space-x-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={handleUpdate}
                className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
