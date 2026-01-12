import Link from "next/link";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">Tutor Portal</h1>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link
              href="/tutor"
              className="hover:text-primary transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/tutor/sessions"
              className="hover:text-primary transition-colors"
            >
              Sessions
            </Link>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
