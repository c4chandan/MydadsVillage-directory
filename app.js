// Village Directory - Production Grade
var STORAGE_KEY = 'village_directory_db';
var CACHE_KEY = 'village_cache';
var records = [];
var currentSort = 'newest';
var browseSortMode = 'newest';
var currentView = 'home';
var HOME_LIMIT = 8;
var isOnline = navigator.onLine;
var supabaseClient = null;

// Language strings
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
        install: "Install Directory App", installText: "Fast, offline and ready on your home screen",
        adminSearch: "Search records...", langBtn: "Hindi",
        loading: "Loading...", resultsFound: "results found",
        recentEntries: "Recent Entries",
        viewAllRecords: "View All Records",
        browseAll: "All Entries",
        passwordLabel: "Password",
        errorLoading: "Unable to load records",
        networkError: "Network error",
        offline: "Offline Mode - Showing cached data",
        searchError: "Search failed. Try again.",
        authRequired: "Please login to manage records",
        logout: "Logout"
    },
    hi: {
        title: 'रिकॉर्ड तुरंत <span style="color:var(--accent)">खोजें</span>',
        subtitle: "लिखे हुए रिकॉर्ड को एक शक्तिशाली डिजिटल सर्च अनुभव में बदलें।",
        searchPlaceholder: "नाम या गाँव से खोजें...",
        newest: "ना", name: "नाम", price: "कीमत", village: "गाँव",
        home: "होम", admin: "एडमिन", explore: "एक्सप्लोर",
        manage: "रिकॉर्ड प्रबंधन", backup: "बैकअप", load: "लोड",
        addNew: "नया रिकॉर्ड", editRecord: "एडिट करें",
        nameLabel: "पूरा नाम", villageLabel: "गाँव का नाम", priceLabel: "राशि", noteLabel: "नोट",
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
        install: "ऐप इंस्टॉल करें", installText: "तेज़, ऑफलाइन और होम स्क्रीन पर तैयार",
        adminSearch: "रिकॉर्ड खोजें...", langBtn: "English",
        loading: "लोड हो रहा है...", resultsFound: "रिकॉर्ड मिले",
        recentEntries: "हाल के रिकॉर्ड",
        viewAllRecords: "सभी रिकॉर्ड देखें",
        browseAll: "सभी रिकॉर्ड",
        passwordLabel: "पासवर्ड",
        errorLoading: "रिकॉर्ड लोड नहीं हो सके",
        networkError: "नेटवर्क त्रुटि",
        offline: "ऑफलाइन मोड - कैश्ड डेटा दिखा रहे हैं",
        searchError: "खोज विफल। पुनः प्रयास करें।",
        authRequired: "रिकॉर्ड प्रबंधन के लिए कृपया लॉगिन करें",
        logout: "लॉग आउट"
    }
};

var currentLang = localStorage.getItem('app_lang') || 'hi';
function t(key) { return LANG[currentLang][key] || key; }

function toggleLang() {
    currentLang = currentLang === 'hi' ? 'en' : 'hi';
    localStorage.setItem('app_lang', currentLang);
    applyLang();
    if (currentView === 'home') renderHome();
    else if (currentView === 'admin') renderAdmin();
    else renderBrowse();
}

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
    if (homeSectionTitle) {
        homeSectionTitle.innerHTML = '<i data-lucide="clock"></i> ' + t('recentEntries');
        lucide.createIcons();
    }
    var ms = document.getElementById('mainSearch');
    if (ms) ms.placeholder = t('searchPlaceholder');
    var lt = document.getElementById('loginTitle');
    var ls = document.getElementById('loginSubtext');
    var lb = document.getElementById('loginBtn');
    var lbb = document.getElementById('loginBackBtn');
    if (lt) lt.textContent = t('enterPin');
    if (ls) ls.textContent = t('pinSubtext');
    if (lb) lb.textContent = t('login');
    if (lbb) lbb.textContent = t('back');
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
}

// Security functions
function sanitizeInput(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 500);
}

function sanitizeForSearch(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().toLowerCase().slice(0, 100);
}

