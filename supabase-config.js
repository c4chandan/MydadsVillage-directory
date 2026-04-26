// Supabase Configuration
const SUPABASE_URL = 'https://agtoknvwtfipcumxvcrj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndG9rbnZ3dGZpcGN1bXh2Y3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTA3ODUsImV4cCI6MjA5Mjc4Njc4NX0.EYG0gsppdHQtpk8J_3zHzw4aCrt3EetE-C7YUn3j5wA';

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        return null;
    }
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase connected');
        return supabaseClient;
    } catch (e) {
        console.error('Supabase init error:', e);
        return null;
    }
}