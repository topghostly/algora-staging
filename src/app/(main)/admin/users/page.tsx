"use client";

import { useEffect, useState } from "react";
import UserTable from "./UserTable";
import { ErrorState } from "@/components/ErrorState";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Loader } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: Date | null;
  subscriptionTier: string;
  createdAt: Date;
  disabled: boolean;
  suspended: boolean;
  image: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-page min-h-[60vh] flex flex-col justify-center items-center gap-6">
        <p className="text-muted flex items-center gap-2">
          <Loader
            size={16}
            className="animate-spin"
            style={{ marginRight: "0.4rem" }}
          />
          Loading users…
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 px-page">
      <BreadcrumbNav
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Users" },
        ]}
        className="mb-6"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>Users</h1>
      </div>

      {!users ? (
        <div className="card p-12">
          <ErrorState message="We couldn't load the users at this time. Please try again." />
        </div>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
}
