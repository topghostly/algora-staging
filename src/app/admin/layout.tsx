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
    <div className="flex min-h-screen overflow-x-hidden">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-muted-light">
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>{children}</div>
      </main>
    </div>
  );
}
