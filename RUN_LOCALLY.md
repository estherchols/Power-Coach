# Power Coach — Running Locally on Your Machine

The development server is fully set up and tested. Here's how to run it on your computer.

---

## 📋 Prerequisites

You need Node.js and npm installed on your machine:

```bash
# Check if you have Node.js:
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher

# If not installed, download from: https://nodejs.org/
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Navigate to Power Coach folder
```bash
cd ~/Downloads/"Power Coach"
# or wherever you've saved the folder
```

### Step 2: Install dependencies
```bash
npm install
```

This installs:
- React 18.3.1
- Vite 5.4.2
- Tailwind CSS 4.0.0

### Step 3: Start the dev server
```bash
npm run dev
```

You'll see output like:
```
  VITE v5.4.21  ready in 334 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌐 Open in Browser

**Click this link or paste into your browser:**
```
http://localhost:5173/
```

You should see the Power Coach app with a dark theme.

---

## 🎯 What to Do Once It's Running

### 1. Load Demo Data
- Click the **"Load Demo"** button in the top-right corner
- You'll see 4 email threads appear on the dashboard

### 2. Explore the Threads
Each thread shows:
- Contact name
- Email subject
- Stakes level (high/medium/low) in a colored badge
- Framework (Touchy Feely / Path to Power / Acting with Power) with icon
- One-line coaching summary

### 3. Click on a Thread
Clicking any thread takes you to the full analysis view where you see:
- Complete email conversation
- Framework-specific annotations
- Relationship context
- Detailed coaching recommendations

### 4. Switch Between Views
Use the navigation tabs:
- **◉ Pulse** — Dashboard with all coaching opportunities
- **◈ Analyze** — Deep-dive into selected thread
- **✦ Compose** — Type a draft and get real-time coaching
- **◐ Map** — Relationship visualization

---

## 🐛 Troubleshooting

### "Port 5173 is already in use"
```bash
# Kill the existing process:
# On Mac/Linux:
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Then restart:
npm run dev
```

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall:
rm -rf node_modules
npm install
npm run dev
```

### Page is blank
- Try refreshing (Cmd+R or Ctrl+R)
- Check the browser console for errors (F12 → Console tab)
- Clear browser cache

### "npm: command not found"
- You need to install Node.js from https://nodejs.org/

---

## 📊 What You're Testing

The demo includes:

### 4 Complete Email Threads

| Thread | To | Framework | Issue |
|--------|----|-----------|----|
| Q3 Budget Request | VP Finance | Acting with Power | Hedging despite having strong data |
| Thanksgiving Plans | Mom | Touchy Feely | Missing emotional bids in the conversation |
| Partnership Proposal | Investor | Path to Power | Declining assertiveness across 3 emails |
| Co-founder Check-in | Jamie | Touchy Feely | Pursue-withdraw pattern escalating |

### 3 Calendar Events

- Tomorrow 2:00 PM: 1:1 with Prof. Brady
- Tomorrow 4:30 PM: Investor Coffee Chat  
- Today 10:00 AM: Team Standup

### 3 Coaching Frameworks

1. **Touchy Feely** — Detects emotional dynamics, missed bids, over-the-net language
2. **Path to Power** — Detects power leakage, strategic mistakes, leverage issues
3. **Acting with Power** — Detects status language, space-taking, warmth-authority balance

---

## 📂 Project Files

After you open the project, you'll see:

```
Power Coach/
├── src/                    # React source code
│   ├── views/             # The 4 main screens
│   ├── api/               # Claude API client
│   └── utils/             # Data, constants, helpers
├── package.json           # Dependencies
├── vite.config.js         # Build config
├── index.html             # Entry point
├── README.md              # Overview
├── CLAUDE.md              # Technical spec
├── QUICKSTART.md          # Demo guide
├── SETUP_REPORT.md        # Setup details
└── test-demo-flow.mjs     # Test suite
```

---

## 🔌 Next Steps (After Demo)

### To Connect Real Gmail
1. Set up Google OAuth credentials
2. Add them to the app configuration
3. Click "Scan Inbox" to fetch real threads

### To Enable Live Coaching
1. Get an Anthropic API key from https://console.anthropic.com/
2. Create a `.env.local` file:
   ```
   VITE_ANTHROPIC_API_KEY=your-api-key-here
   ```
3. Real Claude-powered coaching will activate

### To Build for Production
```bash
npm run build

# Creates optimized build in dist/ folder
# Deploy dist/ folder to any static hosting
```

---

## ⌨️ Development Tips

### Hot Module Reloading
- Save any file → Browser updates automatically
- Changes appear instantly, no manual refresh needed

### Debug Mode
- Open F12 (Developer Tools)
- Console tab shows any errors
- Network tab shows API calls
- Elements tab shows component structure

### Working with Components
Edit files in `src/views/` to modify:
- Dashboard.jsx → Change the dashboard layout
- ThreadAnalyzer.jsx → Change thread analysis view
- ComposeCoach.jsx → Change compose experience
- RelationshipMap.jsx → Change relationship visualization

---

## 📞 Support

All documentation is in the Power Coach folder:

- **QUICKSTART.md** — How to explore the demo (5 min read)
- **SETUP_REPORT.md** — What's been validated (technical)
- **POWER_COACH_SPEC.md** — Full product spec
- **CLAUDE.md** — Technical architecture
- **test-demo-flow.mjs** — Run tests: `node test-demo-flow.mjs`

---

## ✨ Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Install dependencies | `npm install` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Run tests | `node test-demo-flow.mjs` |

---

## 🎉 You're All Set!

The app is fully functional with:
- ✅ 3 coaching frameworks
- ✅ 4 complete demo threads
- ✅ 3 calendar events
- ✅ Full UI with 4 views
- ✅ Responsive design
- ✅ Dark theme
- ✅ Hot reloading

Just run `npm run dev` and open http://localhost:5173/ in your browser!
