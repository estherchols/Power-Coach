# Power Coach — Agentic Leadership Communication Coach

## One-Liner

An agentic AI that connects to your Gmail, Slack, and Calendar, analyzes your relationship dynamics and communication patterns, and coaches you in real-time using three GSB frameworks — Touchy Feely (relationships), Path to Power (strategy), and Acting with Power (presence) — so you stop knowing the right thing and start doing it.

---

## Core Concept

The agent reads your real professional and personal messages. It maps the power dynamics and relationship patterns in each thread. When you're drafting a message, it detects misalignment between your intent and your language — hedging when you should be direct, steamrolling when you should be vulnerable, deferring when you should be claiming — and coaches you with framework-specific feedback and a rewritten version.

This is NOT a grammar checker. This is a leadership coach that understands WHO you're talking to, WHAT the dynamic is, and HOW to calibrate your communication for the outcome you actually want.

---

## The Three Frameworks (The Analytical Engine)

### Framework 1: Touchy Feely (Interpersonal Dynamics)

**When it applies:** Any relationship — family, friends, colleagues, co-founders. Anywhere emotional dynamics are at play.

**What the agent detects:**

- **Over the net vs on the net.** Over the net = telling someone what THEY think/feel ("You never listen," "You don't care"). On the net = speaking from YOUR experience ("I feel unheard when the topic changes," "I felt dismissed"). The agent flags every over-the-net statement and rewrites it on-the-net.

- **Pinch-crunch cycles.** Small unaddressed irritations (pinches) that accumulate into explosive conflicts (crunches). The agent reads thread history and identifies building pinches: "This is the 4th time you've said 'no worries' when it clearly wasn't fine. You're suppressing pinches. A crunch is coming."

- **Emotional bids.** Attempts to connect that are disguised as logistics or small talk. "Did you see that article?" = "I want to talk to you." The agent spots unrecognized bids and flags them: "This looks like a bid for connection. Turning toward it strengthens the relationship."

- **Intent vs impact gap.** The agent shows both sides: what the other person probably intended vs how it landed on you, and vice versa. "Your intent was to give feedback. The impact was that they felt criticized. The gap is where the conflict lives."

### Framework 2: Path to Power (Jeffrey Pfeffer)

**When it applies:** Work contexts involving hierarchy, influence, career strategy, resource acquisition, negotiations.

**What the agent detects:**

- **Power leakage through language.** Hedging words: "just," "I think maybe," "sorry to bother you," "if you get a chance," "does that make sense?" These are verbal signals of low power. The agent counts them and rewrites without them.

- **Power source analysis.** For each relationship, the agent maps: who has positional power? Expertise power? Informational power? Network power? Resource power? Then it advises which power source YOU should deploy: "You have expertise power here but you're not using it. Lead with your analysis, not with deference."

- **Strategic positioning.** Is this email building your reputation, spending political capital, or leaking it? "Volunteering to take notes in a meeting with senior leadership signals low status. Let someone else take notes."

- **Reciprocity and coalition dynamics.** "You've done 3 favors for this person with no reciprocity. Pfeffer would say you're creating a power imbalance. Time to make an ask."

### Framework 3: Acting with Power (Deborah Gruenfeld)

**When it applies:** Any communication where presence and status matter — emails to senior people, pitches, negotiations, difficult conversations.

**What the agent detects:**

- **High-status vs low-status language.** High-status: direct statements, short sentences, commands, declaratives ("Here's what I see," "I need X by Friday"). Low-status: questions when you mean statements, qualifiers, run-on justifications, apologetic framing.

- **Space-taking vs space-shrinking.** In written communication this manifests as: do you get to the point or bury it under caveats? Do you make one clear ask or hedge with multiple options? Do you lead with your conclusion or build up to it apologetically?

- **Warmth-authority balance.** Gruenfeld's key insight: high status without warmth reads as dominance. High status WITH warmth reads as leadership. The agent checks: "Your rewrite is more direct but you lost all warmth. Add one human line."

- **Consistency between verbal and contextual signals.** Are you signing off with "Best" (neutral) or "Thanks so much!!" (low-status) or "Regards" (high-status)? Do your subject lines claim space or shrink?

---

## Agentic Architecture

### System Overview

