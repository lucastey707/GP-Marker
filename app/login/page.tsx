"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="max-w-sm mx-auto py-20 px-4">
      <p className="font-mono text-xs uppercase tracking-widest text-slate mb-1">
        GP Essay Marker
      </p>
      <h1 className="font-display text-3xl font-bold mb-8">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
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
            className="w-full px-3 py-2 border border-slate/40 rounded-md bg-white font-body focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </div>
        {error && <p className="font-body text-mark text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-ink text-paper font-body font-semibold rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="font-body text-sm mt-6 text-slate">
        No account?{" "}
        <a href="/signup" className="text-ink underline">Sign up</a>
      </p>
    </main>
  );
}
