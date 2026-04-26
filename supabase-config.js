// Supabase Configuration
// Add your credentials below
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabase;

function initSupabase() {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        console.log('⚠️ Supabase not configured. Using localStorage fallback.');
        return null;
    }
    
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase connected');
        return supabase;
    } catch (e) {
        console.error('Supabase init error:', e);
        return null;
    }
}

// Fetch records from Supabase or localStorage
async function fetchRecords() {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('records')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (e) {
            console.error('Fetch error:', e);
        }
    }
    return null;
}

// Save record to Supabase
async function saveRecord(record) {
    if (!supabase) return false;
    
    try {
        const { data, error } = await supabase
            .from('records')
            .insert([record])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (e) {
        console.error('Save error:', e);
        return null;
    }
}

// Delete record from Supabase
async function deleteRecordById(id) {
    if (!supabase) return false;
    
    try {
        const { error } = await supabase
            .from('records')
            .delete()
            .eq('id', id);
        
        return !error;
    } catch (e) {
        console.error('Delete error:', e);
        return false;
    }
}

// Update record in Supabase
async function updateRecord(id, updates) {
    if (!supabase) return false;
    
    try {
        const { data, error } = await supabase
            .from('records')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (e) {
        console.error('Update error:', e);
        return null;
    }
}