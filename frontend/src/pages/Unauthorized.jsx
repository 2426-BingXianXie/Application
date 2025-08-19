import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Home, ArrowLeft, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Unauthorized = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleGoBack = () => {
        navigate(-1)
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Lock Icon */}
                <div className="mb-8">
                    <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-6">
                        <Shield className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">
                        403
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Access Denied
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    You don't have permission to access this resource.
                    This area may be restricted to certain user roles or require additional authorization.
                </p>

                {/* User Info */}
                {user && (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Currently signed in as:
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {user.name} ({user.email})
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            Role: {user.role}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4 mb-8">
                    <button
                        onClick={handleGoBack}
                        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>

                    <Link
                        to="/dashboard"
                        className="w-full flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Dashboard
                    </Link>

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            Sign in as Different User
                        </button>
                    )}
                </div>

                {/* Help Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Need Access?
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                            If you believe you should have access to this resource, please:
                        </p>

                        <ul className="text-left space-y-2 max-w-sm mx-auto">
                            <li className="flex items-start space-x-2">
                                <span className="font-medium">1.</span>
                                <span>Contact your system administrator</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="font-medium">2.</span>
                                <span>Verify your account permissions</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="font-medium">3.</span>
                                <span>Request additional access if needed</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Support */}
                    <div className="mt-6">
                        <a
                            href="mailto:support@permitmanagement.com"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <Mail className="w-4 h-4 mr-1" />
                            Contact Support
                        </a>
                    </div>
                </div>

                {/* Error Details */}
                <div className="mt-8 text-xs text-gray-400 dark:text-gray-500">
                    <div>Error Code: 403</div>
                    <div>Timestamp: {new Date().toLocaleString()}</div>
                    <div>Request ID: {Date.now()}</div>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized