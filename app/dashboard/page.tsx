import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import ScoreChart from "@/components/ScoreChart";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="font-body">Not logged in.</p>;
  }

  const { data: essays } = await supabase
    .from("essays")
    .select(
      "id, submitted_at, status, questions(question_text), feedback(content_mark, language_mark, overall_grade_estimate)"
    )
    .eq("status", "marked")
    .order("submitted_at", { ascending: true });

  const normalized = (essays ?? []).map((essay) => {
    const question = Array.isArray(essay.questions) ? essay.questions[0] : essay.questions;
    const feedback = Array.isArray(essay.feedback) ? essay.feedback[0] : essay.feedback;
    return { ...essay, question, feedback };
  });

  const chartData = normalized
    .filter((e) => e.feedback)
    .map((e) => ({
      date: new Date(e.submitted_at).toLocaleDateString("en-SG", {
        month: "short",
        day: "numeric",
      }),
      score: e.feedback!.content_mark + e.feedback!.language_mark,
    }));

  const historyList = [...normalized].reverse();

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex justify-between items-start border-b-2 border-ink pb-6 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate mb-1">
            GP Essay Marker
          </p>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="font-body text-slate text-sm mt-1">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <section className="mb-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-slate border-b border-slate/30 pb-1 mb-4">
          Score Over Time
        </h2>
        <ScoreChart data={chartData} />
      </section>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-widest text-slate border-b border-slate/30 pb-1 mb-4">
          Essay History
        </h2>
        {historyList.length === 0 && (
          <p className="font-body text-slate">
            No essays yet.{" "}
            <Link href="/questions" className="text-ink underline">
              Submit your first one
            </Link>.
          </p>
        )}
        <ul className="space-y-2">
          {historyList.map((essay) => (
            <li
              key={essay.id}
              className="border border-slate/40 rounded-lg px-4 py-3 hover:border-ink transition-colors"
            >
              <Link href={`/essays/${essay.id}/feedback`} className="font-body">
                {essay.question?.question_text ?? "Untitled question"}
              </Link>
              <div className="font-mono text-xs text-slate mt-1">
                {new Date(essay.submitted_at).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {essay.feedback &&
                  ` — ${essay.feedback.content_mark + essay.feedback.language_mark}/50 (${essay.feedback.overall_grade_estimate})`}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
