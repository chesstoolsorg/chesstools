"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type RatingEstimatorVariant = "cfc" | "fide";

function validateInput(
  rOld: number,
  rHigh: number,
  rOthers: string,
  score: number,
  games: number
): string[] {
  const errs: string[] = [];
  if (!rOld || rOld < 200 || rOld > 3000) {
    errs.push("Your current rating must be between 200 and 3000.");
  }
  if (rHigh && (rHigh < 200 || rHigh > 3000)) {
    errs.push("Your lifetime highest rating must be between 200 and 3000.");
  }
  const ratings = rOthers.match(/\d+/g)?.map(Number) ?? [];
  if (ratings.length < 1) {
    errs.push("At least one opponent rating is required.");
  } else {
    if (Math.min(...ratings) < 200) errs.push("Opponent ratings must be ≥ 200.");
    if (Math.max(...ratings) > 3000) errs.push("Opponent ratings must be ≤ 3000.");
  }
  if (score < 0) {
    errs.push("Your score must be ≥ 0.");
  } else if (score > games) {
    errs.push("Your score must be ≤ number of games.");
  }
  return errs;
}

function calcExpectedResultCFC(rPlayer: number, rOpponent: number): number {
  const diffToExpected = [
    [0, 3, 0.5, 0.5], [4, 10, 0.51, 0.49], [11, 17, 0.52, 0.48], [18, 25, 0.53, 0.47],
    [26, 32, 0.54, 0.46], [33, 39, 0.55, 0.45], [40, 46, 0.56, 0.44], [47, 53, 0.57, 0.43],
    [54, 61, 0.58, 0.42], [62, 68, 0.59, 0.41], [69, 76, 0.6, 0.4], [77, 83, 0.61, 0.39],
    [84, 91, 0.62, 0.38], [92, 98, 0.63, 0.37], [99, 106, 0.64, 0.36], [107, 113, 0.65, 0.35],
    [114, 121, 0.66, 0.34], [122, 129, 0.67, 0.33], [130, 137, 0.68, 0.32], [138, 145, 0.69, 0.31],
    [146, 153, 0.7, 0.3], [154, 162, 0.71, 0.29], [163, 170, 0.72, 0.28], [171, 179, 0.73, 0.27],
    [180, 188, 0.74, 0.26], [189, 197, 0.75, 0.25], [198, 206, 0.76, 0.24], [207, 215, 0.77, 0.23],
    [216, 225, 0.78, 0.22], [226, 235, 0.79, 0.21], [236, 245, 0.8, 0.2], [246, 256, 0.81, 0.19],
    [257, 267, 0.82, 0.18], [268, 278, 0.83, 0.17], [279, 290, 0.84, 0.16], [291, 302, 0.85, 0.15],
    [303, 315, 0.86, 0.14], [316, 328, 0.87, 0.13], [329, 344, 0.88, 0.12], [345, 357, 0.89, 0.11],
    [358, 374, 0.9, 0.1], [375, 391, 0.91, 0.09], [392, 411, 0.92, 0.08], [412, 432, 0.93, 0.07],
    [433, 456, 0.94, 0.06], [457, 484, 0.95, 0.05], [485, 517, 0.96, 0.04], [518, 559, 0.97, 0.03],
    [560, 619, 0.98, 0.02], [620, 734, 0.99, 0.01], [735, 999999, 1.0, 0.0],
  ];
  const rDiff = Math.abs(rOpponent - rPlayer);
  for (const [low, high, highExp, lowExp] of diffToExpected) {
    if (rDiff >= low && rDiff <= high) {
      return rPlayer > rOpponent ? highExp : lowExp;
    }
  }
  return rPlayer > rOpponent ? 1.0 : 0.0;
}

function calcExpectedResultFIDE(rPlayer: number, rOpponent: number): number {
  return 1 / (1 + Math.pow(10, (rOpponent - rPlayer) / 400));
}

