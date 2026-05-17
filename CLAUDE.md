# Power Coach — "The Net"

## What This Is

An agentic AI leadership communication coach that connects to Gmail, Calendar, and Slack, analyzes relationship dynamics in real conversations, and coaches users in real-time using three Stanford GSB frameworks.

## Tech Stack

- React 18 + Vite
- Tailwind CSS v4
- Claude API (claude-sonnet-4-20250514) for all AI analysis
- Gmail MCP: `https://gmailmcp.googleapis.com/mcp/v1`
- Google Calendar MCP: `https://calendarmcp.googleapis.com/mcp/v1`
- No backend — all API calls from the client, persistent state in localStorage

## Architecture

```
src/
├── main.jsx                # Entry point
├── App.jsx                 # Root component, routing, global state
├── api/
│   ├── claude.js           # Claude API client (callClaude, extractText, extractMcpResults)
│   └── prompts.js          # All system prompts for the three frameworks
├── views/
│   ├── Dashboard.jsx       # Inbox scan, calendar scan, pattern summary
│   ├── ThreadAnalyzer.jsx  # Deep-dive into a single thread with framework annotations
│   ├── ComposeCoach.jsx    # Real-time coaching while composing a message
│   └── RelationshipMap.jsx # Contact cards with power dynamics and patterns
├── components/
│   ├── Nav.jsx             # Top navigation
│   ├── CoachCard.jsx       # The coaching popup (rewrite + reasoning)
│   ├── InnerMonologue.jsx  # Agent reasoning panel (toggleable)
│   ├── FrameworkBadge.jsx  # Colored badge for each framework
│   ├── ScoreRing.jsx       # SVG circular score indicator
│   ├── BothSidesView.jsx   # Split view: your side vs their side of the net
│   └── Loader.jsx          # Loading states
├── hooks/
│   ├── useGmail.js         # Gmail MCP integration (search threads, get thread)
│   ├── useCalendar.js      # Calendar MCP integration (list events)
│   ├── useCoach.js         # Orchestrator: debounced analysis, framework selection
│   └── usePatterns.js      # Longitudinal pattern tracking in localStorage
└── utils/
    ├── storage.js          # localStorage helpers for patterns + relationships
    └── constants.js        # Framework definitions, colors, severity thresholds
```

## The Three Frameworks (Critical Domain Knowledge)

### Framework 1: Touchy Feely (Interpersonal Dynamics)
- **Over the net vs on the net**: "You never listen" (over) → "I feel unheard when the topic changes" (on the net). Flag every over-the-net statement.
- **Pinch-crunch cycles**: Small unaddressed irritations (pinches) accumulate into explosive conflicts (crunches). Detect building pinches in thread history.
- **Emotional bids**: Attempts to connect disguised as logistics. "Did you see that article?" = "I want to talk to you." Detect and flag missed bids.
- **Intent vs impact gap**: Show what the sender probably intended vs how it likely landed.

### Framework 2: Path to Power (Jeffrey Pfeffer)
- **Power leakage**: Hedging words: "just," "I think maybe," "sorry to bother you," "if you get a chance," "does that make sense?" Count and flag.
- **Power source analysis**: Map positional, expertise, informational, network, resource power for each party.
- **Strategic positioning**: Is this email building reputation, spending political capital, or leaking it?

### Framework 3: Acting with Power (Deborah Gruenfeld)
- **High-status vs low-status language**: Direct statements vs hedged questions. Short sentences vs run-on justifications.
- **Space-taking vs space-shrinking**: Leading with conclusion vs burying it under caveats.
- **Warmth-authority balance**: High status without warmth = dominance. High status WITH warmth = leadership.

## Claude API Integration

