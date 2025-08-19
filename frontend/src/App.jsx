import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Layout from './components/common/Layout'
import Dashboard from './pages/Dashboard'
import PermitApplication from './pages/PermitApplication'
import BuildingPermits from './pages/BuildingPermits'
import GasPermits from './pages/GasPermits'
import PermitDetails from './pages/PermitDetails'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ThemeProvider } from './context/ThemeContext'
import './styles/globals.css'

const queryClient = new QueryClient({
                                        defaultOptions: {
                                            queries: {
                                                retry: 1,
                                                refetchOnWindowFocus: false,
                                                staleTime: 5 * 60 * 1000,
                                            },
                                        },
                                    })

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AuthProvider>
                        <NotificationProvider>
                            <Router>
                                <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
                                    <Routes>
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/unauthorized" element={<Unauthorized />} />
                                        <Route path="/*" element={
                                            <Layout>
                                                <Routes>
                                                    <Route path="/" element={<Dashboard />} />
                                                    <Route path="/dashboard" element={<Dashboard />} />
                                                    <Route path="/apply" element={<PermitApplication />} />
                                                    <Route path="/building-permits" element={<BuildingPermits />} />
                                                    <Route path="/gas-permits" element={<GasPermits />} />
                                                    <Route path="/permit/:id" element={<PermitDetails />} />
                                                    <Route path="/profile" element={<Profile />} />
                                                    <Route path="/settings" element={<Settings />} />
                                                    <Route path="/reports" element={<Reports />} />
                                                    <Route path="*" element={<NotFound />} />
                                                </Routes>
                                            </Layout>
                                        } />
                                    </Routes>
                                    <Toaster
                                        position="top-right"
                                        toastOptions={{
                                            duration: 4000,
                                            style: {
                                                background: '#363636',
                                                color: '#fff',
                                            },
                                        }}
                                    />
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