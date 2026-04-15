import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 支持的语言列表
  locales: ['zh', 'en'],
  
  // 默认语言
  defaultLocale: 'zh',
  
  // 语言检测策略
  localeDetection: true,
});

export const config = {
  // 只对页面路由生效，排除静态资源和 API
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
