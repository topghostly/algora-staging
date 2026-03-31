"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSessionRequest } from "@/app/(main)/actions/request";
import { SPECIALTY_OPTIONS } from "@/app/(main)/tutor/onboarding/page";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { FormFieldError } from "@/components/ui/form-error";

interface Tutor {
  id: string;
  name: string | null;
  email: string;
  specialties: string[];
  image: string | null;
  tutorBio: string | null;
}

interface SessionRequestFormProps {
  tutors: Tutor[];
}

const sessionRequestSchema = z.object({
  specialty: z.string().min(1, "Please select a specialty"),
  tutorId: z.string().min(1, "Please select a tutor"),
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  message: z.string().optional(),
});

type FormErrors = {
  [K in keyof z.infer<typeof sessionRequestSchema>]?: string;
};

export function SessionRequestForm({ tutors }: SessionRequestFormProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedTutorId, setSelectedTutorId] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredTutors = useMemo(() => {
    // if (!selectedSpecialty) return tutors;
    setSelectedTutorId("");
    return tutors.filter((tutor) =>
      tutor.specialties.includes(selectedSpecialty),
    );
  }, [tutors, selectedSpecialty]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const validation = sessionRequestSchema.safeParse({
      ...data,
      specialty: selectedSpecialty,
    });

    if (!validation.success) {
      const fieldErrors: FormErrors = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof FormErrors] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createSessionRequest(formData);
        if (result.success) {
          toast.success("Session request submitted successfully!");
          router.push("/dashboard/sessions");
        } else {
          toast.error(result.error || "Failed to submit request");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="specialty">
          Select Specialty
        </label>
        <select
          id="specialty"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select Specialty</option>
          {SPECIALTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FormFieldError error={errors.specialty} />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold">Select Tutor</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => (
              <div
                key={tutor.id}
                onClick={() => setSelectedTutorId(tutor.id)}
                className={`flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                  selectedTutorId === tutor.id
                    ? "border-primary/60 bg-primary/2"
                    : "border-gray-200 bg-card hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                    {tutor.image ? (
                      <img
                        src={tutor.image}
                        alt={tutor.name || "Tutor"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold truncate">
                        {tutor.name || tutor.email}
                      </h4>
                      {/* {selectedTutorId === tutor.id && (
                        <CheckCircle2 size={18} className="text-primary" />
                      )} */}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1 items-end">
                      {tutor.specialties.slice(0, 1).map((spec) => (
                        <Badge
                          key={spec}
                          variant="outline"
                          className="text-[10px] px-1.5 py-[2px] font-medium rounded-full text-black"
                        >
                          {spec}
                        </Badge>
                      ))}
                      {tutor.specialties.length > 1 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{tutor.specialties.length - 1} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {tutor.tutorBio || "No bio available."}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-4 text-center text-muted-foreground">
              No tutors found for this specialty.
            </div>
          )}
        </div>
        <input type="hidden" name="tutorId" value={selectedTutorId} required />
        <FormFieldError error={errors.tutorId} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="title">
          Session Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g., Help with React Tables"
          className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <FormFieldError error={errors.title} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="preferredDate">
            Preferred Date
          </label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="preferredTime">
            Preferred Time
          </label>
          <input
            id="preferredTime"
            name="preferredTime"
            type="time"
            required
            className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="message">
          Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell the tutor what you'd like to cover..."
          className="w-full min-h-[100px] px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ></textarea>
        <FormFieldError error={errors.message} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary py-6 text-base"
      >
        {isPending ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
