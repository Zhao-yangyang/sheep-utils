"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState, useCallback } from "react"
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface CropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCrop: (croppedBlob: Blob) => void
  file: File
  imageUrl: string
}

const ASPECT_RATIOS = [
  { value: "free", label: "自由裁剪" },
  { value: "1:1", label: "正方形 (1:1)" },
  { value: "4:3", label: "标准 (4:3)" },
  { value: "16:9", label: "宽屏 (16:9)" },
  { value: "3:4", label: "竖屏 (3:4)" },
] as const

export function CropDialog({
  open,
  onOpenChange,
  onCrop,
  file,
  imageUrl,
}: CropDialogProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  })
  const [aspectRatio, setAspectRatio] = useState<string>("free")

  const handleAspectRatioChange = useCallback((value: string) => {
    setAspectRatio(value)
    if (value === "free") {
      setCrop(prev => ({ ...prev, aspect: undefined }))
    } else {
      const [width, height] = value.split(":").map(Number)
      setCrop(prev => ({ ...prev, aspect: width / height }))
    }
  }, [])

  const handleCrop = useCallback(async () => {
    try {
      const image = new Image()
      image.src = imageUrl
      await new Promise((resolve) => (image.onload = resolve))

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error("无法创建canvas上下文")

      // 计算裁剪区域的实际像素值
      const scaleX = image.naturalWidth / 100
      const scaleY = image.naturalHeight / 100
      const pixelCrop = {
        x: Math.round(crop.x * scaleX),
        y: Math.round(crop.y * scaleY),
        width: Math.round(crop.width * scaleX),
        height: Math.round(crop.height * scaleY)
      }

      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCrop(blob)
            onOpenChange(false)
          }
        },
        file.type,
        1
      )
    } catch (err) {
      console.error("裁剪失败:", err)
    }
  }, [crop, imageUrl, file.type, onCrop, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>裁剪图片</DialogTitle>
          <DialogDescription>
            拖动或调整选框来裁剪图片
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select
              value={aspectRatio}
              onValueChange={handleAspectRatioChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择裁剪比例" />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative aspect-video bg-muted">
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              className="max-h-[60vh] w-full object-contain"
            >
              <img
                src={imageUrl}
                alt="裁剪预览"
                className="max-h-[60vh] w-full object-contain"
                // eslint-disable-next-line @next/next/no-img-element
              />
            </ReactCrop>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCrop}>确认裁剪</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 