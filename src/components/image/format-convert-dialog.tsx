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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const FORMAT_OPTIONS = [
  { value: "png", label: "PNG", mime: "image/png" },
  { value: "jpeg", label: "JPEG", mime: "image/jpeg" },
  { value: "webp", label: "WebP", mime: "image/webp" },
  { value: "ico", label: "ICO", mime: "image/png" },
] as const

interface FormatConvertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConvert: (format: string, mime: string) => void
  file: File
}

export function FormatConvertDialog({
  open,
  onOpenChange,
  onConvert,
  file,
}: FormatConvertDialogProps) {
  const [format, setFormat] = useState<string>("png")
  const selectedFormat = FORMAT_OPTIONS.find(f => f.value === format)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>转换图片格式</DialogTitle>
          <DialogDescription>
            当前文件：{file.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              目标格式
            </label>
            <Select
              value={format}
              onValueChange={setFormat}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择目标格式" />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => selectedFormat && onConvert(format, selectedFormat.mime)}
          >
            开始转换
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 