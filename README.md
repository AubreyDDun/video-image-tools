# 浏览器端视频工具站

免费在线视频处理工具，使用 FFmpeg.wasm 在浏览器中完成视频处理，无需上传文件到服务器。

## 🚀 快速开始

### 本地开发

```bash
cd video-tools
npm install
npm run dev
```

访问 http://localhost:3000

### 部署到 Vercel

1. 安装 Vercel CLI（可选）：
```bash
npm i -g vercel
```

2. 部署：
```bash
vercel
```

或直接在 Vercel 官网导入 GitHub 仓库自动部署。

## 🛠️ 技术栈

- **框架**: Next.js 14 + App Router
- **样式**: Tailwind CSS
- **视频处理**: FFmpeg.wasm
- **部署**: Vercel

## 📁 项目结构

```
video-tools/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 全局布局 + SEO
│   │   ├── page.tsx            # 首页
│   │   ├── compress/           # 视频压缩
│   │   ├── convert/            # 视频格式转换
│   │   └── image-compress/     # 图片压缩
│   ├── components/
│   │   ├── FileUploader.tsx
│   │   ├── ProcessingStatus.tsx
│   │   └── DownloadButton.tsx
│   └── lib/ffmpeg/
│       ├── videoCompress.ts
│       ├── videoConvert.ts
│       └── imageCompress.ts
├── public/
└── package.json
```

## 🎯 功能列表

- ✅ 视频压缩（可调质量）
- ✅ 视频格式转换（MP4、WebM、AVI、MOV、GIF）
- ✅ 图片压缩（JPG、PNG、WebP）

## 📈 SEO 优化

- 每个工具独立页面
- Meta 标签优化
- 结构化数据（Schema.org）
- 语义化 HTML

## 💰 变现路径

### 阶段 1：AdSense（当前）
- 在页面侧边栏/底部添加广告位

### 阶段 2：付费功能
- 大文件处理（>500MB）
- 批量处理
- 无水印导出

### 阶段 3：API 服务
- 为开发者提供视频处理 API

## ⚠️ 注意事项

- FFmpeg.wasm 在浏览器中运行，大文件处理可能较慢
- 部分老旧浏览器可能不支持 WebAssembly
- 建议单个文件不超过 500MB

## 📝 待开发工具

- [ ] 视频剪辑
- [ ] 视频合并
- [ ] 视频分割
- [ ] 提取音频
- [ ] 添加水印
- [ ] GIF 制作
- [ ] 视频转图片

## 📄 License

MIT
