// ════════════════════════════════════════════════
// Language System
// ════════════════════════════════════════════════

// Supabase initialization
let supabaseClient = null;
const STORAGE_KEY = 'village_directory_db';

const LANG = {
let records = [];
let currentSort = 'newest';
let browseSortMode = 'newest';
let currentView = 'home';
let deferredPrompt;
const HOME_LIMIT = 8;
    en: {
        title: 'Find Records <span style="color:var(--accent)">Instantly</span>',
        subtitle: "Transform handwritten records into a powerful digital search experience.",
        searchPlaceholder: "Search by name or village...",
        newest: "Newest", name: "Name", price: "Price", village: "Village",
        home: "Home", admin: "Admin", explore: "Explore",
        manage: "Manage Records", backup: "Backup", load: "Import",
        addNew: "New Record", editRecord: "Edit Record",
        nameLabel: "Full Name", villageLabel: "Village Name", priceLabel: "Amount (₹)", noteLabel: "Note",
        namePlaceholder: "e.g. Ram Singh",
        villagePlaceholder: "e.g. Bhatni",
        pricePlaceholder: "e.g. 101",
        notePlaceholder: "Optional note...",
        save: "Save Record", edit: "Edit", delete: "Delete",
        noRecords: "No records found", noData: "No data yet",
        confirmDelete: "Are you sure you want to delete this record?",
        saved: "Record saved successfully!", deleted: "Record deleted!",
        imported: "Data imported successfully!", invalidFile: "Invalid file format!",
        enterPin: "Admin Login", pinSubtext: "Secure access for management",
        login: "Sign In", back: "Cancel", wrongPin: "Invalid User ID or Password!",
        totalRecords: "Total Records", totalAmount: "Total Amount", villages: "Villages",
        install: "Install Directory App", installText: "Fast, offline & ready on your home screen",
        adminSearch: "Search records...", langBtn: "हिंदी",
        loading: "Loading records...", resultsFound: "results found",
        recentEntries: "Recent Entries",
        viewAllRecords: "View All Records",
        browseAll: "All Entries",
        voiceAdd: "Voice Add",
        sayName: "Say Name...",
        sayVillage: "Say Village...",
        sayPrice: "Say Price...",
        voiceFinished: "Voice Entry Done!",
        passwordLabel: "Password"
    },
    hi: {
        title: 'रिकॉर्ड तुरंत <span style="color:var(--accent)">खोजें</span>',
        subtitle: "लिखे हुए रिकॉर्ड को एक शक्तिशाली डिजिटल सर्च अनुभव में बदलें।",
        searchPlaceholder: "नाम या गाँव से खोजें...",
        newest: "नया", name: "नाम", price: "कीमत", village: "गाँव",
        home: "होम", admin: "एडमिन", explore: "एक्सप्लोर",
        manage: "रिकॉर्ड प्रबंधन", backup: "बैकअप", load: "लोड",
        addNew: "नया रिकॉर्ड", editRecord: "एडिट करें",
        nameLabel: "पूरा नाम", villageLabel: "गाँव का नाम", priceLabel: "राशि (₹)", noteLabel: "नोट",
        namePlaceholder: "जैसे: राम सिंह",
        villagePlaceholder: "जैसे: भटनी",
        pricePlaceholder: "जैसे: 101",
        notePlaceholder: "वैकल्पिक नोट...",
        save: "रिकॉर्ड सेव करें", edit: "एडिट", delete: "हटाएं",
        noRecords: "कोई रिकॉर्ड नहीं मिला", noData: "अभी कोई डेटा नहीं है",
        confirmDelete: "क्या आप इस रिकॉर्ड को हटाना चाहते हैं?",
        saved: "रिकॉर्ड सफलतापूर्वक सेव हो गया!", deleted: "रिकॉर्ड हटा दिया गया!",
        imported: "डेटा सफलतापूर्वक इम्पोर्ट हो गया!", invalidFile: "गलत फ़ाइल फॉर्मेट!",
        enterPin: "एडमिन लॉगिन", pinSubtext: "मैनेजमेंट के लिए सुरक्षित लॉगिन",
        login: "लॉगिन करें", back: "रद्द करें", wrongPin: "गलत आईडी या पासवर्ड!",
        totalRecords: "कुल रिकॉर्ड", totalAmount: "कुल राशि", villages: "गाँव",
        install: "ऐप इंस्टॉल करें", installText: "तेज़, ऑफलाइन और आपकी होम स्क्रीन पर तैयार",
        adminSearch: "रिकॉर्ड खोजें...", langBtn: "English",
        loading: "रिकॉर्ड लोड हो रहे हैं...", resultsFound: "रिकॉर्ड मिले",
        recentEntries: "हाल के रिकॉर्ड",
        viewAllRecords: "सभी रिकॉर्ड देखें",
        browseAll: "सभी रिकॉर्ड",
        voiceAdd: "बोलकर जोड़ें",
        sayName: "नाम बोलें...",
        sayVillage: "गाँव का नाम बोलें...",
        sayPrice: "कीमत बोलें...",
        voiceFinished: "बोलना समाप्त!",
        passwordLabel: "पासवर्ड"
    }
};

