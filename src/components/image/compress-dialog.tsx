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
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface CompressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCompress: (quality: number) => void
  file: File
}

export function CompressDialog({
  open,
  onOpenChange,
  onCompress,
  file,
}: CompressDialogProps) {
  const [quality, setQuality] = useState(80)
  const fileSize = (file.size / 1024 / 1024).toFixed(2) // 转换为MB

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>压缩图片</DialogTitle>
          <DialogDescription>
            当前文件：{file.name}（{fileSize} MB）
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              压缩质量：{quality}%
            </label>
            <Slider
              value={[quality]}
              onValueChange={([value]) => setQuality(value)}
              min={1}
              max={100}
              step={1}
            />
            <p className="text-sm text-muted-foreground">
              质量越低，文件越小，但图片可能会失真
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onCompress(quality)}>开始压缩</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 