"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ExifData } from '@/types/exif';

interface ImagePreviewProps {
  src: string
  className?: string
  exifData?: ExifData 
}

export function ImagePreview({ src, className, exifData }: ImagePreviewProps) {
  return (
    <div className={cn("relative aspect-square overflow-hidden", className)}>
      <Image
        src={src}
        alt="Preview"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
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
  )
}