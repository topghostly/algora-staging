"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MultiCombobox, ComboboxOption } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import ConnectCalendarButton from "@/components/ConnectCalendarButton";
import { BookOpen, GraduationCap, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const SPECIALTY_OPTIONS: ComboboxOption[] = [
  { value: "Web Development", label: "Web Development" },
  { value: "Frontend Development", label: "Frontend Development" },
  { value: "Backend Development", label: "Backend Development" },
  { value: "Full-Stack Development", label: "Full-Stack Development" },
  {
    value: "Data Structures & Algorithms",
    label: "Data Structures & Algorithms",
  },
  { value: "Python Programming", label: "Python Programming" },
  { value: "JavaScript Programming", label: "JavaScript Programming" },
  { value: "Java Programming", label: "Java Programming" },
  { value: "Mobile App Development", label: "Mobile App Development" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Data Science", label: "Data Science" },
  { value: "Machine Learning", label: "Machine Learning" },
];

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== "TUTOR") {
      router.push("/dashboard");
    } else if (session?.user?.hasCompletedOnboarding) {
      router.push("/tutor");
    }
  }, [status, session, router]);

  const handleSaveSpecialties = async () => {
    if (selectedSpecialties.length === 0) {
      toast.error("Please select at least one specialty.");
      return;
    }

    if (!bio.trim()) {
      toast.error("Please provide a short professional bio.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialties: selectedSpecialties,
          tutorBio: bio,
        }),
      });

      if (res.ok) {
        await update();
        setActiveTab("calendar");
        toast.success("Specialties saved successfully!");
      } else {
        console.log(res);
        toast.error("Failed to save specialties. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="flex w-full h-full justify-center items-center">
      <div className="max-w-3xl mx-auto pb-10 ">
        <div className="text-center mb-10">
          <h2 className="font-medium mb-2">Welcome, Tutor!</h2>
          <p className="text-muted-foreground">
            Let's get your profile set up so you can start teaching.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-fit grid-cols-3 mb-8 mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              {/* <BookOpen size={18} />  */}Overview
            </TabsTrigger>
            <TabsTrigger
              value="specialties"
              className="flex items-center gap-2 "
            >
              {/* <GraduationCap size={18} />  */}Specialties
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 ">
              {/* <Calendar size={18} />  */}Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="bg-card  rounded-lg ">
            <h3 className="mb-4">Platform Overview</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Algora is a premium tutoring platform that connects expert
                mentors with eager learners. As a tutor, you have the
                flexibility to manage your own schedule, set your specialties,
                and track your earnings.
              </p>
              <p>Once you complete this onboarding, you'll be able to:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                <li>
                  <p>Manage your 1-on-1 tutoring sessions and group sessions</p>
                </li>
                <li>
                  <p>View and accept session requests from students</p>
                </li>
                <li>
                  <p>Sync your sessions with Google Calendar automatically</p>
                </li>
                <li>
                  <p>Track your statistics and student progress</p>
                </li>
              </ul>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setActiveTab("specialties")}>
                Continue
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="specialties" className="bg-card  rounded-lg ">
            <h3 className="mb-4">What are your specialties?</h3>
            <p className="text-muted-foreground mb-6">
              Select the areas you are most proficient in. This helps students
              find the right tutor for their needs.
            </p>

            <div className="mb-8">
              <label className="text-sm font-medium mb-1.5 block">
                Specialties
              </label>
              <MultiCombobox
                options={SPECIALTY_OPTIONS}
                value={selectedSpecialties}
                onValueChange={setSelectedSpecialties}
                placeholder="Search and select specialties..."
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium mb-1.5 block">
                Professional Bio
              </label>
              <Textarea
                placeholder="Briefly describe your tutoring style, experience, and what students can expect..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-32"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Tell students about your expertise and teaching approach.
              </p>
            </div>

            <div className="flex justify-end items-center mt-8">
              <Button onClick={handleSaveSpecialties} disabled={isSaving}>
                {isSaving ? "Saving..." : "Confirm & Continue"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="bg-card  rounded-lg ">
            <h3 className="mb-4">Sync with Google Calendar</h3>
            <div className="flex flex-col gap-4 text-muted-foreground mb-8">
              <p>
                To provide a seamless experience for both you and your students,
                we integrate directly with Google Calendar.
              </p>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-md">
                <CheckCircle2
                  className="text-primary mt-1 shrink-0"
                  size={18}
                />
                <p className="text-sm">
                  {" "}
                  Algora will automatically create calendar events for all your
                  confirmed sessions.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-md">
                <CheckCircle2
                  className="text-primary mt-1 shrink-0"
                  size={18}
                />
                <p className="text-sm">
                  It helps you avoid double bookings and keeps you informed
                  about upcoming sessions.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <ConnectCalendarButton email={session.user.email!} />
              {/* <p className="text-xs text-muted-foreground mt-4 italic">
                After connecting, your onboarding will be complete!
              </p> */}
            </div>

            {/* <div className="flex justify-start mt-8">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("specialties")}
              >
                Back
              </Button>
            </div> */}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
