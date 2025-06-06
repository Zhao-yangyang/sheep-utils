import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线SVG编辑器 - 代码编辑、实时预览、格式转换",
  description: "专业的在线SVG编辑器，支持代码编辑、实时预览、格式化、多格式导出。基于Monaco Editor，支持语法高亮、代码补全，完全免费使用。",
  keywords: [
    "SVG编辑器",
    "在线SVG编辑",
    "SVG代码编辑器",
    "SVG转PNG",
    "SVG转JPEG",
    "SVG格式化",
    "SVG实时预览",
    "Monaco Editor",
    "免费SVG工具",
    "在线矢量编辑",
    "SVG优化工具"
  ],
  openGraph: {
    title: "在线SVG编辑器 - Sheep Utils",
    description: "专业的SVG编辑器，支持代码编辑、实时预览、格式转换，完全免费",
    url: "https://sheep-utils.vercel.app/svg-editor",
    type: "website",
  },
  alternates: {
    canonical: "/svg-editor",
  },
};

export default function SvgEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 