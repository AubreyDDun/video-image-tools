// 简单的 i18n 实现（使用 URL 参数切换语言）

export type Locale = 'zh' | 'en';

export const translations = {
  zh: {
    nav: {
      home: '首页',
      videoCompress: '视频压缩',
      videoConvert: '格式转换',
      imageCompress: '图片压缩',
    },
    home: {
      title: '浏览器端视频工具站',
      subtitle: '免费在线视频处理工具，所有处理都在您的浏览器中完成，文件不会上传到服务器',
      secure: '安全隐私',
      fast: '快速处理',
      free: '完全免费',
    },
    compress: {
      title: '视频压缩',
      subtitle: '在线压缩视频文件，支持 MP4、MOV、HEVC、AVI、WebM 等格式',
      start: '开始压缩',
      quality: '压缩质量',
      download: '下载压缩后的视频',
    },
    convert: {
      title: '视频格式转换',
      subtitle: '在线转换视频格式，支持 MP4、WebM、MOV、AVI、GIF',
      selectFormat: '选择目标格式',
      start: '转换为 {format}',
      download: '下载转换后的视频',
    },
    image: {
      title: '图片压缩',
      subtitle: '在线压缩图片，支持 JPG、PNG、WebP 格式',
      start: '开始压缩',
      quality: '压缩质量',
      download: '下载压缩后的图片',
    },
  },
  en: {
    nav: {
      home: 'Home',
      videoCompress: 'Video Compress',
      videoConvert: 'Format Converter',
      imageCompress: 'Image Compress',
    },
    home: {
      title: 'Browser-Based Video Tools',
      subtitle: 'Free online video processing tools. All processing happens in your browser - files are never uploaded.',
      secure: 'Secure & Private',
      fast: 'Fast Processing',
      free: 'Completely Free',
    },
    compress: {
      title: 'Video Compressor',
      subtitle: 'Compress video files online. Supports MP4, MOV, HEVC, AVI, WebM and more.',
      start: 'Start Compression',
      quality: 'Compression Quality',
      download: 'Download Compressed Video',
    },
    convert: {
      title: 'Video Format Converter',
      subtitle: 'Convert video formats online. Supports MP4, WebM, MOV, AVI, GIF.',
      selectFormat: 'Select Target Format',
      start: 'Convert to {format}',
      download: 'Download Converted Video',
    },
    image: {
      title: 'Image Compressor',
      subtitle: 'Compress images online. Supports JPG, PNG, WebP.',
      start: 'Start Compression',
      quality: 'Compression Quality',
      download: 'Download Compressed Image',
    },
  },
};

export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'zh';
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  if (lang === 'en') return 'en';
  return 'zh';
}

export function t(locale: Locale, path: string): string {
  const keys = path.split('.');
  let value: any = translations[locale];
  for (const key of keys) {
    value = value?.[key];
  }
  return value || path;
}

export function switchLocale(locale: Locale) {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  window.location.href = url.toString();
}
