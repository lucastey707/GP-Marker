// End-to-end test of the full marking pipeline: retrieval, prompt
// building, the actual Claude API call, and validation — all
// running together for the first time. Run with: npm run test:marking
//
// We're using the real "social media" essay from earlier in this
// project's testing (originally hand-marked by a human at 32/50),
// specifically because we already have a strong, independently-
// derived expectation to compare the AI's output against.

import { markEssay } from "@/lib/ai/markEssay";

const testQuestion = `Is social media changing our lives for the better or for worse?`;

const testEssay = `Unless one lives up in the high mountains of Nepal, or the depths of the Mariana Trench, virtually everyone has access to the internet. Out of those who do, an estimated 4 billion users have social media accounts worldwide. It is no surprise that social media has such significant impacts on our lives. As with most things, social media is too a double-edged sword. While some may claim that it has potential to incite rapid change, it perpetuates echo chambers, where users do not get to see multiple perspectives, as well as serves as a breeding ground for self esteem implications. As such, I proffer that social media is changing our lives for the worse.

Due to the rapid nature of data transmission alone, it is no doubt that a lot of the information and knowledge we gather are from online platforms. Be it from a news company or social media apps such as Facebook, Instagram, TikTok, social media shapes our way of thinking, through providing us with the information we read and digest. However due to the way social media algorithms work, this can create filter bubbles as users are constantly fed with ideas they often subscribe to. These filter bubbles have the pervasive influence of creating echo chambers in which an online user only sees perspectives that echo that of his own opinions. For instance, according to Pew Research Center, Americans who were conservative were forty seven percent more likely to see Facebook posts aligned with their views as opposed to half of that percentage for those who seek the middle ground. This is especially dangerous as these users only see content which affirms their confirmation bias, and they start to believe that there is only one correct opinion, theirs, while every other viewpoint is false. This is absolutely detrimental towards public discourse and is not at all conducive in raising a culture of more aware citizens. Besides, these echo chambers further perpetuate the spread of fake news on social media. When one posts a sensational blog which may carry false information, by ad populum, many will share it, believing it to be true. As this fake news gets reposted over and over again from those who start to accept it, society will no longer be trusting of one another.

However, detractors may many a time postulate that social media has a massive potential in bringing change to different issues. This is definitely also true, and often many point to different online movements such as the MeToo movement or the Black Lives Matter protest. One thing all of these movements have in common is that they were started by a small group of online activists who want to share their concerns and issues. Over time, like minded individuals who are passionate about such issues would also subscribe to their movements, sharing posts which resonated with the topic. Now the importance of social media has even weaseled its way into politics. All presidential candidates in the United States have social media accounts which they use to get users to see the change they wish to bring. In other instances, movements such as the ALS ice bucket challenge, which involve participants pouring buckets loaded with ice water on themselves and posting it to social media, sharing support for a type of muscular dystrophy disease, raised eleven point five million dollars for the cause. Evidently, social media does have the power to rally others towards a similar cause.

Yet to what extent is this change good if it brings up a separate issue? The virtual nature of social media means that nothing occurring online may truly be carried out offline. Case in point, the ALS bucket challenge, while raising millions of dollars, many online simply participated in the challenge for the sake of doing so, because they wanted to farm views and clicks. Very little truly went out to donate. In fact, only one in five who bought into the movement were said to have donated. This is also often referred to as slacktivism. It is as said before, very easy to post something online, but it gets even harder to actually produce concrete change.

Last but not least, social media is also a breeding ground for myriad self esteem and image complications. Due to the nature of social media, one's natural instinct is to post and expect validation. Gratification on social media is instant and so is the influx of dopamine from it. As a result, many often post on social media with the expectation of receiving validation in the form of engagement. Besides this, what are the chances that what we post online are not representative of our real lives? This often affects younger users who are not mature enough to understand what is online is often the best snippets taken out of one's life in order to farm engagement. A survey conducted among teens aged fourteen to eighteen in Korea shared that sixty percent of teenagers stated feeling insecure about their looks and would compare themselves to K-pop idols which they saw on social media.

In conclusion, I stand strong on my stance that social media is changing our lives for the worse. While it may be able to rally online users towards a cause, echo chambers as well as engagement driven users does not make it a conducive place to be. However, as time progresses along with technological improvements, it seems as if we will be unable to abandon social media. It is therefore up to us to not lie supine in allowing these negative effects to infiltrate our social fabric and work towards enabling social media to change our lives for the better.`;

async function main() {
  console.log("Running full marking pipeline...\n");

  const feedback = await markEssay({
    questionText: testQuestion,
    studentEssay: testEssay,
  });

  console.log("=== SCORES ===");
  console.log(`Content: ${feedback.content_mark}/30 (Band ${feedback.content_band})`);
  console.log(`Language: ${feedback.language_mark}/20 (Band ${feedback.language_band})`);
  console.log(`Overall: ${feedback.content_mark + feedback.language_mark}/50`);
  console.log(`Grade estimate: ${feedback.overall_grade_estimate}`);

  console.log("\n=== STUDENT-FACING SUMMARY ===");
  console.log(feedback.student_facing_feedback.overall_summary);

  console.log("\n=== CONTENT FEEDBACK ===");
  console.log(feedback.student_facing_feedback.content_feedback);

  console.log("\n=== LANGUAGE FEEDBACK ===");
  console.log(feedback.student_facing_feedback.language_feedback);

  console.log("\n=== LOGICAL FALLACIES FOUND ===");
  console.log(feedback.logical_fallacies.length === 0 ? "None flagged." : "");
  feedback.logical_fallacies.forEach((f) =>
    console.log(`- ${f.fallacy_name}: "${f.quote}"`)
  );
console.log("\n=== WEAKEST PARAGRAPH (ORIGINAL) ===");
  console.log(feedback.weakest_paragraph_original);

  console.log("\n=== WEAKEST PARAGRAPH (REWRITE) ===");
  console.log(feedback.weakest_paragraph_rewrite);

  console.log("\n=== SUGGESTED STRONGER ARGUMENT ===");
  console.log(feedback.suggested_stronger_argument);

  console.log("\n=== NEXT BOUNDARY ===");
  console.log(`Content: ${feedback.next_boundary_content}`);
  console.log(`Language: ${feedback.next_boundary_language}`);

  console.log("\n=== UNSUPPORTED ASSERTIONS ===");
  feedback.unsupported_assertions.forEach((a) =>
    console.log(`- "${a.quote}" \u2014 ${a.explanation}`)
  );
}

main();