function validateRecord(name, village, price) {
    if (!name || name.length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
    if (!village || village.length < 2) return { valid: false, error: 'Village must be at least 2 characters' };
    if (typeof price !== 'number' || price < 0 || price > 999999) return { valid: false, error: 'Invalid price amount' };
    return { valid: true };
}

function safeDisplay(str, fallback) {
    fallback = fallback || 'Unknown';
    if (!str || typeof str !== 'string') return fallback;
    var trimmed = str.trim();
    return trimmed.length > 0 ? escapeHtml(trimmed) : fallback;
}

function safePriceDisplay(price, fallback) {
    fallback = fallback || 'N/A';
    if (price === null || price === undefined || isNaN(price)) return fallback;
    var num = Number(price);
    if (isNaN(num) || num < 0) return fallback;
    return '₹' + num.toLocaleString('en-IN');
}

function escapeHtml(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(text, query) {
    if (!query || !text) return text;
    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escaped + ')', 'gi');
    return String(text).replace(regex, '<mark>$1</mark>');
}

// Supabase client
function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
        supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

// Check if user is authenticated
function isAuthenticated() {
    var session = sessionStorage.getItem('supabase_session');
    return session ? true : false;
}

function getSession() {
    var session = sessionStorage.getItem('supabase_session');
    return session ? JSON.parse(session) : null;
}

// Load records from Supabase
function loadRecords(callback) {
    var list = document.getElementById('resultsList');
    if (list) {
        list.innerHTML = '<div class="spinner"></div><p style="text-align:center;color:var(--text-dim)">' + t('loading') + '</p>';
    }
    
    var client = getSupabaseClient();
    console.log('Supabase client:', !!client, 'URL:', window.SUPABASE_URL);
    
    if (client) {
        client.from('records').select('id, name, village, price, note, created_at').order('created_at', { ascending: false }).limit(100).then(function(response) {
            console.log('Supabase response:', response);
            if (response.error) {
                console.log('Load error:', response.error.message);
                loadFromCacheOrFallback(callback);
                return;
            }
            if (response.data && response.data.length > 0) {
                records = response.data.slice(0, 100).map(function(r) {
                    return {
                        id: r.id,
                        name: safeDisplay(r.name, 'Unknown'),
                        village: safeDisplay(r.village, 'Unknown'),
                        price: Number(r.price) || 0,
                        note: safeDisplay(r.note, ''),
                        ts: r.created_at ? new Date(r.created_at).getTime() : Date.now()
                    };
                });
                saveCache();
                console.log('Loaded from Supabase:', records.length);
                if (callback) callback();
                else renderHome();
                updateStats();
                return;
            }
            console.log('No data in Supabase');
            loadFromCacheOrFallback(callback);
        }).catch(function(e) {
            console.log('Exception:', e);
            loadFromCacheOrFallback(callback);
        });
    } else {
        console.log('No Supabase client');
        loadFromCacheOrFallback(callback);
    }
}

function loadFromCacheOrFallback(callback) {
    // Try cache first
    var cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        try {
            records = JSON.parse(cached);
            console.log('Loaded from cache:', records.length);
            if (callback) callback();
            else renderHome();
            updateStats();
            return;
        } catch (e) {
            console.log('Cache parse error:', e);
        }
    }
    
    // Try JSON file
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'public/entries.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                if (Array.isArray(data)) {
                    records = data.slice(0, 100).map(function(r, i) {
                        return {
                            id: r.id || i + 1,
                            name: safeDisplay(r.name, 'Unknown'),
                            village: safeDisplay(r.village, 'Unknown'),
                            price: Number(r.price) || 0,
                            note: safeDisplay(r.note, ''),
                            ts: Date.now() - i * 1000
                        };
                    });
                    saveCache();
                    console.log('Loaded from JSON:', records.length);
                }
            } catch(e) {
                console.log('JSON parse error:', e);
            }
        }
        if (callback) callback();
        else renderHome();
        updateStats();
    };
    xhr.onerror = function() {
        console.log('JSON load failed');
        if (callback) callback();
        else renderHome();
        updateStats();
    };
    xhr.send();
}

function saveCache() {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(records));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {}
}

