import { ImageUpload } from "@/components/image/image-upload"

export default function ImageTools() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">图片工具</h1>
        <p className="text-muted-foreground">
          支持图片格式转换、压缩、调整大小等功能
        </p>
      </div>
      <ImageUpload />
    </div>
  )
} 