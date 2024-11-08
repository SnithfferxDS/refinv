/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  APP_URL: string;
  APP_NAME: string;
  APP_DESCRIPTION: string;
  APP_VERSION: string;
  APP_SHORT_VERSION: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}