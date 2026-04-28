"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/legacy/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ChessBoardImageProps {
  initialFen?: string
}

const ChessBoardImage: React.FC<ChessBoardImageProps> = ({ initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }) => {
  const [fen, setFen] = useState<string>(initialFen)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // Maximum reasonable length for a FEN string
  const MAX_FEN_LENGTH = 100

  useEffect(() => {
    if (initialFen) {
      setFen(initialFen)
      setError(null)
    }
  }, [initialFen])

  const handleFetchImage = async () => {
    setLoading(true)
    setError(null)
    
    // Client-side validation
    if (fen.length > MAX_FEN_LENGTH) {
      setError(`FEN string too long (${fen.length} characters). Maximum allowed is ${MAX_FEN_LENGTH} characters.`)
      setLoading(false)
      return
    }
    
    // Check for obvious non-FEN content
    if (fen.includes(':') || fen.includes('.') || fen.includes('Black') || fen.includes('White')) {
      setError('Please enter a valid FEN string, not a description of the position.')
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch('/api/fen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fen }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to generate chess board image')
      }

      const data = await res.json()
      if (data && data.imagePath) {
        setImageUrl(`${data.imagePath}`)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Function to trigger the image download
  const handleDownloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = imageUrl.split('/').pop() || 'chessboard.png';  // Use the file name from the URL
      link.click();  // Trigger the download
    }
  };

  // Check if the current FEN input is valid for submission
  const isValidForSubmission = () => {
    if (fen.length === 0 || fen.length > MAX_FEN_LENGTH) return false
    if (fen.includes(':') || fen.includes('.') || fen.includes('Black') || fen.includes('White')) return false
    return true
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Generate FEN Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fen-input" className="text-sm font-medium">
            FEN String
          </label>
          <Input
            id="fen-input"
            value={fen}
            onChange={(e) => {
              const newValue = e.target.value
              if (newValue.length <= MAX_FEN_LENGTH) {
                setFen(newValue)
                setError(null) // Clear error when user starts typing valid length
              }
            }}
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            maxLength={MAX_FEN_LENGTH}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Enter a valid FEN string (max {MAX_FEN_LENGTH} characters)
            </p>
            <p className={`text-xs ${fen.length > MAX_FEN_LENGTH * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
              {fen.length}/{MAX_FEN_LENGTH}
            </p>
          </div>
        </div>
        {/* Show validation warnings */}
        {fen.length > 0 && !isValidForSubmission() && (
          <div className="text-amber-600 text-sm">
            {fen.length > MAX_FEN_LENGTH && (
              <p>⚠️ FEN string too long ({fen.length}/{MAX_FEN_LENGTH} characters)</p>
            )}
            {(fen.includes(':') || fen.includes('.') || fen.includes('Black') || fen.includes('White')) && (
              <p>⚠️ This looks like a description, not a FEN string</p>
            )}
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {imageUrl && !loading && (
          <div className="mt-4">
            <Image src={imageUrl} alt="Generated Chess Board" className="w-full h-auto" width={800} height={800} unoptimized/>
            <Button className="mt-5" onClick={handleDownloadImage}>Download Image
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleFetchImage} 
          disabled={loading || !isValidForSubmission()} 
          className="w-full"
        >
          {loading ? "Generating..." : "Generate Chess Board Image"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ChessBoardImage

