import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key, not the public anon key.
// The service role key bypasses Row Level Security entirely, which
// is exactly what we want here: this file is only ever used by our
// own trusted backend code (seed scripts, API routes), never sent
// to a user's browser. Never import this file into any component
// that renders in the browser.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase environment variables. Check that .env.local " +
    "exists and contains NEXT_PUBLIC_SUPABASE_URL and " +
    "SUPABASE_SERVICE_ROLE_KEY."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    // We don't need session persistence for server-side/script use —
    // this client authenticates as "the backend itself," not as any
    // particular logged-in user.
    persistSession: false,
  },
});
