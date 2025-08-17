import React from 'react'
import { Link } from 'react-router-dom'
import {
    Home,
    FileText,
    Building,
    Zap,
    Plus,
    BarChart3,
    Settings,
    User,
    HelpCircle,
    Clock
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navigation = ({ onNavigate, currentPath }) => {
    const { user, hasPermission } = useAuth()

    // Navigation items configuration
    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            current: currentPath === '/dashboard' || currentPath === '/',
        },
        {
            name: 'Apply for Permit',
            href: '/apply',
            icon: Plus,
            current: currentPath === '/apply',
            highlight: true,
        },
    ]

    // Permit management items
    const permitItems = [
        {
            name: 'Building Permits',
            href: '/building-permits',
            icon: Building,
            current: currentPath === '/building-permits',
            badge: hasPermission('read') ? null : null, // Could show count
        },
        {
            name: 'Gas Permits',
            href: '/gas-permits',
            icon: Zap,
            current: currentPath === '/gas-permits',
        },
    ]

    // Admin/Management items
    const managementItems = [
        {
            name: 'Reports',
            href: '/reports',
            icon: BarChart3,
            current: currentPath === '/reports',
            requiresPermission: 'admin',
        },
        {
            name: 'Pending Review',
            href: '/pending',
            icon: Clock,
            current: currentPath === '/pending',
            requiresPermission: 'review',
        },
    ]

    // Account items
    const accountItems = [
        {
            name: 'Profile',
            href: '/profile',
            icon: User,
            current: currentPath === '/profile',
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: Settings,
            current: currentPath === '/settings',
        },
        {
            name: 'Help & Support',
            href: '/help',
            icon: HelpCircle,
            current: currentPath === '/help',
        },
    ]

    // Filter items based on permissions
    const filterItemsByPermission = (items) => {
        return items.filter(item => {
            if (!item.requiresPermission) return true
            return hasPermission(item.requiresPermission)
        })
    }

    // Render navigation item
    const renderNavItem = (item) => {
        const isActive = item.current

        return (
            <Link
                key={item.name}
                to={item.href}
                onClick={onNavigate}
                className={`
          group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
          ${isActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }
          ${item.highlight ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        `}
            >
                <item.icon
                    className={`
            mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200
            ${isActive
              ? 'text-blue-500 dark:text-blue-400'
              : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }
          `}
                />
                <span className="flex-1">{item.name}</span>

                {/* Badge/Notification indicator */}
                {item.badge && (
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {item.badge}
          </span>
                )}

                {/* Active indicator */}
                {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                )}
            </Link>
        )
    }

    // Render navigation section
    const renderNavSection = (title, items) => {
        const filteredItems = filterItemsByPermission(items)

        if (filteredItems.length === 0) return null

        return (
            <div className="mb-6">
                {title && (
                    <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        {title}
                    </h3>
                )}
                <nav className="space-y-1">
                    {filteredItems.map(renderNavItem)}
                </nav>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 px-3 py-4 space-y-1">
                {/* Main Navigation */}
                {renderNavSection(null, navigationItems)}

                {/* Permit Management */}
                {renderNavSection('Permits', permitItems)}

                {/* Management Items (for admins/reviewers) */}
                {renderNavSection('Management', managementItems)}

                {/* Account Items */}
                {renderNavSection('Account', accountItems)}
            </div>

            {/* User Info at Bottom */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </div>

                {/* User role badge */}
                {user?.role && (
                    <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
              {user.role}
            </span>
                    </div>
                )}
            </div>

            {/* Quick Links Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <a
                        href={import.meta.env.VITE_H2_CONSOLE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        DB Console
                    </a>
                    <a
                        href={import.meta.env.VITE_SWAGGER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        API Docs
                    </a>
                </div>

                {/* Version info */}
                <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                    v{import.meta.env.VITE_APP_VERSION}
                </div>
            </div>
        </div>
    )
}

export default Navigation