import { supabaseAdmin } from "@/lib/db";
import { modelEssays } from "@/lib/seed/modelEssaysData";

async function seedQuestions() {
  const uniqueQuestions = new Map<string, string>();
  for (const essay of modelEssays) {
    uniqueQuestions.set(essay.questionText, essay.topicCategory);
  }

  console.log(`Seeding ${uniqueQuestions.size} questions...`);

  for (const [questionText, topicCategory] of uniqueQuestions) {
    const { data: existing } = await supabaseAdmin
      .from("questions")
      .select("id")
      .eq("question_text", questionText)
      .maybeSingle();

    if (existing) {
      console.log(`Skipping (already exists): "${questionText.slice(0, 50)}..."`);
      continue;
    }

    const { error } = await supabaseAdmin.from("questions").insert({
      question_text: questionText,
      topic_category: topicCategory,
      source: "Model essay bank",
    });

    if (error) {
      console.error(`Failed to insert: ${error.message}`);
    } else {
      console.log(`Inserted: "${questionText.slice(0, 50)}..."`);
    }
  }

  console.log("Done.");
}

seedQuestions();
