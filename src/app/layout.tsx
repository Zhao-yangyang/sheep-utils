import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Sheep Utils - 在线工具集",
    template: "%s | Sheep Utils"
  },
  description: "功能强大的在线工具集，提供图片处理、SVG编辑、格式转换、压缩优化等实用工具。支持批量处理，操作简单，完全免费。",
  keywords: [
    "在线工具",
    "图片处理",
    "SVG编辑器", 
    "图片压缩",
    "格式转换",
    "图片转换",
    "在线编辑器",
    "免费工具",
    "批量处理",
    "图片优化",
    "EXIF信息",
    "图片工具"
  ],
  authors: [{ name: "Sheep Utils" }],
  creator: "Sheep Utils",
  publisher: "Sheep Utils",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sheep-utils.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://sheep-utils.vercel.app',
    title: 'Sheep Utils - 在线工具集',
    description: '功能强大的在线工具集，提供图片处理、SVG编辑、格式转换、压缩优化等实用工具。支持批量处理，操作简单，完全免费。',
    siteName: 'Sheep Utils',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sheep Utils - 在线工具集',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sheep Utils - 在线工具集',
    description: '功能强大的在线工具集，提供图片处理、SVG编辑等实用工具',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // 需要替换为实际的验证码
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}>
        <GoogleAnalytics />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 flex justify-center">
            <div className="container">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
