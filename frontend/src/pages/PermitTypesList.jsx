import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    FileText,
    ChevronRight,
    Building,
    Zap,
    Wrench,
    MapPin,
    Scale,
    ClipboardCheck,
    FileCheck,
    Loader2
} from 'lucide-react'
import { QUINCY_PERMIT_TYPES } from '../utils/constants'
import permitTypesService from '../services/permitTypesService'

const categoryIcons = {
    Building: Building,
    Inspection: ClipboardCheck,
    Environmental: MapPin,
    Zoning: Scale,
    Trade: Wrench,
    Infrastructure: Zap,
    License: FileCheck,
    Housing: Building,
    Appeals: Scale
}

const PermitTypesList = () => {
    const [permitTypes, setPermitTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await permitTypesService.getAll()
                const list = Array.isArray(data) ? data : data?.content ?? data?.items ?? []
                if (list.length > 0) {
                    setPermitTypes(list)
                } else {
                    setPermitTypes(QUINCY_PERMIT_TYPES)
                }
            } catch (e) {
                setPermitTypes(QUINCY_PERMIT_TYPES)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const byCategory = permitTypes.reduce((acc, p) => {
        const cat = p.category || 'Other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(p)
        return acc
    }, {})

    const categoryOrder = [
        'Building',
        'Trade',
        'Inspection',
        'Zoning',
        'License',
        'Infrastructure',
        'Environmental',
        'Housing',
        'Appeals',
        'Other'
    ]
    const sortedCategories = Object.keys(byCategory).sort(
        (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b) || a.localeCompare(b)
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading permit types…</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Apply for a Permit
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Select a permit type below to start your application. You can save a draft and return later.
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-amber-800 dark:text-amber-200 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-10">
                {sortedCategories.map((category) => {
                    const Icon = categoryIcons[category] || FileText
                    const items = byCategory[category] || []

                    return (
                        <section key={category}>
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                <Icon className="h-5 w-5 text-blue-600" />
                                {category}
                            </h2>
                            <ul className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                                {items.map((type) => {
                                    const slug = type.slug || type.id?.toString?.() || ''
                                    const name = type.name || type.title || 'Unnamed'
                                    const description = type.description || ''

                                    return (
                                        <li key={slug || name}>
                                            <Link
                                                to={slug ? `/apply/${slug}` : '/apply'}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
                                            >
                                                <div className="min-w-0 flex-1 pr-3">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                                        {name}
                                                    </p>
                                                    {description && (
                                                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                            {description}
                                                        </p>
                                                    )}
                                                </div>
                                                <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    )
                })}
            </div>
        </div>
    )
}

export default PermitTypesList
