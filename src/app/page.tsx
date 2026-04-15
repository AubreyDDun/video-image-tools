'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations();

  const tools = [
    {
      href: '/video/compress',
      icon: t('tools.videoCompress.icon'),
      title: t('tools.videoCompress.title'),
      description: t('tools.videoCompress.description'),
      tags: ['MP4', 'MOV', 'HEVC'],
    },
    {
      href: '/video/convert',
      icon: t('tools.videoConvert.icon'),
      title: t('tools.videoConvert.title'),
      description: t('tools.videoConvert.description'),
      tags: ['MP4', 'WebM', 'MOV'],
    },
    {
      href: '/image/compress',
      icon: t('tools.imageCompress.icon'),
      title: t('tools.imageCompress.title'),
      description: t('tools.imageCompress.description'),
      tags: ['JPG', 'PNG', 'WebP'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span>🔒</span> {t('home.features.secure')}
          </span>
          <span className="flex items-center gap-1">
            <span>⚡</span> {t('home.features.fast')}
          </span>
          <span className="flex items-center gap-1">
            <span>💰</span> {t('home.features.free')}
          </span>
        </div>
      </div>

      {/* Supported Formats Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📁 {t('home.supportedFormats.video')}：</h2>
        <div className="flex flex-wrap gap-2">
          {['MP4', 'MOV', 'AVI', 'WebM', 'MKV', 'M4V', 'HEVC/H.265', '3GP', 'WMV', 'FLV'].map((fmt) => (
            <span key={fmt} className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-gray-700">
              {fmt}
            </span>
          ))}
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-3">🖼️ {t('home.supportedFormats.image')}：</h2>
        <div className="flex flex-wrap gap-2">
          {['JPG', 'JPEG', 'PNG', 'WebP', 'GIF', 'BMP', 'SVG'].map((fmt) => (
            <span key={fmt} className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-gray-700">
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {tool.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="py-12 border-t dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {t('home.whyChooseUs.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="text-4xl">🔒</div>
            <h3 className="font-bold text-gray-900 dark:text-white">{t('home.whyChooseUs.privacy.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t('home.whyChooseUs.privacy.desc')}
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-4xl">⚡</div>
            <h3 className="font-bold text-gray-900 dark:text-white">{t('home.whyChooseUs.fast.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t('home.whyChooseUs.fast.desc')}
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-4xl">💰</div>
            <h3 className="font-bold text-gray-900 dark:text-white">{t('home.whyChooseUs.free.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t('home.whyChooseUs.free.desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
