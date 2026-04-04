"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users, ArrowRight, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SelectRolePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"LEARNER" | "TUTOR" | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const handleSelectRole = async () => {
    if (!selectedRole) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!res.ok) {
        throw new Error("Failed to select role");
      }

      // Refresh the session to include the new role
      await update({ role: selectedRole });

      toast.success(`Welcome to Algora-NG as a ${selectedRole.toLowerCase()}!`);

      // Redirect based on role
      if (selectedRole === "TUTOR") {
        router.push("/tutor/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center  p-6 sm:p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full flex flex-col gap-12"
      >
        <div className="text-center flex flex-col gap-4">
          <h1 className="tracking-tight text-foreground">
            How will you use <span className="text-primary">Algora</span>?
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the path that best describes your goals. You can always
            manage your account details later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Learner Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole("LEARNER")}
            className={cn(
              "relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-6",
              selectedRole === "LEARNER"
                ? "border-primary bg-primary/5 "
                : "border-border bg-card/50 hover:border-muted-foreground/30",
            )}
          >
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                selectedRole === "LEARNER"
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-border text-muted",
              )}
            >
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="">I'm a Learner</h3>
              <p className="text-muted-foreground">
                I want to master new skills, build projects, and take my career
                to the next level through expert-led tracks.
              </p>
            </div>
            <ul className="flex flex-col gap-3 mt-4">
              {[
                "Access high-quality tracks",
                "Learn at your own pace",
                "Get certificates of completion",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  {item}
                </li>
              ))}
            </ul>
            {selectedRole === "LEARNER" && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              </div>
            )}
          </motion.div>

          {/* Tutor Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRole("TUTOR")}
            className={cn(
              "relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-6",
              selectedRole === "TUTOR"
                ? "border-primary bg-primary/5 "
                : "border-border bg-card/50 hover:border-muted-foreground/30",
            )}
          >
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                selectedRole === "TUTOR"
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-border text-muted",
              )}
            >
              <Users className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="">I'm a Tutor</h3>
              <p className="text-muted-foreground">
                I want to share my knowledge, mentor students, and help shape
                the next generation of professionals.
              </p>
            </div>
            <ul className="flex flex-col gap-3 mt-4">
              {[
                "Create and manage sessions",
                "Mentor upcoming talents",
                "Build your teaching portfolio",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  {item}
                </li>
              ))}
            </ul>
            {selectedRole === "TUTOR" && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            disabled={!selectedRole || loading}
            onClick={handleSelectRole}
            className={cn(
              "px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-3",
              !selectedRole || loading
                ? "bg-muted text-white cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:scale-105 active:scale-95 ",
            )}
          >
            {loading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Continue to Dashboard
                {/* <ArrowRight className="w-5 h-5" /> */}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
