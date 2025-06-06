import { Button } from "@/components/ui/button";
import Link from "next/link";
import { safeJsonStringify } from "@/lib/json-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线工具集 - 图片处理、SVG编辑器等实用工具",
  description: "Sheep Utils 提供专业的在线工具集，包括图片格式转换、压缩优化、SVG编辑器、EXIF信息查看等功能。支持批量处理，操作简单，完全免费使用。",
  keywords: [
    "在线工具集",
    "图片处理工具",
    "SVG在线编辑器",
    "图片格式转换",
    "图片压缩",
    "免费在线工具",
    "批量图片处理",
    "EXIF信息查看"
  ],
  openGraph: {
    title: "Sheep Utils - 专业的在线工具集",
    description: "提供图片处理、SVG编辑等专业在线工具，支持批量处理，完全免费",
    url: "https://sheep-utils.vercel.app",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

// 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Sheep Utils",
  "description": "功能强大的在线工具集，提供图片处理、SVG编辑、格式转换等实用工具",
  "url": "https://sheep-utils.vercel.app",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  },
  "featureList": [
    "图片格式转换",
    "图片压缩优化", 
    "SVG在线编辑",
    "EXIF信息查看",
    "批量图片处理",
    "拖拽上传支持"
  ],
  "browserRequirements": "Chrome, Firefox, Safari, Edge",
  "author": {
    "@type": "Organization",
    "name": "Sheep Utils"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 py-10">
        <div className="flex max-w-[980px] flex-col items-center gap-6 text-center px-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            专业在线工具集
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            提供图片处理、SVG 编辑等专业在线工具，支持批量处理，操作简单，完全免费。让您的工作更高效。
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-sm text-muted-foreground">
            <span className="bg-secondary px-3 py-1 rounded-full">图片格式转换</span>
            <span className="bg-secondary px-3 py-1 rounded-full">图片压缩</span>
            <span className="bg-secondary px-3 py-1 rounded-full">SVG编辑器</span>
            <span className="bg-secondary px-3 py-1 rounded-full">EXIF信息</span>
            <span className="bg-secondary px-3 py-1 rounded-full">批量处理</span>
          </div>
        </div>
        <div className="flex gap-6">
          <Button asChild size="lg">
            <Link href="/tools/image">图片工具</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/svg-editor">SVG 工具</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
