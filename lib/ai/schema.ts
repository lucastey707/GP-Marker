import { z } from "zod";

const evidenceItem = z.object({
  quote: z.string(),
  comment: z.string(),
});

export const feedbackSchema = z.object({
  content_band: z.number().int().min(1).max(5),
  content_mark: z.number().int().min(0).max(30),
  language_band: z.number().int().min(1).max(5),
  language_mark: z.number().int().min(0).max(20),
  overall_grade_estimate: z.string(),
  content_evidence: z.array(evidenceItem),
  language_evidence: z.array(evidenceItem),
  logical_fallacies: z.array(
    z.object({
      quote: z.string(),
      fallacy_name: z.string(),
      explanation: z.string(),
    })
  ),
  unsupported_assertions: z.array(
    z.object({
      quote: z.string(),
      explanation: z.string(),
    })
  ),
  example_quality_notes: z.array(
    z.object({
      example_reference: z.string(),
      depth_level: z.enum(["mentioned", "explained", "evaluated"]),
      comment: z.string(),
    })
  ),
  weakest_paragraph_original: z.string(),
  weakest_paragraph_rewrite: z.string(),
  suggested_stronger_argument: z.string(),
  next_boundary_content: z.string(),
  next_boundary_language: z.string(),
  student_facing_feedback: z.object({
    overall_summary: z.string(),
    content_feedback: z.string(),
    language_feedback: z.string(),
  }),
});

export type EssayFeedback = z.infer<typeof feedbackSchema>;
