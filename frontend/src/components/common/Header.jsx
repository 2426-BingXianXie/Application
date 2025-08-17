import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Menu,
    Bell,
    User,
    Search,
    Sun,
    Moon,
    Settings,
    LogOut,
    ChevronDown
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'

const Header = ({ onMenuClick, showMenuButton = true }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuth()
    const { notifications, unreadCount, markAsRead } = useNotifications()

    const userMenuRef = useRef(null)
    const notificationRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications)
        if (!showNotifications && unreadCount > 0) {
            // Mark notifications as read when opening
            markAsRead()
        }
    }

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Section */}
                    <div className="flex items-center space-x-4">
                        {/* Menu Button */}
                        {showMenuButton && (
                            <button
                                onClick={onMenuClick}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        )}

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="hidden sm:block">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Search permits..."
                                />
                            </div>
                        </form>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                 <Sun className="w-5 h-5" />
                             )}
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={toggleNotifications}
                                className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                Notifications
                                            </h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                    No notifications
                                                </div>
                                            ) : (
                                                 notifications.slice(0, 5).map((notification) => (
                                                     <div
                                                         key={notification.id}
                                                         className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                                                     >
                                                         <p className="text-sm text-gray-900 dark:text-white">
                                                             {notification.title}
                                                         </p>
                                                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                             {notification.message}
                                                         </p>
                                                         <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                             {notification.time}
                                                         </p>
                                                     </div>
                                                 ))
                                             )}
                                        </div>
                                        {notifications.length > 5 && (
                                            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                                <Link
                                                    to="/notifications"
                                                    className="text-sm text-blue-600 hover:text-blue-500"
                                                    onClick={() => setShowNotifications(false)}
                                                >
                                                    View all notifications
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || 'User'}
                </span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* User Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user?.name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user?.email || 'user@example.com'}
                                            </p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="w-4 h-4 mr-3" />
                                            Profile
                                        </Link>

                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4 mr-3" />
                                            Settings
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header