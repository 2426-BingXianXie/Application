// Permission checking utilities for role-based access control

// Permission constants
export const PERMISSIONS = {
    // Permit permissions
    'read:permits': 'View permits',
    'create:permits': 'Create new permits',
    'update:permits': 'Update permit details',
    'delete:permits': 'Delete permits',
    'submit:permits': 'Submit permits for review',
    'approve:permits': 'Approve permits',
    'reject:permits': 'Reject permits',

    // User permissions
    'read:users': 'View user accounts',
    'create:users': 'Create user accounts',
    'update:users': 'Update user details',
    'delete:users': 'Delete user accounts',

    // Document permissions
    'upload:documents': 'Upload documents',
    'download:documents': 'Download documents',
    'delete:documents': 'Delete documents',

    // Reporting permissions
    'read:reports': 'View reports',
    'export:reports': 'Export reports',

    // Admin permissions
    'admin:system': 'System administration',
    'admin:users': 'User management',
    'admin:settings': 'System settings'
}

// Role definitions
export const ROLES = {
    APPLICANT: {
        name: 'Applicant',
        permissions: [
            'read:permits',
            'create:permits',
            'update:permits',
            'submit:permits',
            'upload:documents',
            'download:documents'
        ]
    },
    CONTRACTOR: {
        name: 'Contractor',
        permissions: [
            'read:permits',
            'create:permits',
            'update:permits',
            'submit:permits',
            'upload:documents',
            'download:documents',
            'read:reports'
        ]
    },
    REVIEWER: {
        name: 'Permit Reviewer',
        permissions: [
            'read:permits',
            'update:permits',
            'approve:permits',
            'reject:permits',
            'upload:documents',
            'download:documents',
            'read:reports',
            'export:reports'
        ]
    },
    ADMIN: {
        name: 'Administrator',
        permissions: [
            'read:permits',
            'create:permits',
            'update:permits',
            'delete:permits',
            'submit:permits',
            'approve:permits',
            'reject:permits',
            'read:users',
            'create:users',
            'update:users',
            'delete:users',
            'upload:documents',
            'download:documents',
            'delete:documents',
            'read:reports',
            'export:reports',
            'admin:system',
            'admin:users',
            'admin:settings'
        ]
    }
}

// Check if user has specific permission
export const hasPermission = (userPermissions, requiredPermission) => {
    if (!userPermissions || !Array.isArray(userPermissions)) {
        return false
    }

    return userPermissions.includes(requiredPermission)
}

// Check if user has any of the specified permissions
export const hasAnyPermission = (userPermissions, requiredPermissions) => {
    if (!userPermissions || !Array.isArray(userPermissions)) {
        return false
    }

    if (!requiredPermissions || !Array.isArray(requiredPermissions)) {
        return false
    }

    return requiredPermissions.some(permission => userPermissions.includes(permission))
}

// Check if user has all specified permissions
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
    if (!userPermissions || !Array.isArray(userPermissions)) {
        return false
    }

    if (!requiredPermissions || !Array.isArray(requiredPermissions)) {
        return true
    }

    return requiredPermissions.every(permission => userPermissions.includes(permission))
}

// Check if user has specific role
export const hasRole = (userRoles, requiredRole) => {
    if (!userRoles) return false

    const roles = Array.isArray(userRoles) ? userRoles : [userRoles]
    return roles.includes(requiredRole)
}

// Check if user has any of the specified roles
export const hasAnyRole = (userRoles, requiredRoles) => {
    if (!userRoles) return false
    if (!requiredRoles || !Array.isArray(requiredRoles)) return false

    const roles = Array.isArray(userRoles) ? userRoles : [userRoles]
    return requiredRoles.some(role => roles.includes(role))
}

// Get user permissions from roles
export const getPermissionsFromRoles = (userRoles) => {
    if (!userRoles) return []

    const roles = Array.isArray(userRoles) ? userRoles : [userRoles]
    const permissions = new Set()

    roles.forEach(roleName => {
        const role = ROLES[roleName]
        if (role && role.permissions) {
            role.permissions.forEach(permission => permissions.add(permission))
        }
    })

    return Array.from(permissions)
}