let currentLang = localStorage.getItem('app_lang') || 'hi';
const t = (key) => LANG[currentLang][key] || key;

function toggleLang() {
    currentLang = currentLang === 'hi' ? 'en' : 'hi';
    localStorage.setItem('app_lang', currentLang);
    applyLang();
    if (currentView === 'home') renderHome();
    else if (currentView === 'admin') renderAdmin();
    else renderBrowse();
}

function applyLang() {
    const map = {
        appTitle: 'title',
        appSubtitle: 'subtitle',
        langBtnText: 'langBtn',
        navHomeText: 'home',
        navAdminText: 'admin',
        navBrowseText: 'explore',
        installText: 'installText',
        installBtn: 'install',
        browseTitle: 'browseAll',
        homeSectionTitleText: 'recentEntries',
        viewAllBtnText: 'viewAllRecords'
    };
    for (const [id, key] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el && key) {
            if (id === 'homeSectionTitleText') {
                // Keep icon
                const icon = el.previousElementSibling;
                el.textContent = t(key);
            } else {
                el.textContent = t(key);
            }
        }
    }
    
    // Custom handling for homeSectionTitle which has an icon
    const homeSectionTitle = document.getElementById('homeSectionTitle');
    if (homeSectionTitle) {
        homeSectionTitle.innerHTML = `<i data-lucide="clock"></i> ${t('recentEntries')}`;
        lucide.createIcons();
    }

    const ms = document.getElementById('mainSearch');
    if (ms) ms.placeholder = t('searchPlaceholder');
    
    // Login modal labels
    const loginUserLabel = document.querySelector('label[for="adminUser"]');
    const loginPassLabel = document.querySelector('label[for="adminPass"]');
    if (loginUserLabel) loginUserLabel.textContent = t('nameLabel'); // reusing nameLabel for "User ID"
    if (loginPassLabel) loginPassLabel.textContent = t('passwordLabel') || "Password"; 
    
    // Chips
    const chipLabels = [
        ['chipNewest', 'bChipNewest', '🕐 ' + t('newest')],
        ['chipName',   'bChipName',   '🔤 ' + t('name')],
        ['chipPrice',  'bChipPrice',  '💰 ' + t('price')],
        ['chipVillage','bChipVillage','🏘️ ' + t('village')]
    ];
    chipLabels.forEach(([id1, id2, label]) => {
        const el1 = document.getElementById(id1);
        const el2 = document.getElementById(id2);
        if (el1) el1.textContent = label;
        if (el2) el2.textContent = label;
    });

    // Login
    const lt = document.getElementById('loginTitle');
    const ls = document.getElementById('loginSubtext');
    const lb = document.getElementById('loginBtn');
    const lbb = document.getElementById('loginBackBtn');
    if (lt) lt.textContent = t('enterPin');
    if (ls) ls.textContent = t('pinSubtext');
    if (lb) lb.textContent = t('login');
    if (lbb) lbb.textContent = t('back');
    
    const va = document.getElementById('voiceAddText');
    if (va) va.textContent = t('voiceAdd');

    // Dynamic Hero Text
    const at = document.getElementById('appTitle');
    const as = document.getElementById('appSubtitle');
    if (at) at.innerHTML = t('title');
    if (as) as.textContent = t('subtitle');

    // Install Banner
    const it = document.getElementById('installText');
    const is = document.getElementById('installSubtext');
    const il = document.getElementById('installBtnLabel');
    if (it) it.textContent = t('install');
    if (is) is.textContent = t('installText');
    if (il) il.textContent = t('install');
}


