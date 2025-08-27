import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Header from './Header'
import Navigation from './Navigation'
import Footer from './Footer'
import { useAuth } from '../../context/AuthContext'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const location = useLocation()
    const { isAuthenticated, loading } = useAuth()

    // Handle responsive behavior
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024)

            // Auto-close sidebar on mobile when navigating
            if (window.innerWidth < 1024) {
                setSidebarOpen(false)
            }
        }

        checkIfMobile()
        window.addEventListener('resize', checkIfMobile)

        return () => window.removeEventListener('resize', checkIfMobile)
    }, [])

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false)
        }
    }, [location.pathname, isMobile])

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobile && sidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobile, sidebarOpen])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    // Don't render layout for auth pages
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password']
    if (authPages.includes(location.pathname)) {
        return children
    }

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile sidebar overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            PermitPro
                        </h1>
                    </div>

                    {/* Mobile close button */}
                    {isMobile && (
                        <button
                            onClick={closeSidebar}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <Navigation
                    currentPath={location.pathname}
                    onNavigate={closeSidebar}
                />
            </div>

            {/* Main content area */}
            <div className={`lg:ml-64 flex flex-col min-h-screen`}>
                {/* Header */}
                <Header
                    onMenuClick={toggleSidebar}
                    showMenuButton={isMobile}
                />

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    )
}

export default Layout