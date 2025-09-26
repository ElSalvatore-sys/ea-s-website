import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  
  // Optimize dependencies for mobile performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'clsx',
      'react-intersection-observer'
    ],
    exclude: ['lucide-react', 'framer-motion'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  
  // Aggressive mobile-first build optimizations
  build: {
    target: 'es2020',
    minify: 'terser',
    modulePreload: false,
    // cssMinify: 'lightningcss', // Temporarily disabled
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        safari10: true
      }
    },
    rollupOptions: {
      output: {
        // Aggressive code splitting for mobile performance
        manualChunks: (id) => {
          // Core React bundle - keep small for fast initial load
          if (id.includes('react') && !id.includes('framer-motion')) {
            return 'react-core';
          }
          // Framer Motion - lazy load animations
          if (id.includes('framer-motion')) {
            return 'animations';
          }
          // Icons - separate chunk for better caching
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          // Supabase - separate for API functionality
          if (id.includes('@supabase')) {
            return 'database';
          }
          // Node modules optimization
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk names for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        }
      },
      external: [],
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false
      }
    },
    chunkSizeWarningLimit: 200, // Strict 200KB limit for mobile
    sourcemap: false,
    reportCompressedSize: true,
    // CSS code splitting
    cssCodeSplit: true,
    // Asset inlining threshold (2KB for mobile)
    assetsInlineLimit: 2048
  },
  
  // Development server configuration
  server: {
    port: 12500,
    proxy: {
      // Proxy API calls to backend server running on port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});