// Database-level search (Supabase)
function searchRecordsDB(query, callback) {
    var list = document.getElementById('resultsList');
    if (!list) return;
    
    list.innerHTML = '<div class="spinner"></div><p style="text-align:center;color:var(--text-dim)">' + t('loading') + '</p>';
    
    var client = getSupabaseClient();
    if (client && query) {
        client.from('records').select('id, name, village, price, note, created_at')
            .or('name.ilike.%' + query + '%,village.ilike.%' + query + '%')
            .order('created_at', { ascending: false })
            .limit(20)
            .then(function(response) {
                if (response.error) {
                    list.innerHTML = '<div class="empty-state"><i data-lucide="alert-circle"></i><p>' + t('searchError') + '</p></div>';
                    lucide.createIcons();
                    return;
                }
                if (response.data && response.data.length > 0) {
                    var items = response.data.map(function(r) {
                        return {
                            id: r.id,
                            name: safeDisplay(r.name, 'Unknown'),
                            village: safeDisplay(r.village, 'Unknown'),
                            price: Number(r.price) || 0,
                            note: safeDisplay(r.note, ''),
                            ts: r.created_at ? new Date(r.created_at).getTime() : Date.now()
                        };
                    });
                    renderSearchResults(items, query);
                } else {
                    list.innerHTML = '<div class="empty-state"><i data-lucide="search-x"></i><p>' + t('noRecords') + '</p></div>';
                    lucide.createIcons();
                }
                if (callback) callback();
            });
    } else {
        if (callback) callback();
        else renderHome();
    }
}

function renderSearchResults(items, query) {
    var list = document.getElementById('resultsList');
    var countEl = document.getElementById('resultCount');
    var viewAllBox = document.getElementById('viewAllContainer');
    var homeTitle = document.getElementById('homeSectionTitle');
    
    if (!list) return;
    
    countEl.textContent = items.length + ' ' + t('resultsFound');
    viewAllBox.classList.add('hidden');
    homeTitle.innerHTML = '<i data-lucide="search"></i> ' + t('resultsFound');
    
    if (!items.length) {
        list.innerHTML = '<div class="empty-state"><i data-lucide="search-x"></i><p>' + t('noRecords') + '</p></div>';
        lucide.createIcons();
        return;
    }
    
    list.innerHTML = items.map(function(r) { return cardHTML(r, query, false); }).join('');
    lucide.createIcons();
}

function updateStats() {
    var total = records.length;
    var sRecVal = document.getElementById('statRecordsVal');
    var sSource = document.getElementById('statSource');
    if (sRecVal) sRecVal.textContent = total > 0 ? total : '-';
    if (sSource) sSource.textContent = isOnline ? 'Cloud' : 'Offline';
}

function sortData(data, mode) {
    if (!Array.isArray(data) || data.length === 0) return [];
    var d = data.slice();
    switch (mode || currentSort) {
        case 'name': return d.sort(function(a, b) { return (a.name || '').localeCompare(b.name || ''); });
        case 'price': return d.sort(function(a, b) { return (b.price || 0) - (a.price || 0); });
        case 'village': return d.sort(function(a, b) { return (a.village || '').localeCompare(b.village || ''); });
        default: return d.sort(function(a, b) { return (b.ts || 0) - (a.ts || 0); });
    }
}

