import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error(
    "Missing Supabase environment variables. Check that .env.local " +
    "exists and contains NEXT_PUBLIC_SUPABASE_URL and " +
    "SUPABASE_SECRET_KEY."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, secretKey, {
  auth: {
    persistSession: false,
  },
});
