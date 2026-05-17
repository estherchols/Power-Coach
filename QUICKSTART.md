# Power Coach — Quick Start Guide

## ✅ Current Status
- **Dev Server:** Running on `http://localhost:5173/`
- **Demo Data:** All validated and ready
- **Tests:** All passing (4 threads, 3 calendar events, 3 frameworks)

## 🚀 How to Test Right Now

### Step 1: Open the Browser
```
Navigate to: http://localhost:5173/
```

### Step 2: Load Demo Data
- Click the **"Load Demo"** button in the top-right navigation

### Step 3: Explore the Dashboard
You'll see:
- **"Your Communication Pulse"** header
- **4 coaching opportunities** (email threads):
  1. Q3 Budget Request → VP Finance (Acting with Power)
  2. Thanksgiving Plans → Mom (Touchy Feely)
  3. Partnership Proposal → Investor (Path to Power)
  4. Co-founder Check-in → Jamie (Touchy Feely)
- **3 upcoming high-stakes moments** from calendar

### Step 4: Test Each View

**View 1: Pulse (Dashboard)**
- See all coaching opportunities at a glance
- Each thread shows: contact, stakes level, framework, coaching preview
- Framework badges show which of the 3 frameworks applies

**View 2: Analyze (Thread Deep-Dive)**
- Click any thread to see the full conversation
- Messages show coaching annotations
- Right panel shows:
  - Relationship context
  - Framework analysis  
  - Coaching recommendations
  - Intent vs. impact breakdown

**View 3: Compose (Draft with Coaching)**
- Type or paste a draft message
- Select the recipient to load relationship context
- After ~1.5 seconds, coaching card appears with:
  - What's wrong with your draft
  - Which framework applies
  - Suggested rewrite
  - Severity indicator (red/yellow/green)
- Click "Use This" to apply suggestions

**View 4: Map (Relationship Visualization)**
- See all your key contacts
- Each shows relationship type and power dynamic
- Pinch-crunch status indicator (green/yellow/red)
- Click to see communication history with that person

---

## 🎯 What You're Testing

### The Three Frameworks in Action

**1. Touchy Feely** (Interpersonal Dynamics)
- Detects: over-the-net language, pinch-crunch cycles, missed emotional bids
- Example: Mom's Thanksgiving email has 3 unacknowledged emotional bids
- Coaches: "She's not asking about logistics. She's asking if you care."

**2. Path to Power** (Strategic Influence)
- Detects: power leakage, strategic positioning errors, reciprocity imbalances
- Example: Investor follow-ups show declining assertiveness
- Coaches: "You're negotiating against yourself. Every hedge gives them more leverage."

**3. Acting with Power** (Presence & Status)
- Detects: high/low status language, space-taking, warmth-authority balance
- Example: Budget request opening with "Sorry to follow up again"
- Coaches: "You have the data. Stop apologizing for using it."

---

## 📊 Demo Data Overview

### Email Threads (4 total)

| Thread | To | Stakes | Framework | Issue |
|--------|----|---------|-----------|----|
| Q3 Budget Request | VP Finance | High | Acting with Power | Excessive hedging despite strong data |
| Thanksgiving Plans | Mom | High | Touchy Feely | Missed emotional bids from parent |
| Partnership Proposal | Investor | High | Path to Power | Declining assertiveness in negotiation |
| Co-founder Check-in | Jamie | Medium | Touchy Feely | Pursue-withdraw pattern escalating |

### Calendar Events (3 total)

| Event | Time | Stakes | Coaching Focus |
|-------|------|--------|-----------------|
| 1:1 with Prof. Brady | Tomorrow 2:00 PM | High | Lead with your ask in first 5 minutes |
| Investor Coffee Chat | Tomorrow 4:30 PM | High | Arrive with insight, not just questions |
| Team Standup | Today 10:00 AM | Medium | Don't push Jamie—let silence exist |

---

## 🔍 What to Notice

