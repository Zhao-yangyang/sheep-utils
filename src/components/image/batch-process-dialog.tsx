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
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect, useCallback } from "react"
import type { ImageFile, ProcessedFile } from "@/types/image"
import { downloadZip } from "@/lib/download"
import { useToast } from "@/hooks/use-toast"
import NextImage from "next/image"
import { handleError } from "@/lib/error"
import { ErrorMessage } from "@/components/ui/error-message"
import type { AppError } from "@/types/error"
import { createError } from "@/lib/error"

const FORMAT_OPTIONS = [
  { value: "png", label: "PNG", mime: "image/png" },
  { value: "jpeg", label: "JPEG", mime: "image/jpeg" },
  { value: "webp", label: "WebP", mime: "image/webp" },
] as const

type ResizeMode = "preset" | "custom"

const RESIZE_PRESETS = [
  { label: "720p (1280×720)", width: 1280, height: 720 },
  { label: "1080p (1920×1080)", width: 1920, height: 1080 },
  { label: "2K (2560×1440)", width: 2560, height: 1440 },
  { label: "4K (3840×2160)", width: 3840, height: 2160 },
] as const

type PresetLabel = typeof RESIZE_PRESETS[number]["label"]

interface BatchProcessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: ImageFile[]
  processType: "convert" | "compress" | "resize"
}

// 创建一个类型安全的 createImage 函数
const createImage = () => {
  if (typeof window === 'undefined') return null
  return new window.Image()
}

