"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { Loader } from "lucide-react";
import { updateRequestStatus } from "@/app/(main)/actions/request";
import { ConfirmationDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeclineRequestButton({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await updateRequestStatus(requestId, "REJECTED");
      setOpen(false);
    });
  };

  return (
    <>
      <Button
        disabled={isPending}
        onClick={() => setOpen(true)}
        variant={"outline"}
        className="flex gap-0"
      >
        {isPending ? (
          <Loader size={18} className="animate-spin mr-2" />
        ) : (
          <X size={18} className="mr-2" />
        )}
        Decline
      </Button>

      <ConfirmationDialog
        isOpen={open}
        onOpenChange={setOpen}
        title="Decline this request?"
        description="This will reject the session request and refund the student's credit. This action cannot be undone."
        confirmText="Yes, decline"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        variant="destructive"
      />
    </>
  );
}
