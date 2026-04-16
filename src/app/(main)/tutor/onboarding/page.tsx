"use client";

import { useState, useEffect, useRef } from "react";
import { Loader, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MultiCombobox, ComboboxOption } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import ConnectCalendarButton from "@/components/ConnectCalendarButton";
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

import { z } from "zod";
import { FormFieldError } from "@/components/ui/form-error";

const onboardingSchema = z.object({
  specialties: z
    .array(z.string())
    .min(1, "Please select at least one specialty."),
  tutorBio: z.string().min(10, "Bio must be at least 10 characters.").max(1000),
});

type OnboardingErrors = {
  [K in keyof z.infer<typeof onboardingSchema>]?: string;
};

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== "TUTOR") {
      router.push("/dashboard");
    } else if (session?.user?.hasCompletedOnboarding) {
      router.push("/auth/redirect");
    }
  }, [status, session, router]);

  // Pre-fill resume state if already uploaded
  useEffect(() => {
    if (session?.user?.resumeLink) {
      setResumeUploaded(true);
    }
  }, [session?.user?.resumeLink]);

  const handleSaveSpecialties = async () => {
    setErrors({});
    const validation = onboardingSchema.safeParse({
      specialties: selectedSpecialties,
      tutorBio: bio,
    });

    if (!validation.success) {
      const fieldErrors: OnboardingErrors = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof OnboardingErrors] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in your profile.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (res.ok) {
        await update();
        setActiveTab("resume");
        toast.success("Specialties saved successfully!");
      } else {
        toast.error("Failed to save specialties. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must not exceed 5 MB.");
      return;
    }

    setResumeFile(file);
  };

  const handleUploadResume = async () => {
    if (!resumeFile) return;

    setIsUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await fetch("/api/tutor/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to upload resume.");
        return;
      }

      await update();
      setResumeUploaded(true);
      toast.success("Resume uploaded successfully!");
      setActiveTab("calendar");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> */}
        <Loader className="animate-spin" />
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
          <TabsList className="grid w-fit grid-cols-4 mb-8 mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="bg-card rounded-lg">
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
              <Button onClick={() => setActiveTab("specialties")} size={"sm"}>
                Continue
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="specialties" className="bg-card rounded-lg">
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
              <FormFieldError error={errors.specialties} />
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
              <FormFieldError error={errors.tutorBio} />
              <p className="text-xs text-muted-foreground mt-1.5">
                Tell students about your expertise and teaching approach.
              </p>
            </div>

            <div className="flex justify-end items-center mt-8">
              <Button
                onClick={handleSaveSpecialties}
                disabled={isSaving}
                size={"sm"}
              >
                {isSaving && <Loader size={16} className="animate-spin" />}
                {isSaving ? "Saving..." : "Confirm & Continue"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="resume" className="bg-card rounded-lg">
            <h3 className="mb-4">Upload Your Resume</h3>
            <p className="text-muted-foreground mb-6">
              Upload a PDF copy of your resume or CV. This helps our team verify
              your qualifications during the vetting process.
            </p>

            {resumeUploaded ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <CheckCircle2 className="text-primary shrink-0" size={22} />
                  <div>
                    <p className="font-medium text-sm">Resume uploaded</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {resumeFile?.name ?? "Your resume has been saved."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setResumeUploaded(false);
                      setResumeFile(null);
                    }}
                  >
                    Replace
                  </Button>
                  <Button size={"sm"} onClick={() => setActiveTab("calendar")}>
                    Continue to Calendar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div
                  className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {resumeFile ? (
                    <>
                      <FileText className="text-primary" size={36} />
                      <p className="font-medium text-sm">{resumeFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB — click
                        to change
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud
                        className="text-muted-foreground"
                        size={36}
                      />
                      <p className="font-medium text-sm">
                        Click to select a PDF
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF only · Max 5 MB
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleResumeChange}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleUploadResume}
                    size={"sm"}
                    disabled={!resumeFile || isUploadingResume}
                  >
                    {isUploadingResume && (
                      <Loader size={16} className="animate-spin" />
                    )}
                    {isUploadingResume ? "Uploading..." : "Upload & Continue"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="bg-card rounded-lg">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
