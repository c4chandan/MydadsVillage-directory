# MyDad's Village Directory

A premium, mobile-first web app for searching handwritten village records.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 🔧 Configuration

### Supabase Setup (Optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Create a table called `records` with columns:
   - `id` (auto-generated)
   - `name` (text)
   - `village` (text)
   - `price` (number)
   - `note` (text, optional)
   - `created_at` (timestamp)

3. Add your credentials to `supabase-config.js`:
```javascript
const SUPABASE_URL = 'your-url';
const SUPABASE_ANON_KEY = 'your-key';
```

## 📱 Features

- 🔍 Live search with highlighting
- 🎤 Voice search (Hindi)
- 🌙 Dark luxury theme
- 📱 Mobile-first design
- 💾 Offline support (PWA)
- 🔒 Admin panel with authentication

## 🏗️ Tech Stack

- Vanilla HTML/CSS/JS
- Supabase (optional)
- Service Worker for offline

## 📁 Structure

```
├── index.html      # Main app
├── app.js         # Application logic
├── styles.css     # Premium UI styles
├── sw.js         # Service worker
├── package.json  # Dependencies
├── public/
│   └── entries.json  # Local data
└── supabase-config.js  # Database config
```

## 🔐 Security

- XSS protection via input sanitization
- CSRF tokens for admin actions
- Secure session storage
- Input validation

## 📄 License

MIT