import React from 'react'
import { MapPin, Search, User } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { US_STATES, ZONING_CLASSIFICATIONS } from '../../utils/constants'

const LocationInfoForm = ({
                              formData,
                              errors,
                              updateField,
                              getFieldValue
                          }) => {

    const applicantTypeOptions = [
        { value: '', label: 'Select your option' },
        { value: 'owner', label: 'Property Owner' },
        { value: 'contractor', label: 'Contractor' },
        { value: 'architect', label: 'Architect' },
        { value: 'other', label: 'Other' }
    ]

    const stateOptions = [
        { value: '', label: 'Select state' },
        ...US_STATES
    ]

    const zoningOptions = [
        { value: '', label: 'Select zoning' },
        ...ZONING_CLASSIFICATIONS
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Location & Applicant Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Please provide the property location and specify your relationship to this project.
                </p>
            </div>

            {/* Form Fields */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Property Search */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <MapPin className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Search for Address or Parcel
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Search for an address or parcel by name, address, or Parcel ID.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <Input
                            placeholder="Search for a name, address, or Parcel ID"
                            startIcon={<Search className="h-4 w-4" />}
                            value={getFieldValue('locationInfo.searchQuery')}
                            onChange={(e) => updateField('locationInfo.searchQuery', e.target.value)}
                            error={errors['locationInfo.searchQuery']}
                        />
                    </div>
                </div>

                {/* Property Address */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Property Address
                    </h3>

                    <Input
                        label="Property Address"
                        required
                        value={getFieldValue('locationInfo.propertyAddress')}
                        onChange={(e) => updateField('locationInfo.propertyAddress', e.target.value)}
                        error={errors['locationInfo.propertyAddress']}
                        placeholder="123 Main Street"
                        helperText="Enter the full property address where work will be performed"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="City"
                            required
                            value={getFieldValue('locationInfo.propertyCity')}
                            onChange={(e) => updateField('locationInfo.propertyCity', e.target.value)}
                            error={errors['locationInfo.propertyCity']}
                            placeholder="City name"
                        />

                        <Select
                            label="State"
                            required
                            value={getFieldValue('locationInfo.propertyState')}
                            onChange={(value) => updateField('locationInfo.propertyState', value)}
                            options={stateOptions}
                            error={errors['locationInfo.propertyState']}
                        />

                        <Input
                            label="ZIP Code"
                            required
                            value={getFieldValue('locationInfo.propertyZipCode')}
                            onChange={(e) => updateField('locationInfo.propertyZipCode', e.target.value)}
                            error={errors['locationInfo.propertyZipCode']}
                            placeholder="12345"
                        />
                    </div>
                </div>

                {/* Property Owner */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Property Owner Information
                    </h3>

                    <Input
                        label="Property Owner Name"
                        value={getFieldValue('locationInfo.propertyOwnerName')}
                        onChange={(e) => updateField('locationInfo.propertyOwnerName', e.target.value)}
                        error={errors['locationInfo.propertyOwnerName']}
                        placeholder="Owner's full name"
                    />
                </div>

                {/* Additional Property Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Property Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Parcel ID"
                            value={getFieldValue('locationInfo.parcelId')}
                            onChange={(e) => updateField('locationInfo.parcelId', e.target.value)}
                            error={errors['locationInfo.parcelId']}
                            placeholder="e.g., 123-456-789"
                            helperText="If known"
                        />

                        <Select
                            label="Zoning Classification"
                            value={getFieldValue('locationInfo.zoningClassification')}
                            onChange={(value) => updateField('locationInfo.zoningClassification', value)}
                            options={zoningOptions}
                            error={errors['locationInfo.zoningClassification']}
                            helperText="If known"
                        />
                    </div>

                    <Input
                        label="Lot Size (sq ft)"
                        type="number"
                        value={getFieldValue('locationInfo.lotSizeSqft')}
                        onChange={(e) => updateField('locationInfo.lotSizeSqft', e.target.value)}
                        error={errors['locationInfo.lotSizeSqft']}
                        placeholder="0"
                        helperText="If known"
                    />
                </div>

                {/* Applicant Type */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center mb-4">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Applicant Information
                        </h3>
                    </div>

                    <Select
                        label="Applicant Type"
                        required
                        value={getFieldValue('permitInfo.applicantType')}
                        onChange={(value) => updateField('permitInfo.applicantType', value)}
                        options={applicantTypeOptions}
                        error={errors['permitInfo.applicantType']}
                        helperText="Select your relationship to this project"
                    />

                    {getFieldValue('permitInfo.applicantType') === 'owner' && (
                        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Important Notice:</strong> "Persons contracting with unregistered contractors
                                do not have access to the guaranty fund" (as set forth in MGL c. 142A)
                            </p>
                        </div>
                    )}
                </div>

                {/* Professional Services */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Professional Services
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={getFieldValue('permitInfo.hasArchitect')}
                                    onChange={(e) => updateField('permitInfo.hasArchitect', e.target.checked)}
                                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <span className="text-sm text-gray-900 dark:text-white">
                  Do you have an Architect?
                </span>
                            </label>
                        </div>

                        <div>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={getFieldValue('permitInfo.hasEngineer')}
                                    onChange={(e) => updateField('permitInfo.hasEngineer', e.target.checked)}
                                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <span className="text-sm text-gray-900 dark:text-white">
                  Do you have an Engineer?
                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Information Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        Property Location Requirements
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• Provide the exact address where the work will be performed</li>
                        <li>• Property owner information is required for all permits</li>
                        <li>• Parcel ID and zoning information help expedite the review process</li>
                        <li>• Professional services may be required based on project scope</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default LocationInfoForm