### Framework Colors
- **Amber** (#E8A87C) = Acting with Power
- **Teal** (#85CDCA) = Path to Power  
- **Purple** (#D4A5FF) = Touchy Feely

### Severity Indicators
- **Red** = Major issue, stop and reconsider
- **Amber** = Notable but optional
- **Green** = Your message is strong, no notes needed

### Navigation Icons
- **◉** Pulse (Dashboard)
- **◈** Analyze (Thread)
- **✦** Compose (Draft Coach)
- **◐** Map (Relationships)

---

## 💡 Testing Tips

1. **Start with "Thanksgiving Plans"**
   - Most emotionally engaging
   - Clearly shows missed emotional bids
   - Best demo of Touchy Feely framework

2. **Then try "Q3 Budget Request"**
   - Clear power leakage through language
   - Good example of Acting with Power coaching
   - Short thread (easy to scan)

3. **Test Compose Coach**
   - Type something hedged intentionally: "Just wanted to check in if you have time"
   - Wait ~1.5 seconds
   - Watch coaching card appear
   - See the suggested rewrite

4. **Check Relationship Map**
   - See all contacts in one view
   - Notice the power dynamics labeled
   - Look for pinch-crunch indicators

---

## ⚙️ Technical Details

**Tech Stack:**
- React 18 + Vite 5.4
- Tailwind CSS v4
- Claude API (configured but needs API key for live use)
- Gmail/Calendar MCP (configured but requires OAuth for live use)

**File Structure:**
```
src/
├── views/          → Dashboard, ThreadAnalyzer, ComposeCoach, RelationshipMap
├── api/            → Claude API client + system prompts
├── utils/          → Constants (frameworks, demo data) + storage helpers
└── index.css       → Tailwind + dark theme variables
```

**Demo Data Location:**
```
src/utils/constants.js
├── FRAMEWORKS      → 3 coaching frameworks with colors/icons
├── DEMO_THREADS    → 4 complete email thread scenarios  
├── DEMO_CALENDAR   → 3 upcoming high-stakes events
└── SEVERITY_COLORS → Color scheme for coaching intensity
```

---

## 🐛 Troubleshooting

**Page shows error?**
- Refresh the page (Cmd+R)
- Check that dev server is running on localhost:5173
- Clear browser cache if needed

**Can't click Load Demo?**
- Try refreshing the page
- Check browser console for JavaScript errors
- Make sure you're on http://localhost:5173/

**Don't see demo data after clicking Load Demo?**
- Wait a second for data to populate
- Check if demoMode is enabled in top-left corner
- Refresh and try again

---

## 📚 Understanding the Code Flow

When you click **"Load Demo"**:

```
User clicks "Load Demo" button
    ↓
App.jsx: loadDemo() function executes
    ↓
setThreads(DEMO_THREADS)    // 4 demo threads
setCalEvents(DEMO_CALENDAR) // 3 demo events
setDemoMode(true)           // Enable demo flag
    ↓
Dashboard renders with demo data
    ↓
Each thread shows in a card with:
  • Contact name
  • Subject line
  • Snippet (one-line coaching)
  • Framework badge
  • Stakes badge (high/medium/low)
    ↓
Click any thread → ThreadAnalyzer loads that thread
    ↓
Full conversation + framework annotations displayed
```

---

## ✨ What This Demonstrates

The Power Coach app demonstrates:

1. **Multi-framework analysis** — Same message analyzed through 3 different lenses
2. **Context awareness** — Coaching changes based on relationship and stakes
3. **Actionable specificity** — Not generic feedback, but specific to YOUR words and relationships
4. **Calibration** — Silent when unnecessary, loud when high-impact
5. **Longitudinal learning** — Tracks patterns over time (in patterns panel)

The demo shows what real coaching would look like when connected to Gmail, Calendar, and Claude API.

---

## 🎓 Learning from the Demo

Each thread teaches a different lesson:

- **Budget Request** → How power leakage happens through language patterns
- **Thanksgiving Plans** → How emotional dynamics hide in logistics
- **Partnership Proposal** → How negotiation power shifts with each hedged word
- **Co-founder Chat** → How relationship patterns repeat and accelerate

---

## 📞 Next Steps

Once you've explored the demo:

1. **Test with real Gmail** (requires API key)
   - Click "Scan Inbox" to fetch real threads
   - See how frameworks apply to actual emails

2. **Set up Claude API** (requires Anthropic key)
   - Real coaching will use Claude to analyze live threads
   - Framework annotations will be generated dynamically

3. **Enable pattern tracking**
   - App will track your patterns over time
   - Build longitudinal insights about your communication

4. **Explore with your own relationships**
   - Customize relationship profiles
   - Get coaching specific to your dynamics

---

**Ready? Open http://localhost:5173/ and click Load Demo!** 🚀
