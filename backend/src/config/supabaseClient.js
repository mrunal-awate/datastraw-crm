const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // Fail fast and loud. A silently-undefined client leads to confusing
  // "fetch failed" errors later instead of a clear reason.
  throw new Error(
    'Missing Supabase environment variables. Check that .env exists in /backend ' +
    'and contains SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );
}

// service_role key bypasses Row Level Security — this client should
// ONLY ever be used on the backend, never exposed to the frontend.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