// ════════════════════════════════════════════════
// Data Layer
// ════════════════════════════════════════════════
const STORAGE_KEY = 'village_directory_db';
let records = [];
let currentSort = 'newest';
let browseSortMode = 'newest';
let currentView = 'home';
let deferredPrompt;
const HOME_LIMIT = 8; // Max records to show on home by default

async function loadRecords() {
    const list = document.getElementById('resultsList');
    list.innerHTML = `<div class="spinner"></div><p style="text-align:center;color:var(--text-dim)">${t('loading')}</p>`;

    // Try Supabase first - ONLY if config is set
    if (window.SUPABASE_URL && window.SUPABASE_URL.includes('supabase')) {
        try {
            console.log('Trying Supabase...');
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            const { data, error } = await client
                .from('records')
                .select('*')
                .order('created_at', { ascending: false });
            
            console.log('Supabase response:', { error, count: data?.length });
            
            if (!error && data && data.length > 0) {
                records = data.map(r => ({
                    id: r.id,
                    name: r.name,
                    village: r.village,
                    price: r.price,
                    note: r.note || '',
                    ts: r.created_at ? new Date(r.created_at).getTime() : Date.now()
                }));
                console.log('✅ Loaded from Supabase:', records.length);
                saveRecords();
                renderHome();
                return;
            }
        } catch (e) {
            console.log('Supabase error:', e.message);
        }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try { records = JSON.parse(stored); } catch (e) { records = []; }
        console.log('Loaded from localStorage:', records.length);
        renderHome();
        return;
    }

    // Fetch from JSON file
    try {
        const res = await fetch('public/entries.json');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        records = data.map((r, i) => ({
            id: i + 1,
            name: (r.name || '').trim(),
            village: (r.village || '').trim(),
            price: Number(r.price) || 0,
            note: (r.note || '').trim(),
            ts: Date.now() - i * 100
        }));
        saveRecords();
    } catch (e) {
        console.error('Failed to load entries.json:', e);
        records = [];
    }
    renderHome();
}

function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getNextId() {
    return records.length ? Math.max(...records.map(r => r.id)) + 1 : 1;
}


// ════════════════════════════════════════════════
// Stats (Admin Only)
// ════════════════════════════════════════════════
function updateStats() {
    const total = records.length;
    const amount = records.reduce((s, r) => s + (r.price || 0), 0);
    const villages = new Set(records.map(r => r.village.trim()).filter(Boolean)).size;
    
    const sRec = document.getElementById('statRecords');
    const sAmt = document.getElementById('statAmount');
    const sVil = document.getElementById('statVillages');
    
    if (sRec) sRec.textContent = total;
    if (sAmt) sAmt.textContent = '₹' + amount.toLocaleString('en-IN');
    if (sVil) sVil.textContent = villages;
}



// ════════════════════════════════════════════════
// Sorting
// ════════════════════════════════════════════════
function sortData(data, mode) {
    const d = [...data];
    switch (mode || currentSort) {
        case 'name':    return d.sort((a, b) => a.name.localeCompare(b.name));
        case 'price':   return d.sort((a, b) => b.price - a.price);
        case 'village': return d.sort((a, b) => a.village.localeCompare(b.village));
        default:        return d.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    }
}

