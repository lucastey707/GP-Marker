import { supabaseAdmin } from "@/lib/db";
import { modelEssays } from "@/lib/seed/modelEssaysData";
import { getEmbedding } from "@/lib/ai/voyageClient";


async function seedModelEssays() {
  console.log(`Starting seed: ${modelEssays.length} essay(s) in data file.`);

  for (const essay of modelEssays) {
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("model_essays")
      .select("id")
      .eq("question_text", essay.questionText)
      .maybeSingle();

    if (lookupError) {
      console.error("Error checking for existing essay:", lookupError.message);
      continue;
    }

    if (existing) {
      console.log(`Skipping (already exists): "${essay.questionText.slice(0, 50)}..."`);
      continue;
    }

    console.log(`Embedding: "${essay.questionText.slice(0, 50)}..."`);

    let embedding: number[];
    try {
      embedding = await getEmbedding(`${essay.questionText}\n\n${essay.essayText}`, "document");
    } catch (err) {
      console.error(`Failed to embed essay: ${(err as Error).message}`);
      continue;
    }

    const { error: insertError } = await supabaseAdmin.from("model_essays").insert({
      question_text: essay.questionText,
      topic_category: essay.topicCategory,
      grade_score: essay.gradeScore,
      quality_label: essay.qualityLabel,
      essay_text: essay.essayText,
      embedding,
    });

    if (insertError) {
      console.error(`Failed to insert essay: ${insertError.message}`);
    } else {
      console.log(`Inserted successfully.`);
    }
  }

  console.log("Seed complete.");
}

seedModelEssays();
