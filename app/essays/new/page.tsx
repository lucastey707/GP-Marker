import { createClient } from "@/lib/supabase/server";
import EssayEditor from "@/components/EssayEditor";
import NewQuestionEssayEditor from "@/components/NewQuestionEssayEditor";
import Link from "next/link";

export default async function NewEssayPage({
  searchParams,
}: {
  searchParams: Promise<{ questionId?: string }>;
}) {
  const { questionId } = await searchParams;

  if (!questionId) {
    return (
      <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
        <h1>Submit a New Essay</h1>
        <p style={{ color: "#666" }}>
          Answering a question that isn&apos;t in our bank yet? Type it below
          along with your essay -- we&apos;ll mark it and add the question to
          the bank for future students.
        </p>
        <p>
          Prefer to answer an existing question instead?{" "}
          <Link href="/questions">Browse the question bank</Link>.
        </p>
        <NewQuestionEssayEditor />
      </main>
    );
  }

  const supabase = await createClient();

  const { data: question, error } = await supabase
    .from("questions")
    .select("id, question_text")
    .eq("id", questionId)
    .single();

  if (error || !question) {
    return (
      <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
        <p>Question not found.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Write Your Essay</h1>
      <p style={{ fontWeight: "bold" }}>{question.question_text}</p>
      <EssayEditor questionId={question.id} />
    </main>
  );
}