function setSort(type, el) {
    currentSort = type;
    document.querySelectorAll('#homeChips .chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const q = document.getElementById('mainSearch').value.trim().toLowerCase();
    const base = q
        ? records.filter(r =>
            r.name.toLowerCase().includes(q) ||
            r.village.toLowerCase().includes(q))
        : records;
    currentQuery = q;
    renderHome(base);
}

function setBrowseSort(type, el) {
    browseSortMode = type;
    document.querySelectorAll('#browseChips .chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    renderBrowse();
}


// ════════════════════════════════════════════════
// Highlight helper
// ════════════════════════════════════════════════
function highlight(text, query) {
    if (!query || !text) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return String(text).replace(regex, '<mark>$1</mark>');
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


// ════════════════════════════════════════════════
// Card HTML
// ════════════════════════════════════════════════
function cardHTML(r, query, showAdmin) {
    const name    = highlight(escapeHtml(r.name), query);
    const village = highlight(escapeHtml(r.village), query);
    const noteHTML = r.note
        ? `<div class="card-note">${escapeHtml(r.note)}</div>`
        : '';
    const adminHTML = showAdmin ? `
        <div class="admin-actions" style="margin-top:12px; display:flex; gap:8px;">
            <button class="btn-sm btn-edit" onclick="editRecord(${r.id})" style="background:rgba(255,255,255,0.08); color:white; border:1px solid rgba(255,255,255,0.15); padding:6px 12px; border-radius:var(--radius-md); font-size:0.75rem; font-weight:700; cursor:pointer;">
                ${t('edit')}
            </button>
            <button class="btn-sm btn-del" onclick="deleteRecord(${r.id})" style="background:rgba(255,255,255,0.05); color:var(--danger); border:1px solid rgba(255,255,255,0.1); padding:6px 12px; border-radius:var(--radius-md); font-size:0.75rem; font-weight:700; cursor:pointer;">
                ${t('delete')}
            </button>
        </div>` : '';

    return `<div class="card">
        <div class="card-info">
            <div class="card-name">${name}</div>
            <div class="card-village"><i data-lucide="map-pin"></i>${village}</div>
            ${noteHTML}
            ${adminHTML}
        </div>
        <div class="card-price">₹${Number(r.price).toLocaleString('en-IN')}</div>
    </div>`;
}


// ════════════════════════════════════════════════
// Render Home
// ════════════════════════════════════════════════
let currentQuery = '';
let iconsRendered = false;

function renderHome(data) {
    const list = document.getElementById('resultsList');
    const countEl = document.getElementById('resultCount');
    const viewAllBox = document.getElementById('viewAllContainer');
    const homeTitle = document.getElementById('homeSectionTitle');
    
    let items = sortData(data !== undefined ? data : records, currentSort);
    const totalMatching = items.length;

    if (!currentQuery) {
        items = items.slice(0, HOME_LIMIT);
        viewAllBox.classList.toggle('hidden', totalMatching <= HOME_LIMIT);
        homeTitle.innerHTML = `<i data-lucide="clock"></i> ${t('recentEntries')}`;
    } else {
        viewAllBox.classList.add('hidden');
        homeTitle.innerHTML = `<i data-lucide="search"></i> ${t('resultsFound')}`;
    }

    if (!items.length) {
        const msg = currentQuery ? t('noRecords') : t('noData');
        list.innerHTML = `<div class="empty-state"><i data-lucide="search-x"></i><p>${msg}</p></div>`;
        countEl.textContent = '';
        return;
    }

    countEl.textContent = currentQuery ? `${totalMatching} ${t('resultsFound')}` : '';
    list.innerHTML = items.map(r => cardHTML(r, currentQuery, false)).join('');
    
    if (!iconsRendered) {
        lucide.createIcons();
        iconsRendered = true;
    }
}


// ════════════════════════════════════════════════
// Render Browse (All Entries)
// ════════════════════════════════════════════════
function renderBrowse() {
    const list = document.getElementById('browseList');
    const badge = document.getElementById('browseCountBadge');
    const items = sortData(records, browseSortMode);

    if (badge) badge.textContent = items.length;

    if (!items.length) {
        list.innerHTML = `<div class="empty-state"><i data-lucide="book-open"></i><p>${t('noData')}</p></div>`;
        return;
    }
    list.innerHTML = items.map(r => cardHTML(r, '', false)).join('');
}


// ════════════════════════════════════════════════
// Render Admin
// ════════════════════════════════════════════════
function renderAdmin(data) {
    const list   = document.getElementById('adminList');
    const header = document.getElementById('adminHeader');
    const items  = data !== undefined ? data : records;


    header.innerHTML = `
        <div class="admin-controls" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
            <h2 style="font-weight:800; font-size:1.4rem;">${t('manage')}</h2>
            <div class="admin-btn-group" style="display:flex; gap:8px;">
                <button class="btn-sm" onclick="exportData()" style="background:rgba(255,255,255,0.08); color:white; border:1px solid rgba(255,255,255,0.15); padding:10px 16px; border-radius:var(--radius-md); font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px;">
                    <i data-lucide="download" style="width:16px; height:16px;"></i> ${t('backup')}
                </button>
                <button class="btn-sm" onclick="importData()" style="background:rgba(255,255,255,0.08); color:white; border:1px solid rgba(255,255,255,0.15); padding:10px 16px; border-radius:var(--radius-md); font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px;">
                    <i data-lucide="upload" style="width:16px; height:16px;"></i> ${t('load')}
                </button>
            </div>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="num" id="statRecords">0</div>
                <div class="lbl">${t('totalRecords')}</div>
            </div>
            <div class="stat-card">
                <div class="num" id="statAmount">₹0</div>
                <div class="lbl">${t('totalAmount')}</div>
            </div>
            <div class="stat-card">
                <div class="num" id="statVillages">0</div>
                <div class="lbl">${t('villages')}</div>
            </div>
        </div>

        <div class="search-box" style="margin-bottom:24px;">
            <i data-lucide="search" style="color:var(--text-dim);width:20px;height:20px;flex-shrink:0"></i>
            <input type="text" id="adminSearch" placeholder="${t('adminSearch')}"
                   autocomplete="off" spellcheck="false">
        </div>`;

    // Attach event listener after HTML is inserted
    setTimeout(() => {
        const adminSearchInput = document.getElementById('adminSearch');
        if (adminSearchInput) {
            adminSearchInput.addEventListener('input', (e) => onAdminSearch(e.target.value));
        }
    }, 100);

    updateStats();

    if (!items.length) {
        list.innerHTML = `<div class="empty-state"><i data-lucide="database"></i><p>${t('noData')}</p></div>`;
        return;
    }
    list.innerHTML = items.map(r => cardHTML(r, '', true)).join('');
}

function onAdminSearch(q) {
    console.log('Admin search:', q);
    q = q.trim().toLowerCase();
    if (!q) { renderAdmin(); return; }
    renderAdmin(records.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.village.toLowerCase().includes(q)));
}


// ════════════════════════════════════════════════
// Live Search (Home)
// ════════════════════════════════════════════════
document.getElementById('mainSearch').addEventListener('input', (e) => {
    currentQuery = e.target.value.trim().toLowerCase();
    syncUrl();
    if (!currentQuery) {
        document.getElementById('suggestions').style.display = 'none';
        renderHome();
        return;
    }
    const filtered = records.filter(r =>
        r.name.toLowerCase().includes(currentQuery) ||
        r.village.toLowerCase().includes(currentQuery));
    renderHome(filtered);
    showSuggestions(filtered.slice(0, 6), currentQuery);
});

function showSuggestions(data, q) {
    const el = document.getElementById('suggestions');
    if (!q || !data.length) { el.style.display = 'none'; return; }
    el.innerHTML = data.map(r => `
        <div class="sug-item" onclick="pickSuggestion(${r.id})">
            <div>
                <div class="sug-name">${highlight(r.name, q)}</div>
                <div class="sug-village">${r.village}</div>
            </div>
            <i data-lucide="arrow-up-left" style="width:16px; color:var(--text-dim)"></i>
        </div>`).join('');
    el.style.display = 'block';
}

window.pickSuggestion = (id) => {
    const r = records.find(x => x.id === id);
    if (!r) return;
    document.getElementById('mainSearch').value = r.name;
    currentQuery = r.name.toLowerCase();
    document.getElementById('suggestions').style.display = 'none';
    renderHome(records.filter(x => x.name.toLowerCase().includes(currentQuery)));
};

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-area')) {
        document.getElementById('suggestions').style.display = 'none';
    }
});


