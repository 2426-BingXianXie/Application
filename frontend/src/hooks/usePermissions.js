import { useMemo } from 'react'
import { useAuth } from './useAuth'

export const usePermissions = () => {
    const { user } = useAuth()

    const permissions = useMemo(() => {
        if (!user?.roles) return []

        const rolePermissions = {
            USER: ['read', 'create', 'update_own'],
            CONTRACTOR: ['read', 'create', 'update_own', 'submit'],
            REVIEWER: ['read', 'create', 'update_own', 'submit', 'review', 'approve', 'reject'],
            ADMIN: ['read', 'create', 'update', 'delete', 'submit', 'review', 'approve', 'reject', 'admin']
        }

        return user.roles.reduce((acc, role) => {
            return [...acc, ...(rolePermissions[role] || [])]
        }, [])
    }, [user?.roles])

    const hasPermission = useCallback((permission) => {
        return permissions.includes(permission)
    }, [permissions])

    const hasAnyPermission = useCallback((permissionList) => {
        return permissionList.some(permission => permissions.includes(permission))
    }, [permissions])

    const hasAllPermissions = useCallback((permissionList) => {
        return permissionList.every(permission => permissions.includes(permission))
    }, [permissions])

    const canAccessRoute = useCallback((route) => {
        const routePermissions = {
            '/dashboard': ['read'],
            '/apply': ['create'],
            '/building-permits': ['read'],
            '/gas-permits': ['read'],
            '/reports': ['read'],
            '/admin': ['admin']
        }

        const requiredPermissions = routePermissions[route]
        if (!requiredPermissions) return true

        return hasAnyPermission(requiredPermissions)
    }, [hasAnyPermission])

    return {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccessRoute,
        isAdmin: hasPermission('admin'),
        isReviewer: hasPermission('review'),
        isContractor: user?.roles?.includes('CONTRACTOR')
    }
}

export default {
    usePermits,
    useAuth,
    useApi,
    useLocalStorage,
    useDebounce,
    usePagination,
    useSearch,
    usePermitForm,
    useNotifications,
    usePermissions
}