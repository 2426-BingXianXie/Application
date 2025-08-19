import React, { useState } from 'react'
import {
    BUILDING_PERMIT_TYPE,
    BUILDING_TYPE,
    OCCUPANCY_TYPE,
    BUILDING_PERMIT_TYPE_LABELS,
    BUILDING_TYPE_LABELS,
    OCCUPANCY_TYPE_LABELS
} from '../../utils/constants'

const BuildingPermitForm = ({ data = {}, onChange }) => {
    const [formData, setFormData] = useState({
                                                 permitFor: '',
                                                 projectCost: '',
                                                 workDescription: '',
                                                 tenantOwnerName: '',
                                                 tenantOwnerPhone: '',
                                                 tenantOwnerAddress: '',
                                                 developmentTitle: '',
                                                 buildingType: '',
                                                 occupancyType: '',
                                                 ownerDoingWork: false,
                                                 ...data
                                             })

    const updateFormData = (field, value) => {
        const newData = { ...formData, [field]: value }
        setFormData(newData)
        onChange && onChange(newData)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Building Permit Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Provide details about your building project.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Permit For */}
                <div>
                    <label className="form-label">
                        Permit For *
                    </label>
                    <select
                        value={formData.permitFor}
                        onChange={(e) => updateFormData('permitFor', e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select permit type</option>
                        {Object.entries(BUILDING_PERMIT_TYPE_LABELS).map(([key, label]) => (
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

                {/* Work Description */}
                <div className="md:col-span-2">
                    <label className="form-label">
                        Work Description *
                    </label>
                    <textarea
                        value={formData.workDescription}
                        onChange={(e) => updateFormData('workDescription', e.target.value)}
                        rows={4}
                        className="form-textarea"
                        placeholder="Describe the work to be performed..."
                    />
                    <p className="form-help">
                        Provide a detailed description of the construction work
                    </p>
                </div>

                {/* Building Type */}
                <div>
                    <label className="form-label">
                        Building Type *
                    </label>
                    <select
                        value={formData.buildingType}
                        onChange={(e) => updateFormData('buildingType', e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select building type</option>
                        {Object.entries(BUILDING_TYPE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Occupancy Type */}
                <div>
                    <label className="form-label">
                        Occupancy Type *
                    </label>
                    <select
                        value={formData.occupancyType}
                        onChange={(e) => updateFormData('occupancyType', e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select occupancy type</option>
                        {Object.entries(OCCUPANCY_TYPE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tenant/Owner Information */}
                <div>
                    <label className="form-label">
                        Tenant/Owner Name *
                    </label>
                    <input
                        type="text"
                        value={formData.tenantOwnerName}
                        onChange={(e) => updateFormData('tenantOwnerName', e.target.value)}
                        className="form-input"
                        placeholder="Full name of tenant or owner"
                    />
                </div>

                <div>
                    <label className="form-label">
                        Tenant/Owner Phone *
                    </label>
                    <input
                        type="tel"
                        value={formData.tenantOwnerPhone}
                        onChange={(e) => updateFormData('tenantOwnerPhone', e.target.value)}
                        className="form-input"
                        placeholder="(555) 123-4567"
                    />
                </div>

                {/* Tenant/Owner Address */}
                <div className="md:col-span-2">
                    <label className="form-label">
                        Tenant/Owner Address *
                    </label>
                    <input
                        type="text"
                        value={formData.tenantOwnerAddress}
                        onChange={(e) => updateFormData('tenantOwnerAddress', e.target.value)}
                        className="form-input"
                        placeholder="Complete address of tenant or owner"
                    />
                </div>

                {/* Development Title */}
                <div className="md:col-span-2">
                    <label className="form-label">
                        Development Title (if applicable)
                    </label>
                    <input
                        type="text"
                        value={formData.developmentTitle}
                        onChange={(e) => updateFormData('developmentTitle', e.target.value)}
                        className="form-input"
                        placeholder="Name of development or subdivision"
                    />
                </div>

                {/* Owner Doing Work */}
                <div className="md:col-span-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.ownerDoingWork}
                            onChange={(e) => updateFormData('ownerDoingWork', e.target.checked)}
                            className="form-checkbox"
                            id="ownerDoingWork"
                        />
                        <label htmlFor="ownerDoingWork" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Owner is performing the work
                        </label>
                    </div>

                    {formData.ownerDoingWork && (
                        <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Important:</strong> Persons contracting with unregistered contractors
                                do not have access to the guaranty fund (as set forth in MGL c. 142A).
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Professional Services */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                    Professional Services Required
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    Some projects may require professional architect or engineer services.
                    Check the boxes below if you have these professionals involved.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            // This would be handled at the parent permit level
                        />
                        <span className="ml-2 text-sm text-blue-700 dark:text-blue-300">
              Architect involved in project
            </span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            // This would be handled at the parent permit level
                        />
                        <span className="ml-2 text-sm text-blue-700 dark:text-blue-300">
              Engineer involved in project
            </span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default LocationInfoForm