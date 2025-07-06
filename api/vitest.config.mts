import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import * as path from 'path';

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: {
          configPath: './wrangler.jsonc',
        },
        main: './src/index.ts',
      },
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
