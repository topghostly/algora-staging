"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/alert-dialog";

const SessionDelete = ({ id }: { id: string }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSession = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/session/${id}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete session");
      }
      toast.success("Session deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete session");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline btn-sm text-red-500 hover:bg-red-50 hover:border-red-200"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDeleting}
        style={{
          borderRadius: "8px",
        }}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete Session"
        description="Are you sure you want to delete this session? This action will also remove the event from your Google Calendar and cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleDeleteSession}
        variant="destructive"
      />
    </>
  );
};

export default SessionDelete;
