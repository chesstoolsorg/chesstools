import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-4 text-4xl font-bold text-primary">Privacy</h1>
        <p className="mb-6 text-muted-foreground">
          ChessTools respects your privacy. We keep data collection minimal and only use information needed to operate and improve
          the website.
        </p>

        <div className="space-y-5 text-sm leading-7 text-foreground/90">
          <p>
            We may use basic analytics to understand site traffic and improve tool reliability. We do not sell personal information.
          </p>
          <p>
            If you contact us by email, we use your message details only to respond and provide support related to ChessTools.
          </p>
          <p>
            For privacy questions or data requests, email{" "}
            <Link href="mailto:info@chesstools.org" className="text-primary hover:underline">
              info@chesstools.org
            </Link>
            .
          </p>
          <p className="text-muted-foreground">This page may be updated as ChessTools evolves.</p>
        </div>
      </section>
    </div>
  )
}
