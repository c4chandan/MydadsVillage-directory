// Village Directory - Production Grade Final
// ════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════
var CONFIG = {
    STORAGE_KEY: 'village_directory_db',
    CACHE_KEY: 'village_cache',
    SEARCH_CACHE_KEY: 'search_cache',
    ANALYTICS_KEY: 'village_analytics',
    HOME_LIMIT: 8,
    SEARCH_LIMIT: 30,
    DEBOUNCE_MS: 300,
    MAX_SEARCH_LENGTH: 50,
    MIN_SEARCH_LENGTH: 1
};

var records = [];
var currentSort = 'newest';
var browseSortMode = 'newest';
var currentView = 'home';
var isOnline = navigator.onLine;
var supabaseClient = null;
var currentQuery = '';
var iconsRendered = false;

// ════════════════════════════════════════════════
// LANGUAGE
// ════════════════════════════════════════════════
var LANG = {
    en: {
        title: 'Find Records <span style="color:var(--accent)">Instantly</span>',
        subtitle: "Transform handwritten records into a powerful digital search experience.",
        searchPlaceholder: "Search by name or village...",
        newest: "Newest", name: "Name", price: "Price", village: "Village",
        home: "Home", admin: "Admin", explore: "Explore",
        manage: "Manage Records", backup: "Backup", load: "Import",
        addNew: "New Record", editRecord: "Edit Record",
        nameLabel: "Full Name", villageLabel: "Village Name", priceLabel: "Amount", noteLabel: "Note",
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
        install: "Install App", installText: "Add to home screen for offline access",
        adminSearch: "Search records...", langBtn: "हिंदी",
        loading: "Loading...", resultsFound: "results found",
        recentEntries: "Recent Entries",
        viewAllRecords: "View All Records",
        browseAll: "All Entries",
        passwordLabel: "Password",
        errorLoading: "Unable to load records",
        networkError: "Network error. Please check connection.",
        offline: "Offline Mode",
        searchError: "Something went wrong. Please try again.",
        authRequired: "Please login to manage records",
        logout: "Logout",
        tryTyping: "Try typing a name or village",
        speaking: "Listening...",
        processing: "Processing...",
        voiceHint: "Tap to speak"
    },
    hi: {
        title: 'रिकॉर्ड तुरंत <span style="color:var(--accent)">खोजें</span>',
        subtitle: "लिखे हुए रिकॉर्ड को शक्तिशाली डिजिटल सर्च में बदलें।",
        searchPlaceholder: "नाम या गाँव से खोजें...",
        newest: "नया", name: "नाम", price: "कीमत", village: "गाँव",
        home: "होम", admin: "एडमिन", explore: "एक्सप्लोर",
        manage: "रिकॉर्ड प्रबंधन", backup: "बैकअप", load: "लोड",
        addNew: "नया रिकॉर्ड", editRecord: "एडिट करें",
        nameLabel: "पूरा नाम", villageLabel: "गाँव का नाम", priceLabel: "राशि", noteLabel: "नोट",
        namePlaceholder: "जैसे: राम सिंह",
        villagePlaceholder: "जैसे: भटनी",
        pricePlaceholder: "जैसे: 101",
        notePlaceholder: "वैकल्पिक नोट...",
        save: "सेव करें", edit: "एडिट", delete: "हटाएं",
        noRecords: "कोई रिकॉर्ड नहीं मिला", noData: "अभी कोई डेटा नहीं है",
        confirmDelete: "क्या आप इस रिकॉर्ड को हटाना चाहते हैं?",
        saved: "रिकॉर्ड सफलतापूर्वक सेव हो गया!", deleted: "रिकॉर्ड हटा दिया गया!",
        imported: "डेटा सफलतापूर्वक इम्पोर्ट हो गया!", invalidFile: "गलत फ़ाइल!",
        enterPin: "एडमिन लॉगिन", pinSubtext: "प्रबंधन के लिए सुरक्षित",
        login: "लॉगिन", back: "रद्द", wrongPin: "गलत आईडी या पासवर्ड!",
        totalRecords: "कुल रिकॉर्ड", totalAmount: "कुल राशि", villages: "गाँव",
        install: "ऐप इंस्टॉल करें", installText: "ऑफलाइन के लिए होम स्क्रीन में जोड़ें",
        adminSearch: "रिकॉर्ड खोजें...", langBtn: "English",
        loading: "लोड हो रहा है...", resultsFound: "रिकॉर्ड मिले",
        recentEntries: "हाल के रिकॉर्ड",
        viewAllRecords: "सभी रिकॉर्ड देखें",
        browseAll: "सभी रिकॉर्ड",
        passwordLabel: "पासवर्ड",
        errorLoading: "रिकॉर्ड लोड नहीं हो सके",
        networkError: "नेटवर्क त्रुटि। कनेक्शन जांचें।",
        offline: "ऑफलाइन मोड",
        searchError: "कुछ गलत हो गया। पुनः प्रयास करें।",
        authRequired: "प्रबंधन के लिए लॉगिन करें",
        logout: "लॉग आउट",
        tryTyping: "नाम या गाँव typing करें",
        speaking: "सुन रहे हैं...",
        processing: "प्रोसेसिंग...",
        voiceHint: "बोलने के लिए टैप करें"
    }
};

