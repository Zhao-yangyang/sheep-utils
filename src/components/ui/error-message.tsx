import { AlertCircle } from "lucide-react"
import type { AppError } from "@/types/error"

interface ErrorMessageProps {
  error: AppError
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
      <AlertCircle className="h-4 w-4 mt-0.5" />
      <div className="space-y-1">
        <p className="font-medium">{error.message}</p>
        {error.details && (
          <p className="text-destructive/80">{error.details}</p>
        )}
        {error.suggestion && (
          <p className="text-destructive/80">{error.suggestion}</p>
        )}
      </div>
    </div>
  )
} 