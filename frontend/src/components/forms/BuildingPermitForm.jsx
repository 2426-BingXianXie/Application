import React, { useState, useEffect } from 'react'
import { Building, DollarSign, FileText, User, AlertCircle, CheckCircle, Calculator } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { BUILDING_PERMIT_TYPE, BUILDING_TYPE, OCCUPANCY_TYPE, APPLICANT_TYPE } from '../../utils/constants'
import { formatCurrency, parseCurrency } from '../../utils/formatters'

const BuildingPermitForm = ({
                                data = {},
                                onChange,
                                errors = {},
                                readOnly = false,
                                showValidation = true
                            }) => {
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
                                                 hasArchitect: false,
                                                 hasEngineer: false,
                                                 ...data
                                             })

    const [validationErrors, setValidationErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [estimatedFees, setEstimatedFees] = useState(null)

    useEffect(() => {
        setFormData(prev => ({ ...prev, ...data }))
    }, [data])

    // Calculate estimated fees based on project cost
    const calculateFees = async (projectCost) => {
        if (!projectCost || projectCost < 1000) {
            setEstimatedFees(null)
            return
        }

        try {
            // This would call your fee calculation service
            // For now, we'll use a simple calculation
            const cost = parseCurrency(projectCost)
            const baseFee = 150
            const percentageFee = cost * 0.005 // 0.5% of project cost
            const totalFee = baseFee + percentageFee

            setEstimatedFees({
                                 baseFee,
                                 percentageFee,
                                 totalFee: Math.max(totalFee, 150) // Minimum fee
                             })
        } catch (error) {
            console.error('Fee calculation failed:', error)
        }
    }

    const validateField = (field, value) => {
        switch (field) {
            case 'permitFor':
                return !value ? 'Permit type is required' : ''
            case 'projectCost':
                if (!value) return 'Project cost is required'
                const cost = parseCurrency(value)
                if (isNaN(cost) || cost <= 0) return 'Please enter a valid project cost'
                if (cost < 100) return 'Project cost must be at least $100'
                return ''
            case 'workDescription':
                if (!value.trim()) return 'Work description is required'
                if (value.trim().length < 10) return 'Please provide a detailed description (at least 10 characters)'
                return ''
            case 'tenantOwnerName':
                return !value.trim() ? 'Tenant/Owner name is required' : ''
            case 'tenantOwnerPhone':
                if (!value.trim()) return 'Tenant/Owner phone is required'
                return !/^\(\d{3}\) \d{3}-\d{4}$/.test(value) ? 'Please enter a valid phone number' : ''
            case 'tenantOwnerAddress':
                return !value.trim() ? 'Tenant/Owner address is required' : ''
            case 'buildingType':
                return !value ? 'Building type is required' : ''
            case 'occupancyType':
                return !value ? 'Occupancy type is required' : ''
            default:
                return ''
        }
    }

    const updateField = (field, value) => {
        // Format project cost
        if (field === 'projectCost') {
            value = formatCurrency(value)
        }

        // Format phone number
        if (field === 'tenantOwnerPhone') {
            const digits = value.replace(/\D/g, '')
            if (digits.length <= 10) {
                value = digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
            }
        }

        const newData = { ...formData, [field]: value }
        setFormData(newData)
        onChange(newData)

        // Calculate fees when project cost changes
        if (field === 'projectCost') {
            calculateFees(value)
        }

        // Validate if field has been touched
        if (showValidation && touched[field]) {
            const error = validateField(field, value)
            setValidationErrors(prev => ({
                ...prev,
                [field]: error
            }))
        }
    }

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }))

        if (showValidation) {
            const error = validateField(field, formData[field])
            setValidationErrors(prev => ({
                ...prev,
                [field]: error
            }))
        }
    }

    const getFieldError = (field) => {
        return errors[field] || validationErrors[field]
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Permit Information */}
            <Card
                title="Permit Information"
                subtitle="Specify the type of building permit and project details"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Permit For"
                            value={formData.permitFor}
                            onChange={(value) => updateField('permitFor', value)}
                            options={BUILDING_PERMIT_TYPE}
                            error={getFieldError('permitFor')}
                            required
                            disabled={readOnly}
                            placeholder="Select permit type"
                            helperText="Type of building work being performed"
                        />

                        <Input
                            label="Project Cost"
                            value={formData.projectCost}
                            onChange={(e) => updateField('projectCost', e.target.value)}
                            onBlur={() => handleBlur('projectCost')}
                            error={getFieldError('projectCost')}
                            required
                            readOnly={readOnly}
                            placeholder="$50,000"
                            startIcon={<DollarSign className="w-4 h-4" />}
                            helperText="Total estimated project cost"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Work Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.workDescription}
                            onChange={(e) => updateField('workDescription', e.target.value)}
                            onBlur={() => handleBlur('workDescription')}
                            className={`form-textarea ${getFieldError('workDescription') ? 'border-red-500' : ''}`}
                            rows={4}
                            placeholder="Describe the work to be performed in detail..."
                            readOnly={readOnly}
                            maxLength={1000}
                        />
                        <div className="flex justify-between mt-1">
                            {getFieldError('workDescription') ? (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {getFieldError('workDescription')}
                                </p>
                            ) : (
                                 <p className="text-sm text-gray-500 dark:text-gray-400">
                                     Provide detailed description of all work to be performed
                                 </p>
                             )}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formData.workDescription.length}/1000
                            </p>
                        </div>
                    </div>

                    {/* Fee Estimation */}
                    {estimatedFees && (
                        <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                                <Calculator className="w-4 h-4 mr-2" />
                                Estimated Permit Fees
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">Base Fee:</span>
                                    <span className="font-medium ml-2">${estimatedFees.baseFee}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">Project Fee:</span>
                                    <span className="font-medium ml-2">${estimatedFees.percentageFee.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">Total:</span>
                                    <span className="font-semibold ml-2">${estimatedFees.totalFee.toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                *Estimated fees are subject to review and may change based on final inspection
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Property Owner/Tenant Information */}
            <Card
                title="Property Owner/Tenant Information"
                subtitle="Details about the person responsible for the property"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Tenant/Owner Name"
                            value={formData.tenantOwnerName}
                            onChange={(e) => updateField('tenantOwnerName', e.target.value)}
                            onBlur={() => handleBlur('tenantOwnerName')}
                            error={getFieldError('tenantOwnerName')}
                            required
                            readOnly={readOnly}
                            placeholder="Full name"
                            startIcon={<User className="w-4 h-4" />}
                            helperText="Person responsible for the property"
                        />

                        <Input
                            label="Tenant/Owner Phone"
                            type="tel"
                            value={formData.tenantOwnerPhone}
                            onChange={(e) => updateField('tenantOwnerPhone', e.target.value)}
                            onBlur={() => handleBlur('tenantOwnerPhone')}
                            error={getFieldError('tenantOwnerPhone')}
                            required
                            readOnly={readOnly}
                            placeholder="(555) 123-4567"
                            startIcon={<Phone className="w-4 h-4" />}
                        />
                    </div>

                    <Input
                        label="Tenant/Owner Address"
                        value={formData.tenantOwnerAddress}
                        onChange={(e) => updateField('tenantOwnerAddress', e.target.value)}
                        onBlur={() => handleBlur('tenantOwnerAddress')}
                        error={getFieldError('tenantOwnerAddress')}
                        required
                        readOnly={readOnly}
                        placeholder="Full mailing address"
                        helperText="Complete mailing address if different from property address"
                    />

                    <Input
                        label="Development Title (if applicable)"
                        value={formData.developmentTitle}
                        onChange={(e) => updateField('developmentTitle', e.target.value)}
                        readOnly={readOnly}
                        placeholder="Subdivision or development name"
                        helperText="Name of subdivision, development, or project"
                    />
                </div>
            </Card>

            {/* Building Classification */}
            <Card
                title="Building Classification"
                subtitle="Specify building and occupancy details"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Building Type"
                        value={formData.buildingType}
                        onChange={(value) => updateField('buildingType', value)}
                        options={BUILDING_TYPE}
                        error={getFieldError('buildingType')}
                        required
                        disabled={readOnly}
                        placeholder="Select building type"
                        helperText="Primary structural classification"
                    />

                    <Select
                        label="Occupancy Type"
                        value={formData.occupancyType}
                        onChange={(value) => updateField('occupancyType', value)}
                        options={OCCUPANCY_TYPE}
                        error={getFieldError('occupancyType')}
                        required
                        disabled={readOnly}
                        placeholder="Select occupancy type"
                        helperText="How the building will be used"
                    />
                </div>
            </Card>

            {/* Professional Services */}
            <Card
                title="Professional Services"
                subtitle="Indicate if professional services are involved"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="ownerDoingWork"
                                checked={formData.ownerDoingWork}
                                onChange={(e) => updateField('ownerDoingWork', e.target.checked)}
                                disabled={readOnly}
                                className="form-checkbox"
                            />
                            <label htmlFor="ownerDoingWork" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Owner doing the work?
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Check if the property owner is performing the work
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasArchitect"
                                checked={formData.hasArchitect}
                                onChange={(e) => updateField('hasArchitect', e.target.checked)}
                                disabled={readOnly}
                                className="form-checkbox"
                            />
                            <label htmlFor="hasArchitect" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Do you have an Architect?
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Required for major structural changes
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasEngineer"
                                checked={formData.hasEngineer}
                                onChange={(e) => updateField('hasEngineer', e.target.checked)}
                                disabled={readOnly}
                                className="form-checkbox"
                            />
                            <label htmlFor="hasEngineer" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Do you have an Engineer?
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Required for structural or electrical systems
                        </p>
                    </div>
                </div>

                {/* Professional Services Warning */}
                {(formData.permitFor === 'NEW_CONSTRUCTION' ||
                  formData.permitFor === 'MAJOR_RENOVATION' ||
                  (formData.projectCost && parseCurrency(formData.projectCost) > 50000)) &&
                 (!formData.hasArchitect || !formData.hasEngineer) && (
                     <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
                         <div className="flex items-start">
                             <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                             <div className="ml-3">
                                 <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                     Professional Services May Be Required
                                 </h4>
                                 <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                     Based on your permit type and project cost, you may need to hire licensed professionals.
                                     Please consult with the building department if you're unsure.
                                 </p>
                             </div>
                         </div>
                     </div>
                 )}
            </Card>

            {/* Form Validation Summary */}
            {showValidation && Object.keys(validationErrors).some(key => validationErrors[key]) && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-md p-4">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                Please fix the following errors:
                            </h3>
                            <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                                {Object.entries(validationErrors)
                                    .filter(([_, error]) => error)
                                    .map(([field, error]) => (
                                        <li key={field}>{error}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Indicator */}
            {showValidation &&
             formData.permitFor &&
             formData.projectCost &&
             formData.workDescription &&
             formData.tenantOwnerName &&
             formData.tenantOwnerPhone &&
             formData.tenantOwnerAddress &&
             formData.buildingType &&
             formData.occupancyType &&
             !Object.keys(validationErrors).some(key => validationErrors[key]) && (
                 <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-md p-4">
                     <div className="flex items-center">
                         <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                         <p className="text-sm font-medium text-green-800 dark:text-green-200">
                             Building permit information is complete and valid
                         </p>
                     </div>
                 </div>
             )}
        </div>
    )
}

export default BuildingPermitForm