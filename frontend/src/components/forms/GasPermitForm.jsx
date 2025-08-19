import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
    GAS_WORK_TYPE,
    GAS_TYPE,
    GAS_INSTALLATION_TYPE,
    GAS_WORK_TYPE_LABELS,
    GAS_TYPE_LABELS,
    GAS_INSTALLATION_TYPE_LABELS
} from '../../utils/constants'

const GasPermitForm = ({ data = {}, onChange }) => {
    const [formData, setFormData] = useState({
                                                 workType: '',
                                                 gasType: '',
                                                 installationType: '',
                                                 projectCost: '',
                                                 workDescription: '',
                                                 totalBtuInput: '',
                                                 gasLineSizeInches: '',
                                                 gasLineLengthFeet: '',
                                                 numberOfAppliances: '',
                                                 applianceDetails: '',
                                                 requiresMeterUpgrade: false,
                                                 requiresRegulator: false,
                                                 existingMeterNumber: '',
                                                 specialRequirements: '',
                                                 ...data
                                             })

    const updateFormData = (field, value) => {
        const newData = { ...formData, [field]: value }
        setFormData(newData)
        onChange && onChange(newData)
    }

    const isHighBtuInstallation = formData.totalBtuInput && parseInt(formData.totalBtuInput) > 400000
    const isCommercialInstallation = ['COMMERCIAL', 'INDUSTRIAL', 'INSTITUTIONAL'].includes(formData.installationType)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Gas Installation Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Provide details about your gas installation project.
                </p>
            </div>

            {/* Safety Warning */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                            Safety Notice
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            All gas work must be performed by a licensed gas contractor.
                            Improper gas installation can result in serious safety hazards including fire, explosion, and carbon monoxide poisoning.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Work Type */}
                <div>
                    <label className="form-label">
                        Type of Gas Work *
                    </label>
                    <select
                        value={formData.workType}
                        onChange={(e) => updateFormData('workType', e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select work type</option>
                        {Object.entries(GAS_WORK_TYPE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Gas Type */}
                <div>
                    <label className="form-label">
                        Gas Type *
                    </label>
                    <select
                        value={formData.gasType}
                        onChange={(e) => updateFormData('gasType', e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select gas type</option>
                        {Object.entries(GAS_TYPE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Installation Type */}
                <div>
                    <label className="form-label">
                        Installation Type *
                    </label>
                    <select
                        value={formData.installationType}
                        onChange={(e) => updateFormData('installationType', e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select installation type</option>
                        {Object.entries(GAS_INSTALLATION_TYPE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Project Cost */}
                <div>
                    <label className="form-label">
                        Project Cost *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={formData.projectCost}
                            onChange={(e) => updateFormData('projectCost', e.target.value)}
                            className="form-input pl-8"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                {/* Total BTU Input */}
                <div>
                    <label className="form-label">
                        Total BTU Input *
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={formData.totalBtuInput}
                            onChange={(e) => updateFormData('totalBtuInput', e.target.value)}
                            className="form-input"
                            placeholder="Enter total BTU"
                            min="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              BTU/hr
            </span>
                    </div>
                    <p className="form-help">
                        Total BTU input of all gas appliances
                    </p>
                </div>

                {/* Gas Line Size */}
                <div>
                    <label className="form-label">
                        Gas Line Size
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={formData.gasLineSizeInches}
                            onChange={(e) => updateFormData('gasLineSizeInches', e.target.value)}
                            className="form-input"
                            placeholder="1.0"
                            min="0.5"
                            max="8"
                            step="0.25"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              inches
            </span>
                    </div>
                </div>

                {/* Gas Line Length */}
                <div>
                    <label className="form-label">
                        Gas Line Length
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={formData.gasLineLengthFeet}
                            onChange={(e) => updateFormData('gasLineLengthFeet', e.target.value)}
                            className="form-input"
                            placeholder="50"
                            min="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              feet
            </span>
                    </div>
                </div>

                {/* Number of Appliances */}
                <div>
                    <label className="form-label">
                        Number of Appliances
                    </label>
                    <input
                        type="number"
                        value={formData.numberOfAppliances}
                        onChange={(e) => updateFormData('numberOfAppliances', e.target.value)}
                        className="form-input"
                        placeholder="1"
                        min="1"
                    />
                </div>

                {/* Existing Meter Number */}
                <div>
                    <label className="form-label">
                        Existing Meter Number
                    </label>
                    <input
                        type="text"
                        value={formData.existingMeterNumber}
                        onChange={(e) => updateFormData('existingMeterNumber', e.target.value)}
                        className="form-input"
                        placeholder="Enter meter number if applicable"
                    />
                </div>

                {/* Work Description */}
                <div className="md:col-span-2">
                    <label className="form-label">
                        Detailed Work Description *
                    </label>
                    <textarea
                        value={formData.workDescription}
                        onChange={(e) => updateFormData('workDescription', e.target.value)}
                        rows={4}
                        className="form-textarea"
                        placeholder="Describe the gas work to be performed..."
                    />
                </div>

                {/* Appliance Details */}
                <div className="md:col-span-2">
                    <label className="form-label">
                        Appliance Details
                    </label>
                    <textarea
                        value={formData.applianceDetails}
                        onChange={(e) => updateFormData('applianceDetails', e.target.value)}
                        rows={3}
                        className="form-textarea"
                        placeholder="List all gas appliances (type, model, BTU rating)..."
                    />
                    <p className="form-help">
                        Include appliance type, manufacturer, model, and BTU rating for each appliance
                    </p>
                </div>

                {/* Special Requirements */}
                <div className="md:col-span-2">
                    <label className="form-label">
                        Special Requirements
                    </label>
                    <textarea
                        value={formData.specialRequirements}
                        onChange={(e) => updateFormData('specialRequirements', e.target.value)}
                        rows={2}
                        className="form-textarea"
                        placeholder="Any special installation requirements or considerations..."
                    />
                </div>
            </div>

            {/* System Requirements */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    System Requirements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.requiresMeterUpgrade}
                            onChange={(e) => updateFormData('requiresMeterUpgrade', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Meter upgrade required
            </span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.requiresRegulator}
                            onChange={(e) => updateFormData('requiresRegulator', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Pressure regulator required
            </span>
                    </label>
                </div>
            </div>

            {/* High BTU Warning */}
            {isHighBtuInstallation && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                High BTU Installation
                            </h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                This installation exceeds 400,000 BTU and will require pressure testing and additional safety inspections.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Commercial Installation Notice */}
            {isCommercialInstallation && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Commercial Installation
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Commercial gas installations require additional documentation, emergency shutoff systems, and enhanced safety measures.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GasPermitForm