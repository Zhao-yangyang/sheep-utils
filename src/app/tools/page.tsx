import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Image, Code, Wrench } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线工具 - Sheep Utils",
  description: "Sheep Utils 提供的所有在线工具，包括图片处理、SVG编辑器等实用工具。",
  keywords: [
    "在线工具",
    "工具集合",
    "图片工具",
    "SVG工具",
    "免费工具"
  ],
  openGraph: {
    title: "在线工具 - Sheep Utils",
    description: "查看所有可用的在线工具",
    url: "https://sheep-utils.vercel.app/tools",
    type: "website",
  },
  alternates: {
    canonical: "/tools",
  },
};

const tools = [
  {
    title: "图片处理工具",
    description: "支持图片格式转换、压缩、尺寸调整、EXIF信息查看等功能",
    href: "/tools/image",
    icon: Image,
    features: ["格式转换", "图片压缩", "尺寸调整", "EXIF信息", "批量处理"]
  },
  {
    title: "SVG编辑器",
    description: "在线SVG代码编辑器，支持实时预览、格式化、多格式导出",
    href: "/svg-editor",
    icon: Code,
    features: ["代码编辑", "实时预览", "格式化", "多格式导出", "语法高亮"]
  }
];

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { name: "工具", href: "/tools" }
        ]}
        className="mb-6"
      />
      
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Wrench className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-4xl font-bold">在线工具集</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          选择您需要的工具，提高工作效率
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card key={tool.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconComponent className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-base">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature) => (
                      <span 
                        key={feature}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={tool.href}>
                      使用工具
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 