function setSort(type, el) {
    currentSort = type;
    var chips = document.querySelectorAll('#homeChips .chip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
    el.classList.add('active');
    var q = sanitizeForSearch(document.getElementById('mainSearch').value);
    if (q) {
        var filtered = records.filter(function(r) {
            return (r.name || '').toLowerCase().indexOf(q) !== -1 || (r.village || '').toLowerCase().indexOf(q) !== -1;
        });
        renderHome(filtered);
    } else {
        renderHome();
    }
}

function setBrowseSort(type, el) {
    browseSortMode = type;
    var chips = document.querySelectorAll('#browseChips .chip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
    el.classList.add('active');
    renderBrowse();
}

function cardHTML(r, query, showAdmin) {
    var safeName = escapeHtml(r.name) || 'Unknown';
    var safeVillage = escapeHtml(r.village) || 'Unknown';
    var name = highlight(safeName, query);
    var village = highlight(safeVillage, query);
    var noteHTML = r.note ? '<div class="card-note">' + escapeHtml(r.note) + '</div>' : '';
    var adminHTML = showAdmin ? '<div class="admin-actions" style="margin-top:12px;display:flex;gap:8px;"><button class="btn-sm btn-edit" onclick="editRecord(' + r.id + ')" style="background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.15);padding:6px 12px;border-radius:var(--radius-md);font-size:0.75rem;font-weight:700;cursor:pointer;">' + t('edit') + '</button><button class="btn-sm btn-del" onclick="deleteRecord(' + r.id + ')" style="background:rgba(255,255,255,0.05);color:var(--danger);border:1px solid rgba(255,255,255,0.1);padding:6px 12px;border-radius:var(--radius-md);font-size:0.75rem;font-weight:700;cursor:pointer;">' + t('delete') + '</button></div>' : '';
    return '<div class="card"><div class="card-info"><div class="card-name">' + name + '</div><div class="card-village"><i data-lucide="map-pin"></i>' + village + '</div>' + noteHTML + adminHTML + '</div><div class="card-price">' + safePriceDisplay(r.price) + '</div></div>';
}

var currentQuery = '';
var iconsRendered = false;

function renderHome(data) {
    var list = document.getElementById('resultsList');
    var countEl = document.getElementById('resultCount');
    var viewAllBox = document.getElementById('viewAllContainer');
    var homeTitle = document.getElementById('homeSectionTitle');
    if (!list) return;
    
    var items = sortData(data !== undefined ? data : records, currentSort);
    var totalMatching = items.length;
    
    if (!currentQuery) {
        items = items.slice(0, HOME_LIMIT);
        viewAllBox.classList.toggle('hidden', totalMatching <= HOME_LIMIT);
        homeTitle.innerHTML = '<i data-lucide="clock"></i> ' + t('recentEntries');
    } else {
        viewAllBox.classList.add('hidden');
        homeTitle.innerHTML = '<i data-lucide="search"></i> ' + t('resultsFound');
    }
    
    if (!items.length) {
        var msg = currentQuery ? t('noRecords') : t('noData');
        list.innerHTML = '<div class="empty-state"><i data-lucide="search-x"></i><p>' + msg + '</p></div>';
        countEl.textContent = '';
        lucide.createIcons();
        return;
    }
    
    countEl.textContent = currentQuery ? totalMatching + ' ' + t('resultsFound') : '';
    list.innerHTML = items.map(function(r) { return cardHTML(r, currentQuery, false); }).join('');
    if (!iconsRendered) {
        lucide.createIcons();
        iconsRendered = true;
    }
}

function renderBrowse() {
    var list = document.getElementById('browseList');
    var badge = document.getElementById('browseCountBadge');
    var items = sortData(records, browseSortMode);
    if (!list) return;
    if (badge) badge.textContent = items.length;
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
    var items = data !== undefined ? data : records;
    if (!list || !header) return;
    
    var totalAmount = items.reduce(function(s, r) { return s + (r.price || 0); }, 0);
    var villageCount = {};
    items.forEach(function(r) { villageCount[r.village] = true; });
    
    header.innerHTML = '<div class="admin-controls" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;"><h2 style="font-weight:800;font-size:1.4rem;">' + t('manage') + '</h2><div class="admin-btn-group" style="display:flex;gap:8px;"><button class="btn-sm" onclick="exportData()" style="background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.15);padding:10px 16px;border-radius:var(--radius-md);font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;"><i data-lucide="download" style="width:16px;height:16px;"></i>' + t('backup') + '</button><button class="btn-sm" onclick="logout()" style="background:rgba(255,68,68,0.2);color:#ef4444;border:1px solid rgba(255,68,68,0.3);padding:10px 16px;border-radius:var(--radius-md);font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;"><i data-lucide="log-out" style="width:16px;height:16px;"></i>' + t('logout') + '</button></div></div><div class="stats"><div class="stat-card"><div class="num" id="statRecords">' + items.length + '</div><div class="lbl">' + t('totalRecords') + '</div></div><div class="stat-card"><div class="num">₹' + totalAmount.toLocaleString('en-IN') + '</div><div class="lbl">' + t('totalAmount') + '</div></div><div class="stat-card"><div class="num">' + Object.keys(villageCount).length + '</div><div class="lbl">' + t('villages') + '</div></div></div><div class="search-box" style="margin-bottom:24px;"><i data-lucide="search" style="color:var(--text-dim);width:20px;height:20px;flex-shrink:0"></i><input type="text" id="adminSearch" placeholder="' + t('adminSearch') + '" autocomplete="off" spellcheck="false"></div>';
    
    setTimeout(function() {
        var adminSearchInput = document.getElementById('adminSearch');
        if (adminSearchInput) {
            adminSearchInput.addEventListener('input', function(e) { onAdminSearch(e.target.value); });
        }
    }, 100);
    lucide.createIcons();
    
    if (!items.length) {
        list.innerHTML = '<div class="empty-state"><i data-lucide="database"></i><p>' + t('noData') + '</p></div>';
        return;
    }
    list.innerHTML = items.map(function(r) { return cardHTML(r, '', true); }).join('');
}

function onAdminSearch(q) {
    q = sanitizeForSearch(q);
    if (!q) { renderAdmin(); return; }
    renderAdmin(records.filter(function(r) {
        return (r.name || '').toLowerCase().indexOf(q) !== -1 || (r.village || '').toLowerCase().indexOf(q) !== -1;
    }));
}

// Debounced search
var searchTimeout = null;
var DEBOUNCE_MS = 300;

function performDebouncedSearch(query) {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
        var q = sanitizeForSearch(query);
        currentQuery = q;
        syncUrl();
        if (!q) {
            document.getElementById('suggestions').style.display = 'none';
            renderHome();
            return;
        }
        // Use database search
        searchRecordsDB(q);
    }, DEBOUNCE_MS);
}

