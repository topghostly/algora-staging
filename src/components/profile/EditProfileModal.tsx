"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditProfileModalProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export default function EditProfileModal({ user }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [imagePreview, setImagePreview] = useState(user.image || "");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      // 1MB
      setError("Image size must be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image: imagePreview !== user.image ? imagePreview : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      router.refresh();
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="btn btn-outline rounded-lg"
          style={{ fontSize: "0.875rem" }}
        >
          Edit Profile
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-full max-w-[480px] p-0 overflow-hidden bg-white text-black border-none shadow-2xl rounded-xl">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <h4 className="font-medium">Edit Profile</h4>
          <button
            onClick={() => setIsOpen(false)}
            // style={{
            //   color: "#6b7280",
            //   cursor: "pointer",
            //   background: "none",
            //   border: "none",
            //   padding: 4,
            // }}
            className="btn btn-outline rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                fontSize: "0.875rem",
                padding: "0.75rem",
                borderRadius: "6px",
              }}
            >
              {error}
            </div>
          )}

          {/* Image Upload Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "relative",
                height: "96px",
                width: "96px",
                borderRadius: "9999px",
                overflow: "hidden",
                backgroundColor: "#f3f4f6",
                cursor: "pointer",
                border: "2px solid #e5e7eb",
              }}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={96}
                  height={96}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    color: "#9ca3af",
                  }}
                >
                  <Camera size={32} />
                </div>
              )}
              {/* Hover Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <Camera color="white" size={24} />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                fontSize: "0.75rem",
              }}
              className="btn btn-outline rounded-lg"
            >
              Change Photo
            </button>
          </div>

          {/* Name Input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <label
              htmlFor="name"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              //   style={{
              //     width: "100%",
              //     padding: "0.625rem 0.875rem",
              //     border: "1px solid #e5e7eb",
              //     borderRadius: "6px",
              //     backgroundColor: "white",
              //     color: "black",
              //     fontSize: "1rem",
              //     outline: "none",
              //   }}
              className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Your Name"
              maxLength={50}
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              paddingTop: "1rem",
            }}
          >
            {/* <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn rounded-lg"
              style={{
                backgroundColor: "transparent",
                color: "#4b5563",
                border: "1px solid #e5e7eb",
              }}
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className="btn btn-primary rounded-lg"
              disabled={isLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
