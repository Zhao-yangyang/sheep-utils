"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { useState } from "react"

interface ExifData {
  Make: string
  Model: string
  DateTime: string
  ExposureTime: string
  FNumber: string
  ISO: string
}

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
          {exifData && (
            <div className="absolute bottom-0 left-0 bg-white p-2 text-sm">
              <p>相机: {exifData.Make} {exifData.Model}</p>
              <p>拍摄时间: {exifData.DateTime}</p>
              <p>曝光时间: {exifData.ExposureTime}</p>
              <p>光圈: f/{exifData.FNumber}</p>
              <p>ISO: {exifData.ISO}</p>
            </div>
          )}
        </div>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}