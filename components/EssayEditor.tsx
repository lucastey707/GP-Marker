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
    <div>
      <textarea
        value={essayText}
        onChange={(e) => setEssayText(e.target.value)}
        rows={20}
        style={{ width: "100%", padding: "0.75rem", fontFamily: "inherit" }}
        placeholder="Write or paste your essay here..."
      />
      <p style={{ color: "#666" }}>{wordCount} words</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={submitting || essayText.trim().length === 0}
        style={{ padding: "0.75rem 1.5rem" }}
      >
        {submitting
          ? "Marking your essay... this can take up to a minute"
          : "Submit for Marking"}
      </button>
    </div>
  );
}
