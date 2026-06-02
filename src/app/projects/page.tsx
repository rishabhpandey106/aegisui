"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { Network, Plus, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useOrg } from "@/components/OrgProvider";

export default function ProjectsHub() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", upstream_url: "" });
  const [apiKey, setApiKey] = useState("");
  const { getToken } = useAuth();
  const { orgId } = useOrg();

  const loadProjects = async () => {
    if (!orgId) return;
    try {
      const token = await getToken();
      const data = await fetchApi(
        `/organizations/${orgId}/projects`,
        {},
        token
      );
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [orgId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    try {
      const token = await getToken();
      const res = await fetchApi("/projects", {
        method: "POST",
        body: JSON.stringify({
          org_id: orgId,
          name: newProject.name,
          upstream_url: newProject.upstream_url,
        }),
      }, token);
      setApiKey(res.api_key || res.RawAPIKey || res.raw_api_key);
      loadProjects();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Projects Hub
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Manage your protected APIs and Security Rules.
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setApiKey("");
          }}
          className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm sm:text-base shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Network className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Deploy your first project to start securing your APIs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-xl p-5 sm:p-6 hover:bg-card-hover hover:border-muted-foreground/20 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Network className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground truncate">
                  {p.name}
                </h3>
              </div>

              <div className="text-sm text-muted-foreground space-y-2 flex-1 min-w-0">
                <p className="truncate">
                  Upstream:{" "}
                  <span className="text-foreground font-mono text-xs">
                    {p.upstream_url}
                  </span>
                </p>
                <p>
                  ID:{" "}
                  <span className="text-muted-foreground/60 font-mono text-xs">
                    {p.id}
                  </span>
                </p>
              </div>

              <Link
                href={`/projects/${p.id}`}
                className="mt-5 w-full inline-flex items-center justify-between text-accent hover:text-accent/80 bg-accent/5 hover:bg-accent/10 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
              >
                <span>Configure Rules</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl">
            {!apiKey ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  Deploy New Project
                </h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                      Project Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                      placeholder="e.g. Production Billing API"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                      Upstream URL
                    </label>
                    <input
                      required
                      type="url"
                      className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                      placeholder="https://api.mycompany.com"
                      value={newProject.upstream_url}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          upstream_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg text-sm transition-colors"
                    >
                      Deploy Project
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center space-y-5">
                <ShieldCheck className="w-14 h-14 sm:w-16 sm:h-16 text-accent mx-auto" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Project Secured!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Save this API Key. It will never be shown again.
                </p>
                <div className="bg-background border border-accent/30 rounded-lg p-4 text-accent font-mono text-sm break-all">
                  {apiKey}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-5 py-3 bg-muted hover:bg-muted-foreground/20 text-foreground font-medium rounded-lg text-sm transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
