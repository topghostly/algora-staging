"use client";

import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader size={16} className="animate-spin" /> : label}
    </Button>
  );
}