// ════════════════════════════════════════════════
// View Switching
// ════════════════════════════════════════════════
function switchView(view) {
    currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('homeView').classList.toggle('hidden', view !== 'home');
    document.getElementById('adminView').classList.toggle('hidden', view !== 'admin');
    document.getElementById('browseView').classList.toggle('hidden', view !== 'browse');

    document.getElementById('navHome').classList.toggle('active', view === 'home');
    document.getElementById('navAdmin').classList.toggle('active', view === 'admin');
    document.getElementById('navBrowse').classList.toggle('active', view === 'browse');

    const isAdmin = !!sessionStorage.getItem('isAdmin');
    document.getElementById('addFab').classList.toggle('show', view === 'admin' && isAdmin);

    if (view === 'admin') {
        if (!isAdmin) {
            showLogin();
        } else {
            renderAdmin();
        }
    } else if (view === 'browse') {
        renderBrowse();
    } else {
        renderHome();
    }
}


// ════════════════════════════════════════════════
// Login
// ════════════════════════════════════════════════
function showLogin() {
    applyLang();
    document.getElementById('loginModal').classList.add('open');
    setTimeout(() => {
        const field = document.getElementById('adminUser');
        if (field) field.focus();
    }, 300);
}

function login() {
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value;
    
    if (user === 'admin' && pass === 'dad123') {
        sessionStorage.setItem('isAdmin', 'true');
        document.getElementById('loginModal').classList.remove('open');
        document.getElementById('adminUser').value = '';
        document.getElementById('adminPass').value = '';
        document.getElementById('addFab').classList.add('show');
        renderAdmin();
        showToast("Logged in as Admin");
    } else {
        showToast(t('wrongPin'), 'error');
        document.getElementById('adminPass').value = '';
    }
}

