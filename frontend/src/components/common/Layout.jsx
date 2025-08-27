import React, { useState } from 'react'
import Header from './Header'
import Navigation from './Navigation'
import Footer from './Footer'
import { useAuth } from '../../context/AuthContext'
import { Menu, X } from 'lucide-react'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user } = useAuth()

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={closeSidebar}
                >
                    <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                </div>
            )}

            {/* Sidebar for mobile */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">PM</span>
                            </div>
                        </div>
                        <h1 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                            Permit Manager
                        </h1>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <Navigation onNavigate={closeSidebar} />
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PM</span>
                                </div>
                            </div>
                            <h1 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                                Permit Manager
                            </h1>
                        </div>
                    </div>
                    <Navigation />
                </div>
            </div>

            {/* Main content area */}
            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Header */}
                <Header onToggleSidebar={toggleSidebar} />

                {/* Main content */}
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>

            {/* Mobile menu button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={toggleSidebar}
            >
                <Menu className="h-6 w-6" />
            </button>
        </div>
    )
}

export default Layout