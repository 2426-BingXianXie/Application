import { useState, useEffect } from 'react'

/**
 * useDebounce hook
 * Delays updating a value until after a specified delay
 * Useful for search inputs and API calls
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

/**
 * useDebounceCallback hook
 * Debounces a callback function
 */
export const useDebounceCallback = (callback, delay = 500, dependencies = []) => {
    const [debouncedCallback, setDebouncedCallback] = useState(null)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedCallback(() => callback)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [callback, delay, ...dependencies])

    return debouncedCallback
}

/**
 * useDebounceEffect hook
 * Debounces useEffect execution
 */
export const useDebounceEffect = (effect, dependencies, delay = 500) => {
    useEffect(() => {
        const handler = setTimeout(() => {
            effect()
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [...dependencies, delay])
}

export default useDebounce