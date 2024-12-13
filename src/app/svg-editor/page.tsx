"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadZone } from "@/components/svg-editor/upload-zone";
import { SettingsPanel } from "@/components/svg-editor/settings-panel";
import { toast } from "@/hooks/use-toast";
import { useHotkeys } from "react-hotkeys-hook";

// 动态导入 Monaco 编辑器以避免 SSR 问题
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

// 动态导入 prettier 和 xml-parser
const formatSvg = async (code: string) => {
  const [prettier, xmlParser] = await Promise.all([
    import('prettier/standalone').then(mod => mod.default),
    import('@prettier/plugin-xml').then(mod => mod.default)
  ]);
  
  return prettier.format(code, {
    parser: "xml",
    plugins: [xmlParser],
    xmlWhitespaceSensitivity: "ignore",
    bracketSameLine: true,
  });
};

export default function SvgEditorPage() {
  const [svgCode, setSvgCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"editor" | "upload">("editor");

  // 格式化代码
  const handleFormat = async () => {
    if (!svgCode.trim()) {
      toast({
        title: "提示",
        description: "没有可格式化的代码",
      });
      return;
    }

    try {
      const formatted = await formatSvg(svgCode);
      setSvgCode(formatted);
      toast({
        title: "成功",
        description: "代码格式化完成",
      });
    } catch (error) {
      console.error("Format error:", error);
      toast({
        title: "错误",
        description: "代码格式化失败，请检查 SVG 代码是否有效",
        variant: "destructive",
      });
    }
  };

  // 调整 SVG 尺寸
  const handleResize = (width: number, height: number) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, "image/svg+xml");
      const svg = doc.documentElement;
      
      svg.setAttribute("width", width.toString());
      svg.setAttribute("height", height.toString());
      
      const serializer = new XMLSerializer();
      const newSvgCode = serializer.serializeToString(svg);
      setSvgCode(newSvgCode);
      
      toast({
        title: "成功",
        description: "SVG 尺寸已更新",
      });
    } catch {
      toast({
        title: "错误",
        description: "更新 SVG 尺寸失败",
        variant: "destructive",
      });
    }
  };

  // 导出图片
  const handleExport = useCallback((format: 'svg' | 'png' | 'jpeg', scale: number, bgColor: string) => {
    if (format === "svg") {
      const blob = new Blob([svgCode], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "image.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    const svg = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svg);
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // 设置背景色
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `image.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
        `image/${format}`,
        0.9
      );
    };
    
    img.src = url;
  }, [svgCode]);

  // 快捷键
  useHotkeys("ctrl+s", (e) => {
    e.preventDefault();
    handleExport("svg", 1, "#ffffff");
  }, [handleExport]);

  useHotkeys("ctrl+shift+p", (e) => {
    e.preventDefault();
    handleFormat();
  }, [handleFormat]);

  useHotkeys("ctrl+v", async (_e) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim().toLowerCase().startsWith("<svg")) {
        setSvgCode(text);
        toast({
          title: "成功",
          description: "SVG 代码已粘贴",
        });
      }
    } catch {
      // 忽略错误
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.DOMParser || !window.XMLSerializer) {
        toast({
          title: "浏览器兼容性提示",
          description: "您的浏览器���能不支持某些功能，建议使用最新版本的 Chrome、Firefox 或 Edge",
          variant: "destructive",
        });
      }
    }
  }, []);

  return (
    <div className="h-[calc(100vh-65px)]">
      <div className="w-full max-w-[1600px] px-4 py-4">
        <h1 className="text-2xl font-bold mb-4 text-center">SVG 编辑器</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧编辑器面板 */}
          <div className="lg:col-span-6">
            <Card className="p-4">
              <Tabs defaultValue={activeTab} onValueChange={(value: string) => setActiveTab(value as "editor" | "upload")}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="editor">代码编辑</TabsTrigger>
                    <TabsTrigger value="upload">文件上传</TabsTrigger>
                  </TabsList>
                  {activeTab === "editor" && (
                    <Button onClick={handleFormat} size="sm">
                      格式化代码
                    </Button>
                  )}
                </div>
                
                <TabsContent value="editor">
                  <div className="h-[490px] border rounded-md overflow-hidden">
                    <MonacoEditor
                      height="100%"
                      language="xml"
                      theme="vs-dark"
                      value={svgCode}
                      onChange={(value: string | undefined) => setSvgCode(value || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        formatOnPaste: true,
                        formatOnType: true,
                      }}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="upload">
                  <div className="h-[490px]">
                    <UploadZone onSvgUpload={setSvgCode} />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* 中间预览区域 */}
          <div className="lg:col-span-3">
            <Card className="p-4 h-full">
              <h2 className="text-lg font-semibold mb-4">预览</h2>
              <div className="h-[490px] border rounded-md flex items-center justify-center bg-white">
                {svgCode ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: svgCode }}
                    className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                  />
                ) : (
                  <p className="text-gray-500">暂无预览内容</p>
                )}
              </div>
            </Card>
          </div>

          {/* 右侧设置面板 */}
          <div className="lg:col-span-3">
            <Card className="p-4">
              <SettingsPanel onExport={handleExport} onResize={handleResize} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 