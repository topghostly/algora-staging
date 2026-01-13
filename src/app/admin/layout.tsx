import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          backgroundColor: "var(--muted-light)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>{children}</div>
      </main>
    </div>
  );
}
