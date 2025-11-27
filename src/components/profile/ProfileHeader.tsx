import { User } from "lucide-react";

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
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {user.image ? (
                    <img src={user.image} alt={user.name || "User"} className="h-full w-full rounded-full object-cover" />
                ) : (
                    <User size={40} />
                )}
            </div>
            <div>
                <h1 className="text-2xl font-bold">{user.name || "User"}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {user.role}
                </div>
            </div>
        </div>
    );
}
