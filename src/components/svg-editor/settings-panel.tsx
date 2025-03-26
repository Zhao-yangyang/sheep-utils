"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsPanelProps {
  onExport: (format: 'svg' | 'png' | 'jpeg' | 'ico', scale: number, bgColor: string) => void;
  onResize: (width: number, height: number) => void;
}

export function SettingsPanel({ onExport, onResize }: SettingsPanelProps) {
  const [width, setWidth] = useState("100");
  const [height, setHeight] = useState("100");
  const [format, setFormat] = useState<'svg' | 'png' | 'jpeg' | 'ico'>('svg');
  const [scale, setScale] = useState("1");
  const [bgColor, setBgColor] = useState("#ffffff");

  const handleResize = () => {
    const w = parseInt(width);
    const h = parseInt(height);
    if (isNaN(w) || isNaN(h)) return;
    onResize(w, h);
  };

  const handleExport = () => {
    const s = parseFloat(scale);
    if (isNaN(s)) return;
    // 如果是 ICO 格式，强制使用 32x32 尺寸
    if (format === 'ico') {
      onExport(format, 32 / Math.max(parseInt(width), parseInt(height)), bgColor);
    } else {
      onExport(format, s, bgColor);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">调整尺寸</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">宽度</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">高度</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleResize} className="w-full mt-4">
            应用尺寸
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">导出设置</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>格式</Label>
              <Select value={format} onValueChange={(value: 'svg' | 'png' | 'jpeg' | 'ico') => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="ico">ICO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {format !== 'svg' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="scale">缩放比例</Label>
                  <Input
                    id="scale"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={format === 'ico' ? '1' : scale}
                    onChange={(e) => setScale(e.target.value)}
                    disabled={format === 'ico'}
                  />
                  {format === 'ico' && (
                    <p className="text-sm text-muted-foreground">
                      ICO 格式将自动调整为 32x32 像素
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bgColor">背景颜色</Label>
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button onClick={handleExport} className="w-full">
              导出图片
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 