```
┌─────────────────────────────────────────────────┐
│                  USER INTERFACE                  │
│         (Web App / Chrome Extension)             │
│                                                  │
│  ┌──────────┐ ┌──────────────┐ ┌─────────────┐  │
│  │ Inbox    │ │ Compose +    │ │ Relationship │  │
│  │ Scanner  │ │ Coach Card   │ │ Dashboard    │  │
│  └──────────┘ └──────────────┘ └─────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              AGENT ORCHESTRATOR                  │
│                                                  │
│  1. Scan → 2. Map → 3. Analyze → 4. Coach       │
│                                                  │
│  Tools:                                          │
│  - scan_inbox(source, filters)                   │
│  - map_relationship(contact, history)             │
│  - analyze_power_dynamics(thread)                │
│  - analyze_touchy_feely(thread)                  │
│  - analyze_acting_with_power(draft)              │
│  - generate_coaching(analysis, framework)        │
│  - rewrite_message(draft, coaching, voice)       │
│  - log_pattern(user, pattern_type, evidence)     │
│  - get_user_patterns(user, timeframe)            │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              DATA INTEGRATIONS                   │
│                                                  │
│  Gmail API ──── Thread history, drafts, contacts │
│  Calendar ───── Upcoming meetings, attendees     │
│  Slack ──────── Channel/DM conversations         │
│  Journal ────── User reflections, commitments    │
└─────────────────────────────────────────────────┘
```

### The Agent Loop

The agent runs four modes autonomously:

**Mode 1 — SCAN (Proactive)**

The agent periodically scans connected sources and surfaces high-stakes moments:

```
scan_inbox(gmail, last_24h) →
scan_calendar(next_48h) →

Agent reasoning:
"Found 3 threads worth coaching on:
 1. Email from investor — she's hedging heavily, 
    4 minimizers in her draft reply
 2. Slack DM with co-founder — pinch-crunch cycle 
    building, 3rd suppressed pinch this month
 3. Calendar: 1:1 with advisor tomorrow, last 
    interaction had unresolved tension

Priority: the investor email has an unsent draft. 
She's actively composing. Coach now."
```

**Mode 2 — ANALYZE (On Trigger)**

When the user opens a thread or starts composing, the agent runs the full analysis:

```
Step 1: map_relationship(recipient)
  → Who is this person? What's the power dynamic?
  → History: how does the user typically communicate 
     with them? Any patterns?

Step 2: analyze thread through all three frameworks:
  → Touchy Feely: any over-the-net language? 
     suppressed pinches? missed bids?
  → Path to Power: power leakage? strategic 
     positioning errors? missed leverage?
  → Acting with Power: high-status or low-status 
     language? space-taking or shrinking?

Step 3: determine which framework is PRIMARY 
  for this specific situation
  → Family/close relationship → lead with Touchy Feely
  → Career/hierarchy → lead with Path to Power
  → Any high-stakes draft → layer in Acting with Power
```

**Mode 3 — COACH (Real-Time)**

When the user is composing, the agent delivers coaching:

```
Input: user's draft + relationship context + thread history

Output:
{
  "trigger": true,
  "severity": "high",  // high = definitely intervene, 
                        // medium = subtle suggestion, 
                        // low = stay silent
  "primary_framework": "acting_with_power",
  "issues": [
    {
      "type": "power_leakage",
      "evidence": "3 hedging phrases: 'just wanted to', 
                   'if you have time', 'no pressure'",
      "framework": "Acting with Power / Gruenfeld",
      "explanation": "You're writing to an investor who 
        already took the meeting. Deference here signals 
        you don't believe in your own ask."
    }
  ],
  "rewrite": "...",
  "rewrite_reasoning": "Removed 3 hedging phrases. 
    Led with the insight, not the apology. Added 
    specific ask with timeline. Maintained warmth 
    with the closing line.",
  "tradeoff": "This version is more direct. It risks 
    feeling 'pushy' to you but will read as 
    'confident' to them."
}
```

**Mode 4 — REFLECT (Post-Hoc)**

After a thread resolves, the agent logs patterns:

```
log_pattern(
  user: "esther",
  pattern: "hedges_with_authority_figures",
  evidence: "12/15 emails to senior contacts contain 
    3+ minimizers. 3/15 emails to peers do.",
  trend: "improving — hedging rate dropped from 
    93% to 80% over 3 weeks"
)
```

---

## User Interface Spec

### Screen 1: Dashboard (Home)

The landing screen shows:

**"Your Communication Pulse"**
- Active threads with coaching opportunities (sorted by stakes)
- Relationship map: key contacts with power dynamic labels
- Pattern tracker: your top 3 recurring issues with trend arrows
- Upcoming high-stakes moments from calendar

### Screen 2: Thread Analyzer

User selects or forwards a thread. The screen shows:

**Left panel: The Thread**
- Full conversation history
- Each message annotated with framework insights (subtle highlights)
- Over-the-net statements highlighted in one color
- Power leakage highlighted in another
- Emotional bids highlighted in a third

**Right panel: The Coach**
- Relationship context card (who they are, power dynamic, history)
- Framework analysis (which framework applies and why)
- Pattern context ("You've hedged in 4/5 recent emails to this person")
- If there's a draft: the coaching card with rewrite

