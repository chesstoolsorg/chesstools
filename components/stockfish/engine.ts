import { useState, useEffect } from "react";

type EngineMessage = {
  uciMessage: string;
  bestMove?: string;
  ponder?: string;
  positionEvaluation?: string;
  possibleMate?: string;
  pv?: string;
  depth?: number;
};

export default function Engine() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamically load the Stockfish worker script
      const stockfishWorker = new Worker("./stockfish.js");
      setWorker(stockfishWorker);

      stockfishWorker.postMessage("uci");
      stockfishWorker.postMessage("isready");

      stockfishWorker.onmessage = (e) => {
        const uciMessage = e.data;
        if (uciMessage === "readyok") {
          setIsReady(true);
        }
      };

      return () => {
        stockfishWorker.terminate(); // Cleanup when component unmounts
      };
    }
  }, []);

  const onMessage = (callback: (messageData: EngineMessage) => void) => {
    if (worker) {
      worker.onmessage = (e) => {
        const messageData = transformSFMessageData(e);
        callback(messageData);
      };
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformSFMessageData = (e: MessageEvent<any>): EngineMessage => {
    const uciMessage = e?.data ?? e;
    return {
      uciMessage,
      bestMove: uciMessage.match(/bestmove\s+(\S+)/)?.[1],
      ponder: uciMessage.match(/ponder\s+(\S+)/)?.[1],
      positionEvaluation: uciMessage.match(/cp\s+(\S+)/)?.[1],
      possibleMate: uciMessage.match(/mate\s+(\S+)/)?.[1],
      pv: uciMessage.match(/ pv\s+(.*)/)?.[1],
      depth: Number(uciMessage.match(/ depth\s+(\S+)/)?.[1]) ?? 0,
    };
  };

  const init = () => {
    if (worker) {
      worker.postMessage("uci");
      worker.postMessage("isready");
    }
  };

  const evaluatePosition = (fen: string, depth = 12) => {
    if (worker) {
      if (depth > 24) depth = 24;
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage(`go depth ${depth}`);
    }
  };

  const setStrength = (skill: number, elo?: number) => {
    if (!worker) return;
    const normalizedSkill = Math.max(0, Math.min(20, skill));
    worker.postMessage(`setoption name Skill Level value ${normalizedSkill}`);
    if (elo) {
      worker.postMessage("setoption name UCI_LimitStrength value true");
      worker.postMessage(`setoption name UCI_Elo value ${elo}`);
    } else {
      worker.postMessage("setoption name UCI_LimitStrength value false");
    }
  };

  const stop = () => {
    if (worker) {
      worker.postMessage("stop");
    }
  };

  const terminate = () => {
    if (worker) {
      worker.postMessage("quit");
    }
    setIsReady(false);
  };

  return { isReady, onMessage, evaluatePosition, stop, terminate, init, setStrength };
}