document.getElementById('adminPass').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') login();
});

function cancelLogin() {
    document.getElementById('loginModal').classList.remove('open');
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    switchView('home');
}


// ════════════════════════════════════════════════
// CRUD Modal
// ════════════════════════════════════════════════
function openModal(id) {
    document.getElementById('recordModal').classList.add('open');

    // Update labels
    document.getElementById('fNameLabel').textContent    = t('nameLabel');
    document.getElementById('fVillageLabel').textContent = t('villageLabel');
    document.getElementById('fPriceLabel').textContent   = t('priceLabel');
    document.getElementById('fNoteLabel').textContent    = t('noteLabel');
    document.getElementById('fName').placeholder         = t('namePlaceholder');
    document.getElementById('fVillage').placeholder      = t('villagePlaceholder');
    document.getElementById('fPrice').placeholder        = t('pricePlaceholder');
    document.getElementById('fNote').placeholder         = t('notePlaceholder');
    document.getElementById('saveBtn').textContent       = t('save');

    if (id) {
        const r = records.find(x => x.id === id);
        if (!r) return;
        document.getElementById('editId').value    = r.id;
        document.getElementById('fName').value     = r.name;
        document.getElementById('fVillage').value  = r.village;
        document.getElementById('fPrice').value    = r.price;
        document.getElementById('fNote').value     = r.note || '';
        document.getElementById('modalTitle').textContent = t('editRecord');
    } else {
        document.getElementById('recordForm').reset();
        document.getElementById('editId').value = '';
        document.getElementById('modalTitle').textContent = t('addNew');
    }
    setTimeout(() => document.getElementById('fName').focus(), 300);
}

