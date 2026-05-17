import { useState, useCallback } from "react";
import Dashboard from "./views/Dashboard";
import ThreadAnalyzer from "./views/ThreadAnalyzer";
import ComposeCoach from "./views/ComposeCoach";
import RelationshipMap from "./views/RelationshipMap";
import { DEMO_THREADS, DEMO_CALENDAR } from "./utils/constants";
import { callClaude, extractText, extractMcpResults, parseJsonResponse } from "./api/claude";
import { PROMPT_SCAN_INBOX, PROMPT_SCAN_CALENDAR } from "./api/prompts";
import { MCP_SERVERS } from "./api/claude";

const VIEWS = {
  dashboard: "dashboard",
  analyze: "analyze",
  compose: "compose",
  relationships: "relationships",
};

export default function App() {
  const [view, setView] = useState(VIEWS.dashboard);
  const [threads, setThreads] = useState([]);
  const [calEvents, setCalEvents] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // ─── SCAN INBOX (LIVE) ─────────────────────────────────────────
  const scanInbox = useCallback(async () => {
    setScanning(true);
    try {
      const data = await callClaude(
        [{ role: "user", content: "Search my recent emails from the last 7 days and find high-stakes communication threads." }],
        { system: PROMPT_SCAN_INBOX, mcpServers: [MCP_SERVERS.gmail], maxTokens: 4096 }
      );
      const text = extractText(data);
      if (text) {
        const parsed = parseJsonResponse(text);
        if (Array.isArray(parsed)) setThreads(parsed);
      }
    } catch (err) {
      console.error("Gmail scan failed:", err);
      alert("Gmail connection failed. Try loading demo data instead.");
    }
    setScanning(false);
  }, []);

  // ─── SCAN CALENDAR (LIVE) ──────────────────────────────────────
  const scanCalendar = useCallback(async () => {
    try {
      const data = await callClaude(
        [{ role: "user", content: "Find my upcoming events in the next 48 hours that involve high-stakes communication." }],
        { system: PROMPT_SCAN_CALENDAR, mcpServers: [MCP_SERVERS.calendar], maxTokens: 2048 }
      );
      const text = extractText(data);
      if (text) {
        const parsed = parseJsonResponse(text);
        if (Array.isArray(parsed)) setCalEvents(parsed);
      }
    } catch (err) {
      console.error("Calendar scan failed:", err);
    }
  }, []);

  // ─── LOAD DEMO DATA ────────────────────────────────────────────
  const loadDemo = useCallback(() => {
    setThreads(DEMO_THREADS);
    setCalEvents(DEMO_CALENDAR);
    setDemoMode(true);
  }, []);

  // ─── SCAN ALL ──────────────────────────────────────────────────
  const scanAll = useCallback(async () => {
    setScanning(true);
    await Promise.all([scanInbox(), scanCalendar()]);
    setScanning(false);
  }, [scanInbox, scanCalendar]);

  // ─── SELECT THREAD → ANALYZE ──────────────────────────────────
  const handleSelectThread = useCallback((thread) => {
    setSelectedThread(thread);
    setView(VIEWS.analyze);
  }, []);

  // ─── NAV ───────────────────────────────────────────────────────
  const tabs = [
    { id: VIEWS.dashboard, label: "Pulse", icon: "◉" },
    { id: VIEWS.analyze, label: "Analyze", icon: "◈" },
    { id: VIEWS.compose, label: "Compose", icon: "✦" },
    { id: VIEWS.relationships, label: "Map", icon: "◐" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[var(--font-body)]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-[var(--color-amber)] text-xl">▲</span>
            <span className="font-[var(--font-display)] text-xl tracking-tight">The Net</span>
          </div>
          <div className="flex items-center gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  view === t.id
                    ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                }`}
              >
                <span className="text-xs">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadDemo}
              className="px-3 py-1.5 text-xs rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-light)] transition-all"
            >
              Load Demo
            </button>
            <button
              onClick={scanAll}
              disabled={scanning}
              className="px-3 py-1.5 text-xs rounded-md bg-[var(--color-amber)]/10 text-[var(--color-amber)] border border-[var(--color-amber)]/20 hover:bg-[var(--color-amber)]/20 transition-all disabled:opacity-50"
            >
              {scanning ? "Scanning..." : "Scan Inbox"}
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-20 pb-12 max-w-6xl mx-auto px-6">
        {view === VIEWS.dashboard && (
          <Dashboard
            threads={threads}
            calEvents={calEvents}
            loading={scanning}
            onSelectThread={handleSelectThread}
            demoMode={demoMode}
          />
        )}
        {view === VIEWS.analyze && (
          <ThreadAnalyzer
            thread={selectedThread}
            demoMode={demoMode}
            onBack={() => setView(VIEWS.dashboard)}
          />
        )}
        {view === VIEWS.compose && (
          <ComposeCoach
            threads={threads}
            demoMode={demoMode}
          />
        )}
        {view === VIEWS.relationships && (
          <RelationshipMap
            threads={threads}
            demoMode={demoMode}
          />
        )}
      </main>
    </div>
  );
}
