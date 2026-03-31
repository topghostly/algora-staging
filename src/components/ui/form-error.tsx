import React from "react";

interface FormFieldErrorProps {
  error?: string;
}

export function FormFieldError({ error }: FormFieldErrorProps) {
  if (!error) return null;
  return (
    <p className="text-xs font-medium text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
      {error}
    </p>
  );
}
