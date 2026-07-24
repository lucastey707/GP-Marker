import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

// Note: this page has two entry points into essay submission --
// picking a question below (goes through the existing-question
// flow), or the link to /essays/new (the write-your-own-question
// flow). Both ultimately hit the same API route and marking
// pipeline.

export default async function QuestionsPage() {
  const supabase = await createClient();

  const { data: questions, error } = await supabase
    .from("questions")
    .select("id, question_text, topic_category")
    .order("topic_category");

  if (error) {
    return (
      <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
        <p>Failed to load questions: {error.message}</p>
      </main>
    );
  }

  // Group questions by topic so the page reads as organized
  // sections rather than one long undifferentiated list.
  // Student-submitted questions have no topic_category (it's
  // nullable), so we give that group a readable label rather than
  // showing "null" as a section heading.
  const grouped = (questions ?? []).reduce<Record<string, typeof questions>>(
    (acc, q) => {
      const key = q.topic_category ?? "Other / Uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key]!.push(q);
      return acc;
    },
    {}
  );

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Question Bank</h1>
      <p style={{ color: "#666" }}>
        Choose a question to write an essay for.
      </p>
      <p>
        Answering a question that isn&apos;t listed here?{" "}
        <Link href="/essays/new">Submit a new question and essay</Link>.
      </p>

      {Object.entries(grouped).map(([topic, qs]) => (
        <section key={topic} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>{topic}</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {qs!.map((q) => (
              <li
                key={q.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Link href={`/essays/new?questionId=${q.id}`}>
                  {q.question_text}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
