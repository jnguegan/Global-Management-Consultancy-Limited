const SUPABASE_URL = "https://ysaxtuvuzqkyfmganven.supabase.co";
const SUPABASE_KEY = "sb_publishable_esfhuUEIcUJEL6z9zryRAA_FGMmUHlw";

window.supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
