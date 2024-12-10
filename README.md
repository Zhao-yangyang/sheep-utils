# Sheep Utils - 在线工具集

一个功能强大的在线工具集，包含图片处理、视频下载等功能。

## 图片工具功能

### 基础功能
- 支持拖拽上传图片
- 支持剪贴板粘贴图片 (Ctrl+V)
- 支持图片预览、缩放、旋转
- 支持图片拖拽排序
- 支持批量处理

### 图片处理
- 格式转换：支持 PNG、JPEG、WebP 格式互转
- 图片压缩：支持质量调节
- 尺寸调整：支持保持宽高比
- 批量处理：支持多图同时处理

### EXIF 信息查看
- 相机信息：制造商、型号、软件
- 拍摄参数：时间、曝光、光圈、ISO、焦距
- 图像信息：尺寸、方向
- GPS 信息：经纬度、位置名称
- 版权信息：版权、作者

### 键盘快捷键
- `←` : 选择上一张图片
- `→` : 选择下一张图片
- `Delete` : 删除选中的图片
- `Esc` : 取消选择

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- exifr (EXIF 解析)
- OpenStreetMap API (地理位置解析)

## 使用限制

- 支持的图片格式：PNG、JPEG、WebP
- 单个文件大小限制：10MB

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

### 待开发
- [ ] 使用 Web Workers 处理大文件
- [ ] 支持深色模式
- [ ] 添加多语言支持
- [ ] 添加参数预设保存
- [ ] 优化移动端体验
- [ ] 添加更多图片编辑功能

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 部署

本项目可以部署在 Vercel 平台上：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sheep-utils)

## 许可证

MIT License
