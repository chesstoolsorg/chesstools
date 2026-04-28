'use client';

import { useMemo, useState, useEffect, useRef } from "react";

// import Chess from 'chess.js';
import { Chess, PieceColor, PieceType, Square } from 'chess.js';
import { SparePiece } from "react-chessboard";

import dynamic from "next/dynamic";

const ChessboardDnDProvider = dynamic(
  () => import("react-chessboard").then((mod) => mod.ChessboardDnDProvider),
  { ssr: false }
);

const Chessboard = dynamic(
  () => import("react-chessboard").then((mod) => mod.Chessboard),
  { ssr: false }
);

type Pc = "wP" | "wN" | "wB" | "wR" | "wQ" | "wK" | "bP" | "bN" | "bB" | "bR" | "bQ" | "bK"

export default function ChessBoardEditor() {
  const game = useMemo(() => new Chess("8/8/8/8/8/8/8/8 w - - 0 1"), []); // empty board
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
  const [boardWidth, setBoardWidth] = useState(360);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function update() {
      const padding = 24;
      const containerWidth = containerRef.current?.clientWidth ?? window.innerWidth;
      const ideal = Math.min(containerWidth - padding, Math.floor(window.innerHeight * 0.62), 620);
      setBoardWidth(Math.max(260, ideal));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const [fenPosition, setFenPosition] = useState(game.fen());
  const lichessAnalysisUrl = `https://lichess.org/analysis/${game.fen().replaceAll(" ", "_")}`;
  const handleSparePieceDrop = (piece: string, targetSquare: Square) => {
    const color = piece[0] as PieceColor;
    const type = piece[1].toLowerCase() as PieceType;
    const success = game.put({
      type,
      color
    }, targetSquare);
    if (success) {
      setFenPosition(game.fen());
    } else {
      alert(`The board already contains ${color === "w" ? "WHITE" : "BLACK"} KING`);
    }
    return success;
  };
  const handlePieceDrop = (sourceSquare: Square, targetSquare: Square, piece: string) => {
    const color = piece[0] as PieceColor;
    const type = piece[1].toLowerCase() as PieceType;

    // this is hack to avoid chess.js bug, which I've fixed in the latest version https://github.com/jhlywa/chess.js/pull/426
    game.remove(sourceSquare);
    game.remove(targetSquare);
    const success = game.put({
      type,
      color
    }, targetSquare);
    if (success) setFenPosition(game.fen());
    return success;
  };
  const handlePieceDropOffBoard = (sourceSquare: Square) => {
    game.remove(sourceSquare);
    setFenPosition(game.fen());
  };
  const handleFenInputChange = (e: { target: { value: string; }; }) => {
    const fen = e.target.value;
    const {
      valid
    } = game.validate_fen(fen);
    setFenPosition(fen);
    if (valid) {
      game.load(fen);
      setFenPosition(game.fen());
    }
  };
  const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
  return <div className="mx-auto w-full max-w-6xl">
      <ChessboardDnDProvider>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div ref={containerRef} className="flex justify-center lg:justify-start">
            <Chessboard
              onBoardWidthChange={setBoardWidth}
              boardWidth={boardWidth}
              id="ManualBoardEditor"
              boardOrientation={boardOrientation}
              position={game.fen()}
              onSparePieceDrop={handleSparePieceDrop}
              onPieceDrop={handlePieceDrop}
              onPieceDropOffBoard={handlePieceDropOffBoard}
              dropOffBoardAction="trash"
              customBoardStyle={{
                borderRadius: "8px",
                boxShadow: "0 6px 20px rgba(2,6,23,0.12)",
              }}
            />
          </div>
          <div className="space-y-4 rounded-lg border border-border/70 bg-card p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Black pieces</p>
              <div className="flex flex-wrap gap-2 rounded-md bg-muted/50 p-2">
                {pieces.slice(6, 12).map((piece) => {
                  const color = piece[0] as PieceColor;
                  const type = piece[1].toLowerCase() as PieceType;
                  const formattedPiece = `${color}${type.toUpperCase()}` as Pc;
                  return <SparePiece key={piece} piece={formattedPiece} width={40} dndId="ManualBoardEditor" />;
                })}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">White pieces</p>
              <div className="flex flex-wrap gap-2 rounded-md bg-muted/50 p-2">
                {pieces.slice(0, 6).map((piece) => {
                  const color = piece[0] as PieceColor;
                  const type = piece[1].toLowerCase() as PieceType;
                  const formattedPiece = `${color}${type.toUpperCase()}` as Pc;
                  return <SparePiece key={piece} piece={formattedPiece} width={40} dndId="ManualBoardEditor" />;
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <button
                className="rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => {
                  game.reset();
                  setFenPosition(game.fen());
                }}
              >
                Start position
              </button>
              <button
                className="rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => {
                  game.clear();
                  setFenPosition(game.fen());
                }}
              >
                Clear board
              </button>
              <button
                className="rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => {
                  setBoardOrientation(boardOrientation === "white" ? "black" : "white");
                }}
              >
                Flip board
              </button>
              <a
                href={lichessAnalysisUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-input bg-background px-3 py-2 text-center text-sm transition-colors hover:bg-muted"
              >
                Analyze on Lichess
              </a>
            </div>
            <input
              value={fenPosition}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              onChange={handleFenInputChange}
              placeholder="Paste FEN position to start editing"
            />
          </div>
        </div>
      </ChessboardDnDProvider>
    </div>;
}