var currentLang = localStorage.getItem('app_lang') || 'hi';
function t(key) { return LANG[currentLang][key] || key; }

function toggleLang() {
    currentLang = currentLang === 'hi' ? 'en' : 'hi';
    localStorage.setItem('app_lang', currentLang);
    applyLang();
    renderCurrentView();
}

// ════════════════════════════════════════════════
// UTILITIES - SECURITY & DATA RELIABILITY
// ════════════════════════════════════════════════
function sanitizeInput(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().slice(0, 500).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sanitizeSearch(str) {
    if (!str || typeof str !== 'string') return '';
    var s = str.trim().toLowerCase().slice(0, CONFIG.MAX_SEARCH_LENGTH);
    s = s.replace(/\s+/g, ' ');
    return s;
}

function validateSearch(query) {
    if (!query || query.length < CONFIG.MIN_SEARCH_LENGTH) return { valid: false };
    if (query.length > CONFIG.MAX_SEARCH_LENGTH) return { valid: false, error: 'Query too long' };
    return { valid: true };
}

function safeDisplay(str, fallback) {
    fallback = fallback || 'Unknown';
    if (!str || typeof str !== 'string') return fallback;
    var s = str.trim();
    return s.length > 0 ? escapeHtml(s) : fallback;
}

function safePrice(price, fallback) {
    fallback = fallback || 'N/A';
    if (price === null || price === undefined) return fallback;
    var n = Number(price);
    if (isNaN(n) || n < 0) return fallback;
    return '₹' + n.toLocaleString('en-IN');
}

function escapeHtml(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ════════════════════════════════════════════════
// AI SMART SEARCH - FUZZY MATCHING
// ════════════════════════════════════════════════
function levenshteinDistance(a, b) {
    if (!a || !b) return a ? a.length : (b ? b.length : 0);
    a = a.toLowerCase();
    b = b.toLowerCase();
    var matrix = [];
    for (var i = 0; i <= b.length; i++) matrix[i] = [i];
    for (var j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (var i = 1; i <= b.length; i++) {
        for (var j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function fuzzyMatch(text, query) {
    if (!text || !query) return 0;
    text = text.toLowerCase();
    query = query.toLowerCase();
    
    if (text === query) return 100;
    if (text.startsWith(query)) return 90;
    if (text.indexOf(query) !== -1) return 80;
    
    var distance = levenshteinDistance(text, query);
    var maxLen = Math.max(text.length, query.length);
    var similarity = ((maxLen - distance) / maxLen) * 70;
    
    return similarity >= 30 ? similarity : 0;
}

function smartSearch(records, query) {
    if (!records || !records.length || !query) return records;
    
    var scored = records.map(function(r) {
        var nameScore = fuzzyMatch(r.name || '', query);
        var villageScore = fuzzyMatch(r.village || '', query) * 0.8;
        var maxScore = Math.max(nameScore, villageScore);
        return { record: r, score: maxScore };
    });
    
    scored = scored.filter(function(s) { return s.score > 0; });
    scored.sort(function(a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return (b.ts || 0) - (a.ts || 0);
    });
    
    return scored.slice(0, CONFIG.SEARCH_LIMIT).map(function(s) { return s.record; });
}

// ════════════════════════════════════════════════
// HIGHLIGHT
// ════════════════════════════════════════════════
function highlight(text, query) {
    if (!query || !text) return text;
    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return String(text).replace(new RegExp('(' + escaped + ')', 'gi'), '<mark>$1</mark>');
}

// ════════════════════════════════════════════════
// LANGUAGE UI
// ════════════════════════════════════════════════
function applyLang() {
    var map = {
        appTitle: 'title', appSubtitle: 'subtitle', langBtnText: 'langBtn',
        navHomeText: 'home', navAdminText: 'admin', navBrowseText: 'explore',
        installText: 'installText', installBtn: 'install',
        browseTitle: 'browseAll', homeSectionTitleText: 'recentEntries',
        viewAllBtnText: 'viewAllRecords'
    };
    for (var id in map) {
        var el = document.getElementById(id);
        if (el) el.textContent = t(map[id]);
    }
    var homeSectionTitle = document.getElementById('homeSectionTitle');
    if (homeSectionTitle) homeSectionTitle.innerHTML = '<i data-lucide="clock"></i> ' + t('recentEntries');
    var ms = document.getElementById('mainSearch');
    if (ms) ms.placeholder = t('searchPlaceholder');
    var at = document.getElementById('appTitle');
    var as = document.getElementById('appSubtitle');
    if (at) at.innerHTML = t('title');
    if (as) as.textContent = t('subtitle');
    var it = document.getElementById('installText');
    var is = document.getElementById('installSubtext');
    var il = document.getElementById('installBtnLabel');
    if (it) it.textContent = t('install');
    if (is) is.textContent = t('installText');
    if (il) il.textContent = t('install');
    var lt = document.getElementById('loginTitle');
    var ls = document.getElementById('loginSubtext');
    var lb = document.getElementById('loginBtn');
    var lbb = document.getElementById('loginBackBtn');
    if (lt) lt.textContent = t('enterPin');
    if (ls) ls.textContent = t('pinSubtext');
    if (lb) lb.textContent = t('login');
    if (lbb) lbb.textContent = t('back');
    lucide.createIcons();
}

function renderCurrentView() {
    if (currentView === 'home') renderHome();
    else if (currentView === 'admin') renderAdmin();
    else if (currentView === 'browse') renderBrowse();
    else if (currentView === 'analytics') renderAnalytics();
}

// ════════════════════════════════════════════════
// SUPABASE
// ════════════════════════════════════════════════
function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
        supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

function isAuthenticated() {
    return !!sessionStorage.getItem('supabase_session');
}

// ════════════════════════════════════════════════
// DATA LOADING
// ════════════════════════════════════════════════
function loadRecords(callback) {
    var list = document.getElementById('resultsList');
    if (list) list.innerHTML = '<div class="spinner"></div><p style="text-align:center;color:var(--text-dim)">' + t('loading') + '</p>';
    
    // Try local cache first (always works)
    var cached = localStorage.getItem(CONFIG.CACHE_KEY);
    if (cached) {
        try { 
            records = JSON.parse(cached); 
            renderHome();
            updateStats();
            console.log('Loaded from local cache');
            return;
        } catch (e) { 
            console.log('Cache parse error, trying Supabase...');
        }
    }
    
    // Try Supabase
    var client = getSupabaseClient();
    if (client) {
        client.from('records').select('id, name, village, price, note, created_at')
            .order('created_at', { ascending: false })
            .limit(50)
            .then(function(resp) {
                if (resp.error || !resp.data || resp.data.length === 0) {
                    console.log('Supabase error or empty:', resp.error);
                    loadFromFallback(callback);
                    return;
                }
                records = resp.data.map(function(r) {
                    return {
                        id: r.id,
                        name: safeDisplay(r.name),
                        village: safeDisplay(r.village),
                        price: Number(r.price) || 0,
                        note: safeDisplay(r.note, ''),
                        ts: r.created_at ? new Date(r.created_at).getTime() : Date.now()
                    };
                });
                saveToCache();
                renderHome();
                updateStats();
                console.log('Loaded from Supabase:', records.length);
            })
.catch(function(e) { 
                console.log('Supabase exception:', e);
                loadFromFallback(callback); 
            });
    } else {
        loadFromFallback(callback);
    }
}

function loadFromFallback(callback) {
    // Try JSON file
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'public/entries.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                if (Array.isArray(data)) {
                    records = data.slice(0, 50).map(function(r, i) {
                        return {
                            id: r.id || (i + 1),
                            name: safeDisplay(r.name),
                            village: safeDisplay(r.village),
                            price: Number(r.price) || 0,
                            note: '',
                            ts: Date.now() - i * 1000
                        };
                    });
                    saveToCache();
                    console.log('Loaded from JSON file:', records.length);
                }
            } catch(e) {
                console.log('JSON parse error:', e);
                records = [];
            }
        }
        if (callback) callback();
        else renderHome();
        updateStats();
    };
    xhr.onerror = function() {
        console.log('JSON load failed');
        records = [];
        if (callback) callback();
        else renderHome();
        updateStats();
    };
    xhr.send();
}

function saveToCache() {
    try {
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(records));
    } catch (e) {}
}

function updateStats() {
    var total = records.length;
    var sRecVal = document.getElementById('statRecordsVal');
    var sSource = document.getElementById('statSource');
    if (sRecVal) sRecVal.textContent = total || '-';
    if (sSource) sSource.textContent = isOnline ? 'Cloud' : 'Offline';
}

// ════════════════════════════════════════════════
// SEARCH - DEBOUNCED
// ════════════════════════════════════════════════
var searchTimeout = null;

function performSearch(query) {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    var validation = validateSearch(query);
    if (!validation.valid) {
        renderHome();
        return;
    }
    
    currentQuery = sanitizeSearch(query);
    syncUrl();
    
    searchTimeout = setTimeout(function() {
        var client = getSupabaseClient();
        if (client && isOnline) {
            client.from('records').select('id, name, village, price, note, created_at')
                .or('name.ilike.%' + currentQuery + '%,village.ilike.%' + currentQuery + '%')
                .order('created_at', { ascending: false })
                .limit(CONFIG.SEARCH_LIMIT)
                .then(function(resp) {
                    if (resp.error) {
                        showToast(t('searchError'), 'error');
                        searchLocalFallback();
                        return;
                    }
                    var results = (resp.data || []).map(function(r) {
                        return {
                            id: r.id,
                            name: safeDisplay(r.name),
                            village: safeDisplay(r.village),
                            price: Number(r.price) || 0,
                            note: safeDisplay(r.note, ''),
                            ts: r.created_at ? new Date(r.created_at).getTime() : Date.now()
                        };
                    });
                    renderSearchResults(results);
                    trackSearch(currentQuery, results.length);
                })
                .catch(function() { searchLocalFallback(); });
        } else {
            searchLocalFallback();
        }
    }, CONFIG.DEBOUNCE_MS);
}

function searchLocalFallback() {
    var results = smartSearch(records, currentQuery);
    renderSearchResults(results);
}

function renderSearchResults(items) {
    var list = document.getElementById('resultsList');
    var countEl = document.getElementById('resultCount');
    var viewAllBox = document.getElementById('viewAllContainer');
    var homeTitle = document.getElementById('homeSectionTitle');
    
    if (!list) return;
    
    var total = items.length;
    countEl.textContent = currentQuery ? total + ' ' + t('resultsFound') : '';
    
    if (!currentQuery) {
        items = sortData(items).slice(0, CONFIG.HOME_LIMIT);
        viewAllBox.classList.toggle('hidden', total <= CONFIG.HOME_LIMIT);
        homeTitle.innerHTML = '<i data-lucide="clock"></i> ' + t('recentEntries');
    } else {
        viewAllBox.classList.add('hidden');
        homeTitle.innerHTML = '<i data-lucide="search"></i> ' + t('resultsFound');
    }
    
    if (!items.length) {
        var msg = currentQuery ? t('noRecords') : t('noData');
        list.innerHTML = '<div class="empty-state"><i data-lucide="search-x"></i><p>' + msg + '</p></div>';
        if (currentQuery) list.innerHTML += '<p style="color:var(--text-dim);margin-top:8px;">' + t('tryTyping') + '</p>';
        lucide.createIcons();
        return;
    }
    
    list.innerHTML = items.map(function(r) { return cardHTML(r, currentQuery, currentView === 'admin'); }).join('');
    if (!iconsRendered) { lucide.createIcons(); iconsRendered = true; }
}

function sortData(data) {
    if (!data || !data.length) return [];
    var d = data.slice();
    switch (currentSort) {
        case 'name': return d.sort(function(a, b) { return (a.name || '').localeCompare(b.name || ''); });
        case 'price': return d.sort(function(a, b) { return (b.price || 0) - (a.price || 0); });
        case 'village': return d.sort(function(a, b) { return (a.village || '').localeCompare(b.village || ''); });
        default: return d.sort(function(a, b) { return (b.ts || 0) - (a.ts || 0); });
    }
}

// ════════════════════════════════════════════════
// VOICE SEARCH
// ════════════════════════════════════════════════
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
var isListening = false;

function initVoice() {
    if (!SR) {
        var vb = document.getElementById('voiceBtn');
        if (vb) vb.style.display = 'none';
        return;
    }
    
    var recognition = new SR();
    recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    
    var voiceBtn = document.getElementById('voiceBtn');
    var voiceStatus = document.getElementById('voiceStatus');
    
    recognition.onstart = function() {
        isListening = true;
        voiceBtn.classList.add('recording');
        if (voiceStatus) voiceStatus.textContent = t('speaking');
    };
    
    recognition.onend = function() {
        isListening = false;
        voiceBtn.classList.remove('recording');
        if (voiceStatus) voiceStatus.textContent = '';
    };
    
    recognition.onerror = function(e) {
        isListening = false;
        voiceBtn.classList.remove('recording');
        if (voiceStatus) voiceStatus.textContent = '';
        console.log('Voice error:', e.error);
    };
    
    recognition.onresult = function(e) {
        var transcript = e.results[0][0].transcript;
        var input = document.getElementById('mainSearch');
        input.value = transcript;
        input.dispatchEvent(new Event('input'));
    };
    
    voiceBtn.onclick = function() {
        if (isListening) recognition.stop();
        else try { recognition.start(); } catch (e) {}
    };
}

window.startVoiceAdd = function() {};

// ════════════════════════════════════════════════
// VIEWS
// ════════════════════════════════════════════════
function switchView(view) {
    currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.getElementById('homeView').classList.toggle('hidden', view !== 'home');
    document.getElementById('adminView').classList.toggle('hidden', view !== 'admin');
    document.getElementById('browseView').classList.toggle('hidden', view !== 'browse');
    document.getElementById('analyticsView').classList.toggle('hidden', view !== 'analytics');
    
    document.getElementById('navHome').classList.toggle('active', view === 'home');
    document.getElementById('navBrowse').classList.toggle('active', view === 'browse');
    document.getElementById('navAnalytics').classList.toggle('active', view === 'analytics');
    document.getElementById('navAdmin').classList.toggle('active', view === 'admin');
    
    document.getElementById('addFab').classList.toggle('show', view === 'admin' && isAuthenticated());
    
    renderCurrentView();
}

function renderHome(data) {
    var items = data || records;
    var list = document.getElementById('resultsList');
    if (!list) return;
    
    if (!items.length) {
        list.innerHTML = '<div class="empty-state"><i data-lucide="book-open"></i><p>' + t('noData') + '</p></div>';
        lucide.createIcons();
        return;
    }
    
    items = currentQuery ? items : sortData(items).slice(0, CONFIG.HOME_LIMIT);
    list.innerHTML = items.map(function(r) { return cardHTML(r, currentQuery, false); }).join('');
    if (!iconsRendered) { lucide.createIcons(); iconsRendered = true; }
}

function renderBrowse() {
    var list = document.getElementById('browseList');
    var badge = document.getElementById('browseCountBadge');
    var items = sortData(records);
    if (badge) badge.textContent = items.length;
    if (!list) return;
    if (!items.length) {
        list.innerHTML = '<div class="empty-state"><i data-lucide="book-open"></i><p>' + t('noData') + '</p></div>';
        lucide.createIcons();
        return;
    }
    list.innerHTML = items.map(function(r) { return cardHTML(r, '', false); }).join('');
    lucide.createIcons();
}

function renderAdmin(data) {
    var list = document.getElementById('adminList');
    var header = document.getElementById('adminHeader');
    var items = data || records;
    if (!list || !header) return;
    
    var total = items.reduce(function(s, r) { return s + (r.price || 0); }, 0);
    var villages = items.reduce(function(s, r) { s[r.village] = true; return s; }, {});
    
    header.innerHTML = '<div class="admin-controls" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;"><h2 style="font-weight:800;font-size:1.4rem;">' + t('manage') + '</h2><button class="btn-clear" onclick="logout()">' + t('logout') + '</button></div><div class="stats"><div class="stat-card"><div class="num">' + items.length + '</div><div class="lbl">' + t('totalRecords') + '</div></div><div class="stat-card"><div class="num">₹' + total.toLocaleString('en-IN') + '</div><div class="lbl">' + t('totalAmount') + '</div></div><div class="stat-card"><div class="num">' + Object.keys(villages).length + '</div><div class="lbl">' + t('villages') + '</div></div></div>';
    
    if (!items.length) {
        list.innerHTML = '<div class="empty-state"><i data-lucide="database"></i><p>' + t('noData') + '</p></div>';
        lucide.createIcons();
        return;
    }
    list.innerHTML = items.map(function(r) { return cardHTML(r, '', true); }).join('');
    lucide.createIcons();
    
    if (!isAuthenticated()) showLogin();
}

function cardHTML(r, query, showAdmin) {
    var name = highlight(safeDisplay(r.name), query);
    var village = highlight(safeDisplay(r.village), query);
    var note = r.note ? '<div class="card-note">' + safeDisplay(r.note) + '</div>' : '';
    var adminBtns = showAdmin ? '<div class="admin-actions" style="margin-top:12px;display:flex;gap:8px;"><button class="btn-sm" onclick="editRecord(' + r.id + ')" style="background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.15);padding:6px 12px;border-radius:var(--radius-md);font-size:0.75rem;font-weight:700;cursor:pointer;">' + t('edit') + '</button><button class="btn-sm" onclick="deleteRecord(' + r.id + ')" style="background:rgba(255,68,68,0.2);color:#ef4444;border:1px solid rgba(255,68,68,0.3);padding:6px 12px;border-radius:var(--radius-md);font-size:0.75rem;font-weight:700;cursor:pointer;">' + t('delete') + '</button></div>' : '';
    
    return '<div class="card"><div class="card-info"><div class="card-name">' + name + '</div><div class="card-village"><i data-lucide="map-pin"></i>' + village + '</div>' + note + adminBtns + '</div><div class="card-price">' + safePrice(r.price) + '</div></div>';
}

// ══���═���═══════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════
function showLogin() {
    applyLang();
    document.getElementById('loginModal').classList.add('open');
}

function login() {
    var user = document.getElementById('adminUser').value.trim();
    var pass = document.getElementById('adminPass').value;
    if (user === 'admin' && pass === 'dad123') {
        sessionStorage.setItem('supabase_session', JSON.stringify({ user: { id: 'admin' } }));
        sessionStorage.setItem('isAdmin', 'true');
        document.getElementById('loginModal').classList.remove('open');
        document.getElementById('addFab').classList.add('show');
        renderAdmin();
        showToast('Logged in as Admin');
    } else {
        showToast(t('wrongPin'), 'error');
    }
}

function logout() {
    sessionStorage.removeItem('supabase_session');
    sessionStorage.removeItem('isAdmin');
    showToast('Logged out');
    showLogin();
}

// ════════════════════════════════════════════════
// CRUD
// ════════════════════════════════════════════════
function openModal(id) {
    document.getElementById('recordModal').classList.add('open');
    document.getElementById('fNameLabel').textContent = t('nameLabel');
    document.getElementById('fVillageLabel').textContent = t('villageLabel');
    document.getElementById('fPriceLabel').textContent = t('priceLabel');
    document.getElementById('fNoteLabel').textContent = t('noteLabel');
    document.getElementById('saveBtn').textContent = t('save');
    
    if (id) {
        var r = records.find(function(x) { return x.id === id; });
        if (!r) return;
        document.getElementById('editId').value = r.id;
        document.getElementById('fName').value = r.name;
        document.getElementById('fVillage').value = r.village;
        document.getElementById('fPrice').value = r.price;
        document.getElementById('fNote').value = r.note || '';
        document.getElementById('modalTitle').textContent = t('editRecord');
    } else {
        document.getElementById('recordForm').reset();
        document.getElementById('editId').value = '';
        document.getElementById('modalTitle').textContent = t('addNew');
    }
    setTimeout(function() { document.getElementById('fName').focus(); }, 300);
}

function closeModal() {
    document.getElementById('recordModal').classList.remove('open');
    document.getElementById('recordForm').reset();
}

document.getElementById('recordModal').addEventListener('click', function(e) {
    if (e.target.id === 'recordModal') closeModal();
});
document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target.id === 'loginModal') { document.getElementById('loginModal').classList.remove('open'); switchView('home'); }
});

