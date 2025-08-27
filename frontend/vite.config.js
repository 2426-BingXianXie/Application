import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
                                plugins: [react()],

                                // Path resolution
                                resolve: {
                                    alias: {
                                        '@': path.resolve(__dirname, './src'),
                                        '@components': path.resolve(__dirname, './src/components'),
                                        '@pages': path.resolve(__dirname, './src/pages'),
                                        '@services': path.resolve(__dirname, './src/services'),
                                        '@hooks': path.resolve(__dirname, './src/hooks'),
                                        '@context': path.resolve(__dirname, './src/context'),
                                        '@utils': path.resolve(__dirname, './src/utils'),
                                        '@styles': path.resolve(__dirname, './src/styles'),
                                        '@assets': path.resolve(__dirname, './src/assets')
                                    }
                                },

                                // Development server configuration
                                server: {
                                    port: 3000,
                                    host: true, // Listen on all addresses
                                    proxy: {
                                        // Proxy API requests to backend
                                        '/api': {
                                            target: 'http://localhost:8080',
                                            changeOrigin: true,
                                            secure: false
                                        }
                                    },
                                    // Enable CORS for development
                                    cors: true
                                },

                                // Build configuration
                                build: {
                                    // Output directory
                                    outDir: 'dist',

                                    // Generate source maps for production debugging
                                    sourcemap: true,

                                    // Chunk size warnings
                                    chunkSizeWarningLimit: 1000,

                                    // Rollup options
                                    rollupOptions: {
                                        output: {
                                            // Manual chunk splitting for better caching
                                            manualChunks: {
                                                // Vendor chunks
                                                'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                                                'ui-vendor': ['lucide-react', 'clsx'],
                                                'query-vendor': ['@tanstack/react-query'],
                                                'form-vendor': ['react-hook-form', '@hookform/resolvers', 'yup'],

                                                // App chunks
                                                'components': [
                                                    './src/components/ui/Button.jsx',
                                                    './src/components/ui/Input.jsx',
                                                    './src/components/ui/Select.jsx'
                                                ],
                                                'services': [
                                                    './src/services/api.js',
                                                    './src/services/permitService.js',
                                                    './src/services/authService.js'
                                                ]
                                            },

                                            // Asset file naming
                                            assetFileNames: (assetInfo) => {
                                                const info = assetInfo.name.split('.')
                                                const extType = info[info.length - 1]

                                                if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                                                    return `assets/images/[name]-[hash][extname]`
                                                }

                                                if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
                                                    return `assets/fonts/[name]-[hash][extname]`
                                                }

                                                return `assets/[name]-[hash][extname]`
                                            },

                                            // Chunk file naming
                                            chunkFileNames: 'assets/js/[name]-[hash].js',
                                            entryFileNames: 'assets/js/[name]-[hash].js'
                                        }
                                    },

                                    // Minification
                                    minify: 'terser',
                                    terserOptions: {
                                        compress: {
                                            drop_console: true,
                                            drop_debugger: true
                                        }
                                    }
                                },

                                // Environment variables
                                define: {
                                    // Global constants
                                    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
                                    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
                                },

                                // CSS configuration
                                css: {
                                    modules: {
                                        localsConvention: 'camelCase'
                                    },
                                    postcss: {
                                        plugins: [
                                            require('tailwindcss'),
                                            require('autoprefixer')
                                        ]
                                    }
                                },

                                // Optimization configuration
                                optimizeDeps: {
                                    include: [
                                        'react',
                                        'react-dom',
                                        'react-router-dom',
                                        '@tanstack/react-query',
                                        'axios',
                                        'lucide-react',
                                        'clsx',
                                        'date-fns'
                                    ],
                                    exclude: []
                                },

                                // Preview configuration (for vite preview)
                                preview: {
                                    port: 4173,
                                    host: true,
                                    proxy: {
                                        '/api': {
                                            target: 'http://localhost:8080',
                                            changeOrigin: true,
                                            secure: false
                                        }
                                    }
                                },

                                // Testing configuration
                                test: {
                                    globals: true,
                                    environment: 'jsdom',
                                    setupFiles: ['./src/test/setup.js'],
                                    css: false
                                }
                            })