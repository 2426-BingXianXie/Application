import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'

// Layout Components
import Layout from './components/common/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'
import PermitTypesList from './pages/PermitTypesList'
import ApplicationForm from './pages/ApplicationForm'
import ApplicationDetail from './pages/ApplicationDetail'
import DocumentCenter from './pages/DocumentCenter'
import PropertySearch from './pages/PropertySearch'
import MyPermits from './pages/MyPermits'
import PermitDetails from './pages/PermitDetails'
import BuildingPermits from './pages/BuildingPermits'
import GasPermits from './pages/GasPermits'
import Reports from './pages/Reports'
import Search from './pages/Search'
import Activity from './pages/Activity'
import Approvals from './pages/Approvals'
import UserManagement from './pages/UserManagement'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

// Global Styles
import './styles/globals.css'

// Create a client for React Query
const queryClient = new QueryClient({
                                        defaultOptions: {
                                            queries: {
                                                retry: 1,
                                                refetchOnWindowFocus: false,
                                                staleTime: 5 * 60 * 1000, // 5 minutes
                                            },
                                            mutations: {
                                                retry: 1,
                                            }
                                        },
                                    })

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

// App Routes Component (needs to be inside AuthProvider)
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route path="/*" element={
                <ProtectedRoute>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            } />
        </Routes>
    )
}

// Main App Component
const App = () => {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <NotificationProvider>
                        <AuthProvider>
                            <Router>
                                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                                    <AppRoutes />

                                    {/* Global Toast Notifications */}
                                    <Toaster
                                        position="top-right"
                                        toastOptions={{
                                            duration: 4000,
                                            style: {
                                                background: '#fff',
                                                color: '#333',
                                            },
                                            success: {
                                                duration: 3000,
                                                style: {
                                                    background: '#10b981',
                                                    color: '#fff',
                                                },
                                            },
                                            error: {
                                                duration: 5000,
                                                style: {
                                                    background: '#ef4444',
                                                    color: '#fff',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </Router>
                        </AuthProvider>
                    </NotificationProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default App