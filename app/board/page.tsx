import ChessBoardEditor from "@/components/ChessBoardEditor"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ChessBoard() {
  return (
    <div className="mx-auto mt-8 w-full max-w-6xl px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Interactive Chess Board</h1>
      <Card className="w-full mx-auto">
        <CardHeader></CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="w-full">
            <ChessBoardEditor />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Select a piece from the top bar and click on the board to place it. Drag and drop pieces to move them. Use
            the buttons below to clear or reset the board.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

