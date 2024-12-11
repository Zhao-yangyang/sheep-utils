"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { ExifData } from "@/types/exif"

interface ExifInfoPanelProps {
  exifData?: ExifData
  onClose?: () => void
}

export function ExifInfoPanel({ exifData, onClose }: ExifInfoPanelProps) {
  if (!exifData) return null;

  return (
    <Card className="absolute right-4 top-4 bottom-16 w-72 bg-black/50 text-white p-4 overflow-hidden backdrop-blur-sm border-white/10">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-2 h-6 w-6 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <ScrollArea className="h-full">
        <div className="space-y-4 mt-6">
          {/* 相机信息 */}
          <div>
            <h3 className="font-semibold mb-2 text-white/90">相机信息</h3>
            {exifData.Make && exifData.Model && (
              <p className="text-sm text-white/80">
                {exifData.Make} {exifData.Model}
              </p>
            )}
            {exifData.Software && (
              <p className="text-sm text-white/60">
                软件: {exifData.Software}
              </p>
            )}
          </div>

          <Separator className="bg-white/20" />

          {/* 拍摄参数 */}
          <div>
            <h3 className="font-semibold mb-2 text-white/90">拍摄参数</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {exifData.DateTime && (
                <p className="text-white/80">拍摄时间: {exifData.DateTime}</p>
              )}
              {exifData.ExposureTime && (
                <p className="text-white/80">曝光时间: {exifData.ExposureTime}</p>
              )}
              {exifData.FNumber && (
                <p className="text-white/80">光圈: f/{exifData.FNumber}</p>
              )}
              {exifData.ISO && (
                <p className="text-white/80">ISO: {exifData.ISO}</p>
              )}
              {exifData.FocalLength && (
                <p className="text-white/80">焦距: {exifData.FocalLength}</p>
              )}
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* 图像信息 */}
          <div>
            <h3 className="font-semibold mb-2 text-white/90">图像信息</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {exifData.ExifImageWidth && exifData.ExifImageHeight && (
                <p className="text-white/80">尺寸: {exifData.ExifImageWidth} x {exifData.ExifImageHeight}</p>
              )}
              {exifData.Orientation && (
                <p className="text-white/80">方向: {exifData.Orientation}°</p>
              )}
            </div>
          </div>

          {/* GPS 信息 */}
          {(exifData.latitude || exifData.location) && (
            <>
              <Separator className="bg-white/20" />
              <div>
                <h3 className="font-semibold mb-2 text-white/90">位置信息</h3>
                {exifData.location && (
                  <p className="text-sm text-white/80">{exifData.location}</p>
                )}
                {exifData.latitude && exifData.longitude && (
                  <p className="text-sm text-white/60">
                    {exifData.latitude.toFixed(6)}, {exifData.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </>
          )}

          {/* 版权信息 */}
          {(exifData.Copyright || exifData.Artist) && (
            <>
              <Separator className="bg-white/20" />
              <div>
                <h3 className="font-semibold mb-2 text-white/90">版权信息</h3>
                {exifData.Copyright && (
                  <p className="text-sm text-white/80">版权: {exifData.Copyright}</p>
                )}
                {exifData.Artist && (
                  <p className="text-sm text-white/80">作者: {exifData.Artist}</p>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
} 