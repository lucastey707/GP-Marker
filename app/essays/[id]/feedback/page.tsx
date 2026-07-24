import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BandStamp from "@/components/BandStamp";

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
      <main className="max-w-2xl mx-auto py-16 px-4">
        <p className="font-body">Your essay is still being marked. Refresh in a moment.</p>
      </main>
    );
  }

  if (essay.status === "failed") {
    return (
      <main className="max-w-2xl mx-auto py-16 px-4">
        <p className="font-body text-mark">
          Something went wrong marking this essay. Please try submitting again.
        </p>
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
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-start justify-between border-b-2 border-ink pb-6 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate mb-1">
            Marked Essay
          </p>
          <h1 className="font-display text-2xl font-bold">Your Feedback</h1>
          <p className="font-mono text-sm text-slate mt-2">
            {feedback.overall_grade_estimate}
          </p>
        </div>
        <BandStamp label="Content" band={feedback.content_band} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border border-slate/40 rounded-lg p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-slate">Content</p>
          <p className="font-mono text-2xl font-semibold mt-1">
            {feedback.content_mark}<span className="text-slate text-base">/30</span>
          </p>
          <p className="font-mono text-xs text-slate">Band {feedback.content_band}</p>
        </div>
        <div className="border border-slate/40 rounded-lg p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-slate">Language</p>
          <p className="font-mono text-2xl font-semibold mt-1">
            {feedback.language_mark}<span className="text-slate text-base">/20</span>
          </p>
          <p className="font-mono text-xs text-slate">Band {feedback.language_band}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-2">Summary</h2>
        <p className="font-body leading-relaxed">{feedback.student_facing_overall_summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-2">Content Feedback</h2>
        <p className="font-body leading-relaxed">{feedback.student_facing_content_feedback}</p>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-2">Language Feedback</h2>
        <p className="font-body leading-relaxed">{feedback.student_facing_language_feedback}</p>
      </section>

      {fallacies.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-2">Logical Fallacies Found</h2>
          <ul className="space-y-2">
            {fallacies.map((f) => (
              <li key={f.id} className="font-body border-l-2 border-mark pl-3">
                <span className="font-semibold">&quot;{f.quoted_text}&quot;</span> — {f.comment_text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-2">Weakest Paragraph, Rewritten</h2>
        <p className="font-body text-slate italic mb-3">{feedback.weakest_paragraph_original}</p>
        <p className="font-body leading-relaxed border-l-2 border-approved pl-3">
          {feedback.weakest_paragraph_rewrite}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-2">Suggested Stronger Argument</h2>
        <p className="font-body leading-relaxed">{feedback.suggested_stronger_argument}</p>
      </section>

      <details className="font-body border-t border-slate/30 pt-4">
        <summary className="cursor-pointer font-mono text-sm uppercase tracking-wide text-slate">
          Examiner Reasoning
        </summary>
        <p className="mt-3">
          <strong>Next boundary, Content:</strong> {feedback.next_boundary_content}
        </p>
        <p className="mt-2">
          <strong>Next boundary, Language:</strong> {feedback.next_boundary_language}
        </p>
      </details>
    </main>
  );
}
