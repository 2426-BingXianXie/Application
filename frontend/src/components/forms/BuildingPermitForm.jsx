import React from 'react'
import { Building, DollarSign, FileText, User } from 'lucide-react'
import Input, { Textarea } from '../ui/Input'
import Select from '../ui/Select'
import { BUILDING_PERMIT_TYPE_LABELS, BUILDING_TYPE_LABELS, OCCUPANCY_TYPE_LABELS } from '../../utils/constants'

const BuildingPermitForm = ({
                                formData,
                                errors,
                                updateField,
                                getFieldValue
                            }) => {

    const permitForOptions = [
        { value: '', label: 'Select permit type' },
        ...Object.entries(BUILDING_PERMIT_TYPE_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    const buildingTypeOptions = [
        { value: '', label: 'Select building type' },
        ...Object.entries(BUILDING_TYPE_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    const occupancyTypeOptions = [
        { value: '', label: 'Select occupancy type' },
        ...Object.entries(OCCUPANCY_TYPE_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Building Permit Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Please provide details about your building project and construction work.
                </p>
            </div>

            {/* Form Fields */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Project Type and Cost */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Project Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Permit For"
                            required
                            value={getFieldValue('buildingPermitInfo.permitFor')}
                            onChange={(value) => updateField('buildingPermitInfo.permitFor', value)}
                            options={permitForOptions}
                            error={errors['buildingPermitInfo.permitFor']}
                            helperText="Type of building work"
                        />

                        <Input
                            label="Project Cost"
                            type="number"
                            required
                            startIcon={<DollarSign className="h-4 w-4" />}
                            value={getFieldValue('buildingPermitInfo.projectCost')}
                            onChange={(e) => updateField('buildingPermitInfo.projectCost', e.target.value)}
                            error={errors['buildingPermitInfo.projectCost']}
                            placeholder="0.00"
                            helperText="Total estimated project cost"
                        />
                    </div>
                </div>

                {/* Work Description */}
                <div>
                    <Textarea
                        label="Work Description"
                        required
                        value={getFieldValue('buildingPermitInfo.workDescription')}
                        onChange={(e) => updateField('buildingPermitInfo.workDescription', e.target.value)}
                        error={errors['buildingPermitInfo.workDescription']}
                        placeholder="Describe the work to be performed in detail..."
                        rows={4}
                        helperText="Provide a detailed description of the construction work"
                    />
                </div>

                {/* Building Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Building Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Building Type"
                            required
                            value={getFieldValue('buildingPermitInfo.buildingType')}
                            onChange={(value) => updateField('buildingPermitInfo.buildingType', value)}
                            options={buildingTypeOptions}
                            error={errors['buildingPermitInfo.buildingType']}
                        />

                        <Select
                            label="Occupancy Type"
                            required
                            value={getFieldValue('buildingPermitInfo.occupancyType')}
                            onChange={(value) => updateField('buildingPermitInfo.occupancyType', value)}
                            options={occupancyTypeOptions}
                            error={errors['buildingPermitInfo.occupancyType']}
                        />
                    </div>
                </div>

                {/* Tenant/Owner Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center mb-4">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Tenant/Owner Information
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Tenant/Owner Name"
                            required
                            value={getFieldValue('buildingPermitInfo.tenantOwnerName')}
                            onChange={(e) => updateField('buildingPermitInfo.tenantOwnerName', e.target.value)}
                            error={errors['buildingPermitInfo.tenantOwnerName']}
                            placeholder="Full name"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Tenant/Owner Phone"
                                type="tel"
                                required
                                value={getFieldValue('buildingPermitInfo.tenantOwnerPhone')}
                                onChange={(e) => updateField('buildingPermitInfo.tenantOwnerPhone', e.target.value)}
                                error={errors['buildingPermitInfo.tenantOwnerPhone']}
                                placeholder="(555) 123-4567"
                            />
                        </div>

                        <Input
                            label="Tenant/Owner Address"
                            required
                            value={getFieldValue('buildingPermitInfo.tenantOwnerAddress')}
                            onChange={(e) => updateField('buildingPermitInfo.tenantOwnerAddress', e.target.value)}
                            error={errors['buildingPermitInfo.tenantOwnerAddress']}
                            placeholder="Full address"
                        />
                    </div>
                </div>

                {/* Development Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Development Information
                    </h3>

                    <Input
                        label="Development Title"
                        value={getFieldValue('buildingPermitInfo.developmentTitle')}
                        onChange={(e) => updateField('buildingPermitInfo.developmentTitle', e.target.value)}
                        error={errors['buildingPermitInfo.developmentTitle']}
                        placeholder="Development or project name (if applicable)"
                        helperText="Optional - for subdivisions or planned developments"
                    />
                </div>

                {/* Owner Doing Work */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Work Arrangement
                    </h3>

                    <div>
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={getFieldValue('buildingPermitInfo.ownerDoingWork')}
                                onChange={(e) => updateField('buildingPermitInfo.ownerDoingWork', e.target.checked)}
                                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            />
                            <span className="text-sm text-gray-900 dark:text-white">
                Owner doing the work?
              </span>
                        </label>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Check if the property owner will be performing the work themselves
                        </p>
                    </div>

                    {getFieldValue('buildingPermitInfo.ownerDoingWork') && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>Owner Builder Notice:</strong> If you are doing the work yourself, you may still need
                                to meet licensing requirements for certain types of work (electrical, plumbing, etc.) and
                                obtain separate permits for specialized work.
                            </p>
                        </div>
                    )}
                </div>

                {/* Important Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        Important Permit Information
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• Provide accurate project cost - fees are calculated based on this amount</li>
                        <li>• Work description should be detailed and specific</li>
                        <li>• Building and occupancy types affect code requirements</li>
                        <li>• Professional services may be required for certain project types</li>
                        <li>• All work must be performed according to current building codes</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BuildingPermitForm