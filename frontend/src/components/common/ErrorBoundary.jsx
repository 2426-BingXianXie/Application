import React from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        this.setState({
                          error: error,
                          errorInfo: errorInfo,
                      })

        // Log to console in development
        if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
            console.error('ErrorBoundary caught an error:', error, errorInfo)
        }

        // In production, you might want to log to an error reporting service
        // logErrorToService(error, errorInfo)
    }

    handleRetry = () => {
        this.setState({
                          hasError: false,
                          error: null,
                          errorInfo: null,
                      })
    }

    handleGoHome = () => {
        window.location.href = '/'
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                    <div className="max-w-lg w-full">
                        {/* Error Icon */}
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Something went wrong
                            </h1>

                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We're sorry, but something unexpected happened.
                                Our team has been notified and is working on a fix.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mb-8">
                            <button
                                onClick={this.handleRetry}
                                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go to Homepage
                            </button>

                            <button
                                onClick={this.handleReload}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reload Page
                            </button>
                        </div>

                        {/* Support Info */}
                        <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                If the problem persists, please contact support:
                            </p>
                            <a
                                href="mailto:support@permitmanagement.com"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                <Mail className="w-4 h-4 mr-1" />
                                support@permitmanagement.com
                            </a>
                        </div>

                        {/* Error Details (Development Only) */}
                        {import.meta.env.VITE_ENABLE_DEBUG === 'true' && this.state.error && (
                            <details className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Error Details (Development)
                                </summary>

                                <div className="text-xs space-y-2">
                                    <div>
                                        <strong className="text-red-600 dark:text-red-400">Error:</strong>
                                        <pre className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                      {this.state.error && this.state.error.toString()}
                    </pre>
                                    </div>

                                    {this.state.errorInfo && (
                                        <div>
                                            <strong className="text-red-600 dark:text-red-400">Stack Trace:</strong>
                                            <pre className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-gray-400 overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Environment Info */}
                        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                            <div>Environment: {import.meta.env.VITE_APP_ENVIRONMENT}</div>
                            <div>Version: {import.meta.env.VITE_APP_VERSION}</div>
                            <div>Timestamp: {new Date().toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary