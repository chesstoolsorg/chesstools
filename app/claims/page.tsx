"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { claimApiBase, claimWsUrl } from "@/lib/claim-api";

const Chessboard = dynamic(
  () => import("react-chessboard").then((mod) => mod.Chessboard),
  { ssr: false },
);

const DEFAULT_FEN = new Chess().fen();

export type RelayGame = {
  players: string;
  board: string;
  move_count: number;
  last_move: string;
  status: string;
  result: string;
  claims: string[];
  has_error: boolean;
  error_at_move: number | null;
  last_update: string;
  fen: string | null;
};

export type ClaimRow = {
  type: string;
  board: string;
  players: string;
  move: string;
  at: string;
};

type SnapshotMessage = {
  type: "snapshot";
  session_id: string;
  games: RelayGame[];
  claims: ClaimRow[];
};

export default function ClaimsPage() {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [pgnUrl, setPgnUrl] = useState("");
  const [pgnText, setPgnText] = useState("");
  const [livePgn, setLivePgn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [games, setGames] = useState<RelayGame[]>([]);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [wsStatus, setWsStatus] = useState<"idle" | "open" | "closed">("idle");

  const [selectedPlayers, setSelectedPlayers] = useState<string | null>(null);

  const apiBase = useMemo(() => claimApiBase(), []);

  useEffect(() => {
    if (games.length === 0) {
      setSelectedPlayers(null);
      return;
    }
    setSelectedPlayers((prev) => {
      if (prev && games.some((g) => g.players === prev)) return prev;
      return games[0].players;
    });
  }, [games]);

  const effectiveSelected = selectedPlayers ?? games[0]?.players ?? null;
  const selected = useMemo(
    () => games.find((g) => g.players === effectiveSelected) ?? games[0],
    [games, effectiveSelected],
  );

  const position = selected?.fen && selected.fen.length > 0 ? selected.fen : DEFAULT_FEN;

  const applySnapshot = useCallback((msg: SnapshotMessage) => {
    setGames(msg.games);
    setClaims(msg.claims);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    let ws: WebSocket | null = null;
    let cancelled = false;
    const url = claimWsUrl(sessionId);

    ws = new WebSocket(url);
    ws.onopen = () => {
      if (!cancelled) setWsStatus("open");
    };
    ws.onclose = () => {
      if (!cancelled) setWsStatus("closed");
    };
    ws.onerror = () => {
      if (!cancelled) setWsStatus("closed");
    };
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as SnapshotMessage;
        if (data.type === "snapshot") applySnapshot(data);
      } catch {
        /* ignore */
      }
    };

    return () => {
      cancelled = true;
      ws?.close();
      setWsStatus("idle");
    };
  }, [sessionId, applySnapshot]);

  const stopSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await fetch(`${apiBase}/sessions/${sessionId}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
    setSessionId(null);
    setGames([]);
    setClaims([]);
  }, [sessionId, apiBase]);

  const startSession = async () => {
    setError(null);
    setBusy(true);
    try {
      const body =
        mode === "url"
          ? { pgn_url: pgnUrl.trim(), live_pgn: livePgn }
          : { pgn_text: pgnText, live_pgn: livePgn };

      const res = await fetch(`${apiBase}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        const msg =
          typeof detail?.detail === "string"
            ? detail.detail
            : Array.isArray(detail?.detail)
              ? detail.detail.map((d: { msg?: string }) => d.msg ?? "").join(" ")
              : res.statusText;
        throw new Error(msg || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { session_id: string };
      setSessionId(data.session_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start session");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Claim scanner</h1>
        <p className="max-w-3xl text-muted-foreground">
          Server-side scanning with the same rules as Chess Claim Tool (threefold, fifty- and seventy-five-move, etc.).
          Run the{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">claim-api</code> service locally or deploy it, then
          set{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">NEXT_PUBLIC_CLAIM_API_URL</code> for this site (
          <span className="font-mono text-foreground">{apiBase}</span>).
        </p>
      </div>

      {!sessionId ? (
        <Card className="mb-8 border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">New session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant={mode === "url" ? "default" : "outline"} size="sm" onClick={() => setMode("url")}>
                PGN URL
              </Button>
              <Button type="button" variant={mode === "text" ? "default" : "outline"} size="sm" onClick={() => setMode("text")}>
                Paste PGN
              </Button>
            </div>

            {mode === "url" ? (
              <div className="space-y-2">
                <label htmlFor="pgn-url" className="text-sm font-medium leading-none">
                  URL (must end in .pgn)
                </label>
                <Input
                  id="pgn-url"
                  placeholder="https://example.com/live/games.pgn"
                  value={pgnUrl}
                  onChange={(e) => setPgnUrl(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="pgn-text" className="text-sm font-medium leading-none">
                  PGN
                </label>
                <Textarea id="pgn-text" className="min-h-[160px]" value={pgnText} onChange={(e) => setPgnText(e.target.value)} spellCheck={false} />
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={livePgn} onChange={(e) => setLivePgn(e.target.checked)} />
              Live PGN mode (skip claim checks on finished games)
            </label>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="button" disabled={busy} onClick={() => void startSession()}>
              {busy ? "Starting…" : "Start scanning"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Session <span className="font-mono text-foreground">{sessionId.slice(0, 8)}…</span> · WebSocket{" "}
            <span className="text-foreground">{wsStatus}</span>
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => void stopSession()}>
            Stop session
          </Button>
        </div>
      )}

      {sessionId ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="overflow-hidden border-border/70 shadow-sm">
            <CardHeader className="border-b border-border/60 bg-muted/30">
              <CardTitle className="text-lg">{selected ? selected.players : "No games yet"}</CardTitle>
              {selected ? (
                <p className="text-sm font-normal text-muted-foreground">
                  Board {selected.board} · {selected.move_count} ply · {selected.status}
                  {selected.result !== "*" ? ` · ${selected.result}` : ""}
                  {selected.last_move ? ` · Last: ${selected.last_move}` : ""}
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <div className="w-full max-w-[380px]">
                <Chessboard position={position} arePiecesDraggable={false} boardWidth={380} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Tracked games</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[280px] space-y-2 overflow-y-auto">
                {games.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Waiting for PGN data…</p>
                ) : (
                  games.map((g) => (
                    <button
                      key={g.players}
                      type="button"
                      onClick={() => setSelectedPlayers(g.players)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                        effectiveSelected === g.players
                          ? "border-primary bg-primary/5"
                          : "border-border/70 hover:bg-muted/50"
                      }`}
                    >
                      <div className="font-medium">{g.players}</div>
                      <div className="text-muted-foreground">
                        {g.move_count} ply · {g.status}
                        {g.claims.length > 0 ? ` · ${g.claims.join(", ")}` : ""}
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Claims</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[260px] overflow-x-auto overflow-y-auto">
                {claims.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No claim rows yet.</p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground">
                        <th className="py-1 pr-2 font-medium">Type</th>
                        <th className="py-1 pr-2 font-medium">Board</th>
                        <th className="py-1 pr-2 font-medium">Players</th>
                        <th className="py-1 pr-2 font-medium">Move</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((c, i) => (
                        <tr key={`${c.at}-${i}`} className="border-b border-border/40">
                          <td className="py-1 pr-2 align-top">{c.type}</td>
                          <td className="py-1 pr-2 align-top">{c.board}</td>
                          <td className="py-1 pr-2 align-top">{c.players}</td>
                          <td className="py-1 pr-2 align-top font-mono text-xs">{c.move}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
