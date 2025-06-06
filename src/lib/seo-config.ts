// SEO 配置文件
export const seoConfig = {
  // 基础信息
  siteName: 'Sheep Utils',
  siteUrl: 'https://sheep-utils.vercel.app',
  defaultTitle: 'Sheep Utils - 在线工具集',
  defaultDescription: '功能强大的在线工具集，提供图片处理、SVG编辑、格式转换、压缩优化等实用工具。支持批量处理，操作简单，完全免费。',
  
  // 默认关键词
  defaultKeywords: [
    '在线工具',
    '图片处理',
    'SVG编辑器',
    '图片压缩',
    '格式转换',
    '图片转换',
    '在线编辑器',
    '免费工具',
    '批量处理',
    '图片优化',
    'EXIF信息',
    '图片工具'
  ],
  
  // Open Graph 默认图片
  defaultOgImage: '/og-image.png',
  
  // 作者信息
  author: {
    name: 'Sheep Utils',
    url: 'https://sheep-utils.vercel.app'
  },
  
  // 社交媒体
  social: {
    twitter: '@sheep_utils', // 如果有的话
  },
  
  // 页面特定配置
  pages: {
    home: {
      title: '在线工具集 - 图片处理、SVG编辑器等实用工具',
      description: 'Sheep Utils 提供专业的在线工具集，包括图片格式转换、压缩优化、SVG编辑器、EXIF信息查看等功能。支持批量处理，操作简单，完全免费使用。',
      keywords: [
        '在线工具集',
        '图片处理工具',
        'SVG在线编辑器',
        '图片格式转换',
        '图片压缩',
        '免费在线工具',
        '批量图片处理',
        'EXIF信息查看'
      ]
    },
    imageTools: {
      title: '在线图片处理工具 - 格式转换、压缩、调整大小',
      description: '专业的在线图片处理工具，支持PNG、JPEG、WebP格式转换，图片压缩优化，尺寸调整，EXIF信息查看。支持批量处理，拖拽上传，完全免费使用。',
      keywords: [
        '图片处理工具',
        '图片格式转换',
        '图片压缩',
        '图片尺寸调整',
        'PNG转JPEG',
        'JPEG转PNG',
        'WebP转换',
        'EXIF信息查看',
        '批量图片处理',
        '在线图片编辑',
        '免费图片工具'
      ]
    },
    svgEditor: {
      title: '在线SVG编辑器 - 代码编辑、实时预览、格式转换',
      description: '专业的在线SVG编辑器，支持代码编辑、实时预览、格式化、多格式导出。基于Monaco Editor，支持语法高亮、代码补全，完全免费使用。',
      keywords: [
        'SVG编辑器',
        '在线SVG编辑',
        'SVG代码编辑器',
        'SVG转PNG',
        'SVG转JPEG',
        'SVG格式化',
        'SVG实时预览',
        'Monaco Editor',
        '免费SVG工具',
        '在线矢量编辑',
        'SVG优化工具'
      ]
    }
  }
};

// 生成结构化数据的辅助函数
export const generateWebApplicationSchema = (config: {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  featureList: string[];
  supportedFormat?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": config.name,
  "description": config.description,
  "url": config.url,
  "applicationCategory": config.applicationCategory,
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  },
  "featureList": config.featureList,
  ...(config.supportedFormat && { "supportedFormat": config.supportedFormat }),
  "browserRequirements": "Chrome, Firefox, Safari, Edge",
  "author": {
    "@type": "Organization",
    "name": seoConfig.author.name
  }
});

// 生成面包屑导航结构化数据
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
}); 