"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewQuestionEssayEditor() {
  const router = useRouter();
  const [questionText, setQuestionText] = useState("");
  const [essayText, setEssayText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

  async function handleSubmit() {
    setError(null);

    if (questionText.trim().length < 10) {
      setError("Please enter the full question you're answering.");
      return;
    }

    setSubmitting(true);

    const response = await fetch("/api/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionText, essayText }),
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
      <label>
        Your Question
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="e.g. Is technology making us more isolated?"
          style={{ display: "block", width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
      </label>

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
