"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import useStockfish from "@/components/stockfish/engine";
import { Chess, Square } from "chess.js";

const Chessboard = dynamic(
  () => import("react-chessboard").then((mod) => mod.Chessboard),
  { ssr: false }
);

const LEVELS = [
  { label: "Beginner", skill: 1, eloLabel: "~800", eloValue: 800, depth: 6 },
  { label: "Easy", skill: 3, eloLabel: "~1100", eloValue: 1100, depth: 8 },
  { label: "Intermediate", skill: 6, eloLabel: "~1400", eloValue: 1400, depth: 10 },
  { label: "Advanced", skill: 10, eloLabel: "~1800", eloValue: 1800, depth: 12 },
  { label: "Master", skill: 15, eloLabel: "~2200", eloValue: 2200, depth: 14 },
  { label: "Maximum", skill: 20, eloLabel: "~2600+", eloValue: 2600, depth: 16 },
];

export default function PlayStockfishPage() {
  const [level, setLevel] = useState(1);
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [waiting, setWaiting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const [boardWidth, setBoardWidth] = useState(520);
  const stockfish = useStockfish();
  const selectedLevel = LEVELS.find((entry) => entry.skill === level) ?? LEVELS[0];
  const lichessAnalysisUrl = `https://lichess.org/analysis/${fen.replaceAll(" ", "_")}`;

  useEffect(() => {
    function updateBoardWidth() {
      const containerWidth = boardContainerRef.current?.clientWidth ?? window.innerWidth;
      const ideal = Math.min(containerWidth - 24, Math.floor(window.innerHeight * 0.62), 620);
      setBoardWidth(Math.max(260, ideal));
    }
    updateBoardWidth();
    window.addEventListener("resize", updateBoardWidth);
    return () => window.removeEventListener("resize", updateBoardWidth);
  }, []);

  // Reset game and Stockfish on level change
  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setStatus("");
    setWaiting(false);
    setMoveHistory([]);
    stockfish.init();
    stockfish.setStrength(level, selectedLevel.eloValue);
    // eslint-disable-next-line
  }, [level]);

  // Stockfish move handler
  const makeStockfishMove = () => {
    setWaiting(true);
    stockfish.setStrength(level, selectedLevel.eloValue);
    stockfish.evaluatePosition(game.fen(), selectedLevel.depth);
    stockfish.onMessage((msg) => {
      if (msg.bestMove) {
        const move = {
          from: msg.bestMove.slice(0, 2) as Square,
          to: msg.bestMove.slice(2, 4) as Square,
          promotion: "q" as "q" | "n" | "b" | "r" | undefined,
        };
        const moveResult = game.move(move);
        if (moveResult) {
          setGame(new Chess(game.fen()));
          setFen(game.fen());
          // Save position to history
          setMoveHistory([...moveHistory, game.fen()]);
        }
        setWaiting(false);
        if (game.game_over()) setStatus("Game over");
      }
    });
  };

  // User move handler
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (waiting) return false;
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return false;
    
    // Save current position to history before Stockfish responds
    setMoveHistory([...moveHistory, game.fen()]);
    
    setGame(new Chess(game.fen()));
    setFen(game.fen());
    setTimeout(() => makeStockfishMove(), 400);
    if (game.game_over()) setStatus("Game over");
    return true;
  }

  // Reset game
  function handleReset() {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setStatus("");
    setWaiting(false);
    setMoveHistory([]);
  }

  // Take back last move (both player's move and computer's response)
  function handleTakeback() {
    if (waiting || moveHistory.length < 1) return;
    
    // Get the position before the last move pair
    let targetPosition;
    if (moveHistory.length >= 2) {
      // Take back both computer and player moves
      targetPosition = moveHistory[moveHistory.length - 2];
      setMoveHistory(moveHistory.slice(0, -2));
    } else {
      // Only the player has moved, go back to start
      targetPosition = new Chess().fen();
      setMoveHistory([]);
    }
    
    // Set the board to that position
    const newGame = new Chess(targetPosition);
    setGame(newGame);
    setFen(newGame.fen());
    setStatus("");
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-6xl px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Play Against Stockfish</h1>
      <Card className="w-full mx-auto">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div ref={boardContainerRef} className="flex justify-center lg:justify-start">
              <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={boardWidth} />
            </div>
            <div className="space-y-4 rounded-lg border border-border/70 bg-card p-4">
              <div>
                <p className="mb-2 text-sm font-medium">Difficulty</p>
                <div className="grid grid-cols-2 gap-2">
                  {LEVELS.map((l) => (
                    <Button
                      key={l.skill}
                      variant={level === l.skill ? "default" : "outline"}
                      onClick={() => setLevel(l.skill)}
                      type="button"
                      className="h-auto py-2 text-left"
                    >
                      <span className="flex flex-col">
                        <span>{l.label}</span>
                        <span className="text-xs opacity-70">{l.eloLabel}</span>
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleReset}>Reset</Button>
                <Button
                  variant="outline"
                  onClick={handleTakeback}
                  disabled={waiting || moveHistory.length < 1}
                >
                  Take Back
                </Button>
              </div>
              <Button variant="outline" asChild className="w-full">
                <a href={lichessAnalysisUrl} target="_blank" rel="noreferrer">
                  Analyze on Lichess
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Play against Stockfish at different levels. The higher the level, the stronger the play.
              </p>
              <div className="text-sm">
                {waiting && <span className="text-primary">Stockfish is thinking...</span>}
                {status && <span className="text-red-500">{status}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
