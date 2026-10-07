interface ImportMetaEnv {
  /** Public URL of the deployed site, e.g. https://sreenathp.com (set in .env). */
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
