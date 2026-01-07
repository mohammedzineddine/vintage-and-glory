// Replace the placeholders below with your Supabase project's values
const SUPABASE_URL = 'https://vwezaaqnuvptogblqjij.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_aZJ-9SpZNTn7zi-OuUl1iA_sUWRGnUW';

// `supabase` global is provided by the UMD bundle included in index.html
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
