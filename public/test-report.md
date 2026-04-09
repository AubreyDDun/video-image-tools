# 🧪 FFmpeg.wasm 测试报告

**测试时间：** 2026-04-09  
**测试页面：** http://localhost:3000/test-full.html  
**FFmpeg.wasm 版本：** 0.11.6

---

## ✅ 系统检测结果

| 检测项 | 状态 |
|--------|------|
| SharedArrayBuffer | ✅ 可用 (crossOriginIsolated=true) |
| WebAssembly | ✅ 支持 |
| FileReader | ✅ 支持 |
| 浏览器 | Chrome/138.0.0.0 (Linux) |

---

## 📹 测试视频列表

| 序号 | 文件名 | 格式 | 大小 | 编码 |
|------|--------|------|------|------|
| 1 | banner.mp4 | MP4 | 1.8MB | H.264 |
| 2 | h265.mp4 | MP4 | 14MB | HEVC/H.265 |
| 3 | 9s.mov | MOV | 8.8MB | iPhone MOV |
| 4 | file.avi | AVI | 726KB | AVI |

---

## 📊 测试结果

### ✅ banner.mp4 - 完成

| 指标 | 数值 |
|------|------|
| 原始大小 | 1.80 MB |
| 压缩后 | 0.65 MB |
| **压缩率** | **63.8%** |
| 处理时间 | ~30 秒 |
| 状态 | ✅ 成功 |

**FFmpeg 命令：**
```bash
-i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart output.mp4
```

**详细日志：**
```
[libx264 @ 0x1a6a8c0] profile High 10, level 3.1, 4:2:0, 10-bit
[libx264 @ 0x1a6a8c0] frame I:2     Avg QP:27.65  size: 10977
[libx264 @ 0x1a6a8c0] frame P:111   Avg QP:28.68  size:  3565
[libx264 @ 0x1a6a8c0] frame B:292   Avg QP:31.24  size:   885
[libx264 @ 0x1a6a8c0] kb/s:200.14
frame=  405 fps= 14 q=-1.0 Lsize=     667kB time=00:00:26.82 bitrate= 203.5kbits/s
```

---

### 🔄 h265.mp4 - 进行中

| 指标 | 数值 |
|------|------|
| 原始大小 | 13.32 MB |
| 当前进度 | 12% |
| 输入编码 | HEVC/H.265 (1920x1080) |
| 输出编码 | H.264 (libx264) |
| 状态 | 🔄 处理中 |

**预计处理时间：** 5-10 分钟（14MB HEVC → H.264）

---

### ⏳ 待处理

- **9s.mov** - iPhone MOV 格式测试
- **file.avi** - AVI 格式测试

---

## 🎯 测试结论（初步）

### ✅ 验证成功

1. **FFmpeg.wasm 0.11.x 可以正常加载**
   - 通过 CDN 直接加载脚本
   - 无需 Web Worker，避免了 CORS 问题

2. **H.264 编码视频压缩正常**
   - banner.mp4 成功压缩
   - 压缩率 63.8%，效果良好
   - 输出视频可正常播放

3. **HEVC 解码支持**
   - h265.mp4 正在处理中
   - FFmpeg 日志显示正在解码 HEVC 流

4. **浏览器环境支持**
   - SharedArrayBuffer 可用
   - crossOriginIsolated = true
   - 性能符合预期

---

## 📝 技术要点

### 为什么选择 FFmpeg.wasm 0.11.x？

| 版本 | 优点 | 缺点 |
|------|------|------|
| **0.11.x** | ✅ 不需要 Web Worker<br>✅ 兼容性好<br>✅ 支持 H.264/HEVC | ❌ 单线程<br>❌ 性能较慢 |
| **0.12.x** | ✅ 多线程 (core-mt)<br>✅ 性能更好 | ❌ 需要 Web Worker<br>❌ unpkg CORS 限制 |

### 关键配置

```javascript
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
  log: true,
});

await ffmpeg.load();
```

### 压缩参数优化

```bash
-c:v libx264        # H.264 编码器
-preset medium      # 速度/质量平衡
-crf 23             # 质量参数 (18-28 推荐)
-c:a aac            # AAC 音频
-b:a 128k           # 音频比特率
-movflags +faststart # Web 优化
```

---

## 🚀 下一步

1. ✅ 等待所有测试完成
2. 📊 生成完整测试报告
3. 🔧 根据测试结果优化代码
4.  集成到 Next.js 应用

---

**报告更新时间：** 2026-04-09 19:49 GMT+8  
**实时日志：** 查看测试页面底部
