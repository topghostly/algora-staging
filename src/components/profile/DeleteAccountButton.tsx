"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function DeleteAccountButton() {
  const [showConfirm, setShowConfirm] = useState(false);
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

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Are you sure?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white text-sm px-3 py-1.5 rounded-md duration-200"
        >
          {loading ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="btn-outline text-sm px-3 py-1.5 rounded-md duration-200"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    // <button
    //   onClick={() => setShowConfirm(true)}
    //   className="btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white text-sm px-3 py-1.5 rounded-md duration-200"
    // >
    //   Delete Account
    // </button>
    <Button
      variant={"destructive"}
      size={"sm"}
      onClick={() => setShowConfirm(true)}
    >
      Delete Account
    </Button>
  );
}