document.getElementById('recordForm').onsubmit = function(e) {
    e.preventDefault();
    if (!isAuthenticated()) { showToast(t('authRequired'), 'error'); showLogin(); return; }
    
    var editId = document.getElementById('editId').value;
    var name = sanitizeInput(document.getElementById('fName').value);
    var village = sanitizeInput(document.getElementById('fVillage').value);
    var price = parseInt(document.getElementById('fPrice').value) || 0;
    var note = sanitizeInput(document.getElementById('fNote').value);
    
    if (!name || name.length < 2 || !village || village.length < 2) {
        showToast('Name and village required', 'error');
        return;
    }
    
    var client = getSupabaseClient();
    var data = { name: name, village: village, price: price, note: note };
    
    if (editId) {
        client.from('records').update(data).eq('id', parseInt(editId)).then(function() {
            records = records.map(function(x) { return x.id == editId ? Object.assign({}, x, data) : x; });
            saveToCache();
            closeModal();
            renderAdmin();
            showToast(t('saved'));
        });
    } else {
        client.from('records').insert([data]).then(function(resp) {
            if (resp.data) {
                records.unshift({ id: resp.data[0].id, ts: Date.now(), price: price, note: note, name: name, village: village });
                saveToCache();
            }
            closeModal();
            renderAdmin();
            showToast(t('saved'));
        });
    }
};

