export const Unauthorized = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="text-center py-12 px-6">
                    {/* 403 Illustration */}
                    <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-6">
                        <Building className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>

                    {/* Error Message */}
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        403
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        You don't have permission to access this page.
                        Please contact your administrator if you believe this is an error.
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

                    {/* Contact Information */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Need help?
                        </p>
                        <div className="flex flex-col space-y-2">
                            <a
                                href="mailto:support@permitpro.com"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Contact Support
                            </a>
                            <Link
                                to="/help"
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Help Center
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Unauthorized