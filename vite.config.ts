import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'EA-Solutions - Smart Living & AI Solutions',
        short_name: 'EA-Solutions',
        description: 'Premium AI-powered smart living and business automation solutions',
        theme_color: '#7c3aed',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    process.env.NODE_ENV === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  
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