import { User } from "lucide-react";
import Image from "next/image";
import EditProfileModal from "./EditProfileModal";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    image?: string | null;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="card p-6 mb-6 flex items-center gap-6">
      <div
        style={{
          position: "relative",
          width: "80px",
          height: "80px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "9999px",
            backgroundColor: "var(--primary-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 2px var(--background)",
          }}
        >
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={80}
              height={80}
              className="object-cover h-full w-full rounded-full"
              style={{ borderRadius: "9999px", objectFit: "cover" }}
            />
          ) : (
            <User size={40} className="text-primary" />
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            width: "24px",
            height: "24px",
            borderRadius: "9999px",
            backgroundColor: "#22c55e",
            border: "3px solid var(--background)",
            zIndex: 50,
            boxShadow: "0 0 10px rgba(34, 197, 94, 0.6)",
            transform: "translate(25%, 25%)",
          }}
        ></div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{user.name || "User"}</h1>
        <p className="text-muted-foreground">{user.email}</p>
        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {user.role}
        </div>
      </div>

      <div className="ml-auto">
        <EditProfileModal user={user} />
      </div>
    </div>
  );
}
