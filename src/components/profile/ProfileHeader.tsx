import Image from "next/image";
import EditProfileModal from "./EditProfileModal";
import DeleteAccountButton from "./DeleteAccountButton";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string | null;
    image?: string | null;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="py-6 mb-6 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex items-center gap-6">
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
                className="object-cover h-full w-full rounded-f`ull"
                style={{ borderRadius: "9999px", objectFit: "cover" }}
              />
            ) : (
              <Image
                src="/images/default_profile.png"
                alt={user.name || "User"}
                width={80}
                height={80}
                className="object-cover h-full w-full rounded-full"
                style={{ borderRadius: "9999px", objectFit: "cover" }}
              />
            )}
          </div>
          {/* <div
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
          ></div> */}
        </div>
        <div>
          <h2 className="font-semibold">{user.name || "User"}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-white">
            {user.role ?? "No Role"}
          </div>
        </div>
      </div>

      <div className="md:ml-auto flex items-center gap-2">
        <EditProfileModal user={user} />
        <DeleteAccountButton />
      </div>
    </div>
  );
}
