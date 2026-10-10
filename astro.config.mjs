// @ts-check
import { defineConfig } from 'astro/config';

// 블로그 주소. src/config.ts 의 SITE_URL 과 같게 유지하세요.
export default defineConfig({
  site: 'https://vibelabnotes.com',
  trailingSlash: 'ignore',
});