var mainSearchInput = document.getElementById('mainSearch');
if (mainSearchInput) {
    mainSearchInput.addEventListener('input', function(e) {
        performDebouncedSearch(e.target.value);
    });
}

function showSuggestions(data, q) {
    var el = document.getElementById('suggestions');
    if (!el || !q || !data.length) {
        if (el) el.style.display = 'none';
        return;
    }
    el.innerHTML = data.slice(0, 6).map(function(r) {
        return '<div class="sug-item" onclick="pickSuggestion(' + r.id + ')"><div><div class="sug-name">' + highlight(escapeHtml(r.name) || 'Unknown', q) + '</div><div class="sug-village">' + escapeHtml(r.village || 'Unknown') + '</div></div><i data-lucide="arrow-up-left" style="width:16px;color:var(--text-dim)"></i></div>';
    }).join('');
    el.style.display = 'block';
}

window.pickSuggestion = function(id) {
    var r = records.find(function(x) { return x.id === id; });
    if (!r) return;
    document.getElementById('mainSearch').value = r.name;
    currentQuery = sanitizeForSearch(r.name);
    document.getElementById('suggestions').style.display = 'none';
    searchRecordsDB(currentQuery);
};

document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-area')) {
        document.getElementById('suggestions').style.display = 'none';
    }
});

function switchView(view) {
    currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('homeView').classList.toggle('hidden', view !== 'home');
    document.getElementById('adminView').classList.toggle('hidden', view !== 'admin');
    document.getElementById('browseView').classList.toggle('hidden', view !== 'browse');
    document.getElementById('analyticsView').classList.toggle('hidden', view !== 'analytics');
    document.getElementById('navHome').classList.toggle('active', view === 'home');
    document.getElementById('navAdmin').classList.toggle('active', view === 'admin');
    document.getElementById('navBrowse').classList.toggle('active', view === 'browse');
    document.getElementById('navAnalytics').classList.toggle('active', view === 'analytics');
    document.getElementById('addFab').classList.toggle('show', view === 'admin');
    
    if (view === 'admin') {
        if (!isAuthenticated()) {
            showLogin();
        } else {
            renderAdmin();
        }
    } else if (view === 'browse') {
        renderBrowse();
    } else if (view === 'analytics') {
        renderAnalytics();
    } else {
        renderHome();
    }
}

