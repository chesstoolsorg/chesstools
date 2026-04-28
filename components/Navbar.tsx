"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Menu, Sparkles } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-muted/80">
          <Image src="/chesstools.svg" alt="Chess Tools" width={118} height={40} className="h-8 w-auto" priority />
          <span className="hidden text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground md:inline">
            Chess tools
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <NavigationMenu className="rounded-full border border-border/60 bg-card/70 px-2 py-1 shadow-sm backdrop-blur">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="rounded-full bg-transparent text-foreground hover:bg-muted hover:text-foreground">
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[260px] gap-3 p-4">
                    <ListItem href="/generator" title="FEN to PNG">
                      Convert FEN notation to PNG images
                    </ListItem>
                    <ListItem href="/board" title="Board">
                      Interactive chess board to generate your own positions
                    </ListItem>
                    <ListItem href="/analysis" title="Analysis">
                      Analyze games with Stockfish
                    </ListItem>
                    <ListItem href="https://gif.chesstools.org/" title="GIF Generator">
                      Generate GIFs from Lichess games
                    </ListItem>
                    <ListItem href="https://api.chesstools.org/docs" title="Ratings API">
                      Retrieve ratings with our API
                    </ListItem>
                    <ListItem href="https://cfc.chesstools.org/" title="CFC Ratings Processor">
                      Process Canadian ratings with latest ratings from the CFC
                    </ListItem>
                    <ListItem href="/estimator" title="Ratings Estimator">
                      Estimate ratings with FIDE and CFC
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/play" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "rounded-full bg-transparent text-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    Play
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "rounded-full bg-transparent text-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
            <div className="mt-8 flex flex-col gap-2">
              <Link href="/board" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Board
              </Link>
              <Link href="/play" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Play
              </Link>
              <Link href="/analysis" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Analysis
              </Link>
              <Link href="/estimator" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Ratings Estimator
              </Link>
              <Link href="/generator" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Board Generator
              </Link>
              <Link href="https://gif.chesstools.org/" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Chess GIF Generator
              </Link>
              <Link href="https://cfc.chesstools.org/" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                CFC Ratings Processor
              </Link>
              <Link href="https://api.chesstools.org/docs" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
                Ratings API
              </Link>
              <Link href="/about" className="rounded-xl px-3 py-2 text-base font-medium transition-colors hover:bg-muted">
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

const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & {
  title: string
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href || "#"}
          className={cn(
            "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export default Navbar

