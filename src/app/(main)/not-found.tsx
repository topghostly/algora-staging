import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotFoundAnimation } from "@/components/NotFoundAnimation";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="flex h-60 w-60 md:h-72 md:w-72 items-center justify-center overflow-hidden mb-6">
        <NotFoundAnimation />
      </div>
      <h1 className="text-5xl md:text-7xl tracking-tight mb-2">404</h1>
      <h2 className="text-2xl tracking-tight sm:text-3xl mb-4">
        Page not found
      </h2>
      <p className="max-w-[400px] text-muted-foreground mb-10 text-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been moved, deleted, or you may have mistyped the URL.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link href="/auth/redirect">
          <Button variant={"outline"}>
            <ArrowLeft className="h-4 w-4" />
            Your way back
          </Button>
        </Link>
      </div>
    </div>
  );
}
