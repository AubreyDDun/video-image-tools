import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  return {
    locale: locale || 'zh',
    messages: (await import(`./locales/${locale || 'zh'}.json`)).default
  };
});
