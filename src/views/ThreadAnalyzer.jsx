import { useState, useEffect } from "react";
import { FRAMEWORKS, SEVERITY_COLORS } from "../utils/constants";
import { callClaudeJson } from "../api/claude";
import { PROMPT_ANALYZE_THREAD } from "../api/prompts";
import { logCoachingEvent } from "../utils/storage";

function ScoreRing({ score, label, color }) {
  const pct = (score / 10) * 100;
  const dashArray = `${pct * 1.76} 176`;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="56" height="56" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-border)" strokeWidth="3.5" />
        <circle
          cx="32" cy="32" r="28"
          fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={dashArray}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x="32" y="36" textAnchor="middle" fill={color} fontSize="16" fontWeight="700" fontFamily="'Playfair Display', Georgia, serif">
          {score}
        </text>
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</span>
    </div>
  );
}

export default function ThreadAnalyzer({ thread, demoMode, onBack }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("coaching");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!thread) return;
    analyzeThread();
  }, [thread]);

  async function analyzeThread() {
    setLoading(true);
    setError(null);
    try {
      // Build the thread content for analysis
      const threadContent = thread.messages
        ? thread.messages.map((m, i) => `[Message ${i + 1}] From: ${m.from} | Date: ${m.date}\n${m.body}`).join("\n\n---\n\n")
        : `Subject: ${thread.subject}\nFrom: ${thread.from}\nTo: ${thread.to}\n\n${thread.snippet}`;

      const result = await callClaudeJson(
        [{ role: "user", content: `Analyze this email thread:\n\nSubject: ${thread.subject}\n\n${threadContent}` }],
        { system: PROMPT_ANALYZE_THREAD }
      );

      setAnalysis(result);
      logCoachingEvent({
        threadId: thread.id,
        subject: thread.subject,
        framework: result.primary_framework,
        scores: {
          touchy_feely: result.touchy_feely?.score,
          path_to_power: result.path_to_power?.score,
          acting_with_power: result.acting_with_power?.score,
        },
      });
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message);
    }
    setLoading(false);
  }

  if (!thread) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-text-dim)] text-lg font-[var(--font-display)] mb-2">No thread selected</p>
        <p className="text-[var(--color-text-dim)] text-sm">Select a thread from the Pulse dashboard to analyze.</p>
        <button onClick={onBack} className="mt-4 text-sm text-[var(--color-amber)] hover:underline">
          ← Back to Pulse
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button onClick={onBack} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-3 flex items-center gap-1">
          ← Back
        </button>
        <h1 className="font-[var(--font-display)] font-bold text-4xl mb-1">{thread.subject}</h1>
        <p className="text-[var(--color-text-muted)] text-sm">{thread.from} → {thread.to}</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--color-amber)]/30 border-t-[var(--color-amber)] rounded-full animate-spin mb-4" />
          <p className="text-[var(--color-text-muted)] text-sm">Running three-framework analysis...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-[var(--color-red)]/30 bg-[var(--color-red)]/5 text-[var(--color-red)] text-sm">
          Analysis failed: {error}
          <button onClick={analyzeThread} className="ml-3 underline">Retry</button>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Thread Messages */}
          <div className="lg:col-span-3 space-y-4">
            {/* Messages */}
            <div className="space-y-3">
              {thread.messages?.map((msg, i) => (
                <MessageBubble key={i} msg={msg} index={i} analysis={analysis} />
              ))}
            </div>

            {/* Detailed Coaching */}
            <div className="mt-6 p-6 rounded-xl border border-[var(--color-amber)]/20 bg-[var(--color-amber)]/5">
              <h3 className="font-[var(--font-display)] text-lg text-[var(--color-amber)] mb-3">
                {analysis.headline_coaching}
              </h3>
              <div className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                {analysis.detailed_coaching}
              </div>
            </div>
          </div>

          {/* RIGHT: Analysis Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Scores */}
            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Framework Scores</h3>
              <div className="flex justify-around">
                <ScoreRing score={analysis.touchy_feely?.score || 0} label="Touchy Feely" color={FRAMEWORKS.touchy_feely.color} />
                <ScoreRing score={analysis.path_to_power?.score || 0} label="Power" color={FRAMEWORKS.path_to_power.color} />
                <ScoreRing score={analysis.acting_with_power?.score || 0} label="Presence" color={FRAMEWORKS.acting_with_power.color} />
              </div>
            </div>

            {/* Relationship Context */}
            {analysis.relationship && (
              <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Relationship Context</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-dim)]">Contact</span>
                    <span>{analysis.relationship.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-dim)]">Role</span>
                    <span>{analysis.relationship.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-dim)]">Type</span>
                    <span className="capitalize">{analysis.relationship.relationship_type}</span>
                  </div>
                  <div className="h-px bg-[var(--color-border)] my-2" />
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{analysis.relationship.power_dynamic}</p>
                </div>
              </div>
            )}

            {/* Tabs for Framework Details */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
              <div className="flex border-b border-[var(--color-border)]">
                {["coaching", "both_sides", "power", "touchy_feely"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === tab
                        ? "text-[var(--color-amber)] border-b-2 border-[var(--color-amber)]"
                        : "text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)]"
                    }`}
                  >
                    {tab === "both_sides" ? "Both Sides" : tab === "touchy_feely" ? "T-Group" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {activeTab === "coaching" && <CoachingTab analysis={analysis} />}
                {activeTab === "both_sides" && <BothSidesTab analysis={analysis} />}
                {activeTab === "power" && <PowerTab analysis={analysis} />}
                {activeTab === "touchy_feely" && <TouchyFeelyTab analysis={analysis} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────

function MessageBubble({ msg, index, analysis }) {
  const isUser = msg.from === "You";
  const powerLeaks = analysis.path_to_power?.power_leakage?.filter((p) => p.message_index === index) || [];
  const overTheNet = analysis.touchy_feely?.over_the_net?.filter((o) => o.message_index === index) || [];
  const statusSignals = analysis.acting_with_power?.status_signals?.filter((s) => s.message_index === index) || [];
  const hasIssues = powerLeaks.length > 0 || overTheNet.length > 0 || statusSignals.length > 0;

  return (
    <div className={`p-4 rounded-xl border ${isUser ? "border-[var(--color-border-light)] bg-[var(--color-surface-2)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-semibold ${isUser ? "text-[var(--color-amber)]" : "text-[var(--color-text-muted)]"}`}>
          {msg.from}
        </span>
        <span className="text-[10px] text-[var(--color-text-dim)]">{msg.date}</span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text)]">{msg.body}</p>

      {/* Inline Annotations */}
      {hasIssues && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)] space-y-2">
          {powerLeaks.map((p, i) => (
            <AnnotationChip key={`pl-${i}`} color={FRAMEWORKS.path_to_power.color} icon="◆">
              Power leakage: "{p.quote}" → {p.fix}
            </AnnotationChip>
          ))}
          {overTheNet.map((o, i) => (
            <AnnotationChip key={`ot-${i}`} color={FRAMEWORKS.touchy_feely.color} icon="◐">
              Over the net: "{o.quote}" → {o.correction}
            </AnnotationChip>
          ))}
          {statusSignals.filter((s) => s.signal === "low_status").map((s, i) => (
            <AnnotationChip key={`ss-${i}`} color={FRAMEWORKS.acting_with_power.color} icon="▲">
              Low-status signal: "{s.quote}" — {s.explanation}
            </AnnotationChip>
          ))}
        </div>
      )}
    </div>
  );
}

