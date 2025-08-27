import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'

export const useSearch = ({
                              searchFunction,
                              debounceDelay = 300,
                              minSearchLength = 2,
                              initialQuery = ''
                          }) => {
    const [query, setQuery] = useState(initialQuery)
    const [results, setResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState(null)

    const debouncedQuery = useDebounce(query, debounceDelay)

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.length < minSearchLength) {
                setResults([])
                return
            }

            setIsSearching(true)
            setError(null)

            try {
                const searchResults = await searchFunction(debouncedQuery)
                setResults(searchResults)
            } catch (err) {
                setError(err.message || 'Search failed')
                setResults([])
            } finally {
                setIsSearching(false)
            }
        }

        performSearch()
    }, [debouncedQuery, searchFunction, minSearchLength])

    const clearSearch = () => {
        setQuery('')
        setResults([])
        setError(null)
    }

    return {
        query,
        setQuery,
        results,
        isSearching,
        error,
        clearSearch,
        hasResults: results.length > 0
    }
}