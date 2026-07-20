import { retrieveRelevantEssays } from "@/lib/ai/retrieval";
import { buildMarkingPrompt } from "@/lib/ai/promptTemplates";
import { getMarkingResponse } from "@/lib/ai/claudeClient";
import { feedbackSchema, type EssayFeedback } from "@/lib/ai/schema";

function extractJson(rawText: string): unknown {
  const cleaned = rawText.replace(/^```json\s*|```\s*$/g, "").trim();
  return JSON.parse(cleaned);
}

export async function markEssay(params: {
  questionText: string;
  studentEssay: string;
  studentPatternSummary?: string;
}): Promise<EssayFeedback> {
  const { questionText, studentEssay, studentPatternSummary } = params;

  const retrievedEssays = await retrieveRelevantEssays(questionText, studentEssay, 3);

  const prompt = buildMarkingPrompt({
    questionText,
    studentEssay,
    retrievedEssays,
    studentPatternSummary,
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    const rawResponse = await getMarkingResponse(
      attempt === 1
        ? prompt
        : `${prompt}\n\nIMPORTANT: Your previous response was not valid JSON matching the required structure. Return ONLY the valid JSON object, with no other text.`
    );

    try {
      const parsed = extractJson(rawResponse);
      return feedbackSchema.parse(parsed);
    } catch (err) {
      if (attempt === 2) {
        throw new Error(
          `AI response failed validation after retry: ${(err as Error).message}`
        );
      }
    }
  }

  throw new Error("Unexpected: marking loop completed without a result.");
}
