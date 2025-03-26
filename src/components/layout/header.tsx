"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-2 pl-4">
            <span className="text-xl font-bold">Sheep Utils</span>
          </Link>
          {!isHomePage && (
            <nav className="flex items-center space-x-8 text-sm font-medium">
              <Link href="/tools/image" className="transition-colors hover:text-foreground/80">
                图片工具
              </Link>
              <Link href="/svg-editor" className="transition-colors hover:text-foreground/80">
                SVG 工具
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
} 