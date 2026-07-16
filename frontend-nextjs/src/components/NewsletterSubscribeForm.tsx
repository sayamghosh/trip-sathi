"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "../services/newsletter.service";

type Status = "idle" | "success" | "already" | "error";

export function NewsletterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setMessage(null);
    try {
      const data = await subscribeToNewsletter(trimmed);
      setStatus("success");
      setMessage(data?.message || "You're subscribed! Watch your inbox for fresh deals.");
      setEmail("");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setStatus("already");
        setMessage(err.response.data?.message || "You're already on our list! We'll email you as soon as a new deal drops.");
      } else if (err?.response?.status === 400) {
        setStatus("error");
        setMessage(err.response.data?.message || "Please enter a valid email address.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="mt-8 sm:mt-10 flex items-center gap-3 rounded-full bg-white/10 px-6 py-4 text-sm font-medium text-white sm:max-w-[420px]">
        <Check className="h-5 w-5 shrink-0 text-emerald-300" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 sm:mt-10">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={submitting}
          className="w-full sm:w-[320px] h-13 rounded-full bg-[#2E69E3] px-6 text-white placeholder:text-white/70 outline-none border border-white/10 focus:border-white/40 disabled:opacity-70"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto h-13 px-8 rounded-full bg-white text-black font-medium cursor-pointer hover:bg-neutral-200 disabled:opacity-70 inline-flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-sm font-medium ${
            status === "already" ? "text-white/90" : "text-red-200"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default NewsletterSubscribeForm;