function closeModal() {
    document.getElementById('recordModal').classList.remove('open');
    document.getElementById('recordForm').reset();
}

document.getElementById('recordModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('recordModal')) closeModal();
});
document.getElementById('loginModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('loginModal')) cancelLogin();
});

document.getElementById('recordForm').onsubmit = async (e) => {
    e.preventDefault();
    const editId = document.getElementById('editId').value;
    const name   = document.getElementById('fName').value.trim();
    const village= document.getElementById('fVillage').value.trim();
    const price  = parseInt(document.getElementById('fPrice').value) || 0;
    const note   = document.getElementById('fNote').value.trim();

    // Validation
    if (!name || name.length < 2) {
        showToast('Name must be at least 2 characters', 'error');
        return;
    }
    if (!village || village.length < 2) {
        showToast('Village must be at least 2 characters', 'error');
        return;
    }
    if (price < 0 || price > 999999) {
        showToast('Invalid price amount', 'error');
        return;
    }

    const entry = {
        id:      editId ? parseInt(editId) : getNextId(),
        name:    sanitize(name),
        village: sanitize(village),
        price:   price,
        note:    sanitize(note),
        ts:      editId ? (records.find(x => x.id == editId)?.ts || Date.now()) : Date.now()
    };

    // Save to Supabase if connected
    if (supabaseClient && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        try {
            if (editId) {
                await supabaseClient.from('records').update({
                    name: entry.name,
                    village: entry.village,
                    price: entry.price,
                    note: entry.note
                }).eq('id', entry.id);
            } else {
                await supabaseClient.from('records').insert([{
                    name: entry.name,
                    village: entry.village,
                    price: entry.price,
                    note: entry.note
                }]);
            }
        } catch (e) {
            console.log('Supabase save failed, using local');
        }
    }

    if (editId) {
        records = records.map(x => x.id == editId ? entry : x);
    } else {
        records.unshift(entry);
    }

    saveRecords();
    closeModal();
    renderAdmin();
    updateStats();
    showToast(t('saved'));
};