### Screen 3: Compose + Coach

Split-screen compose experience:

**Top: Your Draft**
- Text area where you write or paste your message
- Real-time annotation as you type (underlines on hedging phrases, etc.)

**Bottom: Coach Card**
- Appears after ~1 second pause in typing
- Shows: what you're doing, why it matters, framework reference
- Suggested rewrite with "Use This" button
- Severity indicator (is this a minor polish or a major reframe?)
- "Why?" expandable section explaining the framework logic

### Screen 4: Relationship Map

Visual map of your key relationships:

- Each contact as a node
- Edges labeled with the dominant dynamic (e.g., "you defer," "pursue-withdraw loop," "healthy reciprocity")
- Click a contact to see: communication history analysis, patterns, coaching history
- Pinch-crunch status indicator (green/yellow/red)

### Screen 5: Weekly Mirror

Weekly reflection dashboard:

- Messages coached this week
- Pattern trends (improving / static / regressing)
- Cross-domain insight: "You defer to authority at work AND at home — same pattern, different context"
- One question for next week

---

## Technical Build Plan (Claude Code)

### Tech Stack

- **Frontend:** React (single-page app) with Tailwind CSS
- **AI Engine:** Claude API (claude-sonnet-4-20250514) with tool use
- **Data Integration:** Gmail MCP, Google Calendar MCP, Slack MCP
- **Storage:** Browser persistent storage (for hackathon) or simple JSON backend
- **Deployment:** Local dev server for demo

### Build Sequence

#### Phase 1: Core Engine (Hours 1-3)

**Task 1.1: Project scaffold**
```
- React app with routing (Dashboard, Thread Analyzer, Compose, Relationships)
- Tailwind setup
- Claude API client utility
```

**Task 1.2: Framework analysis prompts**
Build three system prompts, one per framework:

```
Prompt A: Touchy Feely Analyzer
Input: message thread + relationship context
Output: structured JSON with over-the-net flags, 
  pinch-crunch status, bid detection, 
  intent-impact analysis

Prompt B: Path to Power Analyzer  
Input: message thread + power map
Output: structured JSON with power leakage count, 
  power source analysis, strategic assessment

Prompt C: Acting with Power Analyzer
Input: draft message + recipient context
Output: structured JSON with status signals, 
  space-taking score, warmth-authority balance, 
  specific word-level flags
```

**Task 1.3: Orchestrator prompt**
The meta-prompt that decides WHICH framework to lead with and WHETHER to intervene:

```
Input: all three framework analyses + 
  relationship context + user patterns
Output: {
  should_intervene: boolean,
  severity: high/medium/low,
  primary_framework: string,
  coaching_message: string,
  rewrite: string,
  reasoning: string
}
```

#### Phase 2: Data Integration (Hours 3-5)

**Task 2.1: Gmail integration**
```
- Connect Gmail MCP
- Fetch recent threads (last 7 days)
- Extract: sender, recipient, subject, body, 
  thread history, timestamp
- Build contact list from email history
```

**Task 2.2: Calendar integration**
```
- Connect Google Calendar MCP
- Fetch upcoming events (next 48 hours)
- Extract: attendees, meeting title, 
  related email threads
- Flag high-stakes meetings (1:1s with senior 
  people, investor calls, reviews)
```

**Task 2.3: Relationship profiler**
```
- For each frequent contact, auto-generate:
  - Name, role, inferred seniority
  - Communication frequency
  - Power dynamic assessment (based on 
    language patterns in thread history)
  - Relationship type: family / peer / 
    senior / junior / external
- Store in persistent storage
- Allow user to edit/confirm profiles
```

#### Phase 3: User Interface (Hours 5-7)

**Task 3.1: Dashboard**
```
- "Communication Pulse" view
- List of threads with coaching opportunities
- Each thread card shows: contact name, 
  severity badge, primary framework tag, 
  one-line coaching preview
- Pattern tracker: top 3 issues with 
  sparkline trends
```

**Task 3.2: Thread Analyzer view**
```
- Left: threaded conversation with inline 
  annotations (colored underlines for each 
  framework's flags)
- Right: coach panel with full analysis
- Framework tabs: switch between TF / PtP / AwP 
  views of the same thread
- "Both Sides of the Net" toggle: shows 
  probable intent vs impact split view
```

**Task 3.3: Compose + Coach view**
```
- Textarea with recipient selector
- Auto-loads relationship context
- Debounced analysis on typing pause (1.5s)
- Coaching card slides up from bottom:
  - Issue summary (1-2 sentences)
  - Framework citation
  - Original vs suggested side-by-side
  - [Use Suggestion] [Dismiss] buttons
- Severity-based styling: 
  red border = major reframe needed
  yellow = notable but optional
  green = your message is strong, no notes
```

