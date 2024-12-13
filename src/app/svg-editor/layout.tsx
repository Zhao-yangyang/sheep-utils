import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG 编辑器 - Sheep Utils",
  description: "在线 SVG 编辑器，支持代码编辑、实时预览、格式转换等功能",
};

export default function SvgEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 