import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    noDiscovery: true
  },

  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()]
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // ✅ ADD THIS BLOCK (THIS IS THE FIX)
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lodash')) return 'lodash';
            if (id.includes('vue')) return 'vendor';
            return 'vendor';
          }
        }
      }
    }
  }
});
