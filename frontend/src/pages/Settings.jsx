import React, { useState } from 'react'
import {
    Settings as SettingsIcon,
    Moon,
    Sun,
    Monitor,
    Bell,
    Shield,
    Database,
    Download,
    Trash2,
    AlertTriangle,
    CheckCircle,
    Save
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { ConfirmModal } from '../components/ui/Modal'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'

const Settings = () => {
    const { theme, setTheme } = useTheme()
    const { user } = useAuth()
    const { success, error, warning } = useToast()

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataExportModal, setShowDataExportModal] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Settings state
    const [settings, setSettings] = useState({
                                                 language: 'en',
                                                 timezone: 'America/New_York',
                                                 dateFormat: 'MM/DD/YYYY',
                                                 currency: 'USD',
                                                 autoSave: true,
                                                 emailDigest: 'weekly',
                                                 systemNotifications: true,
                                                 pushNotifications: true,
                                                 dataRetention: '2years'
                                             })

    const themeOptions = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'system', label: 'System', icon: Monitor }
    ]

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'fr', label: 'Français' }
    ]

    const timezoneOptions = [
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Denver', label: 'Mountain Time (MT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
    ]

    const dateFormatOptions = [
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
    ]

    const emailDigestOptions = [
        { value: 'none', label: 'Never' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ]

    const dataRetentionOptions = [
        { value: '1year', label: '1 Year' },
        { value: '2years', label: '2 Years' },
        { value: '5years', label: '5 Years' },
        { value: 'forever', label: 'Forever' }
    ]

    const handleSaveSettings = async () => {
        try {
            // This would call the settings update service
            await new Promise(resolve => setTimeout(resolve, 1000))
            success('Settings saved successfully!')
        } catch (err) {
            error('Failed to save settings. Please try again.')
        }
    }

    const handleExportData = async () => {
        setIsExporting(true)
        try {
            // This would call the data export service
            await new Promise(resolve => setTimeout(resolve, 2000))
            success('Data export completed! Check your email for download link.')
            setShowDataExportModal(false)
        } catch (err) {
            error('Failed to export data. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            // This would call the account deletion service
            await new Promise(resolve => setTimeout(resolve, 2000))
            warning('Account deletion initiated. You will receive a confirmation email.')
            setShowDeleteModal(false)
        } catch (err) {
            error('Failed to delete account. Please contact support.')
        } finally {
            setIsDeleting(false)
        }
    }

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your application preferences and account settings
                </p>
            </div>

            {/* Appearance Settings */}
            <Card
                title="Appearance"
                subtitle="Customize how the application looks and feels"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Theme
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {themeOptions.map((option) => {
                                const Icon = option.icon
                                const isSelected = theme === option.value

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setTheme(option.value)}
                                        className={`p-4 border-2 rounded-lg transition-all ${
                                            isSelected
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                                            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                                        }`} />
                                        <p className={`text-sm font-medium ${
                                            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {option.label}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Regional Settings */}
            <Card
                title="Regional & Format"
                subtitle="Language, timezone, and display preferences"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Language"
                        value={settings.language}
                        onChange={(value) => updateSetting('language', value)}
                        options={languageOptions}
                        helperText="Application display language"
                    />

                    <Select
                        label="Timezone"
                        value={settings.timezone}
                        onChange={(value) => updateSetting('timezone', value)}
                        options={timezoneOptions}
                        helperText="Used for timestamps and deadlines"
                    />

                    <Select
                        label="Date Format"
                        value={settings.dateFormat}
                        onChange={(value) => updateSetting('dateFormat', value)}
                        options={dateFormatOptions}
                        helperText="How dates are displayed"
                    />

                    <Select
                        label="Currency"
                        value={settings.currency}
                        onChange={(value) => updateSetting('currency', value)}
                        options={[
                            { value: 'USD', label: 'US Dollar ($)' },
                            { value: 'EUR', label: 'Euro (€)' },
                            { value: 'GBP', label: 'British Pound (£)' },
                            { value: 'CAD', label: 'Canadian Dollar (C$)' }
                        ]}
                        helperText="Default currency for costs"
                    />
                </div>
            </Card>

            {/* Application Behavior */}
            <Card
                title="Application Behavior"
                subtitle="Configure how the application behaves"
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Auto-save Forms
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Automatically save form progress as you type
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.autoSave}
                            onChange={(e) => updateSetting('autoSave', e.target.checked)}
                            className="form-checkbox"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Digest Frequency
                        </label>
                        <Select
                            value={settings.emailDigest}
                            onChange={(value) => updateSetting('emailDigest', value)}
                            options={emailDigestOptions}
                            className="max-w-xs"
                            helperText="How often to receive permit status summaries"
                        />
                    </div>
                </div>
            </Card>

            {/* Notification Settings */}
            <Card
                title="Notifications"
                subtitle="Manage your notification preferences"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                System Notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Show notifications for system updates and maintenance
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.systemNotifications}
                            onChange={(e) => updateSetting('systemNotifications', e.target.checked)}
                            className="form-checkbox"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Push Notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Receive browser push notifications for important updates
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.pushNotifications}
                            onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                            className="form-checkbox"
                        />
                    </div>
                </div>
            </Card>

            {/* Privacy & Security */}
            <Card
                title="Privacy & Security"
                subtitle="Data handling and security preferences"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data Retention Period
                        </label>
                        <Select
                            value={settings.dataRetention}
                            onChange={(value) => updateSetting('dataRetention', value)}
                            options={dataRetentionOptions}
                            className="max-w-xs"
                            helperText="How long to keep your permit data"
                        />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                        <div className="flex items-start">
                            <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Data Security
                                </h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                    Your permit data is encrypted in transit and at rest. We follow industry best practices
                                    to keep your information secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Data Management */}
            <Card
                title="Data Management"
                subtitle="Export or delete your account data"
            >
                <div className="space-y-6">
                    {/* Export Data */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Export My Data
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Download all your permit applications and data
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowDataExportModal(true)}
                            startIcon={<Download className="w-4 h-4" />}
                        >
                            Export
                        </Button>
                    </div>

                    {/* Delete Account */}
                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Delete Account
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteModal(true)}
                            startIcon={<Trash2 className="w-4 h-4" />}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Advanced Settings */}
            <Card
                title="Advanced"
                subtitle="Developer and advanced user options"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Debug Mode
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Show additional debugging information in the console
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={false}
                            onChange={() => {}}
                            disabled={!user?.roles?.includes('ADMIN')}
                            className="form-checkbox"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Beta Features
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Enable experimental features and early access updates
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={false}
                            onChange={() => {}}
                            className="form-checkbox"
                        />
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Beta Features Warning
                                </h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Beta features are experimental and may not work as expected.
                                    Use at your own risk in production environments.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Save Settings */}
            <div className="flex justify-end">
                <Button
                    variant="primary"
                    onClick={handleSaveSettings}
                    startIcon={<Save className="w-4 h-4" />}
                >
                    Save All Settings
                </Button>
            </div>

            {/* Data Export Modal */}
            <ConfirmModal
                isOpen={showDataExportModal}
                onClose={() => setShowDataExportModal(false)}
                onConfirm={handleExportData}
                title="Export Account Data"
                message="This will generate a comprehensive export of all your permit applications, documents, and account information. You'll receive an email with a download link when the export is ready."
                confirmText="Start Export"
                variant="primary"
                loading={isExporting}
            />

            {/* Delete Account Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your permit applications, documents, and account data."
                confirmText="Delete Account"
                variant="danger"
                loading={isDeleting}
            />
        </div>
    )
}

export default Settings