// Login (simple session-based for this demo)
function showLogin() {
    applyLang();
    document.getElementById('loginModal').classList.add('open');
    setTimeout(function() {
        var field = document.getElementById('adminUser');
        if (field) field.focus();
    }, 300);
}

function login() {
    var user = document.getElementById('adminUser').value.trim();
    var pass = document.getElementById('adminPass').value;
    if (user === 'admin' && pass === 'dad123') {
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('supabase_session', JSON.stringify({ user: { id: 'admin', email: 'admin@example.com' } }));
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

function logout() {
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('supabase_session');
    showToast("Logged out");
    switchView('home');
}

var adminPassField = document.getElementById('adminPass');
if (adminPassField) {
    adminPassField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') login();
    });
}

function cancelLogin() {
    document.getElementById('loginModal').classList.remove('open');
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    switchView('home');
}

function openModal(id) {
    document.getElementById('recordModal').classList.add('open');
    document.getElementById('fNameLabel').textContent = t('nameLabel');
    document.getElementById('fVillageLabel').textContent = t('villageLabel');
    document.getElementById('fPriceLabel').textContent = t('priceLabel');
    document.getElementById('fNoteLabel').textContent = t('noteLabel');
    document.getElementById('fName').placeholder = t('namePlaceholder');
    document.getElementById('fVillage').placeholder = t('villagePlaceholder');
    document.getElementById('fPrice').placeholder = t('pricePlaceholder');
    document.getElementById('fNote').placeholder = t('notePlaceholder');
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
    if (e.target === document.getElementById('recordModal')) closeModal();
});
document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === document.getElementById('loginModal')) cancelLogin();
});

document.getElementById('recordForm').onsubmit = function(e) {
    e.preventDefault();
    if (!isAuthenticated()) {
        showToast(t('authRequired'), 'error');
        showLogin();
        return;
    }
    var editId = document.getElementById('editId').value;
    var name = sanitizeInput(document.getElementById('fName').value);
    var village = sanitizeInput(document.getElementById('fVillage').value);
    var price = parseInt(document.getElementById('fPrice').value) || 0;
    var note = sanitizeInput(document.getElementById('fNote').value);
    var validation = validateRecord(name, village, price);
    if (!validation.valid) {
        showToast(validation.error, 'error');
        return;
    }
    var client = getSupabaseClient();
    var recordData = { name: name, village: village, price: price, note: note };
    if (editId) {
        client.from('records').update(recordData).eq('id', parseInt(editId)).then(function(resp) {
            if (!resp.error) {
                records = records.map(function(x) { return x.id == editId ? Object.assign({}, x, recordData) : x; });
                saveCache();
                closeModal();
                renderAdmin();
                updateStats();
                showToast(t('saved'));
            } else {
                showToast('Error: ' + resp.error.message, 'error');
            }
        });
    } else {
        client.from('records').insert([recordData]).then(function(resp) {
            if (!resp.error && resp.data) {
                var newRecord = Object.assign({ id: resp.data[0].id, ts: Date.now() }, recordData);
                records.unshift(newRecord);
                saveCache();
                closeModal();
                renderAdmin();
                updateStats();
                showToast(t('saved'));
            } else {
                showToast('Error: ' + (resp.error ? resp.error.message : 'Unknown'), 'error');
            }
        });
    }
};

window.editRecord = function(id) { openModal(id); };
window.deleteRecord = function(id) {
    if (!isAuthenticated()) {
        showToast(t('authRequired'), 'error');
        return;
    }
    document.getElementById('confirmMsg').textContent = t('confirmDelete');
    document.getElementById('confirmTitle').textContent = 'Delete Record';
document.getElementById('confirmModal').classList.add('open');
    window._confirmResolve = function(confirmed) {
        document.getElementById('confirmModal').classList.remove('open');
        if (confirmed) {
            var client = getSupabaseClient();
            client.from('records').delete().eq('id', id).then(function(resp) {
                if (!resp.error) {
                    records = records.filter(function(x) { return x.id !== id; });
                    saveCache();
                    renderAdmin();
                    updateStats();
                    showToast(t('deleted'));
                } else {
                    showToast('Error: ' + resp.error.message, 'error');
                }
            });
        }
    };
}

