import { prisma } from "@/lib/prisma";
import UserTable from "./UserTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const users = await getUsers();

  return (
    <div className="p-6">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Users</h1>
      </div>

      <UserTable users={users} />
    </div>
  );
}
