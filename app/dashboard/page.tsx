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
    return <p>Not logged in.</p>;
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
    <main style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <LogoutButton />
      </div>
      <p>Logged in as: {user.email}</p>

      <section style={{ margin: "2rem 0" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Score Over Time</h2>
        <ScoreChart data={chartData} />
      </section>

      <section>
        <h2 style={{ fontSize: "1.1rem" }}>Essay History</h2>
        {historyList.length === 0 && (
          <p style={{ color: "#666" }}>
            No essays yet. <Link href="/questions">Submit your first one</Link>.
          </p>
        )}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {historyList.map((essay) => (
            <li
              key={essay.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                marginBottom: "0.5rem",
              }}
            >
              <Link href={`/essays/${essay.id}/feedback`}>
                {essay.question?.question_text ?? "Untitled question"}
              </Link>
              <div style={{ color: "#666", fontSize: "0.9rem" }}>
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