function AnnotationChip({ color, icon, children }) {
  return (
    <div
      className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs leading-relaxed"
      style={{ backgroundColor: color + "10", color, border: `1px solid ${color}25` }}
    >
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function CoachingTab({ analysis }) {
  const leaks = analysis.path_to_power?.power_leakage || [];
  const otn = analysis.touchy_feely?.over_the_net || [];
  return (
    <div className="space-y-4 text-sm">
      {leaks.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: FRAMEWORKS.path_to_power.color }}>
            Power Leakage ({leaks.length})
          </h4>
          <div className="space-y-2">
            {leaks.map((l, i) => (
              <div key={i} className="text-[var(--color-text-muted)]">
                <span className="line-through text-[var(--color-red)]/60">"{l.quote}"</span>
                <span className="mx-1">→</span>
                <span className="text-[var(--color-green)]">"{l.fix}"</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {otn.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: FRAMEWORKS.touchy_feely.color }}>
            Over the Net ({otn.length})
          </h4>
          <div className="space-y-2">
            {otn.map((o, i) => (
              <div key={i} className="text-[var(--color-text-muted)]">
                <span className="line-through text-[var(--color-red)]/60">"{o.quote}"</span>
                <span className="mx-1">→</span>
                <span className="text-[var(--color-green)]">"{o.correction}"</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {analysis.path_to_power?.strategic_assessment && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--color-text-dim)]">Strategic Assessment</h4>
          <p className="text-[var(--color-text-muted)] leading-relaxed">{analysis.path_to_power.strategic_assessment}</p>
        </div>
      )}
    </div>
  );
}

function BothSidesTab({ analysis }) {
  if (!analysis.both_sides) return <p className="text-sm text-[var(--color-text-dim)]">No data.</p>;
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border border-[var(--color-amber)]/20 bg-[var(--color-amber)]/5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-amber)] mb-2">Your Side of the Net</h4>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{analysis.both_sides.your_side}</p>
      </div>
      <div className="p-4 rounded-lg border border-[var(--color-teal)]/20 bg-[var(--color-teal)]/5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)] mb-2">Their Side of the Net</h4>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{analysis.both_sides.their_side}</p>
      </div>
      {analysis.touchy_feely?.intent_vs_impact && (
        <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-dim)] mb-2">The Gap</h4>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{analysis.touchy_feely.intent_vs_impact}</p>
        </div>
      )}
    </div>
  );
}

