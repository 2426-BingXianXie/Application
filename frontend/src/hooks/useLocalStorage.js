import { useState, useEffect, useCallback } from 'react'

/**
 * useLocalStorage hook
 * Manages state synchronized with localStorage
 */
export const useLocalStorage = (key, initialValue) => {
    // Get value from localStorage or use initial value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = useCallback((value) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value

            setStoredValue(valueToStore)

            // Save to localStorage
            if (valueToStore === undefined) {
                window.localStorage.removeItem(key)
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error)
        }
    }, [key, storedValue])

    // Remove item from localStorage
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key)
            setStoredValue(initialValue)
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error)
        }
    }, [key, initialValue])

    return [storedValue, setValue, removeValue]
}

/**
 * useSessionStorage hook
 * Similar to useLocalStorage but uses sessionStorage
 */
export const useSessionStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading sessionStorage key "${key}":`, error)
            return initialValue
        }
    })

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value

            setStoredValue(valueToStore)

            if (valueToStore === undefined) {
                window.sessionStorage.removeItem(key)
            } else {
                window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            console.error(`Error setting sessionStorage key "${key}":`, error)
        }
    }, [key, storedValue])

    const removeValue = useCallback(() => {
        try {
            window.sessionStorage.removeItem(key)
            setStoredValue(initialValue)
        } catch (error) {
            console.error(`Error removing sessionStorage key "${key}":`, error)
        }
    }, [key, initialValue])

    return [storedValue, setValue, removeValue]
}

/**
 * useStorageState hook
 * Combines localStorage with state management and cross-tab synchronization
 */
export const useStorageState = (key, initialValue, storageType = 'localStorage') => {
    const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage

    const [value, setValue] = useState(() => {
        try {
            const item = storage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading ${storageType} key "${key}":`, error)
            return initialValue
        }
    })

    // Listen for storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.storageArea === storage) {
                try {
                    const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue
                    setValue(newValue)
                } catch (error) {
                    console.error(`Error parsing ${storageType} value for key "${key}":`, error)
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [key, initialValue, storage])

    const setStoredValue = useCallback((newValue) => {
        try {
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue

            setValue(valueToStore)

            if (valueToStore === undefined) {
                storage.removeItem(key)
            } else {
                storage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            console.error(`Error setting ${storageType} key "${key}":`, error)
        }
    }, [key, value, storage])

    const removeStoredValue = useCallback(() => {
        try {
            storage.removeItem(key)
            setValue(initialValue)
        } catch (error) {
            console.error(`Error removing ${storageType} key "${key}":`, error)
        }
    }, [key, initialValue, storage])

    return [value, setStoredValue, removeStoredValue]
}

export default useLocalStorage