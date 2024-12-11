"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { handleError } from "@/lib/error"
import { ErrorMessage } from "@/components/ui/error-message"
import type { AppError } from "@/types/error"

interface DragDropZoneProps {
  onFilesDrop: (files: FileList) => void
  className?: string
}

export function DragDropZone({ onFilesDrop, className }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [error, setError] = useState<AppError | null>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCounter(prev => prev + 1)
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCounter(prev => prev - 1)
    if (dragCounter === 1) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setDragCounter(0)
    setError(null)

    try {
      if (e.dataTransfer.files) {
        onFilesDrop(e.dataTransfer.files)
      }
    } catch (err) {
      const error = handleError(err)
      setError(error)
    }
  }

  return (
    <div className="flex-1">
      {error && (
        <ErrorMessage error={error} />
      )}
      
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed border-gray-300 p-6 transition-all",
          isDragging && "border-primary bg-primary/5 scale-[1.02]",
          error && "border-destructive",
          className
        )}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {isDragging ? "松开鼠标上传图片" : "拖拽图片到这里，或者"}
            </p>
            <input
              type="file"
              id="image"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && onFilesDrop(e.target.files)}
            />
            <label
              htmlFor="image"
              className="cursor-pointer text-sm text-primary hover:underline"
            >
              点击选择图片
            </label>
            <p className="text-xs text-muted-foreground">
              支持 PNG、JPEG、WebP 格式，单个文件不超过10MB
            </p>
            <p className="text-xs text-muted-foreground">
              支持剪贴板粘贴图片 (Ctrl+V)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 