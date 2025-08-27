import React from 'react'
import { Shield, Search, AlertCircle } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { LICENSE_TYPE_LABELS, US_STATES } from '../../utils/constants'

const ContractorLicenseForm = ({
                                   formData,
                                   errors,
                                   updateField,
                                   getFieldValue,
                                   permitType
                               }) => {

    const licenseTypeOptions = [
        { value: '', label: 'Select license type' },
        ...Object.entries(LICENSE_TYPE_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    const stateOptions = [
        { value: '', label: 'Select state' },
        ...US_STATES
    ]

    const isGasPermit = permitType === 'gas'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {isGasPermit ? 'Gas Contractor License' : 'Contractor License Information'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {isGasPermit
                     ? 'Please provide gas contractor licensing information and certifications.'
                     : 'Please provide contractor licensing information for this project.'
                    }
                </p>
            </div>

            {/* Form Fields */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Search Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3 mb-4">
                        <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                            Search Contractor Database
                        </h3>
                    </div>
                    <Input
                        placeholder="Search for contractor by name or license number..."
                        className="bg-white dark:bg-gray-800"
                    />
                    <p className="text-xs text-blue-800 dark:text-blue-300 mt-2">
                        Search our database to auto-fill contractor information
                    </p>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Contractor Information
                    </h3>

                    <Input
                        label="Contractor Name"
                        required
                        value={getFieldValue('contractorLicense.name')}
                        onChange={(e) => updateField('contractorLicense.name', e.target.value)}
                        error={errors['contractorLicense.name']}
                        placeholder="Business or individual name"
                    />

                    <Input
                        label="DBA (Doing Business As)"
                        value={getFieldValue('contractorLicense.dba')}
                        onChange={(e) => updateField('contractorLicense.dba', e.target.value)}
                        error={errors['contractorLicense.dba']}
                        placeholder="Trade name or DBA (if applicable)"
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
                        required
                        value={getFieldValue('contractorLicense.address')}
                        onChange={(e) => updateField('contractorLicense.address', e.target.value)}
                        error={errors['contractorLicense.address']}
                        placeholder="Street address"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="City"
                            required
                            value={getFieldValue('contractorLicense.city')}
                            onChange={(e) => updateField('contractorLicense.city', e.target.value)}
                            error={errors['contractorLicense.city']}
                            placeholder="City"
                        />

                        <Select
                            label="State"
                            required
                            value={getFieldValue('contractorLicense.state')}
                            onChange={(value) => updateField('contractorLicense.state', value)}
                            options={stateOptions}
                            error={errors['contractorLicense.state']}
                        />

                        <Input
                            label="ZIP Code"
                            required
                            value={getFieldValue('contractorLicense.zipCode')}
                            onChange={(e) => updateField('contractorLicense.zipCode', e.target.value)}
                            error={errors['contractorLicense.zipCode']}
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
                            required
                            value={getFieldValue('contractorLicense.phoneNumber')}
                            onChange={(e) => updateField('contractorLicense.phoneNumber', e.target.value)}
                            error={errors['contractorLicense.phoneNumber']}
                            placeholder="(555) 123-4567"
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            value={getFieldValue('contractorLicense.email')}
                            onChange={(e) => updateField('contractorLicense.email', e.target.value)}
                            error={errors['contractorLicense.email']}
                            placeholder="contractor@example.com"
                            helperText="Optional"
                        />
                    </div>
                </div>

                {/* License Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        License Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="License Type"
                            required
                            value={getFieldValue('contractorLicense.licenseType')}
                            onChange={(value) => updateField('contractorLicense.licenseType', value)}
                            options={licenseTypeOptions}
                            error={errors['contractorLicense.licenseType']}
                            helperText={isGasPermit ? 'Must include gas fitting license' : 'Type of contractor license'}
                        />

                        <Input
                            label="License Number"
                            required
                            value={getFieldValue('contractorLicense.licenseNumber')}
                            onChange={(e) => updateField('contractorLicense.licenseNumber', e.target.value)}
                            error={errors['contractorLicense.licenseNumber']}
                            placeholder="e.g., CSL123456"
                        />
                    </div>

                    <Input
                        label="License Expiration Date"
                        type="date"
                        required
                        value={getFieldValue('contractorLicense.licenseExpiration')}
                        onChange={(e) => updateField('contractorLicense.licenseExpiration', e.target.value)}
                        error={errors['contractorLicense.licenseExpiration']}
                        helperText="License must be current and valid"
                    />
                </div>

                {/* Gas-specific Requirements */}
                {isGasPermit && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-orange-900 dark:text-orange-200">
                                    Gas Contractor Requirements
                                </h4>
                                <ul className="text-sm text-orange-800 dark:text-orange-300 mt-2 space-y-1">
                                    <li>• Must hold valid Gas Fitting license</li>
                                    <li>• Required insurance coverage for gas work</li>
                                    <li>• Current safety certifications required</li>
                                    <li>• Must be registered with state gas safety division</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Document Requirements */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Required Documentation
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Copy of current contractor license</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Certificate of insurance</span>
                        </div>
                        {isGasPermit && (
                            <>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Gas fitting license certificate</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Current safety training certificates</span>
                                </div>
                            </>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        These documents will need to be uploaded before permit approval
                    </p>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        Contractor Verification
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• All contractor information will be verified against state databases</li>
                        <li>• License must be current and in good standing</li>
                        <li>• Insurance requirements vary by permit type and project value</li>
                        <li>• Provide complete and accurate information to avoid delays</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ContractorLicenseForm