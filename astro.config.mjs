import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

import db from '@astrojs/db';

export default defineConfig({
  integrations: [tailwind(), react(), sitemap(), db()],
  output: 'server',

  adapter: node({
    mode: 'standalone'
  })
});