# Sheep Utils - 在线工具集

一个功能强大的在线工具集，包含图片处理、视频下载等功能。基于 Next.js 14 构建的现代化 Web 应用。

## 图片工具功能

### 基础功能
- 支持拖拽上传图片（使用 @dnd-kit/core）
- 支持剪贴板粘贴图片 (Ctrl+V)
- 支持图片预览、缩放、旋转（使用 react-image-crop）
- 支持图片拖拽排序（使用 @dnd-kit/sortable）
- 支持批量处理
- 支持文件打包下载（使用 jszip）

### 图片处理
- 格式转换：支持 PNG、JPEG、WebP 格式互转
- 图片压缩：支持质量调节
- 尺寸调整：支持保持宽高比
- 批量处理：支持多图同时处理
- 实时预览：所有操作都可以实时预览效果

### EXIF 信息查看
- 相机信息：制造商、型号、软件
- 拍摄参数：时间、曝光、光圈、ISO、焦距
- 图像信息：尺寸、方向
- GPS 信息：经纬度、位置名称（使用 OpenStreetMap API）
- 版权信息：版权、作者

### 键盘快捷键
- `←` : 选择上一张图片
- `→` : 选择下一张图片
- `Delete` : 删除选中的图片
- `Esc` : 取消选择
- `Ctrl+V` : 粘贴图片
- `Ctrl+C` : 复制处理后的图片

## 技术栈

### 核心框架
- Next.js 14 (App Router)
- TypeScript
- React 19

### UI 框架和组件
- Tailwind CSS
- shadcn/ui
- Radix UI 组件库
- Lucide React 图标

### 功能库
- @dnd-kit (拖拽功能)
- exifr (EXIF 解析)
- react-image-crop (图片裁剪)
- jszip (文件打包)
- react-hotkeys-hook (快捷键支持)

### 开发工具
- ESLint
- PostCSS
- TypeScript
- pnpm (包管理器)

## 使用限制

- 支持的图片格式：PNG、JPEG、WebP
- 单个文件大小限制：10MB
- 批量处理数量限制：最多 50 张图片
- 推荐浏览器：Chrome、Firefox、Edge 最新版本

## 开发计划

### 已完成
- [x] 图片上传（拖拽、粘贴）
- [x] 图片预览与基础编辑
- [x] EXIF 信息读取与展示
- [x] 图片格式转换
- [x] 图片压缩
- [x] 图片尺寸调整
- [x] 批量处理功能
- [x] 键盘快捷键支持
- [x] 文件打包下载

### 进行中
- [ ] 图片滤镜功能
- [ ] 图片水印功能
- [ ] 图片智能裁剪

### 待开发
- [ ] 使用 Web Workers 处理大文件
- [ ] 支持深色模式
- [ ] 添加多语言支持（i18n）
- [ ] 添加参数预设保存
- [ ] 优化移动端体验
- [ ] 添加更多图片编辑功能
- [ ] 支持更多图片格式（AVIF、HEIF）
- [ ] 添加图片批处理模板功能
- [ ] 集成图片 AI 增强功能

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行代码检查
pnpm lint
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 环境要求

- Node.js 18.0.0 或更高版本
- pnpm 8.0.0 或更高版本
- 现代浏览器（支持 ES6+）

## 部署

本项目可以部署在 Vercel 平台上：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sheep-utils)

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
