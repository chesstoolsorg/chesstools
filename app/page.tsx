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
                  <Link href="/estimator">Estimate ratings</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="https://api.chesstools.org">Ratings API</Link>
                </Button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-border/60 bg-background/80 p-4 text-center shadow-sm backdrop-blur"
                  >
                    <div className="text-2xl font-semibold text-foreground">{metric.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
                  </div>
                ))}
              </div>
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
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 to-background py-20">
        <div className="absolute -top-24 -left-24 opacity-10">
          <ChessBoard size={300} />
        </div>
        <div className="absolute -bottom-24 -right-24 opacity-10">
          <ChessBoard size={300} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                Welcome to <span className="text-primary">chesstools.org</span>
              </h1>
              <p className="text-xl mb-8 text-muted-foreground max-w-2xl">
                Powerful tools for chess players, coaches, and tournament
                organizers to analyze, visualize, and improve your chess
                experience.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button size="lg" asChild>
                  <Link href="/board">Create Games</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/generator">Convert FEN to PNG</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link href="/analysis">Analyze Games</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/estimator">Estimate Ratings</Link>
                </Button>
                <Button size="lg">
                  <Link href="https://api.chesstools.org">Ratings API</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <ChessPieces className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Chess Tools at Your Fingertips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 mb-4 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path d="M12 2L8 6H16L12 2Z" fill="currentColor" />
                    <path
                      d="M12 6V10M8 10H16M7 14H17M5 18H19M7 22H17"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <CardTitle>FEN to PNG Converter</CardTitle>
                <CardDescription>
                  Convert Forsyth-Edwards Notation to high-quality chess board
                  images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Generate beautiful chess diagrams from FEN strings for your
                  articles, books, or teaching materials. Download as PNG.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/generator">Try Converter</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 mb-4 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M2 8H22M2 14H22M8 2V22M14 2V22"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <CardTitle>Interactive Board</CardTitle>
                <CardDescription>
                  Create positions and copy FEN positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Set up positions from the initial starting position, start
                  with no pieces, or add new pieces.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/board">Open Board</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 mb-4 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M12 2V6M12 22V18M4.93 4.93L7.76 7.76M19.07 19.07L16.24 16.24M2 12H6M22 12H18M4.93 19.07L7.76 16.24M19.07 4.93L16.24 7.76"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <CardTitle>Analyze</CardTitle>
                <CardDescription>
                  Analyze positions with Stockfish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Generate the best lines for any position either starting from
                  the inital position or from FEN.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="analysis">Analyze</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      {/* Featured Image Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Chess Community
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
              <div className="relative rounded-xl overflow-hidden shadow-xl flex-1 min-w-0 mb-6 md:mb-0">
                <Image
                  src="/images/gh.jpg"
                  alt="Chess Tournament in Toronto"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      Supporting Chess Tournaments Worldwide
                    </h3>
                    <p className="text-white/80 text-sm">
                      Pushing the standard of chess events worldwide
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl flex-1 min-w-0 mb-6 md:mb-0">
                <Image
                  src="/images/touch-move.jpg"
                  alt="Chess players analyzing"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      Improving Analysis of Games
                    </h3>
                    <p className="text-white/80 text-sm">
                      Helping each other learn together
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl flex-1 min-w-0 mb-6 md:mb-0">
                <Image
                  src="/images/chess-zoom.jpg"
                  alt="Zoomed image of chess board"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      Expanding Chess Technology
                    </h3>
                    <p className="text-white/80 text-sm">
                      For players of all skill levels
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center mt-6 text-muted-foreground">
              Bringing together chess enthusiasts from Toronto and beyond
            </p>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Improve Your Chess?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore our collection of chess tools designed to help you analyze,
            learn, and grow as a chess player.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/play">Start Playing Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
