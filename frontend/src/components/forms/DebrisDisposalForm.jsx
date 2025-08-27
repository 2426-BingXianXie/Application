import React from 'react'
import { Trash2, AlertTriangle, Truck } from 'lucide-react'
import Input, { Textarea } from '../ui/Input'
import Select from '../ui/Select'
import { DISPOSAL_METHOD_LABELS, DEBRIS_TYPE_LABELS } from '../../utils/constants'

const DebrisDisposalForm = ({
                                formData,
                                errors,
                                updateField,
                                getFieldValue
                            }) => {

    const disposalMethodOptions = [
        { value: '', label: 'Select disposal method' },
        ...Object.entries(DISPOSAL_METHOD_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    const debrisTypeOptions = [
        { value: '', label: 'Select debris type' },
        ...Object.entries(DEBRIS_TYPE_LABELS).map(([value, label]) => ({
            value,
            label
        }))
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Debris Disposal
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Provide debris disposal location in accordance with MGL 40 Section 54.
                </p>
            </div>

            {/* Form Fields */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Legal Requirement Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        Massachusetts General Law Requirement
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        Per MGL Chapter 40, Section 54, all construction and demolition debris must be disposed
                        of at licensed facilities. Proper disposal documentation is required for permit approval.
                    </p>
                </div>

                {/* Disposal Location */}
                <div className="space-y-4">
                    <div className="flex items-center mb-4">
                        <Truck className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Disposal Information
                        </h3>
                    </div>

                    <Input
                        label="Location of Dumpster/Disposal Facility (Address)"
                        required
                        value={getFieldValue('debrisDisposal.dumpsterLocation')}
                        onChange={(e) => updateField('debrisDisposal.dumpsterLocation', e.target.value)}
                        error={errors['debrisDisposal.dumpsterLocation']}
                        placeholder="123 Disposal Facility Road, City, State 12345"
                        helperText="Complete address of disposal facility or dumpster location"
                    />

                    <Input
                        label="Disposal Company Name"
                        required
                        value={getFieldValue('debrisDisposal.companyName')}
                        onChange={(e) => updateField('debrisDisposal.companyName', e.target.value)}
                        error={errors['debrisDisposal.companyName']}
                        placeholder="ABC Waste Management"
                        helperText="Name of licensed disposal company"
                    />
                </div>

                {/* Disposal Method and Type */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Disposal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Disposal Method"
                            value={getFieldValue('debrisDisposal.disposalMethod')}
                            onChange={(value) => updateField('debrisDisposal.disposalMethod', value)}
                            options={disposalMethodOptions}
                            error={errors['debrisDisposal.disposalMethod']}
                            helperText="How debris will be disposed"
                        />

                        <Select
                            label="Debris Type"
                            value={getFieldValue('debrisDisposal.debrisType')}
                            onChange={(value) => updateField('debrisDisposal.debrisType', value)}
                            options={debrisTypeOptions}
                            error={errors['debrisDisposal.debrisType']}
                            helperText="Type of construction debris"
                        />
                    </div>

                    <Input
                        label="Estimated Volume (Cubic Yards)"
                        type="number"
                        value={getFieldValue('debrisDisposal.estimatedVolumeCubicYards')}
                        onChange={(e) => updateField('debrisDisposal.estimatedVolumeCubicYards', e.target.value)}
                        error={errors['debrisDisposal.estimatedVolumeCubicYards']}
                        placeholder="0"
                        helperText="Estimated volume of debris in cubic yards"
                    />
                </div>

                {/* Hazardous Materials */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Hazardous Materials
                    </h3>

                    <div>
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={getFieldValue('debrisDisposal.isHazardousMaterial')}
                                onChange={(e) => updateField('debrisDisposal.isHazardousMaterial', e.target.checked)}
                                className="form-checkbox h-4 w-4 text-red-600 transition duration-150 ease-in-out"
                            />
                            <span className="text-sm text-gray-900 dark:text-white">
                Does the project involve hazardous materials?
              </span>
                        </label>
                        <p className="ml-7 text-xs text-gray-500 dark:text-gray-400">
                            Includes asbestos, lead paint, chemicals, or other hazardous substances
                        </p>
                    </div>

                    {getFieldValue('debrisDisposal.isHazardousMaterial') && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-900 dark:text-red-200">
                                        Hazardous Materials Notice
                                    </h4>
                                    <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                                        Projects involving hazardous materials require additional permits and specialized
                                        disposal procedures. Contact the Environmental Health Department for guidance.
                                    </p>
                                    <div className="mt-3">
                                        <Textarea
                                            label="Hazardous Materials Description"
                                            value={getFieldValue('debrisDisposal.hazardousDescription')}
                                            onChange={(e) => updateField('debrisDisposal.hazardousDescription', e.target.value)}
                                            placeholder="Describe the type and estimated quantity of hazardous materials..."
                                            rows={3}
                                            className="bg-white dark:bg-gray-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Requirements Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Disposal Requirements Checklist
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Disposal facility must be licensed and approved</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Recycling and material recovery when possible</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Disposal receipts must be maintained for inspection</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>No disposal in waterways or unauthorized locations</span>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Questions about debris disposal requirements? Contact the{' '}
                        <a href="mailto:permits@municipality.gov" className="text-blue-600 hover:text-blue-500">
                            Permits Department
                        </a>{' '}
                        at (555) 123-4567
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DebrisDisposalForm