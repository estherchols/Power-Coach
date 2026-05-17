const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

export const MCP_SERVERS = {
  gmail: { type: "url", url: "https://gmailmcp.googleapis.com/mcp/v1", name: "gmail" },
  calendar: { type: "url", url: "https://calendarmcp.googleapis.com/mcp/v1", name: "gcal" },
};

/**
 * Call Claude API with optional MCP servers
 */
export async function callClaude(messages, { system, mcpServers = [], maxTokens = 4096 } = {}) {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    messages,
  };

  if (system) body.system = system;
  if (mcpServers.length > 0) body.mcp_servers = mcpServers;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }

  return res.json();
}

/**
 * Extract all text blocks from a Claude response
 */
export function extractText(data) {
  if (!data?.content) return "";
  return data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

/**
 * Extract MCP tool results from a Claude response
 */
export function extractMcpResults(data) {
  if (!data?.content) return [];
  return data.content
    .filter((b) => b.type === "mcp_tool_result")
    .map((b) => {
      const text = b.content?.[0]?.text || "";
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    });
}

/**
 * Parse JSON from Claude text response, handling markdown fences
 */
export function parseJsonResponse(text) {
  const cleaned = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(cleaned);
}

/**
 * Call Claude and parse the text response as JSON
 */
export async function callClaudeJson(messages, options = {}) {
  const data = await callClaude(messages, options);
  const text = extractText(data);

  if (!text) {
    // Might have MCP results — extract text from those
    const mcpResults = extractMcpResults(data);
    if (mcpResults.length > 0) return { mcpResults, raw: data };
    throw new Error("No text in Claude response");
  }

  try {
    return parseJsonResponse(text);
  } catch (e) {
    console.error("Failed to parse Claude JSON response:", text);
    throw new Error(`JSON parse error: ${e.message}`);
  }
}