function PowerTab({ analysis }) {
  const pp = analysis.path_to_power;
  const awp = analysis.acting_with_power;
  if (!pp && !awp) return <p className="text-sm text-[var(--color-text-dim)]">No data.</p>;
  return (
    <div className="space-y-4 text-sm">
      {pp?.power_sources && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-teal)] mb-2">Power Sources</h4>
          <div className="space-y-2 text-[var(--color-text-muted)]">
            <p><span className="text-[var(--color-amber)]">You:</span> {pp.power_sources.user}</p>
            <p><span className="text-[var(--color-teal)]">Them:</span> {pp.power_sources.other}</p>
          </div>
        </div>
      )}
      {awp?.space_analysis && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-purple)] mb-2">Space Analysis</h4>
          <p className="text-[var(--color-text-muted)] leading-relaxed">{awp.space_analysis}</p>
        </div>
      )}
      {awp?.warmth_authority_balance && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-purple)] mb-2">Warmth-Authority Balance</h4>
          <p className="text-[var(--color-text-muted)] leading-relaxed">{awp.warmth_authority_balance}</p>
        </div>
      )}
    </div>
  );
}

function TouchyFeelyTab({ analysis }) {
  const tf = analysis.touchy_feely;
  if (!tf) return <p className="text-sm text-[var(--color-text-dim)]">No data.</p>;
  return (
    <div className="space-y-4 text-sm">
      {tf.pinch_crunch && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-amber)] mb-2 flex items-center gap-2">
            Pinch-Crunch Status
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  tf.pinch_crunch.status === "red" ? "#FF6B6B" : tf.pinch_crunch.status === "yellow" ? "#E8A87C" : "#6BCB77",
              }}
            />
          </h4>
          <p className="text-[var(--color-text-muted)] leading-relaxed">{tf.pinch_crunch.analysis}</p>
        </div>
      )}
      {tf.emotional_bids?.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-amber)] mb-2">Emotional Bids</h4>
          <div className="space-y-2">
            {tf.emotional_bids.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-[var(--color-text-muted)]">
                <span
                  className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      b.response === "turned_toward" ? "#6BCB77" : b.response === "turned_away" ? "#FF6B6B" : "#E8A87C",
                  }}
                />
                <span>
                  <span className="text-[var(--color-text-dim)]">{b.from}:</span> "{b.quote}" — <em className="capitalize">{b.response?.replace("_", " ")}</em>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
