import ChessBoardImage from '@/components/ChessBoardImage'
import { Card, CardContent } from "@/components/ui/card"

interface GeneratorPageProps {
  searchParams?: Promise<{
    fen?: string
  }>
}

export default async function GeneratorPage({ searchParams }: GeneratorPageProps) {
  const resolvedSearchParams = await searchParams
  const initialFen = resolvedSearchParams?.fen
  return (
    <div className="mx-auto mt-8 w-full max-w-6xl px-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Chess Board Generator</h1>
      <Card className="w-full mx-auto">
        <CardContent className="space-y-6 p-4 sm:p-6">
          <p className="text-center text-sm text-muted-foreground">
            Generate a chess board image from a FEN (Forsyth-Edwards Notation) string.
          </p>
          <div className="w-full">
            <ChessBoardImage initialFen={initialFen} />
          </div>
        </CardContent>
      </Card>
      <p className="mb-10 mt-4 text-center text-sm text-muted-foreground">
        Paste a position, generate the image, then download it as a PNG.
      </p>
    </div>
  )
}

