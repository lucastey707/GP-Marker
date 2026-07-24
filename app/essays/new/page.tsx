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
      <main className="max-w-2xl mx-auto py-12 px-4">
        <p className="font-mono text-xs uppercase tracking-widest text-slate mb-1">
          GP Essay Marker
        </p>
        <h1 className="font-display text-2xl font-bold mb-2">Submit a New Essay</h1>
        <p className="font-body text-slate">
          Answering a question that isn&apos;t in our bank yet? Type it below
          along with your essay -- we&apos;ll mark it and add the question to
          the bank for future students.
        </p>
        <p className="font-body text-sm mt-2">
          Prefer to answer an existing question instead?{" "}
          <Link href="/questions" className="text-ink underline">
            Browse the question bank
          </Link>.
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
      <main className="max-w-2xl mx-auto py-12 px-4">
        <p className="font-body">Question not found.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <p className="font-mono text-xs uppercase tracking-widest text-slate mb-1">
        GP Essay Marker
      </p>
      <h1 className="font-display text-2xl font-bold mb-3">Write Your Essay</h1>
      <p className="font-body font-semibold border-l-2 border-ink pl-3">
        {question.question_text}
      </p>
      <EssayEditor questionId={question.id} />
    </main>
  );
}