**Task 3.4: Relationship Map**
```
- Contact cards in a grid or network visualization
- Each card: name, role, dynamic label, 
  pinch-crunch status dot (green/yellow/red)
- Click to expand: communication history, 
  pattern summary, last 3 coaching interventions
```

#### Phase 4: Agentic Loop (Hours 7-8)

**Task 4.1: Proactive scanner**
```
- On app load: scan Gmail + Calendar
- Triage threads by coaching opportunity
- Auto-generate morning briefing:
  "You have 2 high-stakes moments today. 
   Here's what I'd focus on."
```

**Task 4.2: Pattern engine**
```
- After each coaching interaction, log:
  - Framework triggered
  - Issue type
  - Severity
  - Whether user accepted the rewrite
- Aggregate into user patterns:
  "Hedging with authority: 80% of emails"
  "Over the net with family: 60% of messages"
- Surface patterns in dashboard and 
  in coaching context
```

**Task 4.3: Inner monologue panel (demo feature)**
```
- Toggleable side panel showing the agent's 
  reasoning chain
- Shows: what it scanned, what it detected, 
  why it chose this framework, what it 
  considered but decided not to flag
- This is your demo killer: judges see 
  the agent THINKING
```

---

## Demo Script (3 Minutes)

### Minute 1: "Meet Your Coach"
- Open the app. Dashboard shows: "I scanned your inbox. You have 3 threads worth looking at."
- Show the prioritized list. Agent explains WHY each thread matters.
- Click into an email thread with an investor.

### Minute 2: "The Coach in Action"
- Thread Analyzer shows the full conversation with inline annotations.
- Agent highlights: "You hedged 4 times in your last reply. Here's the pattern across your last 5 investor emails."
- Switch to Compose view. Type a hedging reply on purpose.
- Coach card pops up: "You're deferring when you have leverage. Path to Power says lead with your insight. Acting with Power says cut the qualifiers. Here's a version that sounds like you at your most confident."
- Show the inner monologue panel: agent reasoning visible to judges.

### Minute 3: "The Pattern & The Question"
- Show Relationship Map: "Here's how you communicate across your key relationships."
- Show one cross-domain insight: "You defer to authority figures at work AND you defer to your parents at home. Same pattern. Different context."
- End on the weekly mirror: one question the agent asks based on your patterns.

---

## Prompt Engineering Notes

### The Voice

The agent should sound like:
- A brilliant friend who happens to have a PhD in organizational behavior
- Warm but not soft. Direct but not cold.
- Specific, never generic. Every piece of coaching references YOUR words, YOUR patterns, YOUR relationships.
- No corporate jargon. No "let's unpack that." No "I hear you."
- Concise. One insight per intervention. Not a lecture.

### Trigger Calibration

The agent should STAY SILENT when:
- The email is low-stakes (logistics, scheduling, casual)
- The communication is already well-calibrated
- The user is writing to a close peer where informality is appropriate

The agent should INTERVENE when:
- Power leakage to someone with higher positional power
- Over-the-net language in a relationship with active tension
- A pattern repeating that the user has been coached on before
- High-stakes context (investor, board, performance review, family conflict)

### Severity Calibration

- **High (red):** You're about to damage a relationship or undercut yourself significantly. Stop and reconsider.
- **Medium (yellow):** There's a better way to say this. Worth considering but not critical.
- **Low (green):** Minor polish. Your message is solid.

---

## Answering the Hard VC Questions

**"Why not just paste into Claude?"**
Because context is everything. The agent knows WHO you're writing to, your HISTORY with them, your PATTERNS over time, and which FRAMEWORK applies. Pasting into Claude gives you generic coaching. This gives you coaching calibrated to your specific relationship and your specific growth edges.

**"How do you get trigger accuracy right?"**
Severity thresholds tuned by relationship type and stakes. The agent errs toward silence. It only speaks when confidence is high. And it learns from dismissals — if you ignore a type of coaching 3 times, it stops giving it.

**"What's the retention mechanism?"**
The longitudinal pattern tracking. The more you use it, the more it knows about you, the sharper the coaching gets. Week 1 is good. Week 8 is irreplaceable. Your patterns, your relationships, your growth trajectory — all accumulated data that makes switching costly.

**"Why won't Anthropic ship this?"**
Because the value isn't in the AI. It's in the operationalized frameworks. Pfeffer + Gruenfeld + T-group as a unified analytical lens, calibrated to individual relationship dynamics, with a coaching voice tuned for actionability — that's domain expertise, not a feature flag.
