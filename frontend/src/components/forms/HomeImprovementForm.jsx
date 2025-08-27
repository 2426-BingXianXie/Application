import React from 'react'
import { Settings, Search, Info } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { US_STATES } from '../../utils/constants'

const HomeImprovementForm = ({
                                 formData,
                                 errors,
                                 updateField,
                                 getFieldValue
                             }) => {

    const stateOptions = [
        { value: '', label: 'Select state' },
        ...US_STATES
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Home Improvement Registration
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Home Improvement Contractors must provide HIC registration information.
                </p>
            </div>

            {/* Form Fields */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Information Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                                When is HIC Registration Required?
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                                Home Improvement Contractor (HIC) registration is required for contractors performing
                                residential improvement work valued at $1,000 or more. Skip this section if not applicable.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Search HIC Database
                        </h3>
                    </div>
                    <Input
                        placeholder="Search for HIC registration by name or number..."
                        className="bg-white dark:bg-gray-700"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Search the HIC database to auto-fill registration information
                    </p>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Registration Information
                    </h3>

                    <Input
                        label="Registered Business Name"
                        value={getFieldValue('homeImprovementRegistration.name')}
                        onChange={(e) => updateField('homeImprovementRegistration.name', e.target.value)}
                        error={errors['homeImprovementRegistration.name']}
                        placeholder="Business name as registered with HIC"
                    />

                    <Input
                        label="DBA (Doing Business As)"
                        value={getFieldValue('homeImprovementRegistration.dba')}
                        onChange={(e) => updateField('homeImprovementRegistration.dba', e.target.value)}
                        error={errors['homeImprovementRegistration.dba']}
                        placeholder="Trade name or DBA (if different from registered name)"
                        helperText="Optional - if business operates under different name"
                    />
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Business Address
                    </h3>

                    <Input
                        label="Address"
                        value={getFieldValue('homeImprovementRegistration.address')}
                        onChange={(e) => updateField('homeImprovementRegistration.address', e.target.value)}
                        error={errors['homeImprovementRegistration.address']}
                        placeholder="Street address"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="City"
                            value={getFieldValue('homeImprovementRegistration.city')}
                            onChange={(e) => updateField('homeImprovementRegistration.city', e.target.value)}
                            error={errors['homeImprovementRegistration.city']}
                            placeholder="City"
                        />

                        <Select
                            label="State"
                            value={getFieldValue('homeImprovementRegistration.state')}
                            onChange={(value) => updateField('homeImprovementRegistration.state', value)}
                            options={stateOptions}
                            error={errors['homeImprovementRegistration.state']}
                        />

                        <Input
                            label="ZIP Code"
                            value={getFieldValue('homeImprovementRegistration.zipCode')}
                            onChange={(e) => updateField('homeImprovementRegistration.zipCode', e.target.value)}
                            error={errors['homeImprovementRegistration.zipCode']}
                            placeholder="12345"
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            type="tel"
                            value={getFieldValue('homeImprovementRegistration.phoneNumber')}
                            onChange={(e) => updateField('homeImprovementRegistration.phoneNumber', e.target.value)}
                            error={errors['homeImprovementRegistration.phoneNumber']}
                            placeholder="(555) 123-4567"
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            value={getFieldValue('homeImprovementRegistration.email')}
                            onChange={(e) => updateField('homeImprovementRegistration.email', e.target.value)}
                            error={errors['homeImprovementRegistration.email']}
                            placeholder="business@example.com"
                            helperText="Optional"
                        />
                    </div>
                </div>

                {/* Registration Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        HIC Registration Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Registration Number"
                            value={getFieldValue('homeImprovementRegistration.registrationNumber')}
                            onChange={(e) => updateField('homeImprovementRegistration.registrationNumber', e.target.value)}
                            error={errors['homeImprovementRegistration.registrationNumber']}
                            placeholder="e.g., HIC.123456"
                            helperText="HIC registration number"
                        />

                        <Input
                            label="Registration Expiration Date"
                            type="date"
                            value={getFieldValue('homeImprovementRegistration.registrationExpiration')}
                            onChange={(e) => updateField('homeImprovementRegistration.registrationExpiration', e.target.value)}
                            error={errors['homeImprovementRegistration.registrationExpiration']}
                            helperText="Must be current and valid"
                        />
                    </div>
                </div>

                {/* Bond and Insurance Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Bond and Insurance Requirements
                    </h3>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2">
                            Required Amounts
                        </h4>
                        <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                            <li>• Minimum surety bond: $50,000</li>
                            <li>• Minimum liability insurance: $100,000</li>
                            <li>• Additional coverage may be required based on project scope</li>
                        </ul>
                    </div>
                </div>

                {/* Document Requirements */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Required Documentation
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Copy of current HIC registration certificate</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Proof of surety bond</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Certificate of liability insurance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Workers' compensation certificate (if applicable)</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        These documents will need to be uploaded before permit approval
                    </p>
                </div>

                {/* HIC Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        Home Improvement Contractor Registration
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• Required for residential improvement work over $1,000</li>
                        <li>• Registration must be current and in good standing</li>
                        <li>• Provides consumer protection through guaranty fund</li>
                        <li>• All information will be verified against state records</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HomeImprovementForm