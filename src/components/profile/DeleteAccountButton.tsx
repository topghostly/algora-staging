"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ConfirmationDialog } from "@/components/ui/alert-dialog";

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/delete-account", { method: "POST" });
      if (!res.ok) throw new Error();

      toast.success("Account marked for deletion", {
        description:
          "Your account has been disabled. You will now be signed out.",
      });

      await signOut({ callbackUrl: "/auth/signin" });
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        Delete Account
      </Button>

      <ConfirmationDialog
        isOpen={open}
        onOpenChange={setOpen}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data."
        confirmText={loading ? "Deleting..." : "Yes, delete"}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