export function BatchProcessDialog({
  open,
  onOpenChange,
  images,
  processType,
}: BatchProcessDialogProps) {
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [currentFile, setCurrentFile] = useState<string>("")
  const [currentStatus, setCurrentStatus] = useState<string>("")
  const [failedFiles, setFailedFiles] = useState<{ name: string; error: AppError }[]>([])
  const [error, setError] = useState<AppError | null>(null)
  
  // 转换选项
  const [format, setFormat] = useState<string>("png")
  
  // 压缩选项
  const [quality, setQuality] = useState(80)
  
  // 尺寸调整选项
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [resizeMode, setResizeMode] = useState<ResizeMode>("preset")
  const [selectedPreset, setSelectedPreset] = useState<PresetLabel>(RESIZE_PRESETS[1].label)
  const [previewImage, setPreviewImage] = useState<{
    original: string;
    processed: string | null;
  } | null>(null)

  // 当选择预设时更新宽高
  useEffect(() => {
    if (resizeMode === "preset") {
      const preset = RESIZE_PRESETS.find(p => p.label === selectedPreset)
      if (preset) {
        setWidth(preset.width)
        setHeight(preset.height)
      }
    }
  }, [resizeMode, selectedPreset])

  // 添加宽高比计算
  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainAspectRatio && newWidth > 0) {
      const aspectRatio = width / height
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainAspectRatio && newHeight > 0) {
      const aspectRatio = width / height
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const getTitle = () => {
    switch (processType) {
      case "convert":
        return "转换格式"
      case "compress":
        return "压缩图片"
      case "resize":
        return "调整尺寸"
    }
  }

  const handleProcess = useCallback(async () => {
    setProcessing(true)
    setProgress(0)
    
    try {
      const files: ProcessedFile[] = []
      
      for (let i = 0; i < images.length; i++) {
        // 更新进度
        setProgress((i / images.length) * 100)
        
        // 处理图片
        const image = images[i]
        setCurrentFile(image.file.name)
        setCurrentStatus("加载中...")

        try {
          const img = createImage()
          if (!img) throw new Error("无法创建图片对象")
          
          img.src = image.preview
          await new Promise((resolve) => (img.onload = resolve))

          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("无法创建canvas上下文")

          ctx.drawImage(img, 0, 0)

          let blob: Blob
          switch (processType) {
            case "convert":
              setCurrentStatus("正在转换格式...")
              const selectedFormat = FORMAT_OPTIONS.find(f => f.value === format)
              if (!selectedFormat) throw new Error("未选择目标格式")
              
              blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => {
                  if (blob) resolve(blob)
                  else reject(new Error("转换失败"))
                }, selectedFormat.mime)
              })

              files.push({
                name: `${image.file.name.replace(/\.[^/.]+$/, '')}.${format}`,
                blob
              })
              break

            case "compress":
              setCurrentStatus("正在压缩...")
              // 压缩时使用 JPEG 格式，因为它支持质量控制
              blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => {
                  if (blob) resolve(blob)
                  else reject(new Error("压缩失败"))
                }, "image/jpeg", quality / 100)
              })

              // 获取原始文件大小和压缩后的大小，用于显示压缩比
              const originalSize = image.file.size
              const compressedSize = blob.size
              const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)

              files.push({
                name: `compressed_${image.file.name.replace(/\.[^/.]+$/, '.jpg')}`,
                blob
              })

              // 更新进度信息，包含压缩比
              toast({
                title: `处理第 ${i + 1}/${images.length} 张`,
                description: `压缩率：${compressionRatio}%（${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(compressedSize / 1024 / 1024).toFixed(1)}MB）`,
              })
              break

            case "resize":
              setCurrentStatus("正在调整尺寸...")
              let finalWidth = width
              let finalHeight = height

              if (maintainAspectRatio) {
                const aspectRatio = image.size.width / image.size.height
                if (width / height > aspectRatio) {
                  finalWidth = Math.round(height * aspectRatio)
                  finalHeight = height
                } else {
                  finalWidth = width
                  finalHeight = Math.round(width / aspectRatio)
                }
              }

              // 创建新的 canvas 用于调整尺寸
              const resizeCanvas = document.createElement("canvas")
              resizeCanvas.width = finalWidth
              resizeCanvas.height = finalHeight
              const resizeCtx = resizeCanvas.getContext("2d")
              if (!resizeCtx) throw new Error("无法创建canvas上下文")

              // 使用更好的缩放算法
              resizeCtx.imageSmoothingEnabled = true
              resizeCtx.imageSmoothingQuality = "high"
              resizeCtx.drawImage(img, 0, 0, finalWidth, finalHeight)

              blob = await new Promise<Blob>((resolve, reject) => {
                resizeCanvas.toBlob((blob) => {
                  if (blob) resolve(blob)
                  else reject(new Error("调整失败"))
                }, image.file.type)
              })

              files.push({
                name: `resized_${image.file.name}`,
                blob
              })
              break
          }
        } catch (err) {
          const error = handleError(err)
          setFailedFiles(prev => [...prev, { 
            name: image.file.name, 
            error
          }])
        }
      }

      setProgress(100)

      if (failedFiles.length > 0) {
        const error = createError(
          "PROCESS_FAILED", 
          `成功：${files.length}，失败：${failedFiles.length}张`
        )
        setError(error)
        toast({
          title: error.message,
          description: error.suggestion,
          variant: "destructive",
        })
      } else {
        // 全部成功，继续下载
        if (files.length === 1) {
          const file = files[0]
          const url = URL.createObjectURL(file.blob)
          const a = document.createElement("a")
          a.href = url
          a.download = file.name
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        } else {
          await downloadZip(files)
        }

        onOpenChange(false)
        toast({
          title: "处理成功",
          description: `成功处理 ${files.length} 张图片`,
        })
      }
    } catch (err) {
      const error = handleError(err)
      setError(error)
      toast({
        title: error.message,
        description: error.suggestion,
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
      setCurrentFile("")
      setCurrentStatus("")
    }
  }, [
    images,
    processType,
    format,
    quality,
    width,
    height,
    maintainAspectRatio,
    onOpenChange,
    toast,
    failedFiles.length
  ])

  // 生成预览图
  const generatePreview = useCallback(async () => {
    if (!images[0]) return

    try {
      const img = createImage()
      if (!img) throw new Error("无法创建图片对象")
      
      img.src = images[0].preview
      await new Promise((resolve) => (img.onload = resolve))

      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("无法创建canvas上下文")

      ctx.drawImage(img, 0, 0)

      let processedBlob: Blob | null = null
      switch (processType) {
        case "convert":
          const selectedFormat = FORMAT_OPTIONS.find(f => f.value === format)
          if (!selectedFormat) return
          processedBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob)
              else reject(new Error("预览生成失败"))
            }, selectedFormat.mime)
          })
          break

        case "compress":
          processedBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob)
              else reject(new Error("预览生成失败"))
            }, "image/jpeg", quality / 100)
          })
          break

        case "resize":
          let finalWidth = width
          let finalHeight = height
          if (maintainAspectRatio) {
            const aspectRatio = images[0].size.width / images[0].size.height
            if (width / height > aspectRatio) {
              finalWidth = Math.round(height * aspectRatio)
              finalHeight = height
            } else {
              finalWidth = width
              finalHeight = Math.round(width / aspectRatio)
            }
          }

          const resizeCanvas = document.createElement("canvas")
          resizeCanvas.width = finalWidth
          resizeCanvas.height = finalHeight
          const resizeCtx = resizeCanvas.getContext("2d")
          if (!resizeCtx) throw new Error("无法创建canvas上下文")

          resizeCtx.imageSmoothingEnabled = true
          resizeCtx.imageSmoothingQuality = "high"
          resizeCtx.drawImage(img, 0, 0, finalWidth, finalHeight)

          processedBlob = await new Promise<Blob>((resolve, reject) => {
            resizeCanvas.toBlob((blob) => {
              if (blob) resolve(blob)
              else reject(new Error("预览生成失败"))
            }, images[0].file.type)
          })
          break
      }

      if (processedBlob) {
        // 先清理旧的 URL
        if (previewImage?.processed) {
          URL.revokeObjectURL(previewImage.processed)
        }
        // 创建新的预览
        const newUrl = URL.createObjectURL(processedBlob)
        setPreviewImage({
          original: images[0].preview,
          processed: newUrl
        })
      }
    } catch (err) {
      console.error("预览生成失败:", err)
      setPreviewImage(null)
    }
  }, [images, processType, format, quality, width, height, maintainAspectRatio, previewImage])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (previewImage?.processed) {
        URL.revokeObjectURL(previewImage.processed)
      }
    }
  }, [previewImage?.processed])

  // 参数改变时更新预览
  useEffect(() => {
    generatePreview()
  }, [generatePreview])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {images.length > 1 
              ? `将处理 ${images.length} 张图片`
              : `处理文件：${images[0].file.name}`
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {processType === "convert" && (
            <div className="grid gap-2">
              <Label>目标格式</Label>
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
          )}
          {processType === "compress" && (
            <div className="grid gap-2">
              <Label>压缩质量：{quality}%</Label>
              <Slider
                value={[quality]}
                onValueChange={([value]) => setQuality(value)}
                min={1}
                max={100}
                step={1}
              />
              <p className="text-sm text-muted-foreground">
                质量越低，文件越小，但片可能会失真
              </p>
            </div>
          )}
          {processType === "resize" && (
            <>
              <div className="grid gap-2">
                <Label>调整方式</Label>
                <Select
                  value={resizeMode}
                  onValueChange={(value) => setResizeMode(value as ResizeMode)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择调整方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preset">使用预设尺寸</SelectItem>
                    <SelectItem value="custom">自定义尺寸</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {resizeMode === "preset" ? (
                <div className="grid gap-2">
                  <Label>预设尺寸</Label>
                  <Select
                    value={selectedPreset}
                    onValueChange={(value) => setSelectedPreset(value as PresetLabel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择预设尺寸" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESIZE_PRESETS.map((preset) => (
                        <SelectItem key={preset.label} value={preset.label}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label>宽度（像素）</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      min={1}
                      placeholder="输入目标宽度"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>高度（像素）</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      min={1}
                      placeholder="输入目标高度"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aspect-ratio"
                  checked={maintainAspectRatio}
                  onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
                />
                <Label htmlFor="aspect-ratio" className="text-sm">
                  保持宽高比（推荐：避免图片变形）
                </Label>
              </div>
            </>
          )}
          {processing && (
            <div className="grid gap-2">
              <Progress value={progress} />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground text-center">
                  {currentFile && `正在处理：${currentFile}`}
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  {currentStatus}（{Math.round(progress)}%）
                </p>
              </div>
            </div>
          )}
          {error && (
            <ErrorMessage error={error} />
          )}
          {failedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-destructive">处理失败的文件：</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {failedFiles.map(({ name, error }) => (
                  <p key={name} className="text-xs text-muted-foreground">
                    {name}：{error.message}
                  </p>
                ))}
              </div>
            </div>
          )}
          {previewImage && !processing && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">原图</p>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                  <NextImage
                    src={previewImage.original}
                    alt="原图预览"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">处理后</p>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                  <NextImage
                    src={previewImage.processed || ""}
                    alt="处理后预览"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleProcess}
            disabled={processing}
          >
            {processing ? "处理中..." : "开始处理"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 