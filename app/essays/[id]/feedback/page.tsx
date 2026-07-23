import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: essay, error: essayError } = await supabase
    .from("essays")
    .select("id, essay_text, status, questions(question_text)")
    .eq("id", id)
    .single();

  if (essayError || !essay) {
    notFound();
  }

  if (essay.status === "pending") {
    return (
      <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
        <p>Your essay is still being marked. Refresh in a moment.</p>
      </main>
    );
  }

  if (essay.status === "failed") {
    return (
      <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
        <p>Something went wrong marking this essay. Please try submitting again.</p>
      </main>
    );
  }

  const { data: feedback } = await supabase
    .from("feedback")
    .select("*")
    .eq("essay_id", id)
    .single();

  if (!feedback) {
    notFound();
  }

  const { data: inlineComments } = await supabase
    .from("inline_comments")
    .select("*")
    .eq("feedback_id", feedback.id);

  const fallacies = (inlineComments ?? []).filter(
    (c) => c.comment_type === "logical_fallacy"
  );

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Your Feedback</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <p>
          <strong>Content:</strong> {feedback.content_mark}/30 (Band{" "}
          {feedback.content_band}) &nbsp;|&nbsp;
          <strong>Language:</strong> {feedback.language_mark}/20 (Band{" "}
          {feedback.language_band})
        </p>
        <p>
          <strong>Overall estimate:</strong> {feedback.overall_grade_estimate}
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Summary</h2>
        <p>{feedback.student_facing_overall_summary}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Content Feedback</h2>
        <p>{feedback.student_facing_content_feedback}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Language Feedback</h2>
        <p>{feedback.student_facing_language_feedback}</p>
      </section>

      {fallacies.length > 0 && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Logical Fallacies Found</h2>
          <ul>
            {fallacies.map((f) => (
              <li key={f.id}>
                <strong>&quot;{f.quoted_text}&quot;</strong> — {f.comment_text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Weakest Paragraph, Rewritten</h2>
        <p style={{ color: "#666" }}>{feedback.weakest_paragraph_original}</p>
        <p>{feedback.weakest_paragraph_rewrite}</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Suggested Stronger Argument</h2>
        <p>{feedback.suggested_stronger_argument}</p>
      </section>

      <details>
        <summary>Examiner Reasoning (Content: Band {feedback.content_band}, Language: Band {feedback.language_band})</summary>
        <p><strong>Next boundary, Content:</strong> {feedback.next_boundary_content}</p>
        <p><strong>Next boundary, Language:</strong> {feedback.next_boundary_language}</p>
      </details>
    </main>
  );
}
