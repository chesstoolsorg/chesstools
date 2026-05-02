"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/** Matches pill triggers; DropdownMenu has no built-in chevron here. */
const triggerClass = cn(
  navigationMenuTriggerStyle(),
  "h-9 rounded-full bg-transparent px-4 text-foreground hover:bg-muted hover:text-foreground focus:bg-muted data-[state=open]:bg-muted",
)

const pillLinkClass =
  "inline-flex h-9 max-w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"

/** Radix DropdownMenu portals to `body` — width applies reliably (NavigationMenu viewport did not). */
const dropdownPanelClass =
  "z-[200] max-h-[75vh] min-w-[18rem] w-[min(100vw-2rem,24rem)] overflow-y-auto overflow-x-hidden rounded-xl border bg-popover p-2 shadow-xl"

const dropdownPanelWideClass =
  "z-[200] max-h-[75vh] min-w-[20rem] w-[min(100vw-2rem,28rem)] overflow-y-auto overflow-x-hidden rounded-xl border bg-popover p-2 shadow-xl"

function MenuToolLink({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <DropdownMenuItem asChild className="cursor-pointer p-0 focus:bg-transparent">
      <a
        href={href}
        className="flex flex-col gap-1.5 rounded-lg px-3 py-3 text-left outline-none hover:bg-accent hover:text-accent-foreground"
      >
        <span className="text-sm font-semibold leading-snug text-foreground">{title}</span>
        <span className="text-sm leading-relaxed text-muted-foreground">{description}</span>
      </a>
    </DropdownMenuItem>
  )
}

function DropdownToolSection({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <>
      <DropdownMenuLabel className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </DropdownMenuLabel>
      {children}
    </>
  )
}

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-muted/80">
          <Image src="/chesstools.svg" alt="Chess Tools" width={118} height={40} className="h-8 w-auto" priority />
          <span className="hidden text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground md:inline">
            Chess tools
          </span>
        </Link>

        {/* Desktop: DropdownMenu portals to document — full width honored, no NavigationMenu viewport clipping */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-border/60 bg-card/70 px-2 py-1 shadow-sm">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button type="button" className={triggerClass}>
                  Rating tools
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8} collisionPadding={16} className={dropdownPanelClass}>
                <DropdownToolSection label="Data">
                  <MenuToolLink
                    href="https://api.chesstools.org/docs"
                    title="Ratings API"
                    description="FIDE, CFC, and USCF ratings via API"
                  />
                </DropdownToolSection>
                <DropdownMenuSeparator className="my-1" />
                <DropdownToolSection label="Estimators">
                  <MenuToolLink
                    href="/estimator/canada"
                    title="Canada (CFC) ratings estimator"
                    description="CFC rating change from scores and opponent ratings"
                  />
                  <MenuToolLink
                    href="/estimator/fide"
                    title="FIDE ratings estimator"
                    description="Per-game FIDE calculation with K-factor"
                  />
                </DropdownToolSection>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button type="button" className={triggerClass}>
                  Player tools
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8} collisionPadding={16} className={dropdownPanelWideClass}>
                <DropdownToolSection label="Board & diagrams">
                  <MenuToolLink href="/generator" title="FEN to PNG" description="Convert FEN notation to PNG images" />
                  <MenuToolLink
                    href="/board"
                    title="Board"
                    description="Interactive chess board to generate your own positions"
                  />
                </DropdownToolSection>
                <DropdownMenuSeparator className="my-1" />
                <DropdownToolSection label="Study & media">
                  <MenuToolLink href="/analysis" title="Analysis" description="Analyze games with Stockfish" />
                  <MenuToolLink
                    href="https://gif.chesstools.org/"
                    title="GIF Generator"
                    description="Generate GIFs from Lichess games"
                  />
                </DropdownToolSection>
                <DropdownMenuSeparator className="my-1" />
                <DropdownToolSection label="Live">
                  <MenuToolLink
                    href="/live"
                    title="Live claims relay"
                    description="Watch games from Chess Claim Tool over WebSocket (local)"
                  />
                </DropdownToolSection>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button type="button" className={triggerClass}>
                  Arbiters tools
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8} collisionPadding={16} className={dropdownPanelClass}>
                <DropdownToolSection label="Events & ratings">
                  <MenuToolLink
                    href="https://pairings.chesstools.org/"
                    title="Tournament pairings"
                    description="Swiss pairings with JaVaFo for organizers"
                  />
                  <MenuToolLink
                    href="https://cfc.chesstools.org/"
                    title="CFC Ratings Processor"
                    description="Process Canadian tournament CSVs with CFC ratings"
                  />
                </DropdownToolSection>
                <DropdownMenuSeparator className="my-1" />
                <DropdownToolSection label="Claims">
                  <MenuToolLink
                    href="/claims"
                    title="Claim scanner"
                    description="Scan PGN for draw claims via hosted Claim API"
                  />
                </DropdownToolSection>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/play" className={pillLinkClass}>
              Play
            </Link>
            <Link href="/about" className={pillLinkClass}>
              About
            </Link>
          </div>
          <Button asChild className="rounded-full shadow-sm">
            <Link href="/analysis">
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="rounded-full border-border/70 bg-background shadow-sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background/95 backdrop-blur-xl">
            <div className="mt-8 flex flex-col gap-1">
              <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating tools</p>
              <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">Data</p>
              <Link href="https://api.chesstools.org/docs" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Ratings API
              </Link>
              <p className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">Estimators</p>
              <Link href="/estimator/canada" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Canada (CFC) ratings estimator
              </Link>
              <Link href="/estimator/fide" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                FIDE ratings estimator
              </Link>

              <p className="px-3 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Player tools</p>
              <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">Board & diagrams</p>
              <Link href="/generator" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Board Generator
              </Link>
              <Link href="/board" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Board
              </Link>
              <p className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">Study & media</p>
              <Link href="/play" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Play
              </Link>
              <Link href="/analysis" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Analysis
              </Link>
              <Link href="https://gif.chesstools.org/" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Chess GIF Generator
              </Link>
              <p className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">Live</p>
              <Link href="/live" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Live claims relay
              </Link>

              <p className="px-3 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Arbiters tools</p>
              <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">Events & ratings</p>
              <Link href="https://pairings.chesstools.org/" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Tournament pairings
              </Link>
              <Link href="https://cfc.chesstools.org/" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                CFC Ratings Processor
              </Link>
              <p className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">Claims</p>
              <Link href="/claims" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Claim scanner
              </Link>

              <Link href="/about" className="mt-2 rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                About
              </Link>
              <Button asChild className="mt-4 rounded-full">
                <Link href="/analysis">Launch analysis</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

export default Navbar