All AI calls go through the Anthropic API from the client. No API key needed in code — it's handled by the environment.

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: "...",
    messages: [{ role: "user", content: "..." }],
    mcp_servers: [
      { type: "url", url: "https://gmailmcp.googleapis.com/mcp/v1", name: "gmail" },
      { type: "url", url: "https://calendarmcp.googleapis.com/mcp/v1", name: "gcal" }
    ]
  })
});
```

MCP responses contain mixed content blocks. Always extract by type:
```javascript
const toolResults = data.content.filter(b => b.type === "mcp_tool_result");
const textBlocks = data.content.filter(b => b.type === "text");
```

## Key User Flows

### Flow 1: Dashboard Scan
1. User opens app → auto-scan Gmail (last 7 days) + Calendar (next 48 hours)
2. Agent triages threads by stakes (high/medium/low) and assigns primary framework
3. Dashboard shows prioritized list of coaching opportunities
4. User clicks a thread → goes to Thread Analyzer

### Flow 2: Thread Analysis
1. Agent fetches full thread via Gmail MCP
2. Runs all three framework analyses in parallel
3. Displays thread with inline annotations (color-coded by framework)
4. Right panel shows: relationship context, framework scores, detailed coaching, "Both Sides of the Net" view
5. If there's a draft reply, transitions to Compose Coach

### Flow 3: Real-Time Compose Coaching
1. User types or pastes a draft message
2. Sets recipient context (who they're writing to, relationship type)
3. After 1.5s pause in typing, agent analyzes the draft
4. Coach Card appears with: issues found, framework citations, suggested rewrite, inner monologue
5. "Use This" button replaces draft with suggested version
6. Severity-based styling: red border (major), amber (notable), green (strong message)

### Flow 4: Relationship Map
1. Agent builds contact profiles from email history
2. Shows cards for each frequent contact with: name, role, power dynamic, communication patterns
3. Pinch-crunch status indicator (green/yellow/red)
4. Click to expand: thread history with that person, pattern summary, coaching history

## Agent Orchestration Logic

The agent decides WHICH framework to lead with based on:
- Family/close relationship → lead with Touchy Feely
- Career/hierarchy/external → lead with Path to Power
- Any high-stakes draft → layer in Acting with Power
- Always check all three, but headline the most relevant one

The agent decides WHETHER to intervene based on:
- HIGH: power leakage to senior people, over-the-net language in tense threads, repeated patterns
- MEDIUM: suboptimal but not harmful phrasing
- LOW/NONE: casual messages, well-calibrated communication, low-stakes threads
- Default to SILENCE. Only speak when confident the coaching adds value.

## Design Direction

Aesthetic: editorial luxury. Think high-end consulting firm meets private journal.
- Dark theme (#0a0a0c background)
- Warm amber (#E8A87C) as primary accent
- Teal (#85CDCA) for Path to Power elements
- Soft purple (#D4A5FF) for Acting with Power elements
- Typography: serif display font (Instrument Serif or Playfair Display) for headings, clean sans (DM Sans or Satoshi) for body
- Generous whitespace, subtle borders, no heavy shadows
- Animations: fade-in on load, smooth transitions on view change, subtle pulse on coaching card appearance

## Demo Data Fallback

If Gmail/Calendar MCP fails (auth issues, demo environment), the app should have a "Load Demo Data" button that populates with realistic sample threads:

1. An email thread with an investor where the user is hedging heavily
2. A Slack-style thread with a co-founder showing a pursue-withdraw pattern
3. A family email thread with passive-aggressive dynamics
4. A calendar event for a 1:1 with a senior advisor

This ensures the demo ALWAYS works regardless of API connectivity.

## Patterns to Track in localStorage

```javascript
{
  patterns: [
    {
      type: "hedging_with_authority",
      count: 12,
      total_opportunities: 15,
      trend: "improving", // or "static" or "regressing"
      last_seen: "2026-05-17",
      examples: ["just wanted to check in", "if you get a chance"]
    }
  ],
  relationships: {
    "contact_email": {
      name: "...",
      type: "senior | peer | junior | family",
      dynamic: "description of power dynamic",
      pinch_crunch_status: "green | yellow | red",
      coaching_history: [...]
    }
  },
  sessions: [
    { date: "...", threads_coached: 3, rewrites_accepted: 2, primary_issues: [...] }
  ]
}
```

## Important Implementation Notes

- All AI responses must be parsed as JSON. Prompts explicitly request no markdown fences. Always try-catch JSON.parse and strip any accidental fences.
- Debounce compose coaching at 1500ms after typing stops.
- The Inner Monologue panel is a key demo feature — show the agent's reasoning chain. Always request and display it.
- The "Both Sides of the Net" view is the emotional centerpiece. Make it visually striking.
- Framework scores (1-10) should render as circular SVG gauges.
- Thread annotations should use colored underlines, not highlights (subtler, more editorial).
- Never coach on every message. The calibration between helpfulness and annoyance is critical. When in doubt, stay silent.
