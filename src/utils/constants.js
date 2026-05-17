export const FRAMEWORKS = {
  touchy_feely: {
    label: "Touchy Feely",
    color: "#E8A87C",
    icon: "◐",
    description: "Interpersonal dynamics — how you connect, communicate, and navigate emotions in relationships",
  },
  path_to_power: {
    label: "Path to Power",
    color: "#85CDCA",
    icon: "◆",
    description: "Strategic influence — how you build, deploy, and protect your power in professional contexts",
  },
  acting_with_power: {
    label: "Acting with Power",
    color: "#D4A5FF",
    icon: "▲",
    description: "Presence and status — how your language signals authority, warmth, and leadership",
  },
};

export const SEVERITY_COLORS = {
  high: "#FF6B6B",
  medium: "#E8A87C",
  low: "#85CDCA",
  none: "#55555f",
};

export const RELATIONSHIP_TYPES = [
  "senior",
  "peer",
  "junior",
  "family",
  "investor",
  "co-founder",
  "external",
];

// ─── DEMO DATA ────────────────────────────────────────────────────
// Used when Gmail/Calendar MCP is unavailable (demo mode)

export const DEMO_THREADS = [
  {
    id: "demo-1",
    subject: "Re: Q3 Budget Request",
    from: "You",
    to: "Sarah Chen (VP Finance)",
    snippet: "You've been deferring in this thread for 3 rounds. Your last reply opened with 'Sorry to follow up again' and closed with 'No pressure at all.'",
    stakes: "high",
    primary_framework: "acting_with_power",
    one_line_coaching: "You have the data. Stop apologizing for using it.",
    last_date: "2 hours ago",
    messages: [
      {
        from: "You",
        date: "May 14",
        body: "Hi Sarah, I hope you're doing well! I just wanted to check in on the Q3 budget request I sent over last week. I know you're super busy so no rush at all, but if you get a chance to take a look that would be amazing. Totally understand if the timing isn't right. Thanks so much!",
      },
      {
        from: "Sarah Chen",
        date: "May 15",
        body: "Thanks for the reminder. I'll try to get to it. Can you resend the ROI projections? I think the numbers need more context before I can approve.",
      },
      {
        from: "You",
        date: "May 16",
        body: "Of course! Sorry about that. I've attached the updated ROI analysis — I hope it makes more sense now. I think the numbers are pretty solid but you'd know better than me. Just let me know if you need anything else. Sorry to follow up again and no pressure at all!",
      },
    ],
  },
  {
    id: "demo-2",
    subject: "Re: Thanksgiving Plans",
    from: "Mom",
    to: "You",
    snippet: "Your mom made 3 emotional bids in this thread that went unacknowledged. A pinch-crunch cycle is building.",
    stakes: "high",
    primary_framework: "touchy_feely",
    one_line_coaching: "She's not asking about logistics. She's asking if you care.",
    last_date: "Yesterday",
    messages: [
      {
        from: "Mom",
        date: "May 10",
        body: "Hi sweetie, I saw your friend Ploy's mom posted about her daughter visiting home for Songkran. It looked so lovely. Have you thought about when you might visit? Your dad and I were just talking about how quiet the house is.",
      },
      {
        from: "You",
        date: "May 12",
        body: "Hey Mom! I'm super busy with school right now. Will try to figure out dates soon.",
      },
      {
        from: "Mom",
        date: "May 14",
        body: "OK. I understand. I just thought it would be nice. Your aunt was asking about you the other day too. She said she hadn't heard from you in a while. Anyway, I made your favorite tom kha recipe last weekend. It wasn't the same without you here.",
      },
      {
        from: "You",
        date: "May 15",
        body: "Sounds good Mom. I'll let you know about dates. Super swamped right now.",
      },
      {
        from: "Mom",
        date: "May 16",
        body: "Must be nice to be so busy. Well, whenever you have time for us, we'll be here.",
      },
    ],
  },
  {
    id: "demo-3",
    subject: "Re: Partnership Proposal — Follow Up",
    from: "You",
    to: "David Park (Managing Partner, Horizon Ventures)",
    snippet: "You've sent 3 follow-up emails with declining assertiveness. Each one has more hedging than the last.",
    stakes: "high",
    primary_framework: "path_to_power",
    one_line_coaching: "You're negotiating against yourself. Every hedge gives them more leverage.",
    last_date: "3 days ago",
    messages: [
      {
        from: "You",
        date: "May 8",
        body: "Hi David, Great meeting you at the Stanford VC Summit. I'd love to explore a summer role at Horizon. My background in building a $30M CVC arm from scratch at Thai Union and executing 30+ cross-border M&A transactions gives me a differentiated lens on deal evaluation. I've attached my materials. Would you have 20 minutes this week?",
      },
      {
        from: "David Park",
        date: "May 10",
        body: "Thanks. Interesting background. We're pretty full for summer but let me think about it.",
      },
      {
        from: "You",
        date: "May 12",
        body: "Hi David, thanks so much for considering it! I totally understand you're full. I'm flexible on timing and structure — even a short project or part-time arrangement would be great. I just think there could be an interesting fit. But no worries if it doesn't work out! Just thought I'd mention it in case.",
      },
      {
        from: "David Park",
        date: "May 13",
        body: "Let me discuss with the team.",
      },
      {
        from: "You",
        date: "May 14",
        body: "Sounds great, thank you! Sorry to keep following up — I know everyone's busy. Just wanted to say I'm really excited about Horizon's approach and would love to contribute however I can. Happy to chat whenever works for you. No rush at all!",
      },
    ],
  },
  {
    id: "demo-4",
    subject: "Re: Co-founder Check-in",
    from: "You",
    to: "Jamie Liu (Co-founder)",
    snippet: "A pursue-withdraw pattern is active. You push for engagement, she retreats. The pattern is accelerating.",
    stakes: "medium",
    primary_framework: "touchy_feely",
    one_line_coaching: "Stop pursuing. Name the pattern out loud.",
    last_date: "4 days ago",
    messages: [
      {
        from: "You",
        date: "May 10",
        body: "Hey Jamie — can we sync on the product roadmap? I feel like we haven't been aligned lately and I want to make sure we're on the same page. When are you free this week?",
      },
      {
        from: "Jamie Liu",
        date: "May 11",
        body: "Sure, I'll check my calendar.",
      },
      {
        from: "You",
        date: "May 12",
        body: "Any update on timing? I really think we should talk soon. There are a few decisions I don't want to make unilaterally. Also, I noticed you didn't respond to my Slack messages about the pricing model. Everything OK?",
      },
      {
        from: "Jamie Liu",
        date: "May 13",
        body: "Yeah, been heads down. Let's just do async on the pricing thing.",
      },
      {
        from: "You",
        date: "May 13",
        body: "I'd really prefer to talk live. There's nuance here that's hard to capture in text. Can we do 30 minutes tomorrow? Or even 15? I just feel like we keep missing each other and I don't want this to become a bigger thing.",
      },
    ],
  },
];

export const DEMO_CALENDAR = [
  {
    title: "1:1 with Prof. Brady — Research Check-in",
    start: "Tomorrow, 2:00 PM",
    attendees: ["Prof. Scott Brady"],
    stakes: "high",
    coaching_note: "Last session you left without stating what you needed. Path to Power: lead with your ask in the first 5 minutes.",
  },
  {
    title: "Investor Coffee Chat — Horizon Ventures",
    start: "Tomorrow, 4:30 PM",
    attendees: ["David Park (Horizon Ventures)"],
    stakes: "high",
    coaching_note: "You've been deferring in email. Acting with Power: arrive with a specific insight to share, not just questions to ask.",
  },
  {
    title: "Team Standup",
    start: "Today, 10:00 AM",
    attendees: ["Jamie Liu", "Alex Kim", "Priya Shah"],
    stakes: "medium",
    coaching_note: "The pursue-withdraw dynamic with Jamie is active. Touchy Feely: don't push. Ask one question and let silence exist.",
  },
];