window.editRecord = function(id) { openModal(id); };
window.deleteRecord = function(id) {
    if (!isAuthenticated()) { showToast(t('authRequired'), 'error'); return; }
    document.getElementById('confirmMsg').textContent = t('confirmDelete');
    document.getElementById('confirmModal').classList.add('open');
    window._confirmAction = function(confirmed) {
        document.getElementById('confirmModal').classList.remove('open');
        if (confirmed) {
            var client = getSupabaseClient();
            client.from('records').delete().eq('id', id).then(function() {
                records = records.filter(function(x) { return x.id !== id; });
                saveToCache();
                renderAdmin();
                showToast(t('deleted'));
            });
        }
    };
};

window.resolveConfirm = function(val) {
    if (window._confirmAction) { window._confirmAction(val); window._confirmAction = null; }
};

// ════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════
function showToast(msg, type) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast show ' + (type || 'success');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function() { toast.className = 'toast'; }, 2800);
}

// ════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════
var analyticsFilter = 'all';

function trackSearch(query, results) {
    var analytics = JSON.parse(localStorage.getItem(CONFIG.ANALYTICS_KEY) || '[]');
    analytics.unshift({ query: query, results: results, timestamp: Date.now() });
    if (analytics.length > 500) analytics = analytics.slice(0, 500);
    localStorage.setItem(CONFIG.ANALYTICS_KEY, JSON.stringify(analytics));
}

