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
  const queryEmbedding = await getEmbedding(
    `${studentQuestion}\n\n${studentEssay}`,
    "query"
  );

  const { data, error } = await supabaseAdmin.rpc("match_model_essays", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) {
    throw new Error(`Retrieval failed: ${error.message}`);
  }

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
