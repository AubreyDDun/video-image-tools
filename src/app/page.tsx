import Link from 'next/link';

const tools = [
  {
    href: '/compress',
    icon: '🗜️',
    title: '视频压缩',
    description: '压缩视频文件大小，保持画质，支持 MP4、MOV、AVI 等格式',
    tags: ['视频压缩', '减小体积', '在线工具'],
  },
  {
    href: '/convert',
    icon: '🔄',
    title: '视频格式转换',
    description: '转换视频格式，支持 MP4、WebM、AVI、MOV、GIF 互转',
    tags: ['格式转换', '视频转换', 'MP4 转换'],
  },
  {
    href: '/image-compress',
    icon: '🖼️',
    title: '图片压缩',
    description: '压缩图片文件，支持 JPG、PNG、WebP，可调节质量和尺寸',
    tags: ['图片压缩', '缩小图片', '在线压缩'],
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold text-gray-900">
          浏览器端视频工具站
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          免费在线视频处理工具，所有处理都在您的浏览器中完成，
          <span className="font-medium text-blue-600">文件不会上传到服务器</span>
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span>🔒</span> 安全隐私
          </span>
          <span className="flex items-center gap-1">
            <span>⚡</span> 快速处理
          </span>
          <span className="flex items-center gap-1">
            <span>💰</span> 完全免费
          </span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
              {tool.title}
            </h2>
            <p className="text-gray-600 mb-4">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
              </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="py-12 border-t">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          为什么选择我们？
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="text-4xl">🔒</div>
            <h3 className="font-bold text-gray-900">隐私安全</h3>
            <p className="text-gray-600 text-sm">
              所有文件处理都在您的浏览器本地完成，不会上传到任何服务器
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-4xl">⚡</div>
            <h3 className="font-bold text-gray-900">快速高效</h3>
            <p className="text-gray-600 text-sm">
              利用 WebAssembly 技术，直接在浏览器中运行 FFmpeg，处理速度快
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-4xl">💰</div>
            <h3 className="font-bold text-gray-900">完全免费</h3>
            <p className="text-gray-600 text-sm">
              所有工具免费使用，无使用次数限制，无需注册
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="py-12 border-t space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          在线视频处理工具
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600">
            我们的在线视频工具站提供多种免费视频处理功能，包括视频压缩、视频格式转换、图片压缩等。
            所有工具都在浏览器中运行，无需安装任何软件，无需上传文件到服务器，保护您的隐私安全。
          </p>
          <p className="text-gray-600">
            <strong>视频压缩工具</strong>可以帮助您减小视频文件体积，方便分享和存储。
            <strong>视频格式转换工具</strong>支持 MP4、WebM、AVI、MOV 等多种格式互转。
            <strong>图片压缩工具</strong>可以压缩 JPG、PNG、WebP 格式的图片，减小文件大小。
          </p>
        </div>
      </div>
    </div>
  );
}
