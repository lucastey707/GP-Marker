import { createClient } from "@/lib/supabase/server";
import EssayEditor from "@/components/EssayEditor";
import { redirect } from "next/navigation";

export default async function NewEssayPage({
  searchParams,
}: {
  searchParams: Promise<{ questionId?: string }>;
}) {
  const { questionId } = await searchParams;

  if (!questionId) {
    redirect("/questions");
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
