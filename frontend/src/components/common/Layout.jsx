import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Navigation from './Navigation'
import Footer from './Footer'
import { Menu, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const { theme } = useTheme()

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="flex flex-1">
                {/* Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                        onClick={closeSidebar}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        `}>
                    <div className="flex flex-col h-full">
                        {/* Logo Area */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PMS</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  Permit System
                </span>
                            </div>

                            {/* Close button for mobile */}
                            <button
                                onClick={closeSidebar}
                                className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <Navigation onNavigate={closeSidebar} currentPath={location.pathname} />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Header */}
                    <Header
                        onMenuClick={toggleSidebar}
                        showMenuButton={true}
                    />

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
                        <div className="container mx-auto px-4 py-6 max-w-7xl">
                            {children}
                        </div>
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Layout