import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/db";
import { markEssay } from "@/lib/ai/markEssay";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { questionId, essayText } = await request.json();

  if (!questionId || !essayText || typeof essayText !== "string") {
    return NextResponse.json({ error: "Missing questionId or essayText." }, { status: 400 });
  }

  const { data: question, error: questionError } = await supabaseAdmin
    .from("questions")
    .select("question_text")
    .eq("id", questionId)
    .single();

  if (questionError || !question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

  const { data: essay, error: essayError } = await supabaseAdmin
    .from("essays")
    .insert({
      user_id: user.id,
      question_id: questionId,
      essay_text: essayText,
      word_count: wordCount,
      status: "pending",
    })
    .select("id")
    .single();

  if (essayError || !essay) {
    return NextResponse.json({ error: "Failed to save essay." }, { status: 500 });
  }

  try {
    const feedback = await markEssay({
      questionText: question.question_text,
      studentEssay: essayText,
    });

    const { data: feedbackRow, error: feedbackError } = await supabaseAdmin
      .from("feedback")
      .insert({
        essay_id: essay.id,
        content_band: feedback.content_band,
        content_mark: feedback.content_mark,
        language_band: feedback.language_band,
        language_mark: feedback.language_mark,
        overall_grade_estimate: feedback.overall_grade_estimate,
        next_boundary_content: feedback.next_boundary_content,
        next_boundary_language: feedback.next_boundary_language,
        student_facing_overall_summary: feedback.student_facing_feedback.overall_summary,
        student_facing_content_feedback: feedback.student_facing_feedback.content_feedback,
        student_facing_language_feedback: feedback.student_facing_feedback.language_feedback,
        weakest_paragraph_original: feedback.weakest_paragraph_original,
        weakest_paragraph_rewrite: feedback.weakest_paragraph_rewrite,
        suggested_stronger_argument: feedback.suggested_stronger_argument,
        raw_ai_response: feedback,
      })
      .select("id")
      .single();

    if (feedbackError || !feedbackRow) {
      throw new Error(feedbackError?.message || "Failed to save feedback.");
    }

    const inlineComments = [
      ...feedback.content_evidence.map((e) => ({
        feedback_id: feedbackRow.id,
        quoted_text: e.quote,
        comment_text: e.comment,
        comment_type: "content_evidence",
      })),
      ...feedback.language_evidence.map((e) => ({
        feedback_id: feedbackRow.id,
        quoted_text: e.quote,
        comment_text: e.comment,
        comment_type: "language_evidence",
      })),
      ...feedback.logical_fallacies.map((f) => ({
        feedback_id: feedbackRow.id,
        quoted_text: f.quote,
        comment_text: `${f.fallacy_name}: ${f.explanation}`,
        comment_type: "logical_fallacy",
      })),
      ...feedback.unsupported_assertions.map((a) => ({
        feedback_id: feedbackRow.id,
        quoted_text: a.quote,
        comment_text: a.explanation,
        comment_type: "unsupported_assertion",
      })),
    ];

    if (inlineComments.length > 0) {
      await supabaseAdmin.from("inline_comments").insert(inlineComments);
    }

    await supabaseAdmin
      .from("essays")
      .update({ status: "marked" })
      .eq("id", essay.id);

    return NextResponse.json({ essayId: essay.id });
  } catch (err) {
    await supabaseAdmin
      .from("essays")
      .update({ status: "failed" })
      .eq("id", essay.id);

    return NextResponse.json(
      { error: `Marking failed: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
