const { createClient } = require('@supabase/supabase-js');

const RAW_SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!RAW_SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('⚠️  Missing Supabase credentials. Set SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.');
}

// Normalize to the bare project URL in case the user pasted a sub-path
// (e.g. the REST API URL ".../rest/v1/" instead of the plain project URL).
let SUPABASE_URL = RAW_SUPABASE_URL;
try {
  const parsed = new URL(RAW_SUPABASE_URL);
  SUPABASE_URL = `${parsed.protocol}//${parsed.host}`;
} catch {
  // leave as-is if it doesn't parse; createClient will surface a clear error
}

// Admin client — full privileges, used server-side only (create/manage users)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Anon client — used to verify email/password credentials via Supabase Auth
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = { supabaseAdmin, supabaseAnon };
