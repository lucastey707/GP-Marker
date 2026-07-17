// This script populates the model_essays table using the data in
// modelEssaysData.ts. Run it with: npm run seed
//
// It is SAFE TO RE-RUN as you add more essays to the data file —
// it checks for existing entries first and skips ones already in
// the database, rather than creating duplicates.

import { supabaseAdmin } from "@/lib/db";
import { modelEssays } from "@/lib/seed/modelEssaysData";

// Voyage AI does not have an official lightweight fetch wrapper we
// need here — a plain HTTP request is simple enough on its own.
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: "voyage-3-large",
      input_type: "document",
      // "document" tells Voyage this text is something to be
      // SEARCHED, as opposed to "query", which we'll use later when
      // a student's essay is the thing doing the searching. Voyage
      // optimizes the vector slightly differently for each role.
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Voyage AI request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function seedModelEssays() {
  console.log(`Starting seed: ${modelEssays.length} essay(s) in data file.`);

  for (const essay of modelEssays) {
    // Check whether this exact essay already exists, so re-running
    // this script after adding new essays doesn't create duplicates
    // of the ones we already seeded.
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("model_essays")
      .select("id")
      .eq("question_text", essay.questionText)
      .eq("essay_text", essay.essayText)
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
      // We embed the question and essay together, not just the
      // essay alone. This matters: a student's submission will also
      // be embedded as [question + essay] when we search for
      // matches later, so both sides of the comparison need to be
      // built the same way for the similarity search to be meaningful.
      embedding = await getEmbedding(`${essay.questionText}\n\n${essay.essayText}`);
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
