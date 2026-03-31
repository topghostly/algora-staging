import { prisma } from "@/lib/prisma";
import UserTable from "./UserTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ErrorState } from "@/components/ErrorState";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

export const dynamic = "force-dynamic";

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      subscriptionTier: true,
      createdAt: true,
      disabled: true,
      suspended: true,
      image: true,
      // passwordHash, googleRefreshToken, etc. are NOT selected
    },
  });
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  let users = null;
  try {
    users = await getUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div className="p-6">
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
