import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '在线视频工具 - 视频压缩、格式转换、图片压缩免费工具',
  description: '免费在线视频处理工具，提供视频压缩、视频格式转换、图片压缩等功能。所有处理在浏览器本地完成，文件不上传服务器，安全快速。支持 MP4、MOV、HEVC 等格式。',
  keywords: '视频压缩，视频格式转换，图片压缩，在线视频工具，MP4 压缩，视频转换，HEVC，免费工具',
  authors: [{ name: '视频工具站' }],
  openGraph: {
    title: '在线视频工具 - 视频压缩、格式转换、图片压缩',
    description: '免费在线视频处理工具，所有处理在浏览器本地完成，安全快速。支持 HEVC/iPhone 格式。',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: '在线视频工具站',
              description: '免费在线视频处理工具，提供视频压缩、格式转换、图片压缩等功能',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'CNY',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <a href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                🎬 视频工具站
              </a>
              <div className="flex items-center gap-6">
                <a href="/video/compress" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  视频压缩
                </a>
                <a href="/video/convert" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  格式转换
                </a>
                <a href="/image/compress" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  图片压缩
                </a>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">工具列表</h3>
                <ul className="space-y-1">
                  <li><a href="/video/compress" className="hover:text-blue-600 dark:hover:text-blue-400">视频压缩</a></li>
                  <li><a href="/video/convert" className="hover:text-blue-600 dark:hover:text-blue-400">视频格式转换</a></li>
                  <li><a href="/image/compress" className="hover:text-blue-600 dark:hover:text-blue-400">图片压缩</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">关于我们</h3>
                <p>
                  免费在线视频处理工具，所有处理在浏览器本地完成，
                  保护您的隐私安全。支持 MP4、MOV、HEVC 等格式。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">技术支持</h3>
                <p>如有问题或建议，请联系我们。</p>
              </div>
            </div>
            <div className="border-t dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400 text-xs">
              <p>© 2026 视频工具站。All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
