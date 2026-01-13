"use client";

import { resetPassword } from "@/app/actions/support";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(formData: FormData) {
    const res = await resetPassword(formData);
    if (res.error) {
      setMessage(res.error);
      setIsError(true);
    } else {
      setMessage(res.success || "Success");
      setIsError(false);
    }
  }

  return (
    <div className="container max-w-md py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Support: Reset Password</h1>

        {message && (
          <div
            className={`p-3 rounded mb-4 ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {message}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="input w-full"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
