import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Github } from "lucide-react"
import { ChessBoard } from "@/components/chess-board"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-primary/10 to-background">
      {/* Hero Section with ChessBoard background */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute -top-24 -left-24 opacity-10 pointer-events-none">
          <ChessBoard size={260} />
        </div>
        <div className="absolute -bottom-24 -right-24 opacity-10 pointer-events-none">
          <ChessBoard size={260} />
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center text-primary flex items-center gap-3">
            <span>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="inline-block text-primary">
                <path d="M12 2L8 6H16L12 2Z" fill="currentColor" />
                <circle cx="12" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            About chesstools.org
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-2xl">
            A project made for chess players by chess players
          </p>
        </div>
      </section>

      {/* Main Content in Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center gap-2">
              <span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-lg">
                Welcome to <Link href="https://chesstools.org" className="text-blue-600 dark:text-blue-400 hover:underline">chesstools.org</Link> — built for the chess community.
              </p>
              <p>
                Our goal is to provide useful tools for chess enthusiasts, coaches, and players of all levels. 
                By offering accessible, easy-to-use tools, we hope to contribute 
                to chess analysis, teaching, and enjoyment.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center gap-2">
              <span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M12 2L8 6H16L12 2Z" fill="currentColor" />
                  <circle cx="12" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <CardTitle>Who We Are</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">♟️</span>
                  Built by experienced chess players and developers. 
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">♟️</span>
                  Open-source project with no profit motive.
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">♟️</span>
                  Dedicated to advancing chess technology and accessibility for the world.
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">♟️</span>
                  Community-driven with welcome contributions.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Image Section */}
        <Card className="w-full overflow-hidden mb-12 border border-gray-200 dark:border-gray-800">
          <div className="relative aspect-video w-full">
            <Image 
              src="/images/toronto-rapid.jpg" 
              alt="Chess board visualization" 
              fill 
              className="object-cover transition-transform hover:scale-[1.02] duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            />
          </div>
        </Card>

        {/* Infrastructure & Contribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center gap-2">
              <span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <CardTitle>Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p>
                The application is hosted on a Linux 22.0 server running Docker. Our main costs are infrastructure costs and we appreciate any support.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center gap-2">
              <span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M12 2L8 6H16L12 2Z" fill="currentColor" />
                </svg>
              </span>
              <CardTitle>Contribute</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Have ideas for improvements or want to contribute to the project?
              </p>
              <Link 
                href="https://github.com/Hart-House-Chess-Club/chesstools"
                className="inline-flex items-center px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <Github className="mr-2 h-5 w-5" />
                Visit our GitHub
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center gap-2 text-center">
              <span className="mx-auto">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
              <CardTitle className="text-center w-full">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-lg mb-4">
                Have questions, suggestions, or feedback about our chess tools?
              </p>
              <p className="mb-6">
                We&apos;d love to hear from you! Send us an email and we&apos;ll get back to you as soon as possible.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Link 
                  href="mailto:info@chesstools.org"
                  className="inline-flex items-center px-8 py-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg font-medium"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  info@chesstools.org
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We typically respond within 24-48 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore More Chess Tools?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover our collection of chess tools designed to help you analyze, learn, and grow as a chess player.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/">Back to Homepage</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
