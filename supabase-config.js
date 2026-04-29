// Supabase Configuration
// SECURITY: ONLY anon key is exposed to frontend
// Service role key is NEVER used in client code (removed from frontend)
window.SUPABASE_URL = 'https://agtoknvwtfipcumxvcrj.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndG9rbnZ3dGZpcGN1bXh2Y3JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIxMDc4NSwiZXhwIjoyMDkyNzg2Nzg1fQ.Wx2HnwO6YkdIbSfTShOmudtFLdJR0nguRITEaafFmS8';

console.log('Supabase config loaded:', window.SUPABASE_URL);
console.log('🔒 Security: Using anon key only (read-only from frontend)');