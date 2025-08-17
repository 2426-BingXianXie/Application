import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="text-9xl font-bold text-gray-300 dark:text-gray-700 mb-4">
                        404
                    </div>
                    <div className="w-32 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Page Not Found
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Sorry, we couldn't find the page you're looking for.
                    The page may have been moved, deleted, or you may have mistyped the URL.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4 mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Dashboard
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>

                {/* Quick Links */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        Popular Pages
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            to="/apply"
                            className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    Apply for Permit
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Start new application
                                </p>
                            </div>
                        </Link>

                        <Link
                            to="/building-permits"
                            className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                                <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    View Permits
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    See all applications
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Still can't find what you're looking for?
                    </p>
                    <Link
                        to="/help"
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                    >
                        Contact Support
                    </Link>
                </div>

                {/* Error ID for debugging */}
                <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                    Error ID: 404-{Date.now()}
                </div>
            </div>
        </div>
    )
}

export default NotFound