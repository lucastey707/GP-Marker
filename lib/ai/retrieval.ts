// Given a student's question and essay, finds the model essays in
// our database that are most relevant by meaning (not just keyword
// matching). This is the "R" (Retrieval) in RAG — it runs BEFORE we
// build the AI marking prompt, so the AI can reference genuinely
// similar examples rather than working from the rubric alone.

import { supabaseAdmin } from "@/lib/db";
import { getEmbedding } from "@/lib/ai/voyageClient";

export type RetrievedEssay = {
  id: string;
  questionText: string;
  essayText: string;
  topicCategory: string;
  gradeScore: number | null;
  qualityLabel: "graded" | "expected_high_band";
  similarity: number;
};

export async function retrieveRelevantEssays(
  studentQuestion: string,
  studentEssay: string,
  matchCount: number = 3
): Promise<RetrievedEssay[]> {
  // Step 1: turn the student's question + essay into an embedding,
  // using "query" as the input type (since this text is doing the
  // searching, not being searched for) — the mirror image of how we
  // embedded each model essay during seeding.
  const queryEmbedding = await getEmbedding(
    `${studentQuestion}\n\n${studentEssay}`,
    "query"
  );

  // Step 2: call our custom database function (retrieval_function.sql)
  // to find the closest matches by meaning.
  const { data, error } = await supabaseAdmin.rpc("match_model_essays", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) {
    throw new Error(`Retrieval failed: ${error.message}`);
  }

  // Step 3: reshape the raw database rows into a cleaner shape for
  // the rest of our code to use, converting snake_case (the
  // database's naming style) to camelCase (our TypeScript style).
  return (data ?? []).map((row: any) => ({
    id: row.id,
    questionText: row.question_text,
    essayText: row.essay_text,
    topicCategory: row.topic_category,
    gradeScore: row.grade_score,
    qualityLabel: row.quality_label,
    similarity: row.similarity,
  }));
}
