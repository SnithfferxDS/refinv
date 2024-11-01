import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import db from '@astrojs/db';

export default defineConfig({
  integrations: [tailwind(), db()],
});