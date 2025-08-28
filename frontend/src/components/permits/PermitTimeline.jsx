import React from 'react'
import {
    FileText,
    Send,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    MessageCircle,
    Upload,
    Download,
    Edit
} from 'lucide-react'
import clsx from 'clsx'
import { formatDate, getRelativeTime } from '../../utils/formatters'

const PermitTimeline = ({
                            permitId,
                            timeline = [],
                            loading = false,
                            showActions = true
                        }) => {

    // Default timeline events if none provided
    const defaultTimeline = [
        {
            id: 1,
            type: 'created',
            title: 'Application Created',
            description: 'Permit application was created',
            timestamp: new Date().toISOString(),
            user: 'System',
            status: 'completed'
        }
    ]

    const events = timeline.length > 0 ? timeline : defaultTimeline

    // Get event configuration
    const getEventConfig = (event) => {
        const configs = {
            created: {
                icon: FileText,
                bgColor: 'bg-blue-100 dark:bg-blue-900',
                iconColor: 'text-blue-600 dark:text-blue-400',
                borderColor: 'border-blue-200 dark:border-blue-700'
            },
            submitted: {
                icon: Send,
                bgColor: 'bg-blue-100 dark:bg-blue-900',
                iconColor: 'text-blue-600 dark:text-blue-400',
                borderColor: 'border-blue-200 dark:border-blue-700'
            },
            under_review: {
                icon: Eye,
                bgColor: 'bg-amber-100 dark:bg-amber-900',
                iconColor: 'text-amber-600 dark:text-amber-400',
                borderColor: 'border-amber-200 dark:border-amber-700'
            },
            approved: {
                icon: CheckCircle,
                bgColor: 'bg-green-100 dark:bg-green-900',
                iconColor: 'text-green-600 dark:text-green-400',
                borderColor: 'border-green-200 dark:border-green-700'
            },
            rejected: {
                icon: XCircle,
                bgColor: 'bg-red-100 dark:bg-red-900',
                iconColor: 'text-red-600 dark:text-red-400',
                borderColor: 'border-red-200 dark:border-red-700'
            },
            comment: {
                icon: MessageCircle,
                bgColor: 'bg-gray-100 dark:bg-gray-700',
                iconColor: 'text-gray-600 dark:text-gray-400',
                borderColor: 'border-gray-200 dark:border-gray-600'
            },
            document_uploaded: {
                icon: Upload,
                bgColor: 'bg-purple-100 dark:bg-purple-900',
                iconColor: 'text-purple-600 dark:text-purple-400',
                borderColor: 'border-purple-200 dark:border-purple-700'
            },
            document_downloaded: {
                icon: Download,
                bgColor: 'bg-indigo-100 dark:bg-indigo-900',
                iconColor: 'text-indigo-600 dark:text-indigo-400',
                borderColor: 'border-indigo-200 dark:border-indigo-700'
            },
            updated: {
                icon: Edit,
                bgColor: 'bg-gray-100 dark:bg-gray-700',
                iconColor: 'text-gray-600 dark:text-gray-400',
                borderColor: 'border-gray-200 dark:border-gray-600'
            }
        }

        return configs[event.type] || configs.comment
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3 animate-pulse">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {events.map((event, eventIdx) => {
                    const config = getEventConfig(event)
                    const Icon = config.icon
                    const isLast = eventIdx === events.length - 1

                    return (
                        <li key={event.id || eventIdx}>
                            <div className="relative pb-8">
                                {/* Connector line */}
                                {!isLast && (
                                    <span
                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                                        aria-hidden="true"
                                    />
                                )}

                                <div className="relative flex items-start space-x-3">
                                    {/* Event Icon */}
                                    <div className="relative">
                                        <div className={clsx(
                                            'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900',
                                            config.bgColor
                                        )}>
                                            <Icon className={clsx('h-4 w-4', config.iconColor)} />
                                        </div>
                                    </div>

                                    {/* Event Content */}
                                    <div className="min-w-0 flex-1">
                                        <div>
                                            <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </span>
                                            </div>

                                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                                {event.description}
                                            </p>

                                            {/* Additional event details */}
                                            {event.details && (
                                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                                    {event.details}
                                                </div>
                                            )}

                                            {/* Event metadata */}
                                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {formatDate(event.timestamp, 'datetime')}
                        </span>
                                                <span>•</span>
                                                <span>
                          {getRelativeTime(event.timestamp)}
                        </span>
                                                {event.user && (
                                                    <>
                                                        <span>•</span>
                                                        <span>by {event.user}</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Event actions */}
                                            {showActions && event.actions && event.actions.length > 0 && (
                                                <div className="mt-3 flex items-center space-x-2">
                                                    {event.actions.map((action, actionIdx) => (
                                                        <button
                                                            key={actionIdx}
                                                            onClick={action.onClick}
                                                            className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                                        >
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default PermitTimeline