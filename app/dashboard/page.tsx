import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Not logged in.</p>;
  }

  return (
    <main style={{ maxWidth: 600, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Dashboard</h1>
      <p>Logged in as: {user.email}</p>
      <p style={{ color: "#666" }}>
        This confirms authentication, session handling, and route
        protection are all working correctly. Real dashboard content
        (essay history, progress charts) comes next.
      </p>
      <LogoutButton />
    </main>
  );
}
