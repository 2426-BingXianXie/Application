import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { storageUtils } from '../utils/storageUtils'

// Theme Context
const ThemeContext = createContext()

// Theme types
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
}

// Action types
const THEME_ACTIONS = {
    SET_THEME: 'SET_THEME',
    SET_SYSTEM_PREFERENCE: 'SET_SYSTEM_PREFERENCE',
    TOGGLE_THEME: 'TOGGLE_THEME'
}

// Initial state
const initialState = {
    theme: THEMES.SYSTEM, // User's preference: light, dark, or system
    systemPreference: THEMES.LIGHT, // System's actual preference
    actualTheme: THEMES.LIGHT, // The theme actually being applied
    isSystemDark: false
}

// Theme reducer
const themeReducer = (state, action) => {
    switch (action.type) {
        case THEME_ACTIONS.SET_THEME: {
            const newTheme = action.payload
            let actualTheme = newTheme

            // If system theme is selected, use system preference
            if (newTheme === THEMES.SYSTEM) {
                actualTheme = state.systemPreference
            }

            return {
                ...state,
                theme: newTheme,
                actualTheme
            }
        }

        case THEME_ACTIONS.SET_SYSTEM_PREFERENCE: {
            const systemPreference = action.payload
            let actualTheme = state.actualTheme

            // If user has selected system theme, update actual theme
            if (state.theme === THEMES.SYSTEM) {
                actualTheme = systemPreference
            }

            return {
                ...state,
                systemPreference,
                actualTheme,
                isSystemDark: systemPreference === THEMES.DARK
            }
        }

        case THEME_ACTIONS.TOGGLE_THEME: {
            const newTheme = state.actualTheme === THEMES.LIGHT
                             ? THEMES.DARK
                             : THEMES.LIGHT

            return {
                ...state,
                theme: newTheme,
                actualTheme: newTheme
            }
        }

        default:
            return state
    }
}

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, initialState)

    // Apply theme to DOM
    const applyTheme = (theme) => {
        const root = window.document.documentElement

        // Remove existing theme classes
        root.classList.remove('light', 'dark')

        // Apply new theme
        if (theme === THEMES.DARK) {
            root.classList.add('dark')
            root.setAttribute('data-theme', 'dark')
        } else {
            root.classList.add('light')
            root.setAttribute('data-theme', 'light')
        }
    }

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = storageUtils.getTheme()
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
                                 ? THEMES.DARK
                                 : THEMES.LIGHT

        // Set system preference
        dispatch({
                     type: THEME_ACTIONS.SET_SYSTEM_PREFERENCE,
                     payload: systemPreference
                 })

        // Set user theme preference
        if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
            dispatch({
                         type: THEME_ACTIONS.SET_THEME,
                         payload: savedTheme
                     })
        } else {
            // Default to system theme
            dispatch({
                         type: THEME_ACTIONS.SET_THEME,
                         payload: THEMES.SYSTEM
                     })
        }
    }, [])

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleSystemThemeChange = (e) => {
            const systemPreference = e.matches ? THEMES.DARK : THEMES.LIGHT

            dispatch({
                         type: THEME_ACTIONS.SET_SYSTEM_PREFERENCE,
                         payload: systemPreference
                     })
        }

        mediaQuery.addEventListener('change', handleSystemThemeChange)

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange)
        }
    }, [])

    // Apply theme when actualTheme changes
    useEffect(() => {
        applyTheme(state.actualTheme)
    }, [state.actualTheme])

    // Save theme preference when it changes
    useEffect(() => {
        if (state.theme !== THEMES.SYSTEM || storageUtils.getTheme()) {
            storageUtils.setTheme(state.theme)
        }
    }, [state.theme])

    // Set theme function
    const setTheme = (theme) => {
        if (Object.values(THEMES).includes(theme)) {
            dispatch({
                         type: THEME_ACTIONS.SET_THEME,
                         payload: theme
                     })
        }
    }

    // Toggle between light and dark (skips system)
    const toggleTheme = () => {
        dispatch({ type: THEME_ACTIONS.TOGGLE_THEME })
    }

    // Get theme display name
    const getThemeDisplayName = (theme = state.theme) => {
        switch (theme) {
            case THEMES.LIGHT:
                return 'Light'
            case THEMES.DARK:
                return 'Dark'
            case THEMES.SYSTEM:
                return `System (${state.systemPreference === THEMES.DARK ? 'Dark' : 'Light'})`
            default:
                return 'Unknown'
        }
    }

    // Check if theme is dark
    const isDark = () => {
        return state.actualTheme === THEMES.DARK
    }

    // Check if theme is light
    const isLight = () => {
        return state.actualTheme === THEMES.LIGHT
    }

    // Check if using system theme
    const isSystemTheme = () => {
        return state.theme === THEMES.SYSTEM
    }

    // Get CSS variables for current theme
    const getThemeVars = () => {
        return state.actualTheme === THEMES.DARK
               ? {
                '--bg-primary': '17 24 39',
                '--bg-secondary': '31 41 55',
                '--text-primary': '249 250 251',
                '--text-secondary': '209 213 219'
            }
               : {
                '--bg-primary': '255 255 255',
                '--bg-secondary': '249 250 251',
                '--text-primary': '17 24 39',
                '--text-secondary': '75 85 99'
            }
    }

    // Context value
    const value = {
        // State
        theme: state.theme,
        actualTheme: state.actualTheme,
        systemPreference: state.systemPreference,
        isSystemDark: state.isSystemDark,

        // Actions
        setTheme,
        toggleTheme,

        // Utilities
        getThemeDisplayName,
        isDark,
        isLight,
        isSystemTheme,
        getThemeVars,

        // Theme constants
        themes: THEMES
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

// Custom hook to use theme context
export const useTheme = () => {
    const context = useContext(ThemeContext)

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }

    return context
}

export default ThemeContext