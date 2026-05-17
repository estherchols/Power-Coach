const STORAGE_KEY = "power_coach_data";

function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultData();
  } catch {
    return getDefaultData();
  }
}

function setData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getDefaultData() {
  return {
    relationships: {},
    patterns: [],
    sessions: [],
    coachingHistory: [],
  };
}

// ─── PUBLIC API ───────────────────────────────────────────────────

export function getRelationships() {
  return getData().relationships;
}

export function saveRelationship(email, profile) {
  const data = getData();
  data.relationships[email] = { ...data.relationships[email], ...profile, updatedAt: new Date().toISOString() };
  setData(data);
}

export function getPatterns() {
  return getData().patterns;
}

export function savePatterns(patterns) {
  const data = getData();
  data.patterns = patterns;
  setData(data);
}

export function logCoachingEvent(event) {
  const data = getData();
  data.coachingHistory.push({ ...event, timestamp: new Date().toISOString() });
  // Keep last 100
  if (data.coachingHistory.length > 100) {
    data.coachingHistory = data.coachingHistory.slice(-100);
  }
  setData(data);
}

export function getCoachingHistory() {
  return getData().coachingHistory;
}

export function logSession(session) {
  const data = getData();
  data.sessions.push({ ...session, date: new Date().toISOString() });
  setData(data);
}

export function getSessions() {
  return getData().sessions;
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}
