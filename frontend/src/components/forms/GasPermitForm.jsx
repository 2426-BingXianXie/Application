import React from 'react'
import { Flame, DollarSign, Settings, AlertTriangle } from 'lucide-react'
import Input, { Textarea } from '../ui/Input'
import Select from '../ui/Select'
import { GAS_WORK_TYPE_LABELS, GAS_TYPE_LABELS, GAS_INSTALLATION_TYPE_LABELS } from '../../utils/constants'

const GasPermitForm = ({
                           formData,
                           errors,
                           updateField,
                           getFieldValue
                       }) => {

    const workTypeOptions = [
        { value: '', label: 'Select work type' },
        ...Object.entries(GAS_WORK_TYPE_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    const gasTypeOptions = [
        { value: '', label: 'Select gas type' },
        ...Object.entries(GAS_TYPE_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    const installationTypeOptions = [
        { value: '', label: 'Select installation type' },
        ...Object.entries(GAS_INSTALLATION_TYPE_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Gas Permit Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Please provide details about your gas installation, modification, or repair work.
                </p>
            </div>

            {/* Form Fields */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Work Type and Gas Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Gas Work Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Work Type"
                            required
                            value={getFieldValue('gasPermitInfo.workType')}
                            onChange={(value) => updateField('gasPermitInfo.workType', value)}
                            options={workTypeOptions}
                            error={errors['gasPermitInfo.workType']}
                            helperText="Type of gas work"
                        />

                        <Select
                            label="Gas Type"
                            required
                            value={getFieldValue('gasPermitInfo.gasType')}
                            onChange={(value) => updateField('gasPermitInfo.gasType', value)}
                            options={gasTypeOptions}
                            error={errors['gasPermitInfo.gasType']}
                        />
                    </div>

                    <Select
                        label="Installation Type"
                        required
                        value={getFieldValue('gasPermitInfo.installationType')}
                        onChange={(value) => updateField('gasPermitInfo.installationType', value)}
                        options={installationTypeOptions}
                        error={errors['gasPermitInfo.installationType']}
                    />
                </div>

                {/* Work Description */}
                <div>
                    <Textarea
                        label="Work Description"
                        required
                        value={getFieldValue('gasPermitInfo.workDescription')}
                        onChange={(e) => updateField('gasPermitInfo.workDescription', e.target.value)}
                        error={errors['gasPermitInfo.workDescription']}
                        placeholder="Describe the gas work to be performed in detail..."
                        rows={4}
                        helperText="Provide specific details about the gas installation or work"
                    />
                </div>

                {/* Technical Specifications */}
                <div className="space-y-4">
                    <div className="flex items-center mb-4">
                        <Settings className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Technical Specifications
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Total BTU Input"
                            type="number"
                            value={getFieldValue('gasPermitInfo.totalBtuInput')}
                            onChange={(e) => updateField('gasPermitInfo.totalBtuInput', e.target.value)}
                            error={errors['gasPermitInfo.totalBtuInput']}
                            placeholder="0"
                            helperText="Total BTU rating of all appliances"
                        />

                        <Input
                            label="Gas Line Length (feet)"
                            type="number"
                            value={getFieldValue('gasPermitInfo.gasLineLengthFeet')}
                            onChange={(e) => updateField('gasPermitInfo.gasLineLengthFeet', e.target.value)}
                            error={errors['gasPermitInfo.gasLineLengthFeet']}
                            placeholder="0"
                            helperText="Total length of new gas line"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Number of Appliances"
                            type="number"
                            value={getFieldValue('gasPermitInfo.numberOfAppliances')}
                            onChange={(e) => updateField('gasPermitInfo.numberOfAppliances', e.target.value)}
                            error={errors['gasPermitInfo.numberOfAppliances']}
                            placeholder="0"
                            helperText="Total appliances to be connected"
                        />

                        <Input
                            label="Gas Line Size (inches)"
                            type="number"
                            step="0.125"
                            value={getFieldValue('gasPermitInfo.gasLineSizeInches')}
                            onChange={(e) => updateField('gasPermitInfo.gasLineSizeInches', e.target.value)}
                            error={errors['gasPermitInfo.gasLineSizeInches']}
                            placeholder="0.5"
                            helperText="Diameter of gas line in inches"
                        />
                    </div>

                    <Input
                        label="Project Cost"
                        type="number"
                        startIcon={<DollarSign className="h-4 w-4" />}
                        value={getFieldValue('gasPermitInfo.projectCost')}
                        onChange={(e) => updateField('gasPermitInfo.projectCost', e.target.value)}
                        error={errors['gasPermitInfo.projectCost']}
                        placeholder="0.00"
                        helperText="Total estimated project cost"
                    />
                </div>

                {/* Appliance Details */}
                <div>
                    <Textarea
                        label="Appliance Details"
                        value={getFieldValue('gasPermitInfo.applianceDetails')}
                        onChange={(e) => updateField('gasPermitInfo.applianceDetails', e.target.value)}
                        error={errors['gasPermitInfo.applianceDetails']}
                        placeholder="List all gas appliances with make, model, and BTU ratings..."
                        rows={3}
                        helperText="Describe each appliance to be installed or connected"
                    />
                </div>

                {/* System Requirements */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        System Requirements
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={getFieldValue('gasPermitInfo.requiresMeterUpgrade')}
                                    onChange={(e) => updateField('gasPermitInfo.requiresMeterUpgrade', e.target.checked)}
                                    className="form-checkbox h-4 w-4 text-orange-600 transition duration-150 ease-in-out"
                                />
                                <span className="text-sm text-gray-900 dark:text-white">
                  Requires meter upgrade?
                </span>
                            </label>
                            <p className="ml-7 text-xs text-gray-500 dark:text-gray-400">
                                Check if existing gas meter needs to be upgraded
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={getFieldValue('gasPermitInfo.requiresRegulator')}
                                    onChange={(e) => updateField('gasPermitInfo.requiresRegulator', e.target.checked)}
                                    className="form-checkbox h-4 w-4 text-orange-600 transition duration-150 ease-in-out"
                                />
                                <span className="text-sm text-gray-900 dark:text-white">
                  Requires pressure regulator?
                </span>
                            </label>
                            <p className="ml-7 text-xs text-gray-500 dark:text-gray-400">
                                Check if pressure regulator installation is needed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Safety Notice */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-red-900 dark:text-red-200">
                                Gas Safety Requirements
                            </h4>
                            <ul className="text-sm text-red-800 dark:text-red-300 mt-2 space-y-1">
                                <li>• All gas work must be performed by a licensed gas contractor</li>
                                <li>• Pressure testing is required for all new gas installations</li>
                                <li>• Gas appliances must be properly vented and meet current codes</li>
                                <li>• Emergency shutoff valves must be accessible and properly labeled</li>
                                <li>• Final inspection is mandatory before gas service activation</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        Gas Permit Information
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• BTU calculations determine required gas line sizing</li>
                        <li>• Utility company coordination may be required for new service</li>
                        <li>• Commercial installations have additional safety requirements</li>
                        <li>• Provide accurate appliance specifications for proper sizing</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default GasPermitForm