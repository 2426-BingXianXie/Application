import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, AlertTriangle, Lock } from 'lucide-react'
import Button from '../ui/Button'

const ProtectedRoute = ({
                            children,
                            requiredPermissions = [],
                            requiredRole = null,
                            requiredAnyPermissions = [],
                            fallback = '/unauthorized',
                            showLoadingSpinner = true,
                            customUnauthorizedMessage = null
                        }) => {
    const {
        isAuthenticated,
        loading,
        hasAnyPermission,
        hasAllPermissions,
        userRole,
        user,
        getFullName
    } = useAuth()
    const location = useLocation()

    // Show loading spinner while authentication is being checked
    if (loading && showLoadingSpinner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
                </div>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check role requirement (exact match)
    if (requiredRole && userRole !== requiredRole) {
        if (customUnauthorizedMessage) {
            return (
                <UnauthorizedMessage
                    message={customUnauthorizedMessage}
                    icon={Shield}
                    iconColor="text-amber-500"
                />
            )
        }
        return <Navigate to={fallback} replace />
    }

    // Check permission requirements (user must have ALL specified permissions)
    if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
        if (customUnauthorizedMessage) {
            return (
                <UnauthorizedMessage
                    message={customUnauthorizedMessage}
                    icon={Lock}
                    iconColor="text-red-500"
                    permissions={requiredPermissions}
                />
            )
        }
        return <Navigate to={fallback} replace />
    }

    // Check any permission requirements (user must have AT LEAST ONE of the specified permissions)
    if (requiredAnyPermissions.length > 0 && !hasAnyPermission(requiredAnyPermissions)) {
        if (customUnauthorizedMessage) {
            return (
                <UnauthorizedMessage
                    message={customUnauthorizedMessage}
                    icon={AlertTriangle}
                    iconColor="text-orange-500"
                    permissions={requiredAnyPermissions}
                />
            )
        }
        return <Navigate to={fallback} replace />
    }

    // All checks passed - render the protected content
    return children
}

// Custom unauthorized message component
const UnauthorizedMessage = ({
                                 message,
                                 icon: Icon,
                                 iconColor = "text-red-500",
                                 permissions = []
                             }) => {
    const { getFullName, userRole } = useAuth()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="mb-6">
                    <Icon className={`h-16 w-16 mx-auto ${iconColor}`} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Access Denied
                </h1>

                {message ? (
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {message}
                    </p>
                ) : (
                     <div className="space-y-2 mb-6">
                         <p className="text-gray-600 dark:text-gray-400">
                             You don't have permission to access this page.
                         </p>
                         {permissions.length > 0 && (
                             <p className="text-sm text-gray-500 dark:text-gray-500">
                                 Required permissions: {permissions.join(', ')}
                             </p>
                         )}
                     </div>
                 )}

                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Current User:</strong> {getFullName()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Role:</strong> {userRole}
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        variant="primary"
                        onClick={() => window.history.back()}
                        className="w-full"
                    >
                        Go Back
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full"
                    >
                        Return to Dashboard
                    </Button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-500 mt-6">
                    If you believe this is an error, please contact your administrator.
                </p>
            </div>
        </div>
    )
}

// Higher-Order Component version for class components or special use cases
export const withProtectedRoute = (
    WrappedComponent,
    routeConfig = {}
) => {
    return function ProtectedComponent(props) {
        return (
            <ProtectedRoute {...routeConfig}>
                <WrappedComponent {...props} />
            </ProtectedRoute>
        )
    }
}

// Hook for checking route access programmatically
export const useRouteAccess = (routeConfig = {}) => {
    const {
        isAuthenticated,
        hasAnyPermission,
        hasAllPermissions,
        userRole
    } = useAuth()

    const {
        requiredPermissions = [],
        requiredRole = null,
        requiredAnyPermissions = []
    } = routeConfig

    if (!isAuthenticated) {
        return { hasAccess: false, reason: 'NOT_AUTHENTICATED' }
    }

    if (requiredRole && userRole !== requiredRole) {
        return { hasAccess: false, reason: 'INSUFFICIENT_ROLE' }
    }

    if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
        return { hasAccess: false, reason: 'INSUFFICIENT_PERMISSIONS' }
    }

    if (requiredAnyPermissions.length > 0 && !hasAnyPermission(requiredAnyPermissions)) {
        return { hasAccess: false, reason: 'INSUFFICIENT_ANY_PERMISSIONS' }
    }

    return { hasAccess: true, reason: 'AUTHORIZED' }
}

// Pre-configured route protectors for common scenarios
export const AdminRoute = ({ children, ...props }) => (
    <ProtectedRoute
        requiredRole="ADMIN"
        customUnauthorizedMessage="This page is restricted to administrators only."
        {...props}
    >
        {children}
    </ProtectedRoute>
)

export const ReviewerRoute = ({ children, ...props }) => (
    <ProtectedRoute
        requiredAnyPermissions={['VIEW_ALL_PERMITS', 'APPROVE_PERMITS', 'REJECT_PERMITS']}
        customUnauthorizedMessage="This page is restricted to permit reviewers."
        {...props}
    >
        {children}
    </ProtectedRoute>
)

export const ApplicantRoute = ({ children, ...props }) => (
    <ProtectedRoute
        requiredAnyPermissions={['VIEW_OWN_PERMITS', 'CREATE_PERMITS']}
        customUnauthorizedMessage="This page is for permit applicants only."
        {...props}
    >
        {children}
    </ProtectedRoute>
)

export const ContractorRoute = ({ children, ...props }) => (
    <ProtectedRoute
        requiredRole="CONTRACTOR"
        customUnauthorizedMessage="This page is restricted to licensed contractors."
        {...props}
    >
        {children}
    </ProtectedRoute>
)

export default ProtectedRoute