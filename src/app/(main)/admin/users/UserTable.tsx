"use client";

import React, { useState } from "react";
import {
  Trash2,
  UserCog,
  Ban,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldOff,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
  emailVerified: Date | null;
  subscriptionTier: string;
  createdAt: Date;
  disabled: boolean;
  suspended: boolean;
  [key: string]: any;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users: initialUsers }: UserTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
    variant: "destructive" | "default";
  } | null>(null);

  const handleAction = (config: typeof dialogConfig) => {
    setDialogConfig(config);
    setIsDialogOpen(true);
  };

  const updateRole = async (userId: string, currentRole: string | null) => {
    const newRole = currentRole === "LEARNER" ? "TUTOR" : "LEARNER";
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-role", role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      toast.success(`User role updated to ${newRole}`);
      router.refresh();
    } catch (error) {
      toast.error("Error updating user role");
    }
  };

  const disableUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable" }),
      });

      if (!res.ok) throw new Error("Failed to disable user");

      toast.success("User account disabled and notification sent");
      router.refresh();
    } catch (error) {
      toast.error("Error disabling user account");
    }
  };

  const suspendUser = async (userId: string, isSuspended: boolean) => {
    const action = isSuspended ? "unsuspend" : "suspend";
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error(`Failed to ${action} user`);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, suspended: !isSuspended } : u,
        ),
      );
      toast.success(
        `User ${isSuspended ? "unsuspended" : "suspended"} successfully`,
      );
    } catch (error) {
      toast.error(`Error ${isSuspended ? "unsuspending" : "suspending"} user`);
    }
  };

  return (
    <div className=" overflow-x-auto">
      <table style={{ minWidth: "900px", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--border)",
              backgroundColor: "var(--muted-light)",
              textAlign: "left",
            }}
          >
            <th
              style={{ padding: "1rem", fontWeight: 500, fontSize: "0.9rem" }}
            >
              User
            </th>
            <th
              style={{ padding: "1rem", fontWeight: 500, fontSize: "0.9rem" }}
            >
              Role
            </th>
            <th
              style={{ padding: "1rem", fontWeight: 500, fontSize: "0.9rem" }}
            >
              Status
            </th>
            <th
              style={{ padding: "1rem", fontWeight: 500, fontSize: "0.9rem" }}
            >
              Subscription
            </th>
            <th
              style={{ padding: "1rem", fontWeight: 500, fontSize: "0.9rem" }}
            >
              Joined
            </th>
            <th
              style={{
                padding: "1rem",
                fontWeight: 500,
                fontSize: "0.9rem",
                textAlign: "right",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  opacity: user.disabled ? 0.6 : 1,
                }}
              >
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 500 }}>
                      {user.name || "No Name"}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      {user.email}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      backgroundColor:
                        user.role === "ADMIN"
                          ? "#fee2e2"
                          : user.role === "TUTOR"
                            ? "#e0f2fe"
                            : user.role == null
                              ? "#fef9c3"
                              : "#f3f4f6",
                      color:
                        user.role === "ADMIN"
                          ? "#dc2626"
                          : user.role === "TUTOR"
                            ? "#0284c7"
                            : user.role == null
                              ? "#a16207"
                              : "#6b7280",
                    }}
                  >
                    {user.role ?? "No Role"}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {user.disabled ? (
                      <span
                        style={{
                          color: "#dc2626",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        <XCircle size={14} /> Disabled
                      </span>
                    ) : user.suspended ? (
                      <span
                        style={{
                          color: "#ca8a04",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        <Ban size={14} /> Suspended
                      </span>
                    ) : user.emailVerified ? (
                      <span
                        style={{
                          color: "#16a34a",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#ca8a04",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        <ShieldAlert size={14} /> Unverified
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                  {user.subscriptionTier}
                </td>
                <td
                  style={{
                    padding: "1rem",
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                  }}
                >
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() =>
                        handleAction({
                          title: "Change User Role",
                          description: `Are you sure you want to change ${user.name || user.email}'s role to ${user.role === "LEARNER" ? "TUTOR" : "LEARNER"}?`,
                          confirmText: `${user.role === "LEARNER" ? "Change to TUTOR" : "Change to LEARNER"}`,
                          onConfirm: () => updateRole(user.id, user.role),
                          variant: "default",
                        })
                      }
                      style={{ padding: "0.4rem", height: "auto" }}
                      title="Change Role"
                      disabled={user.role === "ADMIN" || user.role == null}
                    >
                      <UserCog size={16} />
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() =>
                        handleAction({
                          title: user.suspended
                            ? "Unsuspend User"
                            : "Suspend User",
                          description: user.suspended
                            ? `Are you sure you want to unsuspend ${user.name || user.email}? This will restore their access.`
                            : `Are you sure you want to suspend ${user.name || user.email}? This will temporarily restrict their access.`,
                          confirmText: user.suspended ? "Unsuspend" : "Suspend",
                          onConfirm: () => suspendUser(user.id, user.suspended),
                          variant: user.suspended ? "default" : "destructive",
                        })
                      }
                      style={{ padding: "0.4rem", height: "auto" }}
                      title={user.suspended ? "Unsuspend User" : "Suspend User"}
                      disabled={user.disabled || user.role === "ADMIN"}
                    >
                      {user.suspended ? <ShieldOff size={16} /> : <Ban size={16} />}
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() =>
                        handleAction({
                          title: "Delete User",
                          description: `Are you sure you want to delete ${user.name || user.email}? This will disable their account and send a notification. This action cannot be undone.`,
                          confirmText: "Delete Account",
                          onConfirm: () => disableUser(user.id),
                          variant: "destructive",
                        })
                      }
                      style={{
                        padding: "0.4rem",
                        height: "auto",
                        color: "#dc2626",
                      }}
                      title="Delete User"
                      disabled={user.disabled || user.role === "ADMIN"}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {dialogConfig && (
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={dialogConfig.title}
          description={dialogConfig.description}
          confirmText={dialogConfig.confirmText}
          onConfirm={dialogConfig.onConfirm}
          variant={dialogConfig.variant}
        />
      )}
    </div>
  );
}
