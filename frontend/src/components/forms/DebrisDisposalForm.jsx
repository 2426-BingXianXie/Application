import React, { useState } from 'react'

const DebrisDisposalForm = ({ data = {}, onChange, readOnly = false, errors = {} }) => {
    const [formData, setFormData] = useState({
                                                 dumpsterLocation: '',
                                                 companyName: '',
                                                 companyLicenseNumber: '',
                                                 companyPhone: '',
                                                 companyEmail: '',
                                                 disposalMethod: 'DUMPSTER',
                                                 estimatedVolumeCubicYards: '',
                                                 debrisType: 'CONSTRUCTION',
                                                 specialRequirements: '',
                                                 isHazardousMaterial: false,
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
                    Debris Disposal
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Provide debris disposal location in accordance with MGL 40 Section 54.
                </p>
            </div>

            <div className="space-y-4">
                {/* Dumpster Location */}
                <div>
                    <label className="form-label">
                        Location of Dumpster Facility (Address) *
                    </label>
                    <input
                        type="text"
                        value={formData.dumpsterLocation}
                        onChange={(e) => updateFormData('dumpsterLocation', e.target.value)}
                        className={`form-input ${errors.dumpsterLocation ? 'border-red-500' : ''}`}
                        placeholder="Complete address of disposal facility"
                        readOnly={readOnly}
                    />
                    {errors.dumpsterLocation && <p className="form-error">{errors.dumpsterLocation}</p>}
                </div>

                {/* Company Name */}
                <div>
                    <label className="form-label">
                        Disposal Company Name *
                    </label>
                    <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => updateFormData('companyName', e.target.value)}
                        className={`form-input ${errors.companyName ? 'border-red-500' : ''}`}
                        placeholder="Name of disposal company"
                        readOnly={readOnly}
                    />
                    {errors.companyName && <p className="form-error">{errors.companyName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Phone */}
                    <div>
                        <label className="form-label">
                            Company Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.companyPhone}
                            onChange={(e) => updateFormData('companyPhone', e.target.value)}
                            className="form-input"
                            placeholder="(555) 123-4567"
                            readOnly={readOnly}
                        />
                    </div>

                    {/* Company Email */}
                    <div>
                        <label className="form-label">
                            Company Email
                        </label>
                        <input
                            type="email"
                            value={formData.companyEmail}
                            onChange={(e) => updateFormData('companyEmail', e.target.value)}
                            className="form-input"
                            placeholder="company@email.com"
                            readOnly={readOnly}
                        />
                    </div>

                    {/* Disposal Method */}
                    <div>
                        <label className="form-label">
                            Disposal Method
                        </label>
                        <select
                            value={formData.disposalMethod}
                            onChange={(e) => updateFormData('disposalMethod', e.target.value)}
                            className="form-select"
                            disabled={readOnly}
                        >
                            <option value="DUMPSTER">Dumpster Rental</option>
                            <option value="HAULING_SERVICE">Hauling Service</option>
                            <option value="SELF_HAUL">Self Haul</option>
                            <option value="RECYCLING_CENTER">Recycling Center</option>
                        </select>
                    </div>

                    {/* Debris Type */}
                    <div>
                        <label className="form-label">
                            Debris Type
                        </label>
                        <select
                            value={formData.debrisType}
                            onChange={(e) => updateFormData('debrisType', e.target.value)}
                            className="form-select"
                            disabled={readOnly}
                        >
                            <option value="CONSTRUCTION">Construction Debris</option>
                            <option value="DEMOLITION">Demolition Debris</option>
                            <option value="RENOVATION">Renovation Debris</option>
                            <option value="LANDSCAPING">Landscaping Debris</option>
                            <option value="MIXED">Mixed Debris</option>
                        </select>
                    </div>

                    {/* Estimated Volume */}
                    <div>
                        <label className="form-label">
                            Estimated Volume
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={formData.estimatedVolumeCubicYards}
                                onChange={(e) => updateFormData('estimatedVolumeCubicYards', e.target.value)}
                                className="form-input"
                                placeholder="10"
                                min="0"
                                step="0.1"
                                readOnly={readOnly}
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                cubic yards
              </span>
                        </div>
                    </div>

                    {/* Company License */}
                    <div>
                        <label className="form-label">
                            Company License Number
                        </label>
                        <input
                            type="text"
                            value={formData.companyLicenseNumber}
                            onChange={(e) => updateFormData('companyLicenseNumber', e.target.value)}
                            className="form-input"
                            placeholder="Disposal company license"
                            readOnly={readOnly}
                        />
                    </div>
                </div>

                {/* Special Requirements */}
                <div>
                    <label className="form-label">
                        Special Disposal Requirements
                    </label>
                    <textarea
                        value={formData.specialRequirements}
                        onChange={(e) => updateFormData('specialRequirements', e.target.value)}
                        rows={3}
                        className="form-textarea"
                        placeholder="Any special handling or disposal requirements..."
                        readOnly={readOnly}
                    />
                </div>

                {/* Hazardous Material */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.isHazardousMaterial}
                        onChange={(e) => updateFormData('isHazardousMaterial', e.target.checked)}
                        className="form-checkbox"
                        id="hazardousMaterial"
                        disabled={readOnly}
                    />
                    <label htmlFor="hazardousMaterial" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        This project involves hazardous materials
                    </label>
                </div>

                {/* Hazardous Material Warning */}
                {formData.isHazardousMaterial && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Hazardous Materials Notice
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    Special permits and disposal procedures are required for hazardous materials.
                                    Additional documentation and certified disposal companies may be required.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Large Volume Warning */}
                {formData.estimatedVolumeCubicYards && parseInt(formData.estimatedVolumeCubicYards) > 50 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Large Volume Disposal
                                </h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Large volume debris disposal may require additional permits and special handling procedures.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DebrisDisposalForm