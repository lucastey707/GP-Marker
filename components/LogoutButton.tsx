"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="font-mono text-xs uppercase tracking-widest border border-slate/50 rounded-md px-3 py-1.5 hover:border-ink transition-colors"
    >
      Log Out
    </button>
  );
}
