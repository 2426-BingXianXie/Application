import React, { useState } from 'react'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Key,
    Bell,
    Save,
    Camera,
    Edit,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { US_STATES } from '../utils/constants'
import { validateEmail, validatePhone, formatPhoneNumber } from '../utils/validators'

const Profile = () => {
    const { user, updateProfile } = useAuth()
    const { success, error } = useToast()

    const [activeTab, setActiveTab] = useState('personal')
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [profileData, setProfileData] = useState({
                                                       firstName: user?.firstName || '',
                                                       lastName: user?.lastName || '',
                                                       email: user?.email || '',
                                                       phone: user?.phone || '',
                                                       company: user?.company || '',
                                                       title: user?.title || '',
                                                       address1: user?.address1 || '',
                                                       address2: user?.address2 || '',
                                                       city: user?.city || '',
                                                       state: user?.state || '',
                                                       zipCode: user?.zipCode || ''
                                                   })

    const [passwordData, setPasswordData] = useState({
                                                         currentPassword: '',
                                                         newPassword: '',
                                                         confirmPassword: ''
                                                     })

    const [notificationSettings, setNotificationSettings] = useState({
                                                                         emailNotifications: user?.preferences?.emailNotifications ?? true,
                                                                         smsNotifications: user?.preferences?.smsNotifications ?? false,
                                                                         permitUpdates: user?.preferences?.permitUpdates ?? true,
                                                                         reminderNotifications: user?.preferences?.reminderNotifications ?? true,
                                                                         marketingEmails: user?.preferences?.marketingEmails ?? false
                                                                     })

    const [validationErrors, setValidationErrors] = useState({})

    const tabs = [
        { id: 'personal', label: 'Personal Information', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ]

    const validatePersonalInfo = () => {
        const errors = {}

        if (!profileData.firstName.trim()) errors.firstName = 'First name is required'
        if (!profileData.lastName.trim()) errors.lastName = 'Last name is required'
        if (!profileData.email.trim()) errors.email = 'Email is required'
        else if (!validateEmail(profileData.email)) errors.email = 'Please enter a valid email'
        if (!profileData.phone.trim()) errors.phone = 'Phone number is required'
        else if (!validatePhone(profileData.phone)) errors.phone = 'Please enter a valid phone number'

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const validatePassword = () => {
        const errors = {}

        if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required'
        if (!passwordData.newPassword) errors.newPassword = 'New password is required'
        else if (passwordData.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters'
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSaveProfile = async () => {
        if (!validatePersonalInfo()) return

        setIsSaving(true)
        try {
            await updateProfile(profileData)
            success('Profile updated successfully!')
            setIsEditing(false)
        } catch (err) {
            error('Failed to update profile. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleChangePassword = async () => {
        if (!validatePassword()) return

        setIsSaving(true)
        try {
            // This would call the password change service
            await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
            success('Password changed successfully!')
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            error('Failed to change password. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveNotifications = async () => {
        setIsSaving(true)
        try {
            // This would call the preferences update service
            await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
            success('Notification preferences updated!')
        } catch (err) {
            error('Failed to update preferences. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const updateProfileField = (field, value) => {
        if (field === 'phone') {
            value = formatPhoneNumber(value)
        }

        setProfileData(prev => ({ ...prev, [field]: value }))

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const renderPersonalInfo = () => (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="relative">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {(profileData.firstName?.charAt(0) || '') + (profileData.lastName?.charAt(0) || '')}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Camera className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Member since {formatDate(user?.createdAt || new Date())}
                    </p>
                </div>

                <Button
                    variant={isEditing ? 'success' : 'outline'}
                    onClick={() => setIsEditing(!isEditing)}
                    startIcon={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
            </div>

            {/* Personal Details */}
            <Card title="Personal Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => updateProfileField('firstName', e.target.value)}
                        error={validationErrors.firstName}
                        required
                        readOnly={!isEditing}
                        startIcon={<User className="w-4 h-4" />}
                    />

                    <Input
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => updateProfileField('lastName', e.target.value)}
                        error={validationErrors.lastName}
                        required
                        readOnly={!isEditing}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => updateProfileField('email', e.target.value)}
                        error={validationErrors.email}
                        required
                        readOnly={!isEditing}
                        startIcon={<Mail className="w-4 h-4" />}
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => updateProfileField('phone', e.target.value)}
                        error={validationErrors.phone}
                        required
                        readOnly={!isEditing}
                        startIcon={<Phone className="w-4 h-4" />}
                    />

                    <Input
                        label="Company (Optional)"
                        value={profileData.company}
                        onChange={(e) => updateProfileField('company', e.target.value)}
                        readOnly={!isEditing}
                        placeholder="Company name"
                    />

                    <Input
                        label="Job Title (Optional)"
                        value={profileData.title}
                        onChange={(e) => updateProfileField('title', e.target.value)}
                        readOnly={!isEditing}
                        placeholder="Your job title"
                    />
                </div>

                {isEditing && (
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false)
                                setProfileData({
                                                   firstName: user?.firstName || '',
                                                   lastName: user?.lastName || '',
                                                   email: user?.email || '',
                                                   phone: user?.phone || '',
                                                   company: user?.company || '',
                                                   title: user?.title || '',
                                                   address1: user?.address1 || '',
                                                   address2: user?.address2 || '',
                                                   city: user?.city || '',
                                                   state: user?.state || '',
                                                   zipCode: user?.zipCode || ''
                                               })
                                setValidationErrors({})
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSaveProfile}
                            loading={isSaving}
                            startIcon={<Save className="w-4 h-4" />}
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </Card>

            {/* Address Information */}
            <Card title="Address Information">
                <div className="space-y-4">
                    <Input
                        label="Street Address"
                        value={profileData.address1}
                        onChange={(e) => updateProfileField('address1', e.target.value)}
                        readOnly={!isEditing}
                        placeholder="123 Main Street"
                        startIcon={<MapPin className="w-4 h-4" />}
                    />

                    <Input
                        label="Address Line 2 (Optional)"
                        value={profileData.address2}
                        onChange={(e) => updateProfileField('address2', e.target.value)}
                        readOnly={!isEditing}
                        placeholder="Apartment, suite, etc."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-3">
                            <Input
                                label="City"
                                value={profileData.city}
                                onChange={(e) => updateProfileField('city', e.target.value)}
                                readOnly={!isEditing}
                                placeholder="City name"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Select
                                label="State"
                                value={profileData.state}
                                onChange={(value) => updateProfileField('state', value)}
                                options={US_STATES}
                                disabled={!isEditing}
                                placeholder="Select state"
                                searchable
                            />
                        </div>

                        <div className="md:col-span-1">
                            <Input
                                label="ZIP Code"
                                value={profileData.zipCode}
                                onChange={(e) => updateProfileField('zipCode', e.target.value)}
                                readOnly={!isEditing}
                                placeholder="12345"
                                maxLength={5}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )

    const renderSecurity = () => (
        <div className="space-y-6">
            <Card title="Change Password">
                <div className="space-y-4">
                    <Input
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        error={validationErrors.currentPassword}
                        required
                        startIcon={<Key className="w-4 h-4" />}
                    />

                    <Input
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        error={validationErrors.newPassword}
                        required
                        helperText="Password must be at least 8 characters long"
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        error={validationErrors.confirmPassword}
                        required
                    />

                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            onClick={handleChangePassword}
                            loading={isSaving}
                            startIcon={<Save className="w-4 h-4" />}
                        >
                            Change Password
                        </Button>
                    </div>
                </div>
            </Card>

            <Card title="Account Security">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-md">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    Email Verified
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300">
                                    Your email address has been verified
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-md">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Two-Factor Authentication
                                </p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Enable 2FA
                        </Button>
                    </div>
                </div>
            </Card>

            <Card title="Recent Activity">
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Login from Chrome on Windows
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Today at 2:30 PM • IP: 192.168.1.1
                            </p>
                        </div>
                        <span className="text-xs text-green-600 dark:text-green-400">Current session</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Login from Safari on iPhone
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Yesterday at 9:15 AM • IP: 192.168.1.50
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )

    const renderNotifications = () => (
        <div className="space-y-6">
            <Card title="Email Notifications">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Email Notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive notifications via email
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                emailNotifications: e.target.checked
                            }))}
                            className="form-checkbox"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Permit Updates
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Get notified when your permit status changes
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notificationSettings.permitUpdates}
                            onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                permitUpdates: e.target.checked
                            }))}
                            className="form-checkbox"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Reminder Notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Reminders for permit renewals and deadlines
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notificationSettings.reminderNotifications}
                            onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                reminderNotifications: e.target.checked
                            }))}
                            className="form-checkbox"
                        />
                    </div>
                </div>
            </Card>

            <Card title="SMS Notifications">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                SMS Notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive notifications via text message
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                smsNotifications: e.target.checked
                            }))}
                            className="form-checkbox"
                        />
                    </div>
                </div>
            </Card>

            <Card title="Marketing Communications">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Marketing Emails
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive updates about new features and services
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notificationSettings.marketingEmails}
                            onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                marketingEmails: e.target.checked
                            }))}
                            className="form-checkbox"
                        />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button
                    variant="primary"
                    onClick={handleSaveNotifications}
                    loading={isSaving}
                    startIcon={<Save className="w-4 h-4" />}
                >
                    Save Preferences
                </Button>
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your account information and preferences
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                                    isActive
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'personal' && renderPersonalInfo()}
                {activeTab === 'security' && renderSecurity()}
                {activeTab === 'notifications' && renderNotifications()}
            </div>
        </div>
    )
}

export default Profile