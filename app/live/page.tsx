"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chessboard = dynamic(
  () => import("react-chessboard").then((mod) => mod.Chessboard),
  { ssr: false },
);

const DEFAULT_FEN = new Chess().fen();

export type ClaimRelayGame = {
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

function relayWsUrl(): string {
  if (typeof window !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_CHESS_CLAIM_RELAY_WS;
    if (fromEnv) return fromEnv;
  }
  return "ws://127.0.0.1:9173";
}

export default function LiveClaimsPage() {
  const [games, setGames] = useState<ClaimRelayGame[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "open" | "error">("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const wsUrl = useMemo(() => relayWsUrl(), []);

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

  useEffect(() => {
    let ws: WebSocket | null = null;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      setStatus("connecting");
      setLastError(null);
      try {
        ws = new WebSocket(wsUrl);
      } catch (e) {
        setStatus("error");
        setLastError(e instanceof Error ? e.message : "Could not open WebSocket");
        return;
      }

      ws.onopen = () => {
        if (!cancelled) setStatus("open");
      };

      ws.onerror = () => {
        if (!cancelled) {
          setStatus("error");
          setLastError("WebSocket error (is Chess Claim Tool broadcasting on this URL?)");
        }
      };

      ws.onclose = () => {
        if (!cancelled) setStatus("idle");
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data as string) as { type?: string; games?: ClaimRelayGame[] };
          if (data.type === "games" && Array.isArray(data.games)) {
            setGames(data.games);
          }
        } catch {
          /* ignore malformed */
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      ws?.close();
    };
  }, [wsUrl]);

  const position = selected?.fen && selected.fen.length > 0 ? selected.fen : DEFAULT_FEN;

  const statusLabel = useCallback(() => {
    switch (status) {
      case "connecting":
        return "Connecting…";
      case "open":
        return "Connected";
      case "error":
        return "Disconnected";
      default:
        return "Waiting";
    }
  }, [status]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Live claims relay</h1>
        <p className="max-w-3xl text-muted-foreground">
          Connects to the Chess Claim Tool desktop app when{" "}
          <span className="text-foreground">Options → WebSocket broadcast (ChessTools)</span> is enabled and a scan is
          running. The relay defaults to <code className="rounded bg-muted px-1 py-0.5 text-sm">127.0.0.1:9173</code>
          — override with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">CHESS_CLAIM_RELAY_HOST</code> /{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">CHESS_CLAIM_RELAY_PORT</code> on the desktop side and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">NEXT_PUBLIC_CHESS_CLAIM_RELAY_WS</code> for this page.
        </p>
        <p className="text-sm text-muted-foreground">
          Endpoint: <span className="font-mono text-foreground">{wsUrl}</span> · {statusLabel()}
          {lastError ? ` · ${lastError}` : null}
        </p>
      </div>

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

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tracked games</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[520px] space-y-2 overflow-y-auto">
            {games.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No snapshots yet. Start a scan in Chess Claim Tool with WebSocket broadcast enabled.
              </p>
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
                    {g.claims.length > 0 ? ` · Claims: ${g.claims.join(", ")}` : ""}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
