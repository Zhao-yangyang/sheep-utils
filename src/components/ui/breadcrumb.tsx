import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbSchema } from "@/lib/seo-config";
import { safeJsonStringify } from "@/lib/json-utils";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // 添加首页到面包屑开头
  const allItems = [{ name: "首页", href: "/" }, ...items];
  
  // 生成结构化数据
  const breadcrumbSchema = generateBreadcrumbSchema(
    allItems.map(item => ({
      name: item.name,
      url: `https://sheep-utils.vercel.app${item.href}`
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonStringify(breadcrumbSchema) }}
      />
      <nav 
        className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}
        aria-label="面包屑导航"
      >
        {allItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2" aria-hidden="true" />
            )}
            {index === 0 && (
              <Home className="h-4 w-4 mr-1" aria-hidden="true" />
            )}
            {index === allItems.length - 1 ? (
              <span 
                className="font-medium text-foreground"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
} 