window.resolveConfirm = function(val) {
    if (window._confirmResolve) {
        window._confirmResolve(val);
        window._confirmResolve = null;
    }
};

// Voice
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SR) {
    var recognition = new SR();
    recognition.lang = 'hi-IN';
    var vb = document.getElementById('voiceBtn');
    var isListening = false;
    recognition.onstart = function() { isListening = true; vb.classList.add('recording'); };
    recognition.onend = function() { isListening = false; vb.classList.remove('recording'); };
    recognition.onresult = function(e) {
        var transcript = e.results[0][0].transcript;
        var input = document.getElementById('mainSearch');
        input.value = transcript;
        input.dispatchEvent(new Event('input'));
    };
    if (vb) vb.onclick = function() { if (isListening) recognition.stop(); else try { recognition.start(); } catch (e) {}; };
    window.startVoiceAdd = function() {};
} else {
    var vb = document.getElementById('voiceBtn');
    if (vb) vb.style.display = 'none';
}

// Export
window.exportData = function() {
    var blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'village_directory_' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
};

function showToast(msg, type) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast show ' + (type || 'success');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function() { toast.className = 'toast'; }, 2800);
}

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
    var q = document.getElementById('mainSearch').value.trim();
    var url = new URL(window.location);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
}

window.triggerSearch = function() {
    if (searchTimeout) clearTimeout(searchTimeout);
    var q = document.getElementById('mainSearch').value.trim();
    if (q) {
        currentQuery = sanitizeForSearch(q);
        syncUrl();
        searchRecordsDB(currentQuery);
    }
};

if (mainSearchInput) {
    mainSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); triggerSearch(); }
    });
}

window.addEventListener('popstate', function() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
        document.getElementById('mainSearch').value = q;
        currentQuery = sanitizeForSearch(q);
        searchRecordsDB(currentQuery);
    } else {
        document.getElementById('mainSearch').value = '';
        currentQuery = '';
        renderHome();
    }
});

window.addEventListener('online', function() { isOnline = true; updateStats(); });
window.addEventListener('offline', function() { isOnline = false; updateStats(); showToast(t('offline'), 'warning'); });

function initApp() {
    lucide.createIcons();
    applyLang();
    loadRecords();
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
        document.getElementById('mainSearch').value = q;
        currentQuery = sanitizeForSearch(q);
    }
}

initApp();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
}

// ════════════════════════════════════════════════
// ANALYTICS SYSTEM
// ════════════════════════════════════════════════
var ANALYTICS_KEY = 'village_analytics';
var analyticsFilter = 'all';

function getAnalytics() {
    var data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
}

