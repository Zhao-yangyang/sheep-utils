import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 py-10">
      <div className="flex max-w-[980px] flex-col items-center gap-6 text-center px-4">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
          在线工具集
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          提供图片处理、SVG 编辑等在线工具，让您的工作更轻松。
        </p>
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
  );
}
