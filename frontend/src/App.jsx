import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'

// Layout Components
import Layout from './components/common/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'

// Pages
import Dashboard from './pages/Dashboard'
import PermitApplication from './pages/PermitApplication'
import MyPermits from './pages/MyPermits'
import BuildingPermits from './pages/BuildingPermits'
import GasPermits from './pages/GasPermits'
import PermitDetails from './pages/PermitDetails'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import UserManagement from './pages/UserManagement'
import Search from './pages/Search'
import Activity from './pages/Activity'
import Approvals from './pages/Approvals'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

// Auth Components
import { useAuth } from './context/AuthContext'

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

// Enhanced Protected Route Component with permission and role checking
const ProtectedRoute = ({
                            children,
                            requiredPermissions,
                            requiredRole,
                            requiredAnyPermissions,
                            fallbackPath = '/unauthorized'
                        }) => {
    const {
        isAuthenticated,
        loading,
        hasPermission,
        hasAnyPermission,
        hasRole,
        userRole
    } = useAuth()

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Login />
    }

    // Check specific role requirement
    if (requiredRole && userRole !== requiredRole) {
        return <Unauthorized />
    }

    // Check if user has any of the required permissions
    if (requiredAnyPermissions && requiredAnyPermissions.length > 0) {
        const hasRequiredPermission = requiredAnyPermissions.some(permission =>
                                                                      hasPermission(permission)
        )
        if (!hasRequiredPermission) {
            return <Unauthorized />
        }
    }

    // Check if user has all required permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission =>
                                                                hasPermission(permission)
        )
        if (!hasAllPermissions) {
            return <Unauthorized />
        }
    }

    // All checks passed, render children
    return children
}

// Convenience wrappers for common route protections
const AdminRoute = ({ children }) => (
    <ProtectedRoute requiredRole="ADMIN">
        {children}
    </ProtectedRoute>
)

const ReviewerRoute = ({ children }) => (
    <ProtectedRoute requiredAnyPermissions={['VIEW_ALL_PERMITS', 'APPROVE_PERMITS']}>
        {children}
    </ProtectedRoute>
)

const ApplicantRoute = ({ children }) => (
    <ProtectedRoute requiredAnyPermissions={['VIEW_OWN_PERMITS', 'CREATE_PERMITS']}>
        {children}
    </ProtectedRoute>
)

// Main App Component
const App = () => {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <NotificationProvider>
                            <Router>
                                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                                    <Routes>
                                        {/* ==================== PUBLIC ROUTES ==================== */}
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/unauthorized" element={<Unauthorized />} />

                                        {/* ==================== PROTECTED ROUTES ==================== */}
                                        <Route path="/*" element={
                                            <ProtectedRoute>
                                                <Layout>
                                                    <Routes>
                                                        {/* ========== ROUTES AVAILABLE TO ALL AUTHENTICATED USERS ========== */}
                                                        <Route path="/" element={<Dashboard />} />
                                                        <Route path="/dashboard" element={<Dashboard />} />
                                                        <Route path="/profile" element={<Profile />} />

                                                        {/* ========== PERMIT APPLICATION (ALL USERS) ========== */}
                                                        <Route path="/apply" element={
                                                            <ProtectedRoute requiredAnyPermissions={['CREATE_PERMITS']}>
                                                                <PermitApplication />
                                                            </ProtectedRoute>
                                                        } />

                                                        {/* ========== USER'S OWN PERMITS ========== */}
                                                        <Route path="/my-permits" element={
                                                            <ApplicantRoute>
                                                                <MyPermits />
                                                            </ApplicantRoute>
                                                        } />

                                                        {/* ========== PERMIT DETAILS (OWNERS + REVIEWERS) ========== */}
                                                        <Route path="/permit/:id" element={<PermitDetails />} />

                                                        {/* ========== ROUTES FOR REVIEWERS AND ADMINS ========== */}
                                                        <Route path="/building-permits" element={
                                                            <ReviewerRoute>
                                                                <BuildingPermits />
                                                            </ReviewerRoute>
                                                        } />

                                                        <Route path="/gas-permits" element={
                                                            <ReviewerRoute>
                                                                <GasPermits />
                                                            </ReviewerRoute>
                                                        } />

                                                        <Route path="/search" element={
                                                            <ProtectedRoute requiredAnyPermissions={['VIEW_ALL_PERMITS']}>
                                                                <Search />
                                                            </ProtectedRoute>
                                                        } />

                                                        <Route path="/activity" element={
                                                            <ProtectedRoute requiredAnyPermissions={['read:activity']}>
                                                                <Activity />
                                                            </ProtectedRoute>
                                                        } />

                                                        <Route path="/approvals" element={
                                                            <ProtectedRoute requiredAnyPermissions={['approve:permits', 'APPROVE_PERMITS']}>
                                                                <Approvals />
                                                            </ProtectedRoute>
                                                        } />

                                                        <Route path="/reports" element={
                                                            <ProtectedRoute requiredAnyPermissions={['VIEW_REPORTS', 'read:reports']}>
                                                                <Reports />
                                                            </ProtectedRoute>
                                                        } />

                                                        {/* ========== ADMIN-ONLY ROUTES ========== */}
                                                        <Route path="/users" element={
                                                            <AdminRoute>
                                                                <UserManagement />
                                                            </AdminRoute>
                                                        } />

                                                        <Route path="/settings" element={
                                                            <ProtectedRoute requiredAnyPermissions={['SYSTEM_SETTINGS']}>
                                                                <Settings />
                                                            </ProtectedRoute>
                                                        } />

                                                        {/* ========== HELP AND SUPPORT (ALL USERS) ========== */}
                                                        <Route path="/help" element={
                                                            <div className="p-6">
                                                                <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
                                                                <p>Help content will be available here.</p>
                                                            </div>
                                                        } />

                                                        {/* ========== 404 CATCH-ALL ========== */}
                                                        <Route path="*" element={<NotFound />} />
                                                    </Routes>
                                                </Layout>
                                            </ProtectedRoute>
                                        } />
                                    </Routes>

                                    {/* ==================== GLOBAL NOTIFICATIONS ==================== */}
                                    <Toaster
                                        position="top-right"
                                        toastOptions={{
                                            duration: 4000,
                                            style: {
                                                background: '#363636',
                                                color: '#fff',
                                            },
                                            success: {
                                                duration: 3000,
                                                style: {
                                                    background: '#059669',
                                                    color: '#fff',
                                                },
                                                iconTheme: {
                                                    primary: '#fff',
                                                    secondary: '#059669',
                                                },
                                            },
                                            error: {
                                                duration: 5000,
                                                style: {
                                                    background: '#dc2626',
                                                    color: '#fff',
                                                },
                                                iconTheme: {
                                                    primary: '#fff',
                                                    secondary: '#dc2626',
                                                },
                                            },
                                            loading: {
                                                duration: Infinity,
                                                style: {
                                                    background: '#3b82f6',
                                                    color: '#fff',
                                                },
                                            },
                                        }}
                                    />

                                    {/* ==================== DEVELOPMENT MODE INDICATOR ==================== */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 shadow-lg z-50">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-yellow-800 font-medium">
                                                    Development Mode
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Router>
                        </NotificationProvider>
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default App