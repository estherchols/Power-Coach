import { FRAMEWORKS, SEVERITY_COLORS } from "../utils/constants";

function FrameworkBadge({ framework }) {
  const fw = FRAMEWORKS[framework];
  if (!fw) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
      style={{ backgroundColor: fw.color + "15", color: fw.color, borderColor: fw.color + "30" }}
    >
      {fw.icon} {fw.label}
    </span>
  );
}

function StakesBadge({ stakes }) {
  const color = SEVERITY_COLORS[stakes] || "#888";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: color + "18", color }}
    >
      {stakes}
    </span>
  );
}

export default function Dashboard({ threads, calEvents, loading, onSelectThread, demoMode }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-8 h-8 border-2 border-[var(--color-amber)]/30 border-t-[var(--color-amber)] rounded-full animate-spin mb-4" />
        <p className="text-[var(--color-text-muted)] text-sm">Scanning your inbox and calendar...</p>
      </div>
    );
  }

  const hasData = threads.length > 0 || calEvents.length > 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-[var(--font-display)] text-4xl mb-2">Your Communication Pulse</h1>
        <p className="text-[var(--color-text-muted)]">
          {hasData
            ? `${threads.length} coaching opportunities found. ${calEvents.length} upcoming high-stakes moments.`
            : "Connect your Gmail to scan for coaching opportunities, or load demo data to explore."}
        </p>
        {demoMode && (
          <span className="inline-block mt-2 px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-purple)]/10 text-[var(--color-purple)] border border-[var(--color-purple)]/20">
            Demo Mode
          </span>
        )}
      </div>

      {!hasData && (
        <div className="border border-dashed border-[var(--color-border)] rounded-xl p-12 text-center">
          <p className="text-[var(--color-text-dim)] text-lg mb-2 font-[var(--font-display)]">No data yet</p>
          <p className="text-[var(--color-text-dim)] text-sm">
            Click <strong className="text-[var(--color-amber)]">Scan Inbox</strong> to connect Gmail, or{" "}
            <strong className="text-[var(--color-purple)]">Load Demo</strong> to try with sample data.
          </p>
        </div>
      )}

      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* THREADS COLUMN */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
              <span className="text-[var(--color-amber)]">◉</span> Inbox Coaching Opportunities
            </h2>
            {threads.map((t, i) => (
              <button
                key={t.id || i}
                onClick={() => onSelectThread(t)}
                className="w-full text-left p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] hover:border-[var(--color-border-light)] transition-all duration-200 group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-amber)] transition-colors">
                    {t.subject}
                  </span>
                  <StakesBadge stakes={t.stakes} />
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)] mb-3">
                  <span>{t.from} → {t.to}</span>
                  {t.last_date && (
                    <>
                      <span className="text-[var(--color-border)]">·</span>
                      <span>{t.last_date}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mb-3 leading-relaxed">{t.snippet}</p>
                <div className="flex items-center gap-3">
                  <FrameworkBadge framework={t.primary_framework} />
                  <span className="text-xs text-[var(--color-text-dim)] italic">{t.one_line_coaching}</span>
                </div>
              </button>
            ))}
          </div>

          {/* CALENDAR + PATTERNS COLUMN */}
          <div className="space-y-6">
            {/* Calendar Events */}
            {calEvents.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
                  <span className="text-[var(--color-teal)]">◆</span> Upcoming Moments
                </h2>
                <div className="space-y-3">
                  {calEvents.map((e, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm">{e.title}</span>
                        <StakesBadge stakes={e.stakes} />
                      </div>
                      <p className="text-xs text-[var(--color-text-dim)] mb-2">{e.start}</p>
                      <p className="text-xs text-[var(--color-teal)] leading-relaxed">{e.coaching_note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
                <span className="text-[var(--color-purple)]">▲</span> At a Glance
              </h2>
              <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">High-stakes threads</span>
                  <span className="font-[var(--font-display)] text-xl text-[var(--color-red)]">
                    {threads.filter((t) => t.stakes === "high").length}
                  </span>
                </div>
                <div className="h-px bg-[var(--color-border)]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Primary issue</span>
                  <span className="text-sm text-[var(--color-amber)]">
                    {getMostCommonFramework(threads)}
                  </span>
                </div>
                <div className="h-px bg-[var(--color-border)]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Upcoming prep needed</span>
                  <span className="font-[var(--font-display)] text-xl text-[var(--color-teal)]">
                    {calEvents.filter((e) => e.stakes === "high").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getMostCommonFramework(threads) {
  const counts = {};
  threads.forEach((t) => {
    counts[t.primary_framework] = (counts[t.primary_framework] || 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top) return "—";
  return FRAMEWORKS[top[0]]?.label || top[0];
}
