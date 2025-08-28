import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

const Card = ({
                  children,
                  title,
                  subtitle,
                  actions,
                  className = '',
                  headerClassName = '',
                  bodyClassName = '',
                  footerClassName = '',
                  ...props
              }) => {
    return (
        <div
            className={clsx(
                'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
                className
            )}
            {...props}
        >
            {/* Header */}
            {(title || subtitle || actions) && (
                <div className={clsx(
                    'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
                    headerClassName
                )}>
                    <div className="flex items-center justify-between">
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {actions && (
                            <div className="flex items-center space-x-2">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Body */}
            <div className={clsx('px-6 py-4', bodyClassName)}>
                {children}
            </div>
        </div>
    )
}

// Stats Card Component
export const StatsCard = ({
                              title,
                              value,
                              change,
                              changeType = 'neutral',
                              icon,
                              href,
                              className = ''
                          }) => {
    const getChangeColor = () => {
        switch (changeType) {
            case 'positive':
                return 'text-green-600 dark:text-green-400'
            case 'negative':
                return 'text-red-600 dark:text-red-400'
            default:
                return 'text-gray-600 dark:text-gray-400'
        }
    }

    const getChangeIcon = () => {
        switch (changeType) {
            case 'positive':
                return <TrendingUp className="h-4 w-4" />
            case 'negative':
                return <TrendingDown className="h-4 w-4" />
            default:
                return null
        }
    }

    const content = (
        <Card className={clsx('hover:shadow-md transition-shadow', className)}>
            <div className="flex items-center">
                {icon && (
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            {icon}
                        </div>
                    </div>
                )}

                <div className={clsx('flex-1', icon && 'ml-4')}>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </div>
                    {change && (
                        <div className={clsx('flex items-center text-sm', getChangeColor())}>
                            {getChangeIcon()}
                            <span className="ml-1">{change}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )

    return href ? (
        <a href={href} className="block">
            {content}
        </a>
    ) : content
}

export default Card