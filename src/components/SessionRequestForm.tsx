"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSessionRequest } from "@/app/actions/request";
import { SPECIALTY_OPTIONS } from "@/app/tutor/onboarding/page";

interface Tutor {
  id: string;
  name: string | null;
  email: string;
  specialties: string[];
}

interface SessionRequestFormProps {
  tutors: Tutor[];
}

export function SessionRequestForm({ tutors }: SessionRequestFormProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredTutors = useMemo(() => {
    if (!selectedSpecialty) return tutors;
    return tutors.filter((tutor) =>
      tutor.specialties.includes(selectedSpecialty),
    );
  }, [tutors, selectedSpecialty]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

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
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
          <option value="">All Specialties</option>
          {SPECIALTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="tutorId">
          Select Tutor
        </label>
        <select
          id="tutorId"
          name="tutorId"
          required
          className="w-full h-10 px-3 py-2 bg-background rounded-lg text-sm ring-offset-background file:border-0 border-2 border-gray-300 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a tutor...</option>
          {filteredTutors.map((tutor) => (
            <option key={tutor.id} value={tutor.id}>
              {tutor.name || tutor.email}
            </option>
          ))}
        </select>
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
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full py-6 text-base"
      >
        {isPending ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
