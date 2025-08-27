/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            // Custom colors for permit management system
            colors: {
                // Brand colors
                brand: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a'
                },

                // Permit status colors
                status: {
                    draft: {
                        50: '#f9fafb',
                        100: '#f3f4f6',
                        500: '#6b7280',
                        600: '#4b5563'
                    },
                    submitted: {
                        50: '#eff6ff',
                        100: '#dbeafe',
                        500: '#3b82f6',
                        600: '#2563eb'
                    },
                    approved: {
                        50: '#ecfdf5',
                        100: '#d1fae5',
                        500: '#10b981',
                        600: '#059669'
                    },
                    rejected: {
                        50: '#fef2f2',
                        100: '#fee2e2',
                        500: '#ef4444',
                        600: '#dc2626'
                    },
                    expired: {
                        50: '#fefbeb',
                        100: '#fef3c7',
                        500: '#f59e0b',
                        600: '#d97706'
                    }
                },

                // Permit type colors
                permit: {
                    building: {
                        50: '#ecfdf5',
                        100: '#d1fae5',
                        500: '#10b981',
                        600: '#059669'
                    },
                    gas: {
                        50: '#fff7ed',
                        100: '#ffedd5',
                        500: '#f97316',
                        600: '#ea580c'
                    },
                    electrical: {
                        50: '#fef3c7',
                        100: '#fde68a',
                        500: '#f59e0b',
                        600: '#d97706'
                    }
                }
            },

            // Custom font families
            fontFamily: {
                sans: [
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Oxygen',
                    'Ubuntu',
                    'Cantarell',
                    'sans-serif'
                ],
                mono: [
                    'Fira Code',
                    'Monaco',
                    'Cascadia Code',
                    'Roboto Mono',
                    'monospace'
                ]
            },

            // Custom spacing
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem'
            },

            // Custom border radius
            borderRadius: {
                '4xl': '2rem'
            },

            // Custom box shadows
            boxShadow: {
                'inner-lg': 'inset 0 10px 15px -3px rgb(0 0 0 / 0.1)',
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
            },

            // Custom animations
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'fade-out': 'fadeOut 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'slide-out-left': 'slideOutLeft 0.3s ease-in',
                'bounce-soft': 'bounceSoft 1s ease-in-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite'
            },

            // Custom keyframes
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' }
                },
                slideUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                slideDown: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                slideInRight: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)'
                    }
                },
                slideOutLeft: {
                    '0%': {
                        opacity: '1',
                        transform: 'translateX(0)'
                    },
                    '100%': {
                        opacity: '0',
                        transform: 'translateX(-10px)'
                    }
                },
                bounceSoft: {
                    '0%, 20%, 53%, 80%, 100%': {
                        transform: 'translate3d(0,0,0)'
                    },
                    '40%, 43%': {
                        transform: 'translate3d(0, -6px, 0)'
                    },
                    '70%': {
                        transform: 'translate3d(0, -3px, 0)'
                    },
                    '90%': {
                        transform: 'translate3d(0, -1px, 0)'
                    }
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' }
                }
            },

            // Custom transitions
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
                '900': '900ms'
            },

            // Custom z-index values
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100'
            },

            // Custom line heights
            lineHeight: {
                '12': '3rem',
                '16': '4rem'
            },

            // Custom max widths
            maxWidth: {
                '8xl': '88rem',
                '9xl': '96rem'
            },

            // Custom aspect ratios
            aspectRatio: {
                '4/3': '4 / 3',
                '3/2': '3 / 2',
                '21/9': '21 / 9'
            },

            // Custom backdrop blur
            backdropBlur: {
                'xs': '2px'
            },

            // Custom backdrop brightness
            backdropBrightness: {
                25: '.25',
                175: '1.75'
            }
        }
    },

    plugins: [
        // Form plugin for better form styling
        require('@tailwindcss/forms')({
                                          strategy: 'class' // Use class strategy for more control
                                      }),

        // Typography plugin
        require('@tailwindcss/typography'),

        // Container queries plugin
        require('@tailwindcss/container-queries'),

        // Aspect ratio plugin (built into Tailwind 3.0+, but keeping for compatibility)
        require('@tailwindcss/aspect-ratio'),

        // Custom plugin for permit-specific utilities
        function({ addUtilities, addComponents, theme }) {
            // Custom utilities
            const newUtilities = {
                '.text-balance': {
                    'text-wrap': 'balance'
                },
                '.text-pretty': {
                    'text-wrap': 'pretty'
                },
                '.scrollbar-hide': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                },
                '.scrollbar-thin': {
                    'scrollbar-width': 'thin',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme('colors.gray.100')
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme('colors.gray.300'),
                        borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: theme('colors.gray.400')
                    }
                }
            }

            // Custom components
            const newComponents = {
                '.btn': {
                    '@apply inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200': {},
                    '@apply focus:outline-none focus:ring-2 focus:ring-offset-2': {},
                    '@apply disabled:opacity-50 disabled:cursor-not-allowed': {}
                },
                '.btn-sm': {
                    '@apply px-3 py-1.5 text-sm': {}
                },
                '.btn-md': {
                    '@apply px-4 py-2 text-sm': {}
                },
                '.btn-lg': {
                    '@apply px-6 py-3 text-base': {}
                },
                '.card': {
                    '@apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700': {}
                },
                '.card-hover': {
                    '@apply hover:shadow-md transition-shadow': {}
                },
                '.form-group': {
                    '@apply space-y-2': {}
                },
                '.form-input': {
                    '@apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600': {},
                    '@apply rounded-md shadow-sm bg-white dark:bg-gray-700': {},
                    '@apply text-gray-900 dark:text-white placeholder:text-gray-400': {},
                    '@apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500': {},
                    '@apply disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800': {}
                },
                '.form-select': {
                    '@apply form-input appearance-none bg-white dark:bg-gray-700': {},
                    'background-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    'background-position': 'right 0.5rem center',
                    'background-repeat': 'no-repeat',
                    'background-size': '1.5em 1.5em',
                    'padding-right': '2.5rem'
                },
                '.permit-status': {
                    '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {}
                },
                '.permit-status-draft': {
                    '@apply bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': {}
                },
                '.permit-status-submitted': {
                    '@apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': {}
                },
                '.permit-status-approved': {
                    '@apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': {}
                },
                '.permit-status-rejected': {
                    '@apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': {}
                }
            }

            addUtilities(newUtilities)
            addComponents(newComponents)
        }
    ]
}