import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Shield, Lock, AlertTriangle } from 'lucide-react'

const RoleGuard = ({
                       children,
                       requiredPermissions = [],
                       requiredRole = null,
                       requiredAnyPermissions = [],
                       fallback = null,
                       showFallback = true,
                       renderFallback = null,
                       invertLogic = false,
                       debug = false
                   }) => {
    const {
        hasAnyPermission,
        hasAllPermissions,
        userRole,
        isAuthenticated,
        permissions,
        user
    } = useAuth()

    // Debug logging
    if (debug && process.env.NODE_ENV === 'development') {
        console.log('RoleGuard Debug:', {
            userRole,
            permissions,
            requiredPermissions,
            requiredRole,
            requiredAnyPermissions,
            isAuthenticated
        })
    }

    // Check authentication first
    if (!isAuthenticated) {
        if (!showFallback) return null
        return renderFallback || fallback || (
            <div className="text-center py-4 text-gray-500">
                <Lock className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">Authentication required</p>
            </div>
        )
    }

    let hasAccess = true
    let accessReason = 'AUTHORIZED'

    // Check role requirement (exact match)
    if (requiredRole && userRole !== requiredRole) {
        hasAccess = false
        accessReason = 'INSUFFICIENT_ROLE'
    }

    // Check permission requirements (user must have ALL specified permissions)
    if (hasAccess && requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
        hasAccess = false
        accessReason = 'INSUFFICIENT_PERMISSIONS'
    }

    // Check any permission requirements (user must have AT LEAST ONE of the specified permissions)
    if (hasAccess && requiredAnyPermissions.length > 0 && !hasAnyPermission(requiredAnyPermissions)) {
        hasAccess = false
        accessReason = 'INSUFFICIENT_ANY_PERMISSIONS'
    }

    // Invert logic if specified (useful for "hide for admin" scenarios)
    if (invertLogic) {
        hasAccess = !hasAccess
        accessReason = hasAccess ? 'AUTHORIZED_INVERTED' : 'DENIED_INVERTED'
    }

    // Debug logging for access decision
    if (debug && process.env.NODE_ENV === 'development') {
        console.log('RoleGuard Access Decision:', { hasAccess, accessReason })
    }

    // If access is granted, render children
    if (hasAccess) {
        return <>{children}</>
    }

    // If access is denied and showFallback is false, render nothing
    if (!showFallback) {
        return null
    }

    // If custom renderFallback function is provided, use it
    if (renderFallback && typeof renderFallback === 'function') {
        return renderFallback({ accessReason, userRole, permissions })
    }

    // If custom fallback element is provided, use it
    if (fallback) {
        return fallback
    }

    // Default fallback based on access reason
    return <DefaultFallback accessReason={accessReason} />
}

// Default fallback component
const DefaultFallback = ({ accessReason }) => {
    const getFallbackContent = () => {
        switch (accessReason) {
            case 'INSUFFICIENT_ROLE':
                return {
                    icon: Shield,
                    color: 'text-amber-500',
                    message: 'Insufficient role'
                }
            case 'INSUFFICIENT_PERMISSIONS':
                return {
                    icon: Lock,
                    color: 'text-red-500',
                    message: 'Insufficient permissions'
                }
            case 'INSUFFICIENT_ANY_PERMISSIONS':
                return {
                    icon: AlertTriangle,
                    color: 'text-orange-500',
                    message: 'Access restricted'
                }
            default:
                return {
                    icon: Lock,
                    color: 'text-gray-500',
                    message: 'Access denied'
                }
        }
    }

    const { icon: Icon, color, message } = getFallbackContent()

    return (
        <div className="text-center py-2 text-gray-500">
            <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
            <p className="text-xs">{message}</p>
        </div>
    )
}

// Convenience components for common scenarios
export const AdminOnly = ({ children, fallback, showFallback = true }) => (
    <RoleGuard
        requiredRole="ADMIN"
        fallback={fallback}
        showFallback={showFallback}
    >
        {children}
    </RoleGuard>
)

export const ReviewerOnly = ({ children, fallback, showFallback = true }) => (
    <RoleGuard
        requiredAnyPermissions={['VIEW_ALL_PERMITS', 'APPROVE_PERMITS', 'REJECT_PERMITS']}
        fallback={fallback}
        showFallback={showFallback}
    >
        {children}
    </RoleGuard>
)

export const ApplicantOnly = ({ children, fallback, showFallback = true }) => (
    <RoleGuard
        requiredRole="APPLICANT"
        fallback={fallback}
        showFallback={showFallback}
    >
        {children}
    </RoleGuard>
)

export const ContractorOnly = ({ children, fallback, showFallback = true }) => (
    <RoleGuard
        requiredRole="CONTRACTOR"
        fallback={fallback}
        showFallback={showFallback}
    >
        {children}
    </RoleGuard>
)

export const PermissionGuard = ({ permission, children, fallback, showFallback = true }) => (
    <RoleGuard
        requiredPermissions={Array.isArray(permission) ? permission : [permission]}
        fallback={fallback}
        showFallback={showFallback}
    >
        {children}
    </RoleGuard>
)

export const HideFromRole = ({ role, children }) => (
    <RoleGuard
        requiredRole={role}
        invertLogic={true}
        showFallback={false}
    >
        {children}
    </RoleGuard>
)

export const ShowToRole = ({ role, children, fallback, showFallback = true }) => (
    <RoleGuard
        requiredRole={role}
        fallback={fallback}
        showFallback={showFallback}
    >
        {children}
    </RoleGuard>
)

// Hook for component-level access checking
export const useComponentAccess = (accessConfig = {}) => {
    const {
        hasAnyPermission,
        hasAllPermissions,
        userRole,
        isAuthenticated
    } = useAuth()

    const {
        requiredPermissions = [],
        requiredRole = null,
        requiredAnyPermissions = []
    } = accessConfig

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

// Higher-Order Component version
export const withRoleGuard = (WrappedComponent, guardConfig = {}) => {
    return function GuardedComponent(props) {
        return (
            <RoleGuard {...guardConfig}>
                <WrappedComponent {...props} />
            </RoleGuard>
        )
    }
}

export default RoleGuard

/*
USAGE EXAMPLES:

// Basic permission check
<RoleGuard requiredPermissions={['MANAGE_USERS']}>
    <Button onClick={handleDeleteUser}>Delete User</Button>
</RoleGuard>

// Role-specific content
<RoleGuard requiredRole="ADMIN" fallback={<div>Admin access required</div>}>
    <AdminPanel />
</RoleGuard>

// Any of multiple permissions
<RoleGuard requiredAnyPermissions={['APPROVE_PERMITS', 'REJECT_PERMITS']}>
    <PermitActions permit={permit} />
</RoleGuard>

// Custom fallback function
<RoleGuard
    requiredPermissions={['VIEW_REPORTS']}
    renderFallback={({ accessReason }) => (
        <div className="text-red-500">
            Access denied: {accessReason}
        </div>
    )}
>
    <ReportsPanel />
</RoleGuard>

// Hide from specific role
<HideFromRole role="APPLICANT">
    <AdminToolbar />
</HideFromRole>

// Show only to specific role
<ShowToRole role="CONTRACTOR">
    <ContractorDashboard />
</ShowToRole>

// Using convenience components
<AdminOnly>
    <UserManagementSection />
</AdminOnly>

<PermissionGuard permission="APPROVE_PERMITS">
    <ApproveButton />
</PermissionGuard>

// Debug mode (development only)
<RoleGuard
    requiredPermissions={['MANAGE_PERMITS']}
    debug={true}
>
    <PermitManager />
</RoleGuard>
*/