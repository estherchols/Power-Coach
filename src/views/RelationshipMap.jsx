import { useState, useEffect } from "react";
import { FRAMEWORKS } from "../utils/constants";
import { callClaudeJson } from "../api/claude";
import { PROMPT_PROFILE_RELATIONSHIP, PROMPT_DETECT_PATTERNS } from "../api/prompts";
import { getRelationships, saveRelationship, getCoachingHistory } from "../utils/storage";

export default function RelationshipMap({ threads, demoMode }) {
  const [profiles, setProfiles] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [crossPattern, setCrossPattern] = useState(null);
  const [loading, setLoading] = useState(false);

  // Build contacts from threads
  const contacts = extractContacts(threads);

  // Load saved profiles
  useEffect(() => {
    const saved = getRelationships();
    if (saved && Object.keys(saved).length > 0) {
      setProfiles(saved);
    }
  }, []);

  // ─── PROFILE A CONTACT ──────────────────────────────────────────
  async function profileContact(contact) {
    setLoading(true);
    setSelectedContact(contact);

    // Find all threads involving this contact
    const contactThreads = threads.filter(
      (t) => t.from?.includes(contact.name) || t.to?.includes(contact.name)
    );

    const threadContent = contactThreads
      .map((t) => {
        if (t.messages) {
          return `Thread: ${t.subject}\n${t.messages.map((m) => `${m.from}: ${m.body}`).join("\n")}`;
        }
        return `Thread: ${t.subject}\nFrom: ${t.from}, To: ${t.to}\n${t.snippet}`;
      })
      .join("\n\n---\n\n");

    try {
      const result = await callClaudeJson(
        [{ role: "user", content: `Analyze my communication pattern with ${contact.name}:\n\n${threadContent}` }],
        { system: PROMPT_PROFILE_RELATIONSHIP }
      );

      const updatedProfiles = { ...profiles, [contact.key]: result };
      setProfiles(updatedProfiles);
      saveRelationship(contact.key, result);
    } catch (err) {
      console.error("Profile generation failed:", err);
    }

    setLoading(false);
  }

  // ─── DETECT CROSS-DOMAIN PATTERNS ──────────────────────────────
  async function detectPatterns() {
    setLoading(true);

    const coachingHistory = getCoachingHistory();
    const profileData = Object.entries(profiles)
      .map(([key, p]) => `${p.name} (${p.relationship_type}): ${p.communication_pattern?.dominant_dynamic || "unknown"}, pinch-crunch: ${p.pinch_crunch_status || "unknown"}`)
      .join("\n");

    const historyData = coachingHistory
      .slice(-20)
      .map((e) => `${e.framework} coaching on ${e.type || "thread"}, severity: ${e.severity || "unknown"}`)
      .join("\n");

    try {
      const result = await callClaudeJson(
        [{
          role: "user",
          content: `Analyze my communication patterns across these relationships and coaching sessions:

RELATIONSHIP PROFILES:
${profileData || "No profiles yet"}

COACHING HISTORY:
${historyData || "No coaching history yet"}

THREADS ANALYZED:
${threads.map((t) => `${t.subject} (${t.from} → ${t.to}): ${t.one_line_coaching}`).join("\n")}`,
        }],
        { system: PROMPT_DETECT_PATTERNS }
      );

      setCrossPattern(result);
    } catch (err) {
      console.error("Pattern detection failed:", err);
    }

    setLoading(false);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-display)] font-bold text-5xl mb-2">Relationship Map</h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Your communication dynamics across key relationships.
          </p>
        </div>
        {threads.length > 0 && (
          <button
            onClick={detectPatterns}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-[var(--color-purple)]/10 text-[var(--color-purple)] border border-[var(--color-purple)]/20 hover:bg-[var(--color-purple)]/20 transition-all disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Detect Cross-Domain Patterns"}
          </button>
        )}
      </div>

      {/* Cross-Domain Insight */}
      {crossPattern?.headline_insight && (
        <div className="mb-8 p-6 rounded-xl border border-[var(--color-purple)]/20 bg-[var(--color-purple)]/5 animate-slide-up">
          <h3 className="font-[var(--font-display)] text-lg text-[var(--color-purple)] mb-3">
            {crossPattern.headline_insight}
          </h3>
          {crossPattern.patterns?.map((p, i) => (
            <div key={i} className="mt-3 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[var(--color-text)]">{p.label}</span>
                {p.cross_domain && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-amber)]/10 text-[var(--color-amber)] border border-[var(--color-amber)]/20 font-semibold uppercase tracking-wider">
                    Cross-domain
                  </span>
                )}
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                  style={{
                    color: p.trend === "improving" ? "#6BCB77" : p.trend === "regressing" ? "#FF6B6B" : "#888",
                    backgroundColor: p.trend === "improving" ? "#6BCB7715" : p.trend === "regressing" ? "#FF6B6B15" : "#88888815",
                  }}
                >
                  {p.trend}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{p.evidence}</p>
              {p.cross_domain_insight && (
                <p className="text-xs text-[var(--color-amber)] mt-2 italic">{p.cross_domain_insight}</p>
              )}
              <p className="text-xs text-[var(--color-text-dim)] mt-2">{p.coaching_recommendation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Contact Cards */}
      {contacts.length === 0 ? (
        <div className="border border-dashed border-[var(--color-border)] rounded-xl p-12 text-center">
          <p className="text-[var(--color-text-dim)] text-lg font-[var(--font-display)] mb-2">No relationships mapped yet</p>
          <p className="text-[var(--color-text-dim)] text-sm">
            Scan your inbox first. Contacts will appear here for deep analysis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact, i) => {
            const profile = profiles[contact.key];
            const isSelected = selectedContact?.key === contact.key;

            return (
              <div
                key={contact.key}
                className={`rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-light)]"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-sm">{contact.name}</h3>
                      {profile && (
                        <p className="text-xs text-[var(--color-text-dim)] capitalize mt-0.5">{profile.relationship_type}</p>
                      )}
                    </div>
                    {profile?.pinch_crunch_status && (
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                        style={{
                          backgroundColor:
                            profile.pinch_crunch_status === "red" ? "#FF6B6B"
                            : profile.pinch_crunch_status === "yellow" ? "#E8A87C"
                            : "#6BCB77",
                        }}
                        title={`Pinch-crunch: ${profile.pinch_crunch_status}`}
                      />
                    )}
                  </div>

                  {profile ? (
                    <div className="space-y-3">
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                        {profile.power_dynamic?.summary || profile.communication_pattern?.dominant_dynamic}
                      </p>

                      {profile.communication_pattern?.user_tendency && (
                        <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] mb-1">Your tendency</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{profile.communication_pattern.user_tendency}</p>
                        </div>
                      )}

                      {profile.coaching_priorities?.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)]">Priorities</p>
                          {profile.coaching_priorities.map((p, j) => (
                            <p key={j} className="text-xs text-[var(--color-amber)] leading-relaxed">• {p}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-[var(--color-text-dim)]">
                        {contact.threadCount} thread{contact.threadCount !== 1 ? "s" : ""} found
                      </p>
                      <button
                        onClick={() => profileContact(contact)}
                        disabled={loading}
                        className="w-full py-2 text-xs rounded-lg border border-[var(--color-amber)]/20 text-[var(--color-amber)] hover:bg-[var(--color-amber)]/10 transition-all disabled:opacity-50"
                      >
                        {loading && isSelected ? "Analyzing..." : "Analyze Relationship"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────

function extractContacts(threads) {
  const contactMap = {};

  threads.forEach((t) => {
    const names = [t.from, t.to].filter((n) => n && n !== "You");
    names.forEach((name) => {
      const key = name.toLowerCase().replace(/\s+/g, "_");
      if (!contactMap[key]) {
        contactMap[key] = { key, name, threadCount: 0, frameworks: [] };
      }
      contactMap[key].threadCount++;
      if (t.primary_framework) contactMap[key].frameworks.push(t.primary_framework);
    });
  });

  return Object.values(contactMap).sort((a, b) => b.threadCount - a.threadCount);
}
