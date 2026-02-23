import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FileText, ArrowLeft, Loader2, Calendar } from 'lucide-react'
import Button from '../components/ui/Button'
import applicationService from '../services/applicationService'
import { PERMIT_STATUS_LABELS } from '../utils/constants'

const statusColors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    under_review: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const ApplicationDetail = () => {
    const { id } = useParams()
    const [application, setApplication] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!id) return
        applicationService
            .getById(id)
            .then(setApplication)
            .catch((e) => setError(e?.message || 'Failed to load application'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading application…</p>
            </div>
        )
    }

    if (error || !application) {
        return (
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 text-center">
                <p className="text-amber-800 dark:text-amber-200 font-medium">{error || 'Application not found.'}</p>
                <Button as={Link} to="/my-permits" variant="outline" className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Permits
                </Button>
            </div>
        )
    }

    const status = (application.status || 'draft').toLowerCase().replace(' ', '_')
    const statusClass = statusColors[status] || statusColors.draft
    const formData = application.formData || {}

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                to="/my-permits"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
                <ArrowLeft className="h-4 w-4" /> Back to My Permits
            </Link>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {application.permitTypeName || application.permitTypeSlug || 'Application'} #{application.id}
                            </p>
                            {application.submittedAt && (
                                <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    Submitted {new Date(application.submittedAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                        {PERMIT_STATUS_LABELS[status?.toUpperCase?.()?.replace(/-/g, '_')] || application.status || status}
                    </span>
                </div>
                <div className="px-6 py-4 space-y-3">
                    {Object.entries(formData).map(([key, value]) => {
                        if (value == null || value === '') return null
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
                        return (
                            <div key={key}>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                                <p className="text-gray-900 dark:text-white">{String(value)}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ApplicationDetail
