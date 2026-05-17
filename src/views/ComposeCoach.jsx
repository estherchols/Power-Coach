import { useState, useEffect, useRef, useCallback } from "react";
import { FRAMEWORKS, SEVERITY_COLORS, RELATIONSHIP_TYPES } from "../utils/constants";
import { callClaudeJson } from "../api/claude";
import { PROMPT_COACH_COMPOSE } from "../api/prompts";
import { logCoachingEvent } from "../utils/storage";

export default function ComposeCoach({ threads, demoMode }) {
  const [recipient, setRecipient] = useState("");
  const [recipientType, setRecipientType] = useState("peer");
  const [context, setContext] = useState("");
  const [draft, setDraft] = useState("");
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMonologue, setShowMonologue] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const textareaRef = useRef(null);

  // ─── DEBOUNCED ANALYSIS ─────────────────────────────────────────
  const analyze = useCallback(async (text) => {
    if (text.trim().length < 20) {
      setCoaching(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userMessage = [
        `Recipient: ${recipient || "Unknown"}`,
        `Relationship type: ${recipientType}`,
        context ? `Context: ${context}` : "",
        `\nDraft message:\n${text}`,
      ].filter(Boolean).join("\n");

      const result = await callClaudeJson(
        [{ role: "user", content: userMessage }],
        { system: PROMPT_COACH_COMPOSE }
      );

      setCoaching(result);

      if (result.should_intervene) {
        logCoachingEvent({
          type: "compose_coaching",
          recipient,
          recipientType,
          severity: result.severity,
          framework: result.primary_framework,
          issueCount: result.issues?.length || 0,
        });
      }
    } catch (err) {
      console.error("Coaching analysis failed:", err);
      setError(err.message);
    }

    setLoading(false);
  }, [recipient, recipientType, context]);

  // ─── HANDLE TYPING ──────────────────────────────────────────────
  const handleDraftChange = (e) => {
    const text = e.target.value;
    setDraft(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => analyze(text), 1500);
  };

  // ─── USE SUGGESTION ─────────────────────────────────────────────
  const useSuggestion = () => {
    if (coaching?.rewrite) {
      setDraft(coaching.rewrite);
      setCoaching(null);
    }
  };

  // ─── LOAD FROM THREAD ───────────────────────────────────────────
  const loadFromThread = (thread) => {
    setRecipient(thread.to || thread.from);
    setContext(`Subject: ${thread.subject}\n${thread.snippet || ""}`);
    if (thread.messages?.length > 0) {
      const lastUserMsg = [...thread.messages].reverse().find((m) => m.from === "You");
      if (lastUserMsg) setDraft(lastUserMsg.body);
    }
  };

  const fw = coaching?.primary_framework ? FRAMEWORKS[coaching.primary_framework] : null;
  const severityColor = coaching ? SEVERITY_COLORS[coaching.severity] || "#888" : "#888";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[var(--font-display)] text-5xl font-bold mb-2">Compose + Coach</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          Write your message. The coach watches and intervenes when it matters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: Compose Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Recipient & Context */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
                To
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Name or email"
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-amber)]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
                Relationship
              </label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-amber)]/50"
              >
                {RELATIONSHIP_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
              Context (thread history, what you're responding to)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste the email thread or describe the situation..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-amber)]/50 resize-none"
            />
          </div>

          {/* Quick Load from Threads */}
          {threads.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)]">Quick load:</span>
              {threads.slice(0, 3).map((t, i) => (
                <button
                  key={i}
                  onClick={() => loadFromThread(t)}
                  className="px-2 py-1 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-amber)] hover:border-[var(--color-amber)]/30 transition-colors"
                >
                  {t.subject?.slice(0, 30)}...
                </button>
              ))}
            </div>
          )}

          {/* Draft Textarea */}
          <div className="relative">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
              Your Draft
            </label>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={handleDraftChange}
              placeholder="Start typing your message..."
              rows={10}
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] text-[var(--color-text)] text-sm leading-relaxed focus:outline-none resize-none transition-all duration-300"
              style={{
                border: coaching?.should_intervene
                  ? `2px solid ${severityColor}40`
                  : "2px solid var(--color-border)",
              }}
            />
            {loading && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[var(--color-text-dim)] text-xs">
                <div className="w-3 h-3 border border-[var(--color-amber)]/30 border-t-[var(--color-amber)] rounded-full animate-spin" />
                Analyzing...
              </div>
            )}
            {!loading && coaching && !coaching.should_intervene && draft.length > 20 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[var(--color-green)] text-xs">
                <span>✓</span> Looking strong
              </div>
            )}
          </div>

          {/* COACH CARD */}
          {coaching?.should_intervene && (
            <div
              className="animate-slide-up rounded-xl border overflow-hidden"
              style={{ borderColor: severityColor + "30", backgroundColor: severityColor + "08" }}
            >
              <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${severityColor}20` }}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold" style={{ color: severityColor }}>
                    {coaching.severity === "high" ? "🔴" : coaching.severity === "medium" ? "🟡" : "🟢"} Coach
                  </span>
                  {fw && (
                    <span className="text-xs px-2 py-0.5 rounded-full border" style={{ color: fw.color, borderColor: fw.color + "30", backgroundColor: fw.color + "10" }}>
                      {fw.icon} {fw.label}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMonologue(!showMonologue)}
                  className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)] transition-colors"
                >
                  {showMonologue ? "Hide reasoning" : "Show reasoning"}
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Issues */}
                {coaching.issues?.map((issue, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--color-red)] mt-0.5 flex-shrink-0">•</span>
                      <div>
                        <span className="text-[var(--color-text)]">"{issue.evidence}"</span>
                        <p className="text-[var(--color-text-muted)] mt-1">{issue.explanation}</p>
                        <p className="text-xs mt-0.5" style={{ color: fw?.color || "#888" }}>{issue.framework}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Rewrite */}
                {coaching.rewrite && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-dim)] mb-2">Suggested Rewrite</h4>
                    <div className="p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text)] leading-relaxed">
                      {coaching.rewrite}
                    </div>
                    <p className="text-xs text-[var(--color-text-dim)] mt-2 italic">{coaching.rewrite_reasoning}</p>
                  </div>
                )}

                {/* Tradeoff */}
                {coaching.tradeoff && (
                  <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                    <span className="font-semibold text-[var(--color-text-dim)]">Tradeoff:</span> {coaching.tradeoff}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={useSuggestion}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: severityColor + "20", color: severityColor, border: `1px solid ${severityColor}30` }}
                  >
                    Use This
                  </button>
                  <button
                    onClick={() => setCoaching(null)}
                    className="px-4 py-2 rounded-lg text-sm text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)] border border-[var(--color-border)] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Inner Monologue */}
              {showMonologue && coaching.inner_monologue && (
                <div className="px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] mb-2 flex items-center gap-2">
                    <span className="animate-pulse-soft">●</span> Agent Reasoning
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed italic whitespace-pre-line">
                    {coaching.inner_monologue}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Tips & Patterns */}
        <div className="lg:col-span-2 space-y-5">
          {/* Framework Quick Reference */}
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Quick Reference</h3>
            <div className="space-y-4">
              {Object.entries(FRAMEWORKS).map(([key, fw]) => (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: fw.color }}>{fw.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: fw.color }}>{fw.label}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">{fw.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Power Leaks */}
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Common Power Leaks</h3>
            <div className="space-y-2">
              {[
                { bad: "Just wanted to check in", good: "Following up on X" },
                { bad: "Sorry to bother you", good: "I have a question about X" },
                { bad: "I was kind of thinking maybe", good: "I recommend" },
                { bad: "Does that make sense?", good: "Let me know if you have questions" },
                { bad: "If you get a chance", good: "By [date]" },
                { bad: "I think we could possibly", good: "We should" },
                { bad: "No worries if not!", good: "[Delete]" },
              ].map((pair, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--color-red)]/60 line-through">{pair.bad}</span>
                  <span className="text-[var(--color-text-dim)]">→</span>
                  <span className="text-[var(--color-green)]">{pair.good}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coaching History Count */}
          <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">How It Works</h3>
            <div className="space-y-2 text-xs text-[var(--color-text-dim)]">
              <p>1. Set who you're writing to and the relationship type</p>
              <p>2. Add context (paste the thread you're replying to)</p>
              <p>3. Start typing your draft</p>
              <p>4. The coach analyzes after a 1.5s pause</p>
              <p>5. If coaching is warranted, a card appears with specific feedback</p>
              <p className="text-[var(--color-amber)] pt-1">The coach stays silent when your message is strong.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
