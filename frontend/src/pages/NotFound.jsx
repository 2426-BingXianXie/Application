import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search, Building } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import PermitDetails from "@/pages/PermitDetails.jsx";

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="text-center py-12 px-6">
                    {/* 404 Illustration */}
                    <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                        <Building className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </div>

                    {/* Error Message */}
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Sorry, we couldn't find the page you're looking for.
                        The page may have been moved, deleted, or you may have mistyped the URL.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="primary"
                            onClick={() => navigate(-1)}
                            startIcon={<ArrowLeft className="w-4 h-4" />}
                        >
                            Go Back
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                            startIcon={<Home className="w-4 h-4" />}
                        >
                            Go to Dashboard
                        </Button>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Looking for something specific?
                        </p>
                        <div className="flex flex-col space-y-2">
                            <Link
                                to="/apply"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Apply for a Permit
                            </Link>
                            <Link
                                to="/building-permits"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                View Building Permits
                            </Link>
                            <Link
                                to="/gas-permits"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                View Gas Permits
                            </Link>
                            <Link
                                to="/help"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Help & Support
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default NotFound