function renderAnalytics() {
    var analytics = JSON.parse(localStorage.getItem(CONFIG.ANALYTICS_KEY) || '[]');
    var now = Date.now();
    if (analyticsFilter === 'today') {
        analytics = analytics.filter(function(a) { return now - a.timestamp < 86400000; });
    }
    
    var total = analytics.length;
    var unique = {};
    var totalResults = 0;
    analytics.forEach(function(a) { unique[a.query] = true; totalResults += a.results || 0; });
    
    document.getElementById('totalSearches').textContent = total;
    document.getElementById('uniqueQueries').textContent = Object.keys(unique).length;
    document.getElementById('totalResults').textContent = totalResults;
    
    var counts = {};
    analytics.forEach(function(a) { counts[a.query] = (counts[a.query] || 0) + 1; });
    var top = Object.keys(counts).sort(function(a, b) { return counts[b] - counts[a]; }).slice(0, 5);
    var max = top.length ? counts[top[0]] : 1;
    
    var chart = top.map(function(q) {
        var pct = Math.round((counts[q] / max) * 100);
        return '<div class="bar-item"><div class="bar-label">' + q.slice(0, 15) + '</div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div><div class="bar-value">' + counts[q] + '</div></div>';
    }).join('') || '<div class="analytics-empty"><p>No data</p></div>';
    
    document.getElementById('topNamesChart').innerHTML = chart;
    document.getElementById('topVillagesChart').innerHTML = top.length ? chart : '<div class="analytics-empty"><p>No data</p></div>';
    
    var recent = analytics.slice(0, 10).map(function(a) {
        var time = Math.floor((now - a.timestamp) / 60000);
        if (time < 1) time = 'Just now';
        else if (time < 60) time = time + 'm ago';
        else if (time < 1440) time = Math.floor(time / 60) + 'h ago';
        else time = Math.floor(time / 1440) + 'd ago';
        return '<div class="search-item"><div class="search-query">' + a.query + '</div><div class="search-time">' + time + '</div></div>';
    }).join('') || '<div class="analytics-empty"><p>No recent</p></div>';
    
    document.getElementById('recentSearchesList').innerHTML = recent;
    lucide.createIcons();
}

