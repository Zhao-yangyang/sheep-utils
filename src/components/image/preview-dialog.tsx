"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ZoomIn, ZoomOut, RotateCw, Info } from "lucide-react"
import { useState } from "react"
import type { ExifData } from '@/types/exif';
import { ExifInfoPanel } from "./exif-info-panel"

interface PreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string | null
  exifData?: ExifData
}

export function PreviewDialog({
  open,
  onOpenChange,
  src,
  exifData,
}: PreviewDialogProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showExif, setShowExif] = useState(false)

  if (!src) return null

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg max-h-[90vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>图片预览</DialogTitle>
          <DialogDescription>查看和编辑图片</DialogDescription>
        </DialogHeader>
        <div className="relative h-[80vh] w-full overflow-hidden bg-black/5">
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
            }}
          >
            <Image
              src={src}
              alt="图片预览"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
          {showExif && <ExifInfoPanel exifData={exifData} onClose={() => setShowExif(false)} />}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/50 p-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleRotate}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            {exifData && Object.keys(exifData).length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 relative"
                onClick={() => setShowExif(!showExif)}
              >
                <Info className="h-4 w-4" />
                {showExif && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}