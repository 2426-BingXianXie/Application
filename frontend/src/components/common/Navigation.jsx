import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Home,
    FileText,
    Building,
    Flame,
    BarChart3,
    Settings,
    User,
    HelpCircle,
    Plus,
    Search,
    Clock,
    CheckCircle2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navigation = ({ onNavigate }) => {
    const location = useLocation()
    const { user, hasPermission } = useAuth()

    // Navigation items configuration
    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            description: 'Overview and statistics',
            permissions: ['read:dashboard']
        },
        {
            name: 'Apply for Permit',
            href: '/apply',
            icon: Plus,
            description: 'Start new permit application',
            permissions: ['create:permit'],
            highlight: true
        },
        {
            name: 'Building Permits',
            href: '/building-permits',
            icon: Building,
            description: 'Construction and building permits',
            permissions: ['read:building_permits']
        },
        {
            name: 'Gas Permits',
            href: '/gas-permits',
            icon: Flame,
            description: 'Gas installation and safety permits',
            permissions: ['read:gas_permits']
        },
        {
            name: 'Reports & Analytics',
            href: '/reports',
            icon: BarChart3,
            description: 'Reports and data insights',
            permissions: ['read:reports']
        }
    ]

    const secondaryItems = [
        {
            name: 'Search Permits',
            href: '/search',
            icon: Search,
            description: 'Find permits by various criteria',
            permissions: ['read:permits']
        },
        {
            name: 'Recent Activity',
            href: '/activity',
            icon: Clock,
            description: 'View recent permit activities',
            permissions: ['read:activity']
        },
        {
            name: 'My Approvals',
            href: '/approvals',
            icon: CheckCircle2,
            description: 'Permits pending your approval',
            permissions: ['approve:permits'],
            badge: 'approval_count'
        }
    ]

    const settingsItems = [
        {
            name: 'Profile',
            href: '/profile',
            icon: User,
            description: 'Manage your profile and preferences'
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: Settings,
            description: 'Application settings and preferences'
        },
        {
            name: 'Help & Support',
            href: '/help',
            icon: HelpCircle,
            description: 'Get help and support'
        }
    ]

    // Check if user has permission for navigation item
    const hasNavigationPermission = (item) => {
        if (!item.permissions || item.permissions.length === 0) {
            return true // No permissions required
        }
        return item.permissions.some(permission => hasPermission(permission))
    }

    // Check if current path matches navigation item
    const isActive = (href) => {
        if (href === '/dashboard' && location.pathname === '/') {
            return true
        }
        return location.pathname === href || location.pathname.startsWith(href + '/')
    }

    // Get badge content for navigation item
    const getBadgeContent = (badgeType) => {
        // This would typically come from a global state or API
        // For now, return placeholder values
        switch (badgeType) {
            case 'approval_count':
                return '3' // Would be dynamic
            default:
                return null
        }
    }

    // Render navigation section
    const renderNavigationSection = (items, title = null) => (
        <div className="space-y-1">
            {title && (
                <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {title}
                    </h3>
                </div>
            )}

            {items
                .filter(hasNavigationPermission)
                .map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    const badgeContent = item.badge ? getBadgeContent(item.badge) : null

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={onNavigate}
                            className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative
                ${active
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }
                ${item.highlight && !active
                  ? 'ring-2 ring-blue-200 dark:ring-blue-800'
                  : ''
                            }
              `}
                            title={item.description}
                        >
                            <Icon className={`
                mr-3 flex-shrink-0 h-5 w-5 transition-colors
                ${active
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                            }
              `} />

                            <span className="flex-1">{item.name}</span>

                            {/* Badge */}
                            {badgeContent && (
                                <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  {badgeContent}
                </span>
                            )}

                            {/* Active indicator */}
                            {active && (
                                <div className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-r-md"></div>
                            )}
                        </Link>
                    )
                })}
        </div>
    )

    return (
        <nav className="flex-1 px-2 py-4 space-y-8 overflow-y-auto">
            {/* User info */}
            {user && (
                <div className="px-3 py-2">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
                            </div>
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Primary navigation */}
            {renderNavigationSection(navigationItems)}

            {/* Secondary navigation */}
            {renderNavigationSection(secondaryItems, 'Quick Access')}

            {/* Settings navigation */}
            {renderNavigationSection(settingsItems, 'Account')}

            {/* Footer info */}
            <div className="px-3 py-2 mt-8">
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Permit Management System</p>
                    <p>Version 1.0.0</p>
                    <p className="text-gray-400 dark:text-gray-500">
                        © 2024 Municipality
                    </p>
                </div>
            </div>
        </nav>
    )
}

export default Navigation