// Check if user can perform action on permit
export const canPerformPermitAction = (user, permit, action) => {
    if (!user || !permit) return false

    const userPermissions = user.permissions || getPermissionsFromRoles(user.roles)

    // Owner can always view and edit their own drafts
    if (permit.contactInfo?.email === user.email) {
        switch (action) {
            case 'view':
            case 'read':
                return true
            case 'edit':
            case 'update':
                return permit.status === 'DRAFT' || hasPermission(userPermissions, 'update:permits')
            case 'submit':
                return permit.status === 'DRAFT' && hasPermission(userPermissions, 'submit:permits')
            case 'delete':
                return permit.status === 'DRAFT' && hasPermission(userPermissions, 'delete:permits')
        }
    }

    // Permission-based checks for non-owners
    switch (action) {
        case 'view':
        case 'read':
            return hasPermission(userPermissions, 'read:permits')
        case 'create':
            return hasPermission(userPermissions, 'create:permits')
        case 'edit':
        case 'update':
            return hasPermission(userPermissions, 'update:permits')
        case 'delete':
            return hasPermission(userPermissions, 'delete:permits')
        case 'submit':
            return hasPermission(userPermissions, 'submit:permits')
        case 'approve':
            return hasPermission(userPermissions, 'approve:permits')
        case 'reject':
            return hasPermission(userPermissions, 'reject:permits')
        default:
            return false
    }
}

// Get permitted actions for a permit
export const getPermittedActions = (user, permit) => {
    const actions = []

    if (canPerformPermitAction(user, permit, 'view')) actions.push('view')
    if (canPerformPermitAction(user, permit, 'edit')) actions.push('edit')
    if (canPerformPermitAction(user, permit, 'delete')) actions.push('delete')
    if (canPerformPermitAction(user, permit, 'submit')) actions.push('submit')
    if (canPerformPermitAction(user, permit, 'approve')) actions.push('approve')
    if (canPerformPermitAction(user, permit, 'reject')) actions.push('reject')

    return actions
}

// Check if user is permit owner
export const isPermitOwner = (user, permit) => {
    if (!user || !permit) return false

    return permit.contactInfo?.email === user.email ||
           permit.applicantId === user.id ||
           permit.createdBy === user.id
}

// Filter permits by user permissions
export const filterPermitsByPermissions = (permits, user) => {
    if (!permits || !Array.isArray(permits)) return []
    if (!user) return []

    return permits.filter(permit => canPerformPermitAction(user, permit, 'view'))
}

// Get highest role priority (for display purposes)
export const getHighestRole = (userRoles) => {
    if (!userRoles) return null

    const rolePriority = {
        'ADMIN': 4,
        'REVIEWER': 3,
        'CONTRACTOR': 2,
        'APPLICANT': 1
    }

    const roles = Array.isArray(userRoles) ? userRoles : [userRoles]
    return roles.reduce((highest, role) => {
        return (rolePriority[role] || 0) > (rolePriority[highest] || 0) ? role : highest
    }, roles[0])
}

// Check resource ownership
export const isResourceOwner = (user, resource) => {
    if (!user || !resource) return false

    return resource.ownerId === user.id ||
           resource.createdBy === user.id ||
           resource.userId === user.id ||
           resource.applicantId === user.id
}

// Permission middleware for components
export const withPermissions = (WrappedComponent, requiredPermissions) => {
    return function PermissionWrappedComponent(props) {
        const { user } = useAuth() // Would need to import useAuth

        if (!user) {
            return <div>Please log in to access this feature.</div>
        }

        const userPermissions = user.permissions || getPermissionsFromRoles(user.roles)

        if (!hasAnyPermission(userPermissions, requiredPermissions)) {
            return <div>You don't have permission to access this feature.</div>
        }

        return <WrappedComponent {...props} />
    }
}

export default {
    PERMISSIONS,
    ROLES,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    getPermissionsFromRoles,
    canPerformPermitAction,
    getPermittedActions,
    isPermitOwner,
    filterPermitsByPermissions,
    getHighestRole,
    isResourceOwner,
    withPermissions
}