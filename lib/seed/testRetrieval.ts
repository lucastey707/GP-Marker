import { retrieveRelevantEssays } from "@/lib/ai/retrieval";

async function main() {
  const testQuestion = "Is social media doing more harm than good to society?";
  const testEssay =
    "Social media connects people across the world instantly, but it also " +
    "spreads misinformation and creates echo chambers where users only see " +
    "opinions that match their own. This essay will argue that the harms " +
    "outweigh the benefits.";

  console.log("Retrieving relevant essays for test question...\n");

  const results = await retrieveRelevantEssays(testQuestion, testEssay, 3);

  results.forEach((essay, index) => {
    console.log(`Match ${index + 1}:`);
    console.log(`  Similarity: ${essay.similarity.toFixed(4)}`);
    console.log(`  Topic: ${essay.topicCategory}`);
    console.log(`  Question: ${essay.questionText.slice(0, 80)}...`);
    console.log(`  Quality label: ${essay.qualityLabel}, Grade: ${essay.gradeScore ?? "N/A"}`);
    console.log("");
  });
}

main();
