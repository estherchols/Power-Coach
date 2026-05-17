import { FRAMEWORKS } from "../utils/constants";

function FrameworkBadge({ framework }) {
  const fw = FRAMEWORKS[framework];
  if (!fw) return null;
  return (
    <span className="text-xs font-medium" style={{ color: fw.color }}>
      {fw.label}
    </span>
  );
}

export default function Dashboard({ threads, calEvents, loading, onSelectThread, demoMode, onLoadDemo, onScan }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-[var(--color-text-muted)]/30 border-t-[var(--color-text)] rounded-full animate-spin" />
        <p className="text-[var(--color-text-muted)] text-sm">Scanning your inbox...</p>
      </div>
    );
  }

  const hasData = threads.length > 0 || calEvents.length > 0;

  return (
    <div className="space-y-8">
      {/* GREETING */}
      <div>
        <p className="text-sm text-[var(--color-text-muted)] mb-2">9:41</p>
        <h1 className="text-3xl font-light mb-1">Good morning</h1>
        <h2 className="text-2xl font-normal">Hi, Esther.</h2>
      </div>

      {!hasData && !demoMode && (
        <div className="bg-[var(--color-surface-2)] rounded-lg p-6 text-center space-y-4">
          <p className="text-[var(--color-text-muted)]">Connect your Gmail to get started, or load demo data to explore.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onLoadDemo}
              className="px-4 py-2 rounded-lg bg-[var(--color-text)] text-[var(--color-surface)] font-medium text-sm hover:opacity-90 transition"
            >
              Load Demo
            </button>
            <button
              onClick={onScan}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:bg-[var(--color-surface-2)] transition"
            >
              Scan Inbox
            </button>
          </div>
        </div>
      )}

      {hasData && (
        <>
          {/* THIS MORNING */}
          {calEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">This morning</h3>
              <p className="text-sm text-[var(--color-text)] mb-3">{calEvents.length} moments</p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                I scanned your inbox and calendar. {threads.slice(0, 2).map(t => t.one_line_coaching).join(", and ")}.
              </p>
            </div>
          )}

          {/* WORTH COACHING */}
          {threads.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">Worth coaching</h3>
              <div className="space-y-3">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => onSelectThread(thread)}
                    className="block w-full text-left p-4 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition group"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-lg font-bold text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]">
                        {thread.to.split(" ")[0][0]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          {thread.to.split("(")[0].trim()}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {thread.from === "You" ? "Gmail" : "Thread"}
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium"
                        style={{ color: FRAMEWORKS[thread.primary_framework]?.color || "#666" }}
                      >
                        {thread.primary_framework === "acting_with_power" ? "AwP" :
                         thread.primary_framework === "path_to_power" ? "PtP" : "TF"}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text)] leading-snug">
                      "{thread.one_line_coaching}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* YOUR PATTERNS */}
          <div className="pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4">Your patterns</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-sm font-medium text-[var(--color-text)]">Hedging with authority</p>
                  <p className="text-xs text-[var(--color-amber)]">from 93% three weeks ago</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="flex-1 h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-amber)] rounded-full" style={{ width: "80%" }} />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text)]">80%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-sm font-medium text-[var(--color-text)]">Over the net with family</p>
                  <p className="text-xs text-[var(--color-text-muted)]">no change this week</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="flex-1 h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-text-muted)] rounded-full" style={{ width: "60%" }} />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text)]">60%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-sm font-medium text-[var(--color-text)]">Missed bids from mentors</p>
                  <p className="text-xs text-[var(--color-red)]">watch this</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="flex-1 h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-red)] rounded-full" style={{ width: "57%" }} />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text)]">4 / 7</span>
                </div>
              </div>
            </div>
          </div>

          {/* CROSS-DOMAIN INSIGHT */}
          <div className="bg-[var(--color-surface-2)] rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">Cross‑domain insight</p>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">
              You defer to authority at work — and to your parents at home. Same pattern, different rooms.
            </p>
          </div>

          {/* FRAMEWORKS */}
          <div className="flex gap-2 text-xs text-[var(--color-text-muted)] pt-4 border-t border-[var(--color-border)]">
            <span>Touchy Feely</span>
            <span>·</span>
            <span>Path to Power</span>
            <span>·</span>
            <span>Acting with Power</span>
          </div>
        </>
      )}
    </div>
  );
}
