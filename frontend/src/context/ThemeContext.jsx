import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Theme Context
const ThemeContext = createContext()

// Theme actions
const THEME_ACTIONS = {
    SET_THEME: 'SET_THEME',
    TOGGLE_THEME: 'TOGGLE_THEME',
    SET_SYSTEM_THEME: 'SET_SYSTEM_THEME',
}

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme
    }

    // Default to system preference
    return 'system'
}

// Get resolved theme (actual light/dark, not system)
const getResolvedTheme = (theme) => {
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
}

// Initial state
const initialState = {
    theme: getInitialTheme(),
    resolvedTheme: getResolvedTheme(getInitialTheme()),
    systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
}

// Theme reducer
const themeReducer = (state, action) => {
    switch (action.type) {
        case THEME_ACTIONS.SET_THEME:
            const newTheme = action.payload.theme
            const newResolvedTheme = getResolvedTheme(newTheme)

            return {
                ...state,
                theme: newTheme,
                resolvedTheme: newResolvedTheme,
            }

        case THEME_ACTIONS.TOGGLE_THEME:
            const toggledTheme = state.resolvedTheme === 'light' ? 'dark' : 'light'
            return {
                ...state,
                theme: toggledTheme,
                resolvedTheme: toggledTheme,
            }

        case THEME_ACTIONS.SET_SYSTEM_THEME:
            const systemTheme = action.payload.systemTheme
            const resolvedTheme = state.theme === 'system' ? systemTheme : state.resolvedTheme

            return {
                ...state,
                systemTheme,
                resolvedTheme,
            }

        default:
            return state
    }
}

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, initialState)

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement

        // Remove previous theme classes
        root.classList.remove('light', 'dark')

        // Add current theme class
        root.classList.add(state.resolvedTheme)

        // Set CSS custom property for theme
        root.style.setProperty('--theme', state.resolvedTheme)

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name=theme-color]')
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                state.resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
            )
        }
    }, [state.resolvedTheme])

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e) => {
            const newSystemTheme = e.matches ? 'dark' : 'light'
            dispatch({
                         type: THEME_ACTIONS.SET_SYSTEM_THEME,
                         payload: { systemTheme: newSystemTheme }
                     })
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Save theme to localStorage
    useEffect(() => {
        localStorage.setItem('theme', state.theme)
    }, [state.theme])

    // Set theme function
    const setTheme = (theme) => {
        if (!['light', 'dark', 'system'].includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Using 'system' instead.`)
            theme = 'system'
        }

        dispatch({
                     type: THEME_ACTIONS.SET_THEME,
                     payload: { theme }
                 })
    }

    // Toggle between light and dark (ignores system)
    const toggleTheme = () => {
        dispatch({ type: THEME_ACTIONS.TOGGLE_THEME })
    }

    // Get theme icon for UI
    const getThemeIcon = () => {
        switch (state.theme) {
            case 'light':
                return '☀️'
            case 'dark':
                return '🌙'
            case 'system':
                return '💻'
            default:
                return '💻'
        }
    }

    // Get theme display name
    const getThemeDisplayName = () => {
        switch (state.theme) {
            case 'light':
                return 'Light'
            case 'dark':
                return 'Dark'
            case 'system':
                return 'System'
            default:
                return 'System'
        }
    }

    // Check if theme is dark
    const isDark = state.resolvedTheme === 'dark'

    // Check if theme is light
    const isLight = state.resolvedTheme === 'light'

    // Check if using system preference
    const isSystem = state.theme === 'system'

    const value = {
        // Current theme settings
        theme: state.resolvedTheme, // This is the actual theme (light/dark)
        selectedTheme: state.theme, // This includes 'system'
        systemTheme: state.systemTheme,

        // Theme state helpers
        isDark,
        isLight,
        isSystem,

        // Theme actions
        setTheme,
        toggleTheme,

        // UI helpers
        getThemeIcon,
        getThemeDisplayName,

        // Available themes
        themes: [
            { value: 'light', label: 'Light', icon: '☀️' },
            { value: 'dark', label: 'Dark', icon: '🌙' },
            { value: 'system', label: 'System', icon: '💻' },
        ],
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

// Hook to use theme context
export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}