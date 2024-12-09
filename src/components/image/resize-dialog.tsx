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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect, useCallback } from "react"

interface ResizeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResize: (width: number, height: number, maintainAspectRatio: boolean) => void
  file: File
  imageSize: { width: number; height: number }
}

export function ResizeDialog({
  open,
  onOpenChange,
  onResize,
  file,
  imageSize,
}: ResizeDialogProps) {
  const [width, setWidth] = useState<number>(imageSize.width)
  const [height, setHeight] = useState<number>(imageSize.height)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const aspectRatio = imageSize.width / imageSize.height

  // 重置尺寸
  useEffect(() => {
    setWidth(imageSize.width)
    setHeight(imageSize.height)
  }, [imageSize])

  const updateSize = useCallback((
    newValue: number,
    dimension: 'width' | 'height'
  ) => {
    if (dimension === 'width') {
      setWidth(newValue)
      if (maintainAspectRatio && newValue > 0) {
        const newHeight = Math.round(newValue / aspectRatio)
        setHeight(newHeight)
      }
    } else {
      setHeight(newValue)
      if (maintainAspectRatio && newValue > 0) {
        const newWidth = Math.round(newValue * aspectRatio)
        setWidth(newWidth)
      }
    }
  }, [maintainAspectRatio, aspectRatio])

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value === '' ? 0 : Math.max(1, parseInt(e.target.value))
    updateSize(newWidth, 'width')
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value === '' ? 0 : Math.max(1, parseInt(e.target.value))
    updateSize(newHeight, 'height')
  }

  const handleAspectRatioChange = (checked: boolean) => {
    setMaintainAspectRatio(checked)
    if (checked && width > 0) {
      // 切换到保持宽高比时，根据当前宽度重新计算高度
      const newHeight = Math.round(width / aspectRatio)
      setHeight(newHeight)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>调整图片尺寸</DialogTitle>
          <DialogDescription>
            当前文件：{file.name}（{imageSize.width} x {imageSize.height}）
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>宽度（像素）</Label>
            <Input
              type="number"
              value={width || ''}
              onChange={handleWidthChange}
              min={1}
              placeholder="输入宽度"
            />
          </div>
          <div className="grid gap-2">
            <Label>高度（像素）</Label>
            <Input
              type="number"
              value={height || ''}
              onChange={handleHeightChange}
              min={1}
              placeholder="输入高度"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="aspect-ratio"
              checked={maintainAspectRatio}
              onCheckedChange={handleAspectRatioChange}
            />
            <Label htmlFor="aspect-ratio">
              保持宽高比（{aspectRatio.toFixed(2)}）
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => onResize(width, height, maintainAspectRatio)}
            disabled={width < 1 || height < 1}
          >
            开始调整
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 