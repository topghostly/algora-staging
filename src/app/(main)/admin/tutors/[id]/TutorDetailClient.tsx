"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Ban,
  FileText,
  Calendar,
  Mail,
  User,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/alert-dialog";

interface Tutor {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  specialties: string[];
  tutorBio: string | null;
  tutorStatus: string | null;
  resumeLink: string | null;
  calendarConnected: boolean;
  hasCompletedOnboarding: boolean;
  disabled: boolean;
  suspended: boolean;
  createdAt: Date;
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  PENDING: { bg: "#fef9c3", text: "#a16207", label: "Pending" },
  APPROVED: { bg: "#dcfce7", text: "#15803d", label: "Approved" },
  REJECTED: { bg: "#fee2e2", text: "#dc2626", label: "Rejected" },
};

export default function TutorDetailClient({
  tutor: initial,
}: {
  tutor: Tutor;
}) {
  const router = useRouter();
  const [tutor, setTutor] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
    variant: "destructive" | "default";
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const runAction = async (action: "approve" | "reject" | "disable") => {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/tutors/${tutor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Request failed");
      }

      const data = await res.json();

      if (action === "approve") {
        setTutor((prev) => ({ ...prev, tutorStatus: "APPROVED" }));
        toast.success("Tutor approved — email sent.");
      } else if (action === "reject") {
        setTutor((prev) => ({ ...prev, tutorStatus: "REJECTED" }));
        toast.success("Tutor rejected — email sent.");
      } else if (action === "disable") {
        setTutor((prev) => ({ ...prev, disabled: true }));
        toast.success("Account disabled — email sent.");
      }

      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong.");
    } finally {
      setLoading(null);
    }
  };

  const confirm = (config: typeof dialogConfig) => {
    setDialogConfig(config);
    setDialogOpen(true);
  };

  const statusStyle = STATUS_STYLES[tutor.tutorStatus ?? ""] ?? {
    bg: "#f3f4f6",
    text: "#6b7280",
    label: tutor.tutorStatus ?? "Unknown",
  };

  return (
    <div style={{ maxWidth: "760px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {tutor.image ? (
            <img
              src={tutor.image}
              alt={tutor.name ?? "Tutor"}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "var(--muted-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={24} style={{ color: "var(--muted)" }} />
            </div>
          )}
          <div>
            <h3 style={{ margin: 0 }}>{tutor.name ?? "No Name"}</h3>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
              {tutor.email}
            </p>
          </div>
        </div>

        <span
          style={{
            padding: "0.35rem 1rem",
            borderRadius: "999px",
            fontSize: "0.85rem",
            fontWeight: 600,
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
          }}
        >
          {statusStyle.label}
        </span>
      </div>

      {/* Details grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <DetailCard
          icon={<Mail size={16} />}
          label="Email"
          value={tutor.email}
        />
        <DetailCard
          icon={<Calendar size={16} />}
          label="Calendar"
          value={tutor.calendarConnected ? "Connected" : "Not connected"}
          valueColor={tutor.calendarConnected ? "#15803d" : undefined}
        />
        <DetailCard
          icon={<BookOpen size={16} />}
          label="Specialties"
          value={
            tutor.specialties.length > 0 ? tutor.specialties.join(", ") : "—"
          }
        />
        <DetailCard
          icon={<User size={16} />}
          label="Applied"
          value={new Date(tutor.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
      </div>

      {/* Bio */}
      {tutor.tutorBio && (
        <div
          style={{
            padding: "1.25rem",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--card)",
            marginBottom: "1.25rem",
          }}
        >
          <p
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Professional Bio
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.6" }}>
            {tutor.tutorBio}
          </p>
        </div>
      )}

      {/* Resume link */}
      {tutor.resumeLink && (
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--card)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <FileText
            size={18}
            style={{ color: "var(--primary)", flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "var(--muted)",
                fontWeight: 600,
              }}
            >
              Resume
            </p>
            <a
              href={tutor.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.9rem", color: "var(--primary)" }}
            >
              View PDF
            </a>
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        {tutor.tutorStatus === "PENDING" && (
          <>
            <Button
              onClick={() =>
                confirm({
                  title: "Approve Tutor",
                  description: `Approve ${tutor.name ?? tutor.email} as a tutor? They will receive an approval email and gain full access.`,
                  confirmText: "Approve",
                  onConfirm: () => runAction("approve"),
                  variant: "default",
                })
              }
              disabled={!!loading}
            >
              <CheckCircle2 size={16} />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                confirm({
                  title: "Reject Application",
                  description: `Reject ${tutor.name ?? tutor.email}'s tutor application? They will receive a rejection email.`,
                  confirmText: "Reject",
                  onConfirm: () => runAction("reject"),
                  variant: "destructive",
                })
              }
              disabled={!!loading}
            >
              <XCircle size={16} />
              Reject
            </Button>
          </>
        )}

        {tutor.tutorStatus === "REJECTED" && (
          <Button
            onClick={() =>
              confirm({
                title: "Approve Tutor",
                description: `Re-approve ${tutor.name ?? tutor.email} as a tutor?`,
                confirmText: "Approve",
                onConfirm: () => runAction("approve"),
                variant: "default",
              })
            }
            disabled={!!loading}
          >
            <CheckCircle2 size={16} />
            Approve
          </Button>
        )}

        {!tutor.disabled && (
          <Button
            variant="destructive"
            onClick={() =>
              confirm({
                title: "Disable Account",
                description: `Disable ${tutor.name ?? tutor.email}'s account? They will lose access immediately and receive an email notification.`,
                confirmText: "Disable Account",
                onConfirm: () => runAction("disable"),
                variant: "destructive",
              })
            }
            disabled={!!loading}
          >
            <Ban size={16} />
            Disable Account
          </Button>
        )}

        {tutor.disabled && (
          <span
            style={{
              fontSize: "0.85rem",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Ban size={15} /> Account is disabled
          </span>
        )}
      </div>

      {dialogConfig && (
        <ConfirmationDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          title={dialogConfig.title}
          description={dialogConfig.description}
          confirmText={dialogConfig.confirmText}
          onConfirm={dialogConfig.onConfirm}
          variant={dialogConfig.variant}
        />
      )}
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "0.4rem",
          color: "var(--muted)",
          fontSize: "0.8rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {icon} {label}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "0.95rem",
          color: valueColor ?? "var(--foreground)",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}
