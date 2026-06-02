"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Users, UserPlus, Mail, Shield } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useOrg } from "@/components/OrgProvider";

export default function TeamHub() {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const { getToken } = useAuth();
  const { orgId } = useOrg();

  const loadUsers = async () => {
    if (!orgId) return;
    try {
      const token = await getToken();
      const data = await fetchApi(
        `/organizations/${orgId}/users`,
        {},
        token
      );
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [orgId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    try {
      const token = await getToken();
      await fetchApi("/users", {
        method: "POST",
        body: JSON.stringify({
          org_id: orgId,
          email: inviteEmail,
          role: inviteRole,
        }),
      }, token);
      setShowModal(false);
      setInviteEmail("");
      loadUsers();
    } catch (err) {
      alert("Failed to invite user");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Team Members
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Manage access to the Aegis Control Plane.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm sm:text-base shrink-0"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Member</span>
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No team members</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Invite your first team member to collaborate.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3.5 text-sm font-medium text-muted-foreground">
                    User Email
                  </th>
                  <th className="px-5 py-3.5 text-sm font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="px-5 py-3.5 text-sm font-medium text-muted-foreground">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-accent/10 rounded-lg">
                          <Mail className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {u.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-1.5 bg-accent/10 rounded-lg">
                    <Mail className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">
                    {u.email}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.role.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              Invite Team Member
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                  placeholder="engineer@company.com"
                  value={inviteEmail}
                  onChange={(e) =>
                    setInviteEmail(e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Access Role
                </label>
                <select
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                  value={inviteRole}
                  onChange={(e) =>
                    setInviteRole(e.target.value)
                  }
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="viewer">Viewer (Read Only)</option>
                </select>
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
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