function setAnalyticsFilter(f) {
    analyticsFilter = f;
    document.getElementById('filterAll').classList.toggle('active', f === 'all');
    document.getElementById('filterToday').classList.toggle('active', f === 'today');
    renderAnalytics();
}

function clearAnalytics() {
    document.getElementById('confirmMsg').textContent = 'Clear analytics?';
    document.getElementById('confirmModal').classList.add('open');
    window._confirmAction = function(c) {
        document.getElementById('confirmModal').classList.remove('open');
        if (c) { localStorage.removeItem(CONFIG.ANALYTICS_KEY); renderAnalytics(); showToast('Cleared'); }
    };
}

// ════════════════════════════════════════════════
// PWA & UTILS
// ════════════════════════════════════════════════
var deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    var banner = document.getElementById('installBanner');
    if (banner) banner.classList.add('show');
});

window.installPWA = function() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(outcome) {
        if (outcome === 'accepted') {
            var banner = document.getElementById('installBanner');
            if (banner) banner.classList.remove('show');
        }
        deferredPrompt = null;
    });
};

function syncUrl() {
    var url = new URL(window.location);
    if (currentQuery) url.searchParams.set('q', currentQuery);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
}

window.triggerSearch = function() {
    var q = document.getElementById('mainSearch').value;
    if (q) performSearch(q);
};

// EVENTS
var mainSearch = document.getElementById('mainSearch');
if (mainSearch) {
    mainSearch.addEventListener('input', function(e) { performSearch(e.target.value); });
    mainSearch.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); triggerSearch(); } });
}

window.addEventListener('online', function() { isOnline = true; updateStats(); });
window.addEventListener('offline', function() { isOnline = false; updateStats(); showToast(t('offline'), 'warning'); });

var adminPass = document.getElementById('adminPass');
if (adminPass) adminPass.addEventListener('keydown', function(e) { if (e.key === 'Enter') login(); });

window.addEventListener('popstate', function() {
    var q = new URLSearchParams(window.location.search).get('q');
    if (q) { mainSearch.value = q; performSearch(q); }
    else { mainSearch.value = ''; currentQuery = ''; renderHome(); }
});

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
function initApp() {
    lucide.createIcons();
    applyLang();
    initVoice();
    loadRecords();
    var q = new URLSearchParams(window.location.search).get('q');
    if (q) { mainSearch.value = q; currentQuery = q; }
}

initApp();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
}