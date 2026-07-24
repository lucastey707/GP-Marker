import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function QuestionsPage() {
  const supabase = await createClient();

  const { data: questions, error } = await supabase
    .from("questions")
    .select("id, question_text, topic_category")
    .order("topic_category");

  if (error) {
    return (
      <main className="max-w-2xl mx-auto py-12 px-4">
        <p className="font-body text-mark">Failed to load questions: {error.message}</p>
      </main>
    );
  }

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
    <main className="max-w-2xl mx-auto py-12 px-4">
      <p className="font-mono text-xs uppercase tracking-widest text-slate mb-1">
        GP Essay Marker
      </p>
      <h1 className="font-display text-2xl font-bold mb-2">Question Bank</h1>
      <p className="font-body text-slate mb-1">
        Choose a question to write an essay for.
      </p>
      <p className="font-body text-sm mb-8">
        Answering a question that isn&apos;t listed here?{" "}
        <Link href="/essays/new" className="text-ink underline">
          Submit a new question and essay
        </Link>.
      </p>

      {Object.entries(grouped).map(([topic, qs]) => (
        <section key={topic} className="mb-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-slate border-b border-slate/30 pb-1 mb-3">
            {topic}
          </h2>
          <ul className="space-y-2">
            {qs!.map((q) => (
              <li
                key={q.id}
                className="border border-slate/40 rounded-lg px-4 py-3 hover:border-ink transition-colors"
              >
                <Link href={`/essays/new?questionId=${q.id}`} className="font-body">
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
