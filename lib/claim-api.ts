/** Base URL for the ChessTools Claim API (FastAPI). No trailing slash. */
export function claimApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_CLAIM_API_URL?.trim()
  if (raw) return raw.replace(/\/$/, "")
  return "http://127.0.0.1:8000"
}

/** WebSocket URL for a claim scanning session. */
export function claimWsUrl(sessionId: string): string {
  const base = new URL(claimApiBase())
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:"
  base.pathname = `/ws/${sessionId}`
  base.search = ""
  base.hash = ""
  return base.toString()
}