function saveAnalytics(searchObj) {
    var analytics = getAnalytics();
    analytics.unshift({
        query: searchObj.query,
        results: searchObj.results,
        timestamp: Date.now()
    });
    // Keep max 500 searches
    if (analytics.length > 500) analytics = analytics.slice(0, 500);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

function trackSearch(query, resultsCount) {
    var searchObj = {
        query: query,
        results: resultsCount,
        timestamp: Date.now()
    };
    saveAnalytics(searchObj);
}

function getFilteredAnalytics() {
    var analytics = getAnalytics();
    var now = Date.now();
    var dayMs = 24 * 60 * 60 * 1000;
    
    if (analyticsFilter === 'today') {
        return analytics.filter(function(a) { return now - a.timestamp < dayMs; });
    }
    return analytics;
}

function getTopItems(analytics, key, limit) {
    var counts = {};
    analytics.forEach(function(a) {
        var item = a[key] || 'Unknown';
        if (!counts[item]) counts[item] = { count: 0, resultsSum: 0 };
        counts[item].count++;
        counts[item].resultsSum += a.results || 0;
    });
    return Object.keys(counts).map(function(name) {
        return { name: name, count: counts[name].count, resultsSum: counts[name].resultsSum };
    }).sort(function(a, b) { return b.count - a.count; }).slice(0, limit);
}

function renderAnalytics() {
    var analytics = getFilteredAnalytics();
    var totalSearches = analytics.length;
    var uniqueQueries = {};
    var totalResults = 0;
    analytics.forEach(function(a) {
        uniqueQueries[a.query] = true;
        totalResults += a.results || 0;
    });
    var uniqueCount = Object.keys(uniqueQueries).length;
    
    document.getElementById('totalSearches').textContent = totalSearches;
    document.getElementById('uniqueQueries').textContent = uniqueCount;
    document.getElementById('totalResults').textContent = totalResults;
    
    // Top Names
    var topNames = getTopItems(analytics, 'query', 5);
    var maxCount = topNames.length > 0 ? topNames[0].count : 1;
    var namesChart = topNames.length > 0 ? topNames.map(function(item) {
        var percent = Math.round((item.count / maxCount) * 100);
        return '<div class="bar-item"><div class="bar-label">' + escapeHtml(item.name.slice(0, 15)) + '</div><div class="bar-track"><div class="bar-fill" style="width:' + percent + '%"></div></div><div class="bar-value">' + item.count + '</div></div>';
    }).join('') : '<div class="analytics-empty"><i data-lucide="search-x"></i><p>No data yet</p></div>';
    document.getElementById('topNamesChart').innerHTML = namesChart;
    
    // Top Villages (using same data for demo - in real app would track separately)
    var topVillages = getTopItems(analytics, 'query', 5);
    var maxV = topVillages.length > 0 ? topVillages[0].count : 1;
    var villagesChart = topVillages.length > 0 ? topVillages.map(function(item) {
        var percent = Math.round((item.count / maxV) * 100);
        return '<div class="bar-item"><div class="bar-label">' + escapeHtml(item.name.slice(0, 15)) + '</div><div class="bar-track"><div class="bar-fill" style="width:' + percent + '%"></div></div><div class="bar-value">' + item.count + '</div></div>';
    }).join('') : '<div class="analytics-empty"><i data-lucide="search-x"></i><p>No data yet</p></div>';
    document.getElementById('topVillagesChart').innerHTML = villagesChart;
    
    // Recent Searches
    var recent = analytics.slice(0, 10);
    var recentList = recent.length > 0 ? recent.map(function(a) {
        var time = formatTimeAgo(a.timestamp);
        return '<div class="search-item"><div class="search-query">' + escapeHtml(a.query) + '</div><div class="search-time">' + time + '</div></div>';
    }).join('') : '<div class="analytics-empty"><i data-lucide="search-x"></i><p>No recent searches</p></div>';
    document.getElementById('recentSearchesList').innerHTML = recentList;
    
    lucide.createIcons();
}

function formatTimeAgo(timestamp) {
    var seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

function setAnalyticsFilter(filter) {
    analyticsFilter = filter;
    document.getElementById('filterAll').classList.toggle('active', filter === 'all');
    document.getElementById('filterToday').classList.toggle('active', filter === 'today');
    renderAnalytics();
}

function clearAnalytics() {
    document.getElementById('confirmMsg').textContent = 'Clear all analytics data?';
    document.getElementById('confirmTitle').textContent = 'Clear Analytics';
    document.getElementById('confirmModal').classList.add('open');
    window._confirmResolve = function(confirmed) {
        document.getElementById('confirmModal').classList.remove('open');
        if (confirmed) {
            localStorage.removeItem(ANALYTICS_KEY);
            renderAnalytics();
            showToast('Analytics cleared');
        }
    };
}

// Modify search to track
var originalSearchRecordsDB = searchRecordsDB;
searchRecordsDB = function(query, callback) {
    originalSearchRecordsDB(query, function() {
        setTimeout(function() {
            var resultsEl = document.getElementById('resultCount');
            var results = 0;
            if (resultsEl) {
                var match = resultsEl.textContent.match(/(\d+)/);
                if (match) results = parseInt(match[1]);
            }
            trackSearch(query, results);
        }, 500);
        if (callback) callback();
    });
};