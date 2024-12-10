"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect, useCallback } from "react"
import { FormatConvertDialog } from "./format-convert-dialog"
import { CompressDialog } from "./compress-dialog"
import { ResizeDialog } from "./resize-dialog"
import { useToast } from "@/hooks/use-toast"
import { DragDropZone } from "./drag-drop-zone"
import { BatchProcessDialog } from "./batch-process-dialog"
import { ImageFile } from "@/types/image"
import { PreviewDialog } from "./preview-dialog"
import { validateImageFile, createImagePreview } from "@/lib/image"
import { SortableImageGrid } from "./sortable-image-grid"
import { useHotkeys } from "react-hotkeys-hook"
import { KeyboardShortcuts } from "./keyboard-shortcuts"
import { handleError } from "@/lib/error"
import { ErrorMessage } from "@/components/ui/error-message"
import { AppError } from "@/types/error"
import { getExifData } from '@/lib/exif';

export function ImageUpload() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const [showCompressDialog, setShowCompressDialog] = useState(false)
  const [showResizeDialog, setShowResizeDialog] = useState(false)
  const [showBatchDialog, setShowBatchDialog] = useState(false)
  const [batchProcessType, setBatchProcessType] = useState<"convert" | "compress" | "resize" | null>(null)
  const { toast } = useToast()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [error, setError] = useState<AppError | null>(null)

  const handleFilesAdded = useCallback(async (files: FileList) => {
    try {
        const newImages: ImageFile[] = [];
        for (const file of Array.from(files)) {
            // 验证文件
            validateImageFile(file);
            
            // 创建预览
            const { preview, size } = await createImagePreview(file);
            
            // 读取EXIF数据
            const exifData = await getExifData(file);
            console.log('EXIF data:', exifData);
            
            newImages.push({ file, preview, size, exifData });
        }
        setImages(prev => [...prev, ...newImages]);
    } catch (error) {
        handleError(error);
    }
  }, []);

  const handleConvert = async (format: string, mime: string) => {
    if (selectedIndex === -1) return

    try {
      // 创建canvas来转换图片格式
      const img = new Image()
      img.src = images[selectedIndex].preview
      await new Promise((resolve) => (img.onload = resolve))

      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("无法创建canvas上下文")

      ctx.drawImage(img, 0, 0)
      
      // 转换格式
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error("转换失败"))
        }, mime)
      })

      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `converted.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setShowFormatDialog(false)
      toast({
        title: "转换成功",
        description: `图片已转换为 ${format.toUpperCase()} 格式`,
      })
    } catch (err) {
      const error = handleError(err)
      setError(error)
      toast({
        title: error.message,
        description: error.suggestion,
        variant: "destructive",
      })
    }
  }

  const handleCompress = async (quality: number) => {
    if (selectedIndex === -1) return

    try {
      // 创建canvas来压缩图片
      const img = new Image()
      img.src = images[selectedIndex].preview
      await new Promise((resolve) => (img.onload = resolve))

      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("无法创建canvas上下文")

      ctx.drawImage(img, 0, 0)
      
      // 压缩图片
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error("压缩失败"))
        }, "image/jpeg", quality / 100)
      })

      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `compressed_${images[selectedIndex].file.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setShowCompressDialog(false)
      toast({
        title: "压缩成功",
        description: `原大小：${(images[selectedIndex].file.size / 1024 / 1024).toFixed(2)}MB，压缩后：${(blob.size / 1024 / 1024).toFixed(2)}MB`,
      })
    } catch (err) {
      const error = handleError(err)
      setError(error)
      toast({
        title: error.message,
        description: error.suggestion,
        variant: "destructive",
      })
    }
  }

  const handleResize = async (width: number, height: number, maintainAspectRatio: boolean) => {
    if (selectedIndex === -1) return

    try {
      // 创建canvas来调整图片尺寸
      const img = new Image()
      img.src = images[selectedIndex].preview
      await new Promise((resolve) => (img.onload = resolve))

      // 如果需要保持宽高比，重新计算尺寸
      let finalWidth = width
      let finalHeight = height
      if (maintainAspectRatio) {
        const aspectRatio = img.width / img.height
        if (width / height > aspectRatio) {
          finalWidth = Math.round(height * aspectRatio)
        } else {
          finalHeight = Math.round(width / aspectRatio)
        }
      }

      const canvas = document.createElement("canvas")
      canvas.width = finalWidth
      canvas.height = finalHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("无法创建canvas上下文")

      // 使用更好的缩放算法
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight)
      
      // 导出图片
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error("调整失败"))
        }, images[selectedIndex].file.type)
      })

      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `resized_${images[selectedIndex].file.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setShowResizeDialog(false)
      toast({
        title: "调整成功",
        description: `图片尺寸已调整为 ${finalWidth} x ${finalHeight}`,
      })
    } catch (err) {
      const error = handleError(err)
      setError(error)
      toast({
        title: error.message,
        description: error.suggestion,
        variant: "destructive",
      })
    }
  }

  // 添加键盘快捷键
  useHotkeys('delete', () => {
    if (selectedIndex !== -1) {
      setImages((prev) => prev.filter((_, i) => i !== selectedIndex))
      setSelectedIndex(-1)
    }
  }, [selectedIndex])

  useHotkeys('escape', () => {
    setSelectedIndex(-1)
  })

  useHotkeys('left', () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }, [selectedIndex])

  useHotkeys('right', () => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }, [selectedIndex, images.length])

  // 使用 useCallback 包装 handlePaste 函数
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    try {
      const items = e.clipboardData?.items
      if (!items) return

      const imageItems = Array.from(items).filter(
        item => item.type.startsWith('image/')
      )

      if (imageItems.length === 0) return

      const files: File[] = []
      for (const item of imageItems) {
        const file = item.getAsFile()
        if (file) files.push(file)
      }

      await handleFilesAdded(
        Object.assign(files, { item: (i: number) => files[i] }) as FileList
      )

      toast({
        title: "粘贴成功",
        description: `已从剪贴板添加 ${files.length} 张图片`,
      })
    } catch (err) {
      const error = handleError(err)
      setError(error)
      toast({
        title: error.message,
        description: error.suggestion,
        variant: "destructive",
      })
    }
  }, [handleFilesAdded, setError, toast])

  // 更新 useEffect 的依赖数组
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  const handlePreview = (preview: string) => {
    const image = images[selectedIndex];
    console.log('Preview image EXIF:', image?.exifData);
    console.log('Selected index:', selectedIndex);
    console.log('Current images:', images);
    const index = images.findIndex(img => img.preview === preview);
    if (index !== -1) {
      setSelectedIndex(index);
    }
    setPreviewImage(preview);
  };

  return (
    <Card className="w-full max-w-3xl p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-8">
          <DragDropZone onFilesDrop={handleFilesAdded} className="flex-1" />
          <div className="pt-2">
            <KeyboardShortcuts />
          </div>
        </div>
        {images.length > 0 && (
          <>
            <SortableImageGrid
              images={images}
              selectedIndex={selectedIndex}
              onImagesChange={setImages}
              onSelect={(index) => {
                if (index === selectedIndex) {
                  setSelectedIndex(-1)
                } else {
                  setSelectedIndex(index)
                }
              }}
              onPreview={(preview) => handlePreview(preview)}
              onDelete={(index) => {
                setImages((prev) => {
                  const newImages = prev.filter((_, i) => i !== index)
                  if (index === selectedIndex || newImages.length === 0) {
                    setSelectedIndex(-1)
                  } else if (index < selectedIndex) {
                    setSelectedIndex(selectedIndex - 1)
                  }
                  return newImages
                })
              }}
            />
            {selectedIndex === -1 ? (
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBatchProcessType("convert")
                    setShowBatchDialog(true)
                  }}
                >
                  转换格式
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBatchProcessType("compress")
                    setShowBatchDialog(true)
                  }}
                >
                  压缩
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBatchProcessType("resize")
                    setShowBatchDialog(true)
                  }}
                >
                  调整尺寸
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button onClick={() => setShowFormatDialog(true)}>转换格式</Button>
                <Button onClick={() => setShowCompressDialog(true)}>压缩图片</Button>
                <Button onClick={() => setShowResizeDialog(true)}>调整尺寸</Button>
              </div>
            )}
          </>
        )}
        {error && (
          <ErrorMessage error={error} />
        )}
        {selectedIndex !== -1 && (
          <>
            <FormatConvertDialog
              open={showFormatDialog}
              onOpenChange={setShowFormatDialog}
              onConvert={handleConvert}
              file={images[selectedIndex].file}
            />
            <CompressDialog
              open={showCompressDialog}
              onOpenChange={setShowCompressDialog}
              onCompress={handleCompress}
              file={images[selectedIndex].file}
            />
            <ResizeDialog
              open={showResizeDialog}
              onOpenChange={setShowResizeDialog}
              onResize={handleResize}
              file={images[selectedIndex].file}
              imageSize={images[selectedIndex].size}
            />
          </>
        )}
        {batchProcessType && (
          <BatchProcessDialog
            open={showBatchDialog}
            onOpenChange={setShowBatchDialog}
            images={selectedIndex !== -1 ? [images[selectedIndex]] : images}
            processType={batchProcessType}
          />
        )}
        {previewImage && (
          <PreviewDialog
            open={!!previewImage}
            onOpenChange={(open) => !open && setPreviewImage(null)}
            src={previewImage}
            exifData={selectedIndex >= 0 ? images[selectedIndex].exifData : undefined}
          />
        )}
      </div>
    </Card>
  )
} 