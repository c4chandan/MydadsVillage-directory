// Supabase Configuration
// SECURITY: ONLY anon key is exposed to frontend
// Service role key is NEVER used in client code
window.SUPABASE_URL = 'https://agtoknvwtfipcumxvcrj.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndG9rbnZ3dGZpcGN1bXh2Y3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTA3ODUsImV4cCI6MjA5Mjc4Njc4NX0.EYG0gsppdHQtpk8J_3zHzw4aCrt3EetE-C7YUn3j5wA';

console.log('Supabase config loaded:', window.SUPABASE_URL);
console.log('🔒 Security: Using anon key only (read-only from frontend)');