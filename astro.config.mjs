import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [react()],
  // Old talltimbersrfs.com routes -> new funnel, so live Google Ads final URLs
  // and indexed pages keep resolving after the cutover.
  redirects: {
    '/lp/georgia-dscr': '/',
    '/lp/florida-dscr': '/',
    '/privacy-policy': '/privacy',
    '/terms-of-service': '/legal',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
