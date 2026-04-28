'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";

// import Chess from 'chess.js';
import { Chess, Square } from 'chess.js';

import dynamic from "next/dynamic";
import useStockfish from "./stockfish/engine";

const Chessboard = dynamic(
  () => import("react-chessboard").then((mod) => mod.Chessboard),
  { ssr: false }
);

export  default function AnalysisBoard() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [boardWidth, setBoardWidth] = useState<number>(480);

  // Compute responsive board width based on container width and viewport height
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
  const { evaluatePosition, stop, onMessage } = useStockfish();
    const game = useMemo(() => new Chess(), []);
    const inputRef = useRef<HTMLInputElement>(null);
    const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
    const [positionEvaluation, setPositionEvaluation] = useState(0);
    const [depth, setDepth] = useState(10);
    const [bestLine, setBestline] = useState("");
    const [possibleMate, setPossibleMate] = useState("");
    const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
    const lichessAnalysisUrl = game.pgn().trim()
      ? `https://lichess.org/analysis/pgn/${encodeURIComponent(game.pgn())}`
      : `https://lichess.org/analysis/${chessBoardPosition.replaceAll(" ", "_")}`;
  
    const findBestMove = useCallback(() => {
      evaluatePosition(chessBoardPosition, 18);
      onMessage(({ positionEvaluation, possibleMate, pv, depth }) => {
        if (depth && depth < 10) return;
  
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        positionEvaluation &&
          setPositionEvaluation(
            ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
          );

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        possibleMate && setPossibleMate(possibleMate);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        depth && setDepth(depth);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        pv && setBestline(pv);
      });
    }, [chessBoardPosition, evaluatePosition, onMessage, game]);

    // function onDrop(sourceSquare: Square, targetSquare: Square, piece: string) {
      function applyMove(sourceSquare: Square, targetSquare: Square, promotion: "q" | "r" | "b" | "n" = "q") {
        console.log("[analysis] applyMove", { sourceSquare, targetSquare, promotion, fenBefore: game.fen() });
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion,
        });

        // illegal move
        if (move === null) {
          console.log("[analysis] move rejected", { sourceSquare, targetSquare, promotion });
          return false;
        }

        setPossibleMate("");
        setChessBoardPosition(game.fen());
        stop();
        setBestline("");

        if (game.game_over() || game.in_draw()) return false;

        return true;
      }

      function onDrop(sourceSquare: Square, targetSquare: Square) {
        const movingPiece = game.get(sourceSquare);
        const promotionRank = movingPiece?.color === "w" ? "8" : "1";
        const isPromotionMove = movingPiece?.type === "p" && targetSquare.endsWith(promotionRank);
        console.log("[analysis] onDrop", {
          sourceSquare,
          targetSquare,
          movingPiece,
          promotionRank,
          isPromotionMove,
        });
        if (isPromotionMove) {
          setPendingPromotion({ from: sourceSquare, to: targetSquare });
          console.log("[analysis] promotion pending", { from: sourceSquare, to: targetSquare });
          return false;
        }
        return applyMove(sourceSquare, targetSquare);
      }

      function onPromotionPieceSelect(piece?: string, promoteFromSquare?: Square, promoteToSquare?: Square) {
        console.log("[analysis] onPromotionPieceSelect", {
          piece,
          promoteFromSquare,
          promoteToSquare,
          pendingPromotion,
        });
        const candidate = piece?.length === 1 ? piece : piece?.[1];
        const normalized = candidate?.toLowerCase();
        const promotion = (normalized === "q" || normalized === "r" || normalized === "b" || normalized === "n" ? normalized : "q") as "q" | "r" | "b" | "n";
        console.log("[analysis] parsed promotion", { piece, candidate, normalized, promotion });

        const from = promoteFromSquare ?? pendingPromotion?.from;
        const to = promoteToSquare ?? pendingPromotion?.to;
        if (!from || !to) {
          console.log("[analysis] promotion squares missing", { from, to, pendingPromotion });
          return false;
        }

        const didMove = applyMove(from, to, promotion);
        setPendingPromotion(null);
        console.log("[analysis] promotion result", { didMove, fenAfter: game.fen() });
        return didMove;
      }
    
      useEffect(() => {
        if (!game.game_over() || game.in_draw()) {
          findBestMove();
        }
      }, [chessBoardPosition, findBestMove, game]);
    
      const bestMove = bestLine?.split(" ")?.[0];
      const handleFenInputChange = (e: { target: { value: string; }; }) => {
        const { valid } = game.validate_fen(e.target.value);
    
        if (valid && inputRef.current) {
          inputRef.current.value = e.target.value;
          game.load(e.target.value);
          setChessBoardPosition(game.fen());
        }
      };
      return (
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div ref={containerRef} className="flex justify-center lg:justify-start">
              <Chessboard
                id="AnalysisBoard"
                position={chessBoardPosition}
                onPieceDrop={onDrop}
                boardWidth={boardWidth}
                onBoardWidthChange={setBoardWidth}
                promotionToSquare={pendingPromotion?.to}
                onPromotionPieceSelect={onPromotionPieceSelect}
                customBoardStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 6px 20px rgba(2,6,23,0.2)",
                }}
                customArrows={
                  bestMove
                    ? [
                        [
                          bestMove.substring(0, 2) as Square,
                          bestMove.substring(2, 4) as Square,
                          "rgb(0, 128, 0)",
                        ],
                      ]
                    : undefined
                }
              />
            </div>
            <div className="space-y-4 rounded-lg border border-border/70 bg-card p-4">
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <p className="font-medium">
                  Position Evaluation: {possibleMate ? `#${possibleMate}` : positionEvaluation}
                </p>
                <p className="text-muted-foreground">Depth: {depth}</p>
              </div>
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <p className="font-medium">Best line</p>
                <p className="text-muted-foreground">{bestLine ? `${bestLine.slice(0, 60)} ...` : "Calculating..."}</p>
              </div>
              <input
                ref={inputRef}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={handleFenInputChange}
                placeholder="Paste FEN to analyze a custom position"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                  onClick={() => {
                    setPossibleMate("");
                    setBestline("");
                    game.reset();
                    setChessBoardPosition(game.fen());
                    setPendingPromotion(null);
                  }}
                >
                  Reset
                </button>
                <button
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                  onClick={() => {
                    setPossibleMate("");
                    setBestline("");
                    game.undo();
                    setChessBoardPosition(game.fen());
                    setPendingPromotion(null);
                  }}
                >
                  Undo
                </button>
              </div>
              <a
                href={lichessAnalysisUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-input bg-background px-3 py-2 text-center text-sm transition-colors hover:bg-muted"
              >
                Analyze on Lichess
              </a>
            </div>
          </div>
        </div>
      );
    };
    