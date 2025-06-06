"use client";

import Link from "next/link";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";



export default function NotFound() {
  return (
    <>
      <Head>
        <title>页面未找到 - Sheep Utils</title>
        <meta name="description" content="抱歉，您访问的页面不存在。返回首页继续使用我们的在线工具。" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">页面未找到</h2>
          <p className="text-muted-foreground">
            抱歉，您访问的页面不存在或已被移动。
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                返回首页
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回上页
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              您可能在寻找：
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="link" size="sm" asChild>
                <Link href="/tools/image">图片工具</Link>
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link href="/svg-editor">SVG编辑器</Link>
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link href="/tools">所有工具</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 