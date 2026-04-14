"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";

const SessionDelete = ({ id }: { id: string }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleDeleteSession = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/session/${id}/delete`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel session");
      }
      toast.success(data.message ?? "Session cancelled successfully");
      if (data.calendarDisconnected) {
        await update();
        toast.error(
          "Calendar connection expired. Please reconnect your Google Calendar.",
          { duration: 6000 },
        );
        router.push("/tutor");
      } else {
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to cancel session");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDeleting}
        variant={"destructive"}
        size={"sm"}
      >
        {isDeleting ? (
          <div className="flex gap-2">
            <Loader className="animate-spin" size={16} />
            <span>Cancelling...</span>
          </div>
        ) : (
          "Cancel Session"
        )}
      </Button>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Cancel Session"
        description="Are you sure you want to cancel this session? The event will be removed from Google Calendar and enrolled students will be refunded their credit."
        confirmText={isDeleting ? "Cancelling..." : "Cancel Session"}
        onConfirm={handleDeleteSession}
        variant="destructive"
      />
    </>
  );
};

export default SessionDelete;
