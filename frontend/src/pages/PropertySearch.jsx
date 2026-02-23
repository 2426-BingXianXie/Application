import React, { useState } from 'react'
import { Search, MapPin, FileText, Loader2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import propertyRecordsService from '../services/propertyRecordsService'

const PropertySearch = () => {
    const [address, setAddress] = useState('')
    const [parcel, setParcel] = useState('')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSearch = async (e) => {
        e?.preventDefault()
        if (!address.trim() && !parcel.trim()) return
        try {
            setLoading(true)
            setError(null)
            const data = await propertyRecordsService.search({ address: address.trim() || undefined, parcel: parcel.trim() || undefined })
            const list = Array.isArray(data) ? data : data?.content ?? data?.items ?? data?.records ?? []
            setResults(list)
        } catch (e) {
            setError(e?.message || 'Search failed')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Property Records Search
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Search and request inspectional services records by address or parcel ID.
                </p>
            </div>

            <form onSubmit={handleSearch} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 1305 Hancock St, Quincy MA"
                    />
                    <Input
                        label="Parcel ID"
                        value={parcel}
                        onChange={(e) => setParcel(e.target.value)}
                        placeholder="Parcel or lot number"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={loading || (!address.trim() && !parcel.trim())}
                    startIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                >
                    {loading ? 'Searching…' : 'Search'}
                </Button>
            </form>

            {error && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-amber-800 dark:text-amber-200 text-sm">
                    {error}
                </div>
            )}

            {results !== null && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <h2 className="font-semibold text-gray-900 dark:text-white">Results</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {Array.isArray(results) ? results.length : 0} record(s) found
                        </p>
                    </div>
                    {!Array.isArray(results) || results.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <MapPin className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                            <p>No property records match your search.</p>
                            <p className="text-sm mt-1">Try a different address or parcel ID.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {results.map((record, i) => (
                                <li key={record.id || i} className="px-4 py-4">
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {record.address || record.propertyAddress || 'Unknown address'}
                                            </p>
                                            {record.parcelId && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Parcel: {record.parcelId}
                                                </p>
                                            )}
                                            {record.recordType && (
                                                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                    {record.recordType}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default PropertySearch
