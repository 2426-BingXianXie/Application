import React, { useState, useMemo } from 'react'
import {
    Users, Plus, Search, Shield, Edit, Trash2, UserCheck, UserX,
    Mail, Phone, MapPin, Calendar, AlertTriangle, CheckCircle,
    Filter, Download, Upload, RefreshCw, Settings, Eye, Ban
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import Card from '../components/ui/Card'
import RoleGuard from '../components/ui/RoleGuard'
import {
    USER_ROLES,
    USER_ROLE_LABELS,
    USER_ROLE_DESCRIPTIONS,
    DEFAULT_ADMIN
} from '../utils/constants'
import { formatDate } from '../utils/formatters'

const UserManagement = () => {
    const { user: currentUser, isAdmin } = useAuth()
    const { showSuccess, showError, showWarning } = useNotifications()

    // State management
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])

    // Modal states
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false)
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    // Mock users data - replace with actual API call
    const [users] = useState([
                                 {
                                     id: 1,
                                     firstName: 'System',
                                     lastName: 'Administrator',
                                     email: 'admin@municipality.gov',
                                     phone: '(555) 123-4567',
                                     role: 'ADMIN',
                                     status: 'ACTIVE',
                                     createdAt: '2024-01-01T00:00:00Z',
                                     lastLoginAt: '2024-01-15T10:30:00Z',
                                     address: '123 City Hall Drive',
                                     city: 'Springfield',
                                     state: 'MA',
                                     zipCode: '01103',
                                     permitCount: 0,
                                     isDefaultAdmin: true
                                 },
                                 {
                                     id: 2,
                                     firstName: 'John',
                                     lastName: 'Smith',
                                     email: 'john.smith@email.com',
                                     phone: '(555) 234-5678',
                                     role: 'APPLICANT',
                                     status: 'ACTIVE',
                                     createdAt: '2024-01-05T14:22:00Z',
                                     lastLoginAt: '2024-01-14T09:15:00Z',
                                     address: '456 Oak Street',
                                     city: 'Springfield',
                                     state: 'MA',
                                     zipCode: '01104',
                                     permitCount: 3
                                 },
                                 {
                                     id: 3,
                                     firstName: 'ABC Construction',
                                     lastName: 'LLC',
                                     email: 'permits@abcconstruction.com',
                                     phone: '(555) 345-6789',
                                     role: 'CONTRACTOR',
                                     status: 'ACTIVE',
                                     createdAt: '2024-01-08T11:45:00Z',
                                     lastLoginAt: '2024-01-13T16:20:00Z',
                                     address: '789 Industrial Blvd',
                                     city: 'Springfield',
                                     state: 'MA',
                                     zipCode: '01105',
                                     permitCount: 12,
                                     contractorLicense: 'CSL-12345',
                                     licenseExpiration: '2025-06-30'
                                 },
                                 {
                                     id: 4,
                                     firstName: 'Jane',
                                     lastName: 'Reviewer',
                                     email: 'jane.reviewer@municipality.gov',
                                     phone: '(555) 456-7890',
                                     role: 'REVIEWER',
                                     status: 'ACTIVE',
                                     createdAt: '2024-01-10T08:30:00Z',
                                     lastLoginAt: '2024-01-14T13:45:00Z',
                                     address: '321 Government Plaza',
                                     city: 'Springfield',
                                     state: 'MA',
                                     zipCode: '01103',
                                     permitCount: 0
                                 },
                                 {
                                     id: 5,
                                     firstName: 'Bob',
                                     lastName: 'Johnson',
                                     email: 'bob.johnson@email.com',
                                     phone: '(555) 567-8901',
                                     role: 'APPLICANT',
                                     status: 'INACTIVE',
                                     createdAt: '2024-01-12T16:15:00Z',
                                     lastLoginAt: '2024-01-12T16:30:00Z',
                                     address: '654 Pine Avenue',
                                     city: 'Springfield',
                                     state: 'MA',
                                     zipCode: '01106',
                                     permitCount: 1
                                 }
                             ])

    // Filter options
    const roleOptions = [
        { value: '', label: 'All Roles' },
        ...Object.entries(USER_ROLE_LABELS).map(([key, label]) => ({
            value: key,
            label
        }))
    ]

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'SUSPENDED', label: 'Suspended' }
    ]

    const sortOptions = [
        { value: 'createdAt', label: 'Registration Date' },
        { value: 'lastName', label: 'Last Name' },
        { value: 'email', label: 'Email' },
        { value: 'role', label: 'Role' },
        { value: 'lastLoginAt', label: 'Last Login' },
        { value: 'permitCount', label: 'Permit Count' }
    ]

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users.filter(user => {
            const matchesSearch = !searchTerm ||
                                  user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesRole = !roleFilter || user.role === roleFilter
            const matchesStatus = !statusFilter || user.status === statusFilter

            return matchesSearch && matchesRole && matchesStatus
        })

        // Sort users
        filtered.sort((a, b) => {
            let aValue, bValue

            switch (sortBy) {
                case 'createdAt':
                case 'lastLoginAt':
                    aValue = a[sortBy] ? new Date(a[sortBy]).getTime() : 0
                    bValue = b[sortBy] ? new Date(b[sortBy]).getTime() : 0
                    break
                case 'lastName':
                case 'email':
                case 'role':
                    aValue = a[sortBy] || ''
                    bValue = b[sortBy] || ''
                    break
                case 'permitCount':
                    aValue = a[sortBy] || 0
                    bValue = b[sortBy] || 0
                    break
                default:
                    return 0
            }

            if (typeof aValue === 'string') {
                return sortOrder === 'desc'
                       ? bValue.localeCompare(aValue)
                       : aValue.localeCompare(bValue)
            }

            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
        })

        return filtered
    }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder])

    // Calculate user statistics
    const userStats = useMemo(() => {
        return users.reduce((stats, user) => {
            stats.total = (stats.total || 0) + 1
            stats[user.role] = (stats[user.role] || 0) + 1
            stats[user.status] = (stats[user.status] || 0) + 1
            return stats
        }, {})
    }, [users])

    // Action handlers
    const handleCreateDefaultAdmin = async () => {
        try {
            setIsLoading(true)

            // Mock API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 1000))

            showSuccess(
                'Default Admin Created',
                `Admin account created with email: ${DEFAULT_ADMIN.email}`
            )

            setIsCreateAdminModalOpen(false)
        } catch (error) {
            showError('Creation Failed', 'Unable to create default admin account.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleUserStatus = async (user) => {
        if (user.isDefaultAdmin) {
            showWarning('Cannot Modify', 'The default admin account cannot be deactivated.')
            return
        }

        try {
            const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500))

            showSuccess(
                'Status Updated',
                `User has been ${newStatus.toLowerCase()}.`
            )
        } catch (error) {
            showError('Update Failed', 'Unable to update user status.')
        }
    }

    const handleEditUser = (user) => {
        setSelectedUser(user)
        setIsEditUserModalOpen(true)
    }

    const handleDeleteUser = (user) => {
        if (user.isDefaultAdmin) {
            showWarning('Cannot Delete', 'The default admin account cannot be deleted.')
            return
        }

        if (user.id === currentUser?.id) {
            showWarning('Cannot Delete', 'You cannot delete your own account.')
            return
        }

        setSelectedUser(user)
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteUser = async () => {
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500))

            showSuccess('User Deleted', 'User account has been permanently deleted.')
            setIsDeleteModalOpen(false)
            setSelectedUser(null)
        } catch (error) {
            showError('Delete Failed', 'Unable to delete user account.')
        }
    }

    const handleBulkAction = async (action) => {
        if (selectedUsers.length === 0) {
            showWarning('No Selection', 'Please select users to perform bulk actions.')
            return
        }

        const confirmed = window.confirm(
            `Are you sure you want to ${action.toLowerCase()} ${selectedUsers.length} user(s)?`
        )

        if (confirmed) {
            try {
                // Mock API call
                await new Promise(resolve => setTimeout(resolve, 1000))

                showSuccess('Bulk Action Completed', `${action} applied to ${selectedUsers.length} user(s).`)
                setSelectedUsers([])
            } catch (error) {
                showError('Bulk Action Failed', 'Unable to complete bulk action.')
            }
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        setRoleFilter('')
        setStatusFilter('')
        setSortBy('createdAt')
        setSortOrder('desc')
    }

    const renderUserRow = (user) => {
        const isSelected = selectedUsers.includes(user.id)

        return (
            <tr key={user.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                {/* Checkbox */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id])
                            } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                            }
                        }}
                        disabled={user.isDefaultAdmin || user.id === currentUser?.id}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                </td>

                {/* User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.firstName} {user.lastName}
                                </div>
                                {user.isDefaultAdmin && (
                                    <Shield className="h-4 w-4 ml-2 text-amber-500" title="Default Admin" />
                                )}
                                {user.id === currentUser?.id && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        You
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                            </div>
                        </div>
                    </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'REVIEWER' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'CONTRACTOR' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {USER_ROLE_LABELS[user.role]}
                    </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        user.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {user.status === 'ACTIVE' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {user.status === 'INACTIVE' && <Ban className="w-3 h-3 mr-1" />}
                        {user.status}
                    </span>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="space-y-1">
                        <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.city}, {user.state}
                        </div>
                    </div>
                </td>

                {/* Permits */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.permitCount}
                </td>

                {/* Last Login */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                        <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit User"
                        >
                            <Edit className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => handleToggleUserStatus(user)}
                            disabled={user.isDefaultAdmin}
                            className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 disabled:opacity-50"
                            title={user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                        >
                            {user.status === 'ACTIVE' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>

                        <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={user.isDefaultAdmin || user.id === currentUser?.id}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            title="Delete User"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Users className="w-6 h-6 mr-3" />
                        User Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Manage user accounts, roles, and permissions
                    </p>
                </div>

                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsCreateUserModalOpen(true)}
                        className="flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create User
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => setIsCreateAdminModalOpen(true)}
                        className="flex items-center"
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Create Admin
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Total Users
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {userStats.total || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Administrators
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {userStats.ADMIN || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Active Users
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {userStats.ACTIVE || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Settings className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Contractors
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {userStats.CONTRACTOR || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Default Admin Alert */}
            <Card>
                <Card.Body>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <div className="flex items-start">
                            <Shield className="h-5 w-5 text-amber-400 mt-0.5 mr-3" />
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                    Default Administrator Account
                                </h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                    Create a default administrator account with full system privileges. This account can manage all permits, users, and system settings.
                                </p>
                                <div className="mt-3">
                                    <Button
                                        size="sm"
                                        variant="warning"
                                        onClick={() => setIsCreateAdminModalOpen(true)}
                                    >
                                        Create Default Admin
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Search and Filters */}
            <Card>
                <Card.Body>
                    <div className="space-y-4">
                        {/* Search and Primary Filters */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select
                                options={roleOptions}
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                placeholder="Filter by role"
                            />

                            <Select
                                options={statusOptions}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                placeholder="Filter by status"
                            />
                        </div>

                        {/* Sort Options and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Sort by:
                                    </label>
                                    <Select
                                        options={sortOptions}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-40"
                                    />
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                        title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                                    >
                                        {sortOrder === 'desc' ? '↓' : '↑'}
                                    </button>
                                </div>

                                {(searchTerm || roleFilter || statusFilter) && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>

                            {/* Bulk Actions */}
                            {selectedUsers.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedUsers.length} selected
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleBulkAction('DEACTIVATE')}
                                    >
                                        Deactivate
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleBulkAction('ACTIVATE')}
                                    >
                                        Activate
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {filteredAndSortedUsers.length} of {users.length} users
                                </span>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Users Table */}
            <Card>
                <Card.Body>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedUsers(
                                                    filteredAndSortedUsers
                                                        .filter(user => !user.isDefaultAdmin && user.id !== currentUser?.id)
                                                        .map(user => user.id)
                                                )
                                            } else {
                                                setSelectedUsers([])
                                            }
                                        }}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Permits
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredAndSortedUsers.length > 0 ? (
                                filteredAndSortedUsers.map(renderUserRow)
                            ) : (
                                 <tr>
                                     <td colSpan="8" className="px-6 py-12 text-center">
                                         <div className="flex flex-col items-center">
                                             <Users className="w-12 h-12 text-gray-300 mb-4" />
                                             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                 No users found
                                             </h3>
                                             <p className="text-gray-600 dark:text-gray-400">
                                                 {searchTerm || roleFilter || statusFilter
                                                  ? "Try adjusting your search criteria or filters."
                                                  : "No users have been created yet."
                                                 }
                                             </p>
                                         </div>
                                     </td>
                                 </tr>
                             )}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>

            {/* Create Default Admin Modal */}
            <Modal
                isOpen={isCreateAdminModalOpen}
                onClose={() => setIsCreateAdminModalOpen(false)}
                title="Create Default Administrator Account"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        This will create a default administrator account with full system access.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                            Default Admin Credentials:
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                            <li><strong>Email:</strong> {DEFAULT_ADMIN.email}</li>
                            <li><strong>Temporary Password:</strong> {DEFAULT_ADMIN.defaultPassword}</li>
                            <li><strong>Role:</strong> Administrator</li>
                            <li className="text-xs text-blue-600 dark:text-blue-400 italic">
                                * Administrator must change password on first login
                            </li>
                        </ul>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                    Security Notice
                                </h4>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                    The default admin account will have full access to all system functions.
                                    Ensure the password is changed immediately after first login.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="primary"
                            onClick={handleCreateDefaultAdmin}
                            loading={isLoading}
                            className="flex-1"
                        >
                            Create Admin Account
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setIsCreateAdminModalOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete User Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm User Deletion"
                size="md"
            >
                <div className="space-y-4">
                    <div className="flex items-start">
                        <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Are you sure you want to permanently delete the user account for{' '}
                                <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                This action cannot be undone. All associated data will be permanently removed.
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="danger"
                            onClick={confirmDeleteUser}
                            className="flex-1"
                        >
                            Delete User
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default UserManagement