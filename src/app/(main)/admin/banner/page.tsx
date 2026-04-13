"use client";

import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BannerData {
  id: string;
  message: string;
  href: string | null;
  startsAt: string;
  endsAt: string;
  updatedAt: string;
}

function formatForInput(isoString: string): string {
  const d = new Date(isoString);
  const tzOffset = d.getTimezoneOffset() * 60 * 1000;
  const local = new Date(d.getTime() - tzOffset);
  return local.toISOString().slice(0, 16);
}

function getBannerStatus(banner: BannerData): { label: string; color: string } {
  const now = new Date();
  const start = new Date(banner.startsAt);
  const end = new Date(banner.endsAt);
  if (now < start) return { label: "Scheduled", color: "var(--warning)" };
  if (now > end) return { label: "Expired", color: "var(--error)" };
  return { label: "Active", color: "var(--success)" };
}

export default function AdminBannerPage() {
  const [current, setCurrent] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [href, setHref] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  useEffect(() => {
    fetch("/api/admin/banner")
      .then((res) => res.json())
      .then((data: BannerData | null) => {
        if (data) {
          setCurrent(data);
          setMessage(data.message);
          setHref(data.href ?? "");
          setStartsAt(formatForInput(data.startsAt));
          setEndsAt(formatForInput(data.endsAt));
        } else {
          const now = new Date();
          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          setStartsAt(formatForInput(now.toISOString()));
          setEndsAt(formatForInput(nextWeek.toISOString()));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Banner message is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          href: href.trim() || null,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        toast.error(err.error ?? "Failed to save banner");
        return;
      }
      const data = (await res.json()) as BannerData;
      setCurrent(data);
      toast.success("Banner saved");
    } catch {
      toast.error("Unexpected error — please try again");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!current) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/banner", { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to remove banner");
        return;
      }
      setCurrent(null);
      setMessage("");
      setHref("");
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      setStartsAt(formatForInput(now.toISOString()));
      setEndsAt(formatForInput(nextWeek.toISOString()));
      toast.success("Banner removed");
    } catch {
      toast.error("Unexpected error — please try again");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="px-page min-h-[60vh] justify-center items-center flex flex-col gap-6">
        <p className="text-muted flex items-center gap-2">
          {" "}
          <Loader
            size={16}
            className="animate-spin"
            style={{ marginRight: "0.4rem" }}
          />
          Loading banner settings…
        </p>
      </div>
    );
  }

  const status = current ? getBannerStatus(current) : null;
  const isActive = status?.label === "Active";

  return (
    <div className="px-page p-6">
      <div>
        <BreadcrumbNav
          items={[
            { label: "Admin Dashboard", href: "/admin" },
            { label: "Banner" },
          ]}
          className="mb-6"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>Site Banner</h1>
        </div>
        <p
          className="text-muted"
          style={{ marginTop: "0.5rem", marginBottom: 0 }}
        >
          Configure the announcement banner shown to learners and tutors on
          their dashboards.
        </p>
      </div>

      {/* Current status */}
      {current && status && (
        <div
          className="card mt-6"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: status.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
              {status.label}
            </span>
            {isActive && (
              <Button
                onClick={handleDeactivate}
                disabled={saving}
                variant="destructive"
                size={"sm"}
                className="ml-auto"
              >
                Deactivate Now
              </Button>
            )}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              <span style={{ color: "var(--muted)", marginRight: "0.5rem" }}>
                Message:
              </span>
              {current.message}
            </p>
            {current.href && (
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                <span style={{ color: "var(--muted)", marginRight: "0.5rem" }}>
                  Link:
                </span>
                {current.href}
              </p>
            )}
            <p
              style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}
            >
              {new Date(current.startsAt).toLocaleString()} —{" "}
              {new Date(current.endsAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          // maxWidth: 640,
        }}
        className="mt-6"
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label
            htmlFor="banner-message"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            Message <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <textarea
            id="banner-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Happy Valentine's SPRAY! Save an EXTRA 14% off with code IFARTYOU"
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "0.9rem",
              fontFamily: "inherit",
              resize: "vertical",
              background: "var(--background)",
              color: "var(--foreground)",
              outline: "none",
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              color: "var(--muted)",
              textAlign: "right",
            }}
          >
            {message.length} / 300
          </p>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label
            htmlFor="banner-href"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            Link URL{" "}
            <span style={{ color: "var(--muted)", fontWeight: 400 }}>
              (optional)
            </span>
          </label>
          <input
            id="banner-href"
            type="text"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="https://example.com or /tracks"
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              fontSize: "0.9rem",
              fontFamily: "inherit",
              background: "var(--background)",
              color: "var(--foreground)",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="banner-starts-at"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Show from <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              id="banner-starts-at"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                background: "var(--background)",
                color: "var(--foreground)",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="banner-ends-at"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              Hide after <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <input
              id="banner-ends-at"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                background: "var(--background)",
                color: "var(--foreground)",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div>
          <Button type="submit" disabled={saving} variant={"outline"}>
            {saving ? (
              <>
                <Loader
                  size={16}
                  className="animate-spin"
                  style={{ marginRight: "0.4rem" }}
                />
                Saving…
              </>
            ) : (
              "Save Banner"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