// Sanitize input to prevent XSS
function sanitize(str) {
    if (!str) return '';
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ════════════════════════════════════════════════
// Custom Confirm Dialog
// ════════════════════════════════════════════════
let confirmPromiseRes;
function showConfirm(msg, title = "Confirm") {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMsg').textContent = msg;
    document.getElementById('confirmTitle').textContent = title;
    modal.classList.add('open');
    return new Promise(res => {
        confirmPromiseRes = res;
    });
}

function resolveConfirm(val) {
    document.getElementById('confirmModal').classList.remove('open');
    if (confirmPromiseRes) confirmPromiseRes(val);
}

window.editRecord   = (id) => openModal(id);
window.deleteRecord = async (id) => {
    const ok = await showConfirm(t('confirmDelete'));
    if (ok) {
        records = records.filter(x => x.id !== id);
        saveRecords();
        renderAdmin();
        updateStats();
        showToast(t('deleted'));
    }
};

window.resolveConfirm = resolveConfirm;



// ════════════════════════════════════════════════
// Voice Search
// ════════════════════════════════════════════════
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SR) {
    const recognition = new SR();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const vb = document.getElementById('voiceBtn');
    let isListening = false;

    recognition.onstart = () => { isListening = true; vb.classList.add('recording'); };
    recognition.onend   = () => { isListening = false; vb.classList.remove('recording'); };
    recognition.onerror = () => { isListening = false; vb.classList.remove('recording'); };
    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        const input = document.getElementById('mainSearch');
        input.value = transcript;
        input.dispatchEvent(new Event('input'));
    };

    vb.onclick = () => {
        if (isListening) recognition.stop();
        else try { recognition.start(); } catch (e) {}
    };

    // ── Voice Add Wizard ──
    window.startVoiceAdd = () => {
        if (!SR) return;
        const wizard = new SR();
        wizard.lang = 'hi-IN';
        wizard.interimResults = false;
        
        const status = document.getElementById('voiceStatus');
        const vBtn = document.getElementById('voiceAddBtn');
        let step = 0; // 0: Name, 1: Village, 2: Price

        const updateUI = () => {
            if (step === 0) status.textContent = t('sayName');
            else if (step === 1) status.textContent = t('sayVillage');
            else if (step === 2) status.textContent = t('sayPrice');
            else status.textContent = t('voiceFinished');
        };

        wizard.onstart = () => {
            vBtn.classList.add('recording');
            updateUI();
        };

        wizard.onend = () => {
            if (step < 3) {
                try { wizard.start(); } catch (e) {}
            } else {
                vBtn.classList.remove('recording');
                status.textContent = '';
            }
        };

        wizard.onresult = (e) => {
            const val = e.results[0][0].transcript;
            if (step === 0) {
                document.getElementById('fName').value = val;
                step = 1;
            } else if (step === 1) {
                document.getElementById('fVillage').value = val;
                step = 2;
            } else if (step === 2) {
                // Try to extract number from string
                const num = val.match(/\d+/);
                document.getElementById('fPrice').value = num ? num[0] : '';
                step = 3;
                wizard.stop();
            }
            updateUI();
        };

        try { wizard.start(); } catch (e) {}
    };
} else {
    const vb = document.getElementById('voiceBtn');
    if (vb) vb.style.display = 'none';
}


// ════════════════════════════════════════════════
// Export / Import
// ════════════════════════════════════════════════
window.exportData = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `village_directory_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
};

window.importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                if (!Array.isArray(parsed)) throw new Error('Not an array');
                records = parsed.map((r, i) => ({
                    id:      r.id || i + 1,
                    name:    (r.name || '').trim(),
                    village: (r.village || '').trim(),
                    price:   Number(r.price) || 0,
                    note:    (r.note || '').trim(),
                    ts:      r.ts || Date.now()
                }));
                saveRecords();
                renderAdmin();
                updateStats();
                showToast(t('imported'));
            } catch {
                showToast(t('invalidFile'), 'error');
            }
        };
    };
    input.click();
};


// ════════════════════════════════════════════════
// Toast
// ════════════════════════════════════════════════
function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast show ' + (type || 'success');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => { toast.className = 'toast'; }, 2800);
}


// ════════════════════════════════════════════════
// PWA Install
// ════════════════════════════════════════════════
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById('installBanner');
    if (banner) banner.classList.add('show');
});

window.installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        const banner = document.getElementById('installBanner');
        if (banner) banner.classList.remove('show');
    }
    deferredPrompt = null;
};


// ── Sync with URL ──
function syncUrl() {
    const q = document.getElementById('mainSearch').value.trim();
    const url = new URL(window.location);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
}

window.triggerSearch = () => {
    const q = document.getElementById('mainSearch').value.trim();
    if (q) {
        currentQuery = q.toLowerCase();
        syncUrl();
        const filtered = records.filter(r =>
            r.name.toLowerCase().includes(currentQuery) ||
            r.village.toLowerCase().includes(currentQuery));
        renderHome(filtered);
    }
};

// Enter key triggers search
document.getElementById('mainSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch();
    }
});

window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        document.getElementById('mainSearch').value = q;
        renderResults(q);
    } else {
        document.getElementById('mainSearch').value = '';
        switchView('home');
    }
});

// ════════════════════════════════════════════════
// Init
// ════════════════════════════════════════════════
function initApp() {
    lucide.createIcons();
    applyLang();
    loadRecords();
    
    // Check URL for search query
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        document.getElementById('mainSearch').value = q;
        currentQuery = q.toLowerCase();
    }
}

initApp();


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}
