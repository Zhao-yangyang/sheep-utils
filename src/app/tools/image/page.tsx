import { ImageUpload } from "@/components/image/image-upload"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { safeJsonStringify } from "@/lib/json-utils"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线图片处理工具 - 格式转换、压缩、调整大小",
  description: "专业的在线图片处理工具，支持PNG、JPEG、WebP格式转换，图片压缩优化，尺寸调整，EXIF信息查看。支持批量处理，拖拽上传，完全免费使用。",
  keywords: [
    "图片处理工具",
    "图片格式转换",
    "图片压缩",
    "图片尺寸调整",
    "PNG转JPEG",
    "JPEG转PNG", 
    "WebP转换",
    "EXIF信息查看",
    "批量图片处理",
    "在线图片编辑",
    "免费图片工具"
  ],
  openGraph: {
    title: "在线图片处理工具 - Sheep Utils",
    description: "专业的图片处理工具，支持格式转换、压缩、调整大小等功能，批量处理，完全免费",
    url: "https://sheep-utils.vercel.app/tools/image",
    type: "website",
  },
  alternates: {
    canonical: "/tools/image",
  },
};

// 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "图片处理工具",
  "description": "专业的在线图片处理工具，支持格式转换、压缩、尺寸调整等功能",
  "url": "https://sheep-utils.vercel.app/tools/image",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  },
  "featureList": [
    "图片格式转换 (PNG, JPEG, WebP)",
    "图片压缩优化",
    "图片尺寸调整",
    "EXIF信息查看",
    "批量图片处理",
    "拖拽上传支持",
    "剪贴板粘贴",
    "实时预览"
  ],
  "supportedFormat": ["PNG", "JPEG", "WebP"],
  "browserRequirements": "Chrome, Firefox, Safari, Edge"
};

export default function ImageTools() {
  return (
    <>
             <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }}
       />
             <div className="flex flex-col gap-8 py-8">
         <Breadcrumb 
           items={[
             { name: "工具", href: "/tools" },
             { name: "图片处理", href: "/tools/image" }
           ]}
           className="mb-4"
         />
         <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">专业图片处理工具</h1>
          <p className="text-muted-foreground max-w-2xl">
            支持图片格式转换、压缩优化、尺寸调整、EXIF信息查看等功能。支持PNG、JPEG、WebP格式，批量处理，操作简单，完全免费。
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-sm">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">格式转换</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">图片压缩</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">尺寸调整</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">EXIF信息</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">批量处理</span>
          </div>
        </div>
        <ImageUpload />
      </div>
    </>
  )
} 