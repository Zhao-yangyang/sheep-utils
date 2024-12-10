"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  src: string
  className?: string
}

export function ImagePreview({ src, className }: ImagePreviewProps) {
  return (
    <div className={cn("relative aspect-square overflow-hidden", className)}>
      <Image
        src={src}
        alt="Preview"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </div>
  )
}