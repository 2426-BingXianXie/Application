import React from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            eventId: null
        }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error
        }
    }

    componentDidCatch(error, errorInfo) {
        // Generate unique error ID for tracking
        const eventId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        this.setState({
                          error,
                          errorInfo,
                          eventId
                      })

        // Log error details
        console.error('ErrorBoundary caught an error:', {
            error: error.toString(),
            errorInfo,
            eventId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        })
        // Report error to external service in production
        if (import.meta.env.PROD) {
            this.reportError(error, errorInfo, eventId)
        }
    }

    reportError = async (error, errorInfo, eventId) => {
        try {
          // Replace with actual error reporting service integration
            await fetch('/api/v1/errors/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                                         eventId,
                                         error: error.toString(),
                                         stack: error.stack,
                                         componentStack: errorInfo.componentStack,
                                         timestamp: new Date().toISOString(),
                                         userAgent: navigator.userAgent,
                                         url: window.location.href,
                                         userId: this.getUserId()
                                     })
            })
        } catch (reportingError) {
            console.error('Failed to report error:', reportingError)
        }
    }

    getUserId = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            return user?.id || 'anonymous'
        } catch {
            return 'anonymous'
        }
    }

    handleReload = () => {
        window.location.reload()
    }

    handleGoHome = () => {
        window.location.href = '/'
    }

    handleCopyError = () => {
        const errorText = `
Error ID: ${this.state.eventId}
Time: ${new Date().toISOString()}
Error: ${this.state.error?.toString() || 'Unknown error'}
Stack: ${this.state.error?.stack || 'No stack trace'}
Component Stack: ${this.state.errorInfo?.componentStack || 'No component stack'}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `.trim()

        navigator.clipboard.writeText(errorText).then(() => {
            alert('Error details copied to clipboard')
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = errorText
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            alert('Error details copied to clipboard')
        })
    }

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        {/* Error Icon */}
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Something went wrong
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                We're sorry, but something unexpected happened. Our team has been notified.
                            </p>
                        </div>

                        {/* Error Details (Development Only) */}
                        {import.meta.env.DEV && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                                    Error Details (Development)
                                </h3>
                                <div className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
                                    <p><strong>Error ID:</strong> {this.state.eventId}</p>
                                    <p><strong>Message:</strong> {this.state.error?.message}</p>
                                    {this.state.error?.stack && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer">Stack Trace</summary>
                                            <pre className="mt-2 text-xs overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                                        </details>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={this.handleReload}
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reload Page
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Go to Dashboard
                            </button>

                            <button
                                onClick={this.handleCopyError}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Bug className="h-4 w-4 mr-2" />
                                Copy Error Details
                            </button>
                        </div>

                        {/* Error ID for Support */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Error ID: <code className="font-mono">{this.state.eventId}</code>
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Please include this ID when contacting support
                            </p>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary