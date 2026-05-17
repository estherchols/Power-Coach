import { FRAMEWORKS } from "../utils/constants";

function FrameworkLabel({ framework }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wider">
      {framework === "acting_with_power" ? "AwP" :
       framework === "path_to_power" ? "PtP" : "TF"}
    </span>
  );
}

function InitialAvatar({ name }) {
  const initial = name?.split(" ")[0]?.[0] || "?";
  return (
    <div className="w-10 h-10 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center text-sm font-bold text-[var(--color-text-muted)]">
      {initial}
    </div>
  );
}

export default function Dashboard({ threads, calEvents, loading, onSelectThread, demoMode, onLoadDemo, onScan }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-text)] rounded-full animate-spin" />
        <p className="text-[var(--color-text-muted)] text-sm">Scanning your inbox...</p>
      </div>
    );
  }

  const hasData = threads.length > 0 || calEvents.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* GREETING */}
      <div className="mb-8">
        <p className="text-xs text-[var(--color-text-dim)] font-semibold uppercase tracking-wider mb-2">Good Morning</p>
        <h1 className="text-5xl font-bold font-display mb-1 text-[var(--color-text)]">Hi, Esther.</h1>
      </div>

      {!hasData && !demoMode && (
        <div className="border border-[var(--color-border)] rounded-2xl p-8 text-center space-y-4">
          <p className="text-[var(--color-text-muted)]">Connect your Gmail to get started, or load demo data to explore.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onLoadDemo}
              className="px-6 py-2 rounded-lg bg-[var(--color-text)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-90 transition"
            >
              Load Demo
            </button>
            <button
              onClick={onScan}
              className="px-6 py-2 rounded-lg border border-[var(--color-text)] text-[var(--color-text)] font-semibold text-sm hover:bg-[var(--color-surface)] transition"
            >
              Scan Inbox
            </button>
          </div>
        </div>
      )}

      {hasData && (
        <>
          {/* THIS MORNING CARD */}
          {threads.length > 0 && (
            <div className="border border-[var(--color-border)] rounded-2xl p-6 space-y-4 bg-[var(--color-surface)]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-display font-bold text-[var(--color-text)]">This morning</h2>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-dim)]">{threads.length} moments</span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                I scanned your inbox and calendar. {threads.slice(0, 2).map(t => t.one_line_coaching).join(" and ")}.
              </p>
            </div>
          )}

          {/* WORTH COACHING */}
          {threads.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
                <span className="text-[var(--color-red)]">•</span> Worth coaching
              </h3>
              <div className="space-y-3">
                {threads.map((thread) => {
                  const contactName = thread.to?.split("(")[0].trim() || "Unknown";
                  const fw = FRAMEWORKS[thread.primary_framework];
                  return (
                    <button
                      key={thread.id}
                      onClick={() => onSelectThread(thread)}
                      className="w-full text-left p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] transition group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <InitialAvatar name={contactName} />
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-sm font-semibold text-[var(--color-text)]">
                            <span className="text-[var(--color-red)]">•</span> {contactName}
                          </p>
                          <p className="text-xs text-[var(--color-text-dim)] capitalize">
                            {thread.from === "You" ? "Gmail" : "Thread"}
                          </p>
                        </div>
                        <span
                          className="text-xs font-bold uppercase tracking-wider flex-shrink-0 mt-1"
                          style={{ color: fw?.color || "var(--color-text-dim)" }}
                        >
                          <FrameworkLabel framework={thread.primary_framework} />
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed italic">
                        "{thread.one_line_coaching}"
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
