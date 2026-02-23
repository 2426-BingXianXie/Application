import React, { useState, useEffect } from 'react'
import { FileText, Search, Download, FolderOpen, Loader2 } from 'lucide-react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import documentService from '../services/documentService'

const DEFAULT_CATEGORIES = [
    'Forms & Applications',
    'Guidelines',
    'Fees',
    'Laws & Regulations',
    'Inspectional Services',
    'Other'
]

const DocumentCenter = () => {
    const [documents, setDocuments] = useState([])
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
    const [searchName, setSearchName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const params = {}
                if (searchName) params.name = searchName
                if (selectedCategory) params.category = selectedCategory
                const data = await documentService.listDocuments(params)
                const list = Array.isArray(data) ? data : data?.content ?? data?.items ?? data?.documents ?? []
                setDocuments(list)
                if (data?.categories?.length) setCategories(data.categories)
            } catch (e) {
                setError(e?.message || 'Failed to load documents')
                setDocuments([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [searchName, selectedCategory])

    const handleDownload = async (doc) => {
        try {
            await documentService.downloadDocument(doc.id, doc.name || `document-${doc.id}`)
        } catch (e) {
            console.error('Download failed', e)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Document Center
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Browse and download public documents, forms, and guidelines.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Search by file name..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-800 dark:text-red-200 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading documents…</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
                    <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No documents found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Try a different search or category, or check back later.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                    {documents.map((doc) => (
                        <li
                            key={doc.id}
                            className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <FileText className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                        {doc.name || doc.fileName || `Document ${doc.id}`}
                                    </p>
                                    {doc.category && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{doc.category}</p>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(doc)}
                                startIcon={<Download className="h-4 w-4" />}
                            >
                                Download
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default DocumentCenter
