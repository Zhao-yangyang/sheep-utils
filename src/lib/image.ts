export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml"
]

export function validateImageFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`文件大小不能超过${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }
  
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("不支持的文件格式")
  }
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export async function createImagePreview(file: File) {
  return new Promise<{ preview: string; size: { width: number; height: number } }>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        resolve({
          preview: reader.result as string,
          size: { width: img.width, height: img.height }
        })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
} 