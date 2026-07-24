"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EssayEditor({ questionId }: { questionId: string }) {
  const router = useRouter();
  const [essayText, setEssayText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

  async function handleSubmit() {
    setError(null);

    if (wordCount < 300) {
      setError(
        `Your essay looks short (${wordCount} words). GP essays are typically 600-800 words. You can still submit if you're sure.`
      );
    }

    setSubmitting(true);

    const response = await fetch("/api/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, essayText }),
    });

    const data = await response.json();

    setSubmitting(false);

    if (!response.ok) {
      setError(data.error || "Something went wrong submitting your essay.");
      return;
    }

    router.push(`/essays/${data.essayId}/feedback`);
  }

  return (
    <div className="mt-6">
      <textarea
        value={essayText}
        onChange={(e) => setEssayText(e.target.value)}
        rows={20}
        className="w-full p-4 border border-slate/40 rounded-lg bg-white font-body leading-relaxed focus:outline-none focus:ring-2 focus:ring-ink"
        placeholder="Write or paste your essay here..."
      />
      <p className="font-mono text-xs text-slate mt-2">{wordCount} words</p>
      {error && <p className="font-body text-mark text-sm mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={submitting || essayText.trim().length === 0}
        className="mt-4 px-6 py-3 bg-ink text-paper font-body font-semibold rounded-md hover:opacity-90 disabled:opacity-50"
      >
        {submitting
          ? "Marking your essay... this can take up to a minute"
          : "Submit for Marking"}
      </button>
    </div>
  );
}