function parseFideOpponents(input: string) {
  const regex = /([+=-]?)(\d{3,4})/g;
  const matches = Array.from(input.matchAll(regex));
  return matches.map(([, result, rating]) => ({
    result: result || "",
    rating: parseInt(rating, 10),
  }));
}

interface RatingResult {
  rPerf: number | null;
  rBeforeBonus: number | null;
  bonusReg: number;
  bonusLife: number;
  rNew: number;
  delta: number;
  totalExpected?: string;
  totalScore?: number;
}

function estimateRatingCFC(
  rOld: number,
  rHigh: number,
  rOthers: string,
  score: number
): RatingResult {
  const rOpponents = rOthers.match(/\d+/g)?.map(Number) ?? [];
  const games = rOpponents.length;
  const expected = rOpponents.map((r) => calcExpectedResultCFC(rOld, r));
  const expectedScore = expected.reduce((tot, val) => tot + val, 0.0);
  const k = rOld >= 2199 ? 16 : 32;
  let rNew = rOld + k * (score - expectedScore);

  const rOppAvg = rOpponents.reduce((tot, r) => tot + r, 0) / games;
  const winsMinusLosses = score - (games - score);
  const rPerf = Math.round(rOppAvg + (400 * winsMinusLosses) / games);

  if (rOld < 2199 && rNew > 2199) {
    rNew = rNew - (rNew - 2199) / 2;
  }
  if (rOld >= 2199 && rNew < 2199) {
    rNew = rNew - (2199 - rNew) / 2;
  }

  let bonusReg = 0,
    bonusLife = 0;
  const rBeforeBonus = Math.round(rNew);
  if (games >= 4) {
    const RMaxBonus = 20;
    const RChangeBonus = 1.75;
    const RChangeThreshold = 13;
    const kUnder2200 = 32;
    const Ke = k / kUnder2200;
    const Threshold = RChangeThreshold * Ke * Math.sqrt(games);
    const a = rNew > rHigh ? 1 : 0;
    const b = rNew > rOld + Threshold ? 1 : 0;
    bonusLife = Math.round(a * RMaxBonus * Ke);
    bonusReg = Math.round(b * RChangeBonus * (rNew - rOld - Threshold) * Ke);
    rNew = rNew + bonusReg + bonusLife;
  }
  rNew = Math.round(rNew);

  return {
    rPerf,
    rBeforeBonus,
    bonusReg,
    bonusLife,
    rNew,
    delta: rNew - rOld,
  };
}

const titles: Record<RatingEstimatorVariant, string> = {
  cfc: "Canada (CFC) ratings estimator",
  fide: "FIDE ratings estimator",
};

export function RatingEstimator({ variant }: { variant: RatingEstimatorVariant }) {
  const ratingSystem = variant;
  const [rOld, setROld] = useState<number>(1500);
  const [rHigh, setRHigh] = useState<number>(3000);
  const [rOthers, setROthers] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [kFide, setKFide] = useState<number>(20);
  const [results, setResults] = useState<RatingResult | null>(null);
  const [fideBreakdown, setFideBreakdown] = useState<
    {
      game: number;
      rOld: number;
      opponent: number;
      expected: string;
      actual: number;
      rNew: number;
    }[]
  >([]);
  const [errors, setErrors] = useState<string[]>([]);
  const games = rOthers.match(/\d+/g)?.length ?? 0;

  function handleEstimate(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateInput(rOld, rHigh, rOthers, score, games);
    if (errs.length > 0) {
      setErrors(errs);
      setResults(null);
      setFideBreakdown([]);
      return;
    }
    setErrors([]);
    if (ratingSystem === "cfc") {
      setResults(estimateRatingCFC(rOld, rHigh, rOthers, score));
      setFideBreakdown([]);
    } else {
      const opps = parseFideOpponents(rOthers);
      let rCurrent = rOld;
      const breakdown = [];
      let totalExpected = 0;
      let totalScore = 0;
      for (let i = 0; i < opps.length; ++i) {
        const opp = opps[i];
        const expected = calcExpectedResultFIDE(rCurrent, opp.rating);
        let actual = 0;
        if (opp.result === "+") actual = 1;
        else if (opp.result === "=") actual = 0.5;
        else if (opp.result === "-") actual = 0;
        else actual = i < score ? 1 : 0;
        const rNew = rCurrent + kFide * (actual - expected);
        breakdown.push({
          game: i + 1,
          rOld: Math.round(rCurrent),
          opponent: opp.rating,
          expected: expected.toFixed(2),
          actual,
          rNew: Math.round(rNew),
        });
        rCurrent = rNew;
        totalExpected += expected;
        totalScore += actual;
      }
      setFideBreakdown(breakdown);
      setResults({
        rPerf: null,
        rBeforeBonus: null,
        bonusReg: 0,
        bonusLife: 0,
        rNew: Math.round(rCurrent),
        delta: Math.round(rCurrent) - rOld,
        totalExpected: totalExpected.toFixed(2),
        totalScore,
      });
    }
  }

  const peerHref = variant === "cfc" ? "/estimator/fide" : "/estimator/canada";
  const peerLabel = variant === "cfc" ? "FIDE estimator" : "Canada (CFC) estimator";

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-2 text-center">{titles[variant]}</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Looking for the other system?{" "}
        <Link href={peerHref} className="font-medium text-primary underline underline-offset-4 hover:no-underline">
          Open the {peerLabel}
        </Link>
        .
      </p>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <form className="space-y-5 p-2 sm:p-4" onSubmit={handleEstimate}>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[180px] mb-4">
                <label className="block text-sm font-medium mb-1">Your current rating:</label>
                <Input
                  className="input input-bordered w-full mt-1"
                  type="number"
                  min={200}
                  max={3000}
                  value={rOld}
                  onChange={(e) => setROld(Number(e.target.value))}
                />
              </div>
              {ratingSystem === "cfc" && (
                <div className="flex-1 min-w-[180px] mb-4">
                  <label className="block text-sm font-medium mb-1">Your lifetime highest rating:</label>
                  <Input
                    className="input input-bordered w-full mt-1"
                    type="number"
                    min={200}
                    max={3000}
                    value={rHigh}
                    onChange={(e) => setRHigh(Number(e.target.value))}
                  />
                  <div className="text-xs text-muted-foreground">If unknown, set to a high number (3000).</div>
                </div>
              )}
              {ratingSystem === "fide" && (
                <div className="flex-1 min-w-[180px] mb-4">
                  <label className="block text-sm font-medium mb-1">K-factor:</label>
                  <div>
                    <Select value={kFide.toString()} onValueChange={(value) => setKFide(Number(value))}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="K-factor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="40">40 (new players, &lt;30 games)</SelectItem>
                        <SelectItem value="20">20 (active, &lt;2400)</SelectItem>
                        <SelectItem value="10">10 (≥2400 and established)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-xs text-muted-foreground">Choose the K-factor appropriate for your FIDE status.</div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your opponent ratings:</label>
              <Textarea
                className="w-full mt-1"
                rows={2}
                value={rOthers}
                onChange={(e) => setROthers(e.target.value)}
                placeholder={ratingSystem === "fide" ? "e.g. +1800 -1700 =1600" : "e.g. 1800 1700 1600"}
              />
              <div className="text-xs text-muted-foreground">
                {ratingSystem === "fide"
                  ? "Enter ratings as +2000 -1000 =2320 with + wins, - losses, = draws."
                  : "Enter just their ratings (separated by spaces or commas)"}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-end mb-4">
              {ratingSystem === "cfc" && (
                <div className="mb-4">
                  Your score:
                  <Input
                    className="input input-bordered w-24 mt-1"
                    type="number"
                    min={0}
                    max={games}
                    step={0.5}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                  />
                </div>
              )}
              <div className="mb-4">
                Games played:
                <Input className="input input-bordered w-20 mt-1" type="text" value={games} disabled />
              </div>
              <Button type="submit" variant="secondary" className="mb-4 ml-2">
                Estimate
              </Button>
            </div>
            {errors.length > 0 && (
              <div className="bg-red-100 text-red-700 rounded p-3 mt-4">
                <ul className="list-disc pl-5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            {results && ratingSystem === "cfc" && (
              <div className="mt-6">
                <table className="table-auto w-full text-sm ratings-calc">
                  <tbody>
                    <tr>
                      <td className="font-semibold text-right w-1/3">
                        {score} / {games}
                      </td>
                      <td>Your score</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-right">{results.rPerf}</td>
                      <td>Your performance rating</td>
                    </tr>
                    {results.bonusReg > 0 || results.bonusLife > 0 ? (
                      <tr>
                        <td className="font-semibold text-right">{results.rBeforeBonus}</td>
                        <td>
                          Your <i>estimated</i> new rating <i>before bonuses</i>
                        </td>
                      </tr>
                    ) : null}
                    {results.bonusReg > 0 && (
                      <tr>
                        <td className="font-semibold text-right">{results.bonusReg}</td>
                        <td>Regular bonus points</td>
                      </tr>
                    )}
                    {results.bonusLife > 0 && (
                      <tr>
                        <td className="font-semibold text-right">{results.bonusLife}</td>
                        <td>Lifetime high bonus points</td>
                      </tr>
                    )}
                    <tr className="bg-green-100">
                      <td className="font-semibold text-right">{results.rNew}</td>
                      <td>
                        Your <i>estimated</i> new rating
                      </td>
                    </tr>
                    <tr>
                      <td className="text-right text-xs">
                        ({results.delta > 0 ? "+" : ""}
                        {results.delta})
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {results && ratingSystem === "fide" && (
              <div className="mt-6">
                <div className="mb-2 font-semibold">FIDE per-game calculation:</div>
                <div className="mb-4 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">Game</TableHead>
                        <TableHead className="text-right">Old</TableHead>
                        <TableHead className="text-right">Opponent</TableHead>
                        <TableHead className="text-right">Expected Win %</TableHead>
                        <TableHead className="text-right">Result</TableHead>
                        <TableHead className="text-right">New</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fideBreakdown.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-center">{row.game}</TableCell>
                          <TableCell className="text-center">{row.rOld}</TableCell>
                          <TableCell className="text-center">{row.opponent}</TableCell>
                          <TableCell className="text-center">{row.expected}</TableCell>
                          <TableCell className="text-center">{row.actual}</TableCell>
                          <TableCell className="text-center">{row.rNew}</TableCell>
                          <TableCell className="text-center">{row.rNew - row.rOld}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="m-6 text-sm">
                  <b>Final FIDE rating:</b> {results.rNew} ({results.delta > 0 ? "+" : ""}
                  {results.delta})<br />
                  <b>Total expected score:</b> {results.totalExpected}
                </div>
              </div>
            )}
            <div className="ml-4 mt-4 text-xs text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  This is only an <i>estimate</i> of your new rating.
                </li>
                <li>
                  Your final rating may differ for many reasons but especially if you played provisionally rated or unrated
                  opponents.
                </li>
                <li>
                  {ratingSystem === "cfc" ? (
                    <>
                      Calculations are based on section 414 of the CFC Handbook. See{" "}
                      <a
                        href="https://www.chess.ca/en/cfc/rules/cfc-handbook-2014/#section-4---cfc-rating-system--fide-rated-events"
                        className="underline text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LINK
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      FIDE rating calculations use the official FIDE formula. See{" "}
                      <a
                        href="https://handbook.fide.com/chapter/B022024"
                        className="underline text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        FIDE Handbook
                      </a>
                      .
                    </>
                  )}
                </li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground text-center mt-4 mb-8 sm:mb-14">
        Estimate your new {ratingSystem === "cfc" ? "Canadian Chess Federation (CFC)" : "FIDE"} rating based on your results and
        opponents.
      </p>
    </div>
  );
}
