"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="max-w-sm mx-auto py-20 px-4">
        <h1 className="font-display text-2xl font-bold mb-3">Check Your Email</h1>
        <p className="font-body text-slate">
          We&apos;ve sent a confirmation link to {email}. Click it to activate
          your account, then come back and log in.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto py-20 px-4">
      <p className="font-mono text-xs uppercase tracking-widest text-slate mb-1">
        GP Essay Marker
      </p>
      <h1 className="font-display text-3xl font-bold mb-8">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-body block text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate/40 rounded-md bg-white font-body focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>
        <div>
          <label className="font-body block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate/40 rounded-md bg-white font-body focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>
        <div>
          <label className="font-body block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-slate/40 rounded-md bg-white font-body focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>
        <div>
          <label className="font-body block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-slate/40 rounded-md bg-white font-body focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>
        {error && <p className="font-body text-mark text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-ink text-paper font-body font-semibold rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p className="font-body text-sm mt-6 text-slate">
        Already have an account?{" "}
        <a href="/login" className="text-ink underline">Log in</a>
      </p>
    </main>
  );
}
