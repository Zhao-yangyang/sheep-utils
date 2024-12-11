import type { ExifData } from './exif';

export interface ImageFile {
  file: File
  preview: string
  size: { width: number; height: number }
  exifData?: ExifData
}

export interface ProcessOptions {
  onProgress: (current: number, total: number) => void
  format?: string        // 用于格式转换
  quality?: number       // 用于压缩
  width?: number         // 用于调整尺寸
  height?: number        // 用于调整尺寸
  maintainAspectRatio?: boolean  // 用于调整尺寸
}

export interface ProcessedFile {
  name: string
  blob: Blob
}