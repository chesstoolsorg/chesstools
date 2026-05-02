import Image from "next/legacy/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChessPieces } from "@/components/chess-pieces";
import { ChessBoard } from "@/components/chess-board";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, ArrowRight, Trophy, Users, Globe } from "lucide-react";

const toolCards = [
  { title: "Board", description: "Interactive board to build positions", href: "/board", icon: ArrowRight, external: false },
  { title: "Generator", description: "Convert FEN to PNG images", href: "/generator", icon: Sparkles, external: false },
  { title: "Analysis", description: "Analyze games with Stockfish", href: "/analysis", icon: Trophy, external: false },
  {
    title: "Canada (CFC) ratings",
    description: "Estimate CFC rating changes from scores and opponents",
    href: "/estimator/canada",
    icon: Users,
    external: false,
  },
  {
    title: "FIDE ratings",
    description: "Per-game FIDE estimate with optional K-factor",
    href: "/estimator/fide",
    icon: Globe,
    external: false,
  },
];

const showcaseCards = [
  { title: "Tournament", src: "/images/gh.jpg", alt: "Chess Tournament", text: "Supporting chess tournaments worldwide" },
  { title: "Analysis", src: "/images/touch-move.jpg", alt: "Players analyzing", text: "Improving analysis and study sessions" },
  { title: "Share", src: "/images/chess-zoom.jpg", alt: "Board close-up", text: "Generate diagrams and assets" },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <section className="relative isolate overflow-hidden py-20 sm:py-24 lg:py-28">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/35 dark:via-background dark:to-background" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent_88%)]" />
        <div className="absolute -left-24 top-8 opacity-10 md:-left-10">
          <ChessBoard size={300} />
        </div>
        <div className="absolute -bottom-24 -right-24 opacity-10">
          <ChessBoard size={300} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                Modern chess utilities for clubs and players
              </div>
              <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Chess tools that feel
                <span className="text-primary"> fast, polished, and built for real work.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground lg:mx-0 lg:text-xl">
                Create diagrams, analyze games, build positions, and handle ratings with a cleaner interface designed
                to move quickly from idea to output.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/board">
                    Open board
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/generator">Convert FEN to PNG</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link href="/analysis">Analyze games</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/estimator/canada">Canada (CFC) ratings</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/estimator/fide">FIDE ratings</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="https://api.chesstools.org">Ratings API</Link>
                </Button>
              </div>
              {/* metrics removed - not available */}
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[30rem] rounded-[2rem] border border-border/60 bg-background/80 p-6 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="rounded-[1.5rem] bg-gradient-to-br from-muted/80 via-background to-sky-50/70 p-6 dark:from-muted/40 dark:via-background dark:to-sky-950/30">
                  <div className="mx-auto flex aspect-square max-w-[26rem] items-center justify-center">
                    <ChessPieces className="h-full w-full" />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-background/80 p-4 shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Workflow</div>
                      <div className="mt-1 font-semibold">From position to diagram</div>
                    </div>
                    <div className="rounded-2xl bg-background/80 p-4 shadow-sm">
                      <div className="text-sm font-medium text-muted-foreground">Focus</div>
                      <div className="mt-1 font-semibold">No clutter, no dead ends</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Chess tools at your fingertips
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Each tool is built to do one job cleanly, with enough flexibility for players, coaches, organizers, and developers.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {toolCards.map((tool) => {
              const Icon = tool.icon;

              return (
                <Card
                  key={tool.title}
                  className="group h-full border-border/60 bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Designed to stay out of the way while giving you reliable output.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full rounded-full">
                      {tool.external ? (
                        <a href={tool.href}>Open tool</a>
                      ) : (
                        <Link href={tool.href}>Open tool</Link>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-border/60 bg-card/80 p-8 shadow-sm backdrop-blur">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Trophy className="h-4 w-4" />
                Built for chess communities
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                A cleaner way to run tournaments, study games, and share results.
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                The site is tuned for a workflow where organizers, players, and developers need fast access to the same core tools.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4">
                  <Users className="mt-0.5 h-5 w-5 flex-none text-primary" />
                  <div>
                    <div className="font-semibold">For clubs and organizers</div>
                    <div className="text-sm text-muted-foreground">Generate assets, publish ratings, and support your event workflow.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4">
                  <Sparkles className="mt-0.5 h-5 w-5 flex-none text-primary" />
                  <div>
                    <div className="font-semibold">For players and coaches</div>
                    <div className="text-sm text-muted-foreground">Analyze positions and present ideas in a format that looks good anywhere.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {showcaseCards.map((card, index) => (
                <div
                  key={card.title}
                  className={`group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 shadow-sm ${index === 0 ? "sm:col-span-2" : ""}`}
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={index === 0 ? 1400 : 700}
                    height={index === 0 ? 700 : 520}
                    className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="text-2xl font-semibold">{card.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm text-white/80">{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] border border-border/60 bg-primary px-6 py-10 text-primary-foreground shadow-2xl sm:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Ready to improve your chess workflow?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/85">
                Start with the board, move into analysis, or turn a position into a polished asset in a few clicks.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/play">Start playing</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link href="/generator">Make a diagram</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

