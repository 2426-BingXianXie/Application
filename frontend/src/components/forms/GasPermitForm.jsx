import React, { useState, useEffect } from 'react'
import { Zap, Gauge, Wrench, AlertTriangle, CheckCircle, Calculator } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Card from '../ui/Card'
import { GAS_WORK_TYPE, GAS_TYPE, GAS_INSTALLATION_TYPE } from '../../utils/constants'
import { formatCurrency, parseCurrency } from '../../utils/formatters'

const GasPermitForm = ({
                           data = {},
                           onChange,
                           errors = {},
                           readOnly = false,
                           showValidation = true
                       }) => {
    const [formData, setFormData] = useState({
                                                 workType: '',
                                                 gasType: '',
                                                 installationType: '',
                                                 totalBtuInput: '',
                                                 gasLineLengthFeet: '',
                                                 numberOfAppliances: '',
                                                 gasLineSizeInches: '',
                                                 projectCost: '',
                                                 workDescription: '',
                                                 applianceDetails: '',
                                                 requiresMeterUpgrade: false,
                                                 requiresRegulator: false,
                                                 requiresPressureTest: false,
                                                 emergencyShutoffRequired: false,
                                                 ...data
                                             })

    const [validationErrors, setValidationErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [calculatedSpecs, setCalculatedSpecs] = useState(null)
    const [safetyWarnings, setSafetyWarnings] = useState([])

    useEffect(() => {
        setFormData(prev => ({ ...prev, ...data }))
    }, [data])

    // Calculate gas line specifications
    const calculateGasSpecs = (btuInput, lineLength, gasType) => {
        if (!btuInput || !lineLength || !gasType) {
            setCalculatedSpecs(null)
            return
        }

        try {
            const btu = parseInt(btuInput)
            const length = parseInt(lineLength)

            // Simplified gas line sizing calculation
            // In reality, this would use proper gas sizing tables
            let recommendedSize = 0.5 // Default 1/2 inch

            if (btu > 200000 || length > 100) {
                recommendedSize = 1.0
            } else if (btu > 100000 || length > 50) {
                recommendedSize = 0.75
            }

            const pressureDrop = (btu * length) / 100000 // Simplified calculation
            const requiresRegulator = pressureDrop > 0.5
            const requiresPressureTest = btu > 50000 || recommendedSize >= 0.75

            setCalculatedSpecs({
                                   recommendedSize,
                                   pressureDrop: pressureDrop.toFixed(2),
                                   requiresRegulator,
                                   requiresPressureTest,
                                   maxCapacity: Math.round(btu * 1.25) // 25% safety factor
                               })

            // Update form data with calculated requirements
            updateField('requiresRegulator', requiresRegulator)
            updateField('requiresPressureTest', requiresPressureTest)

        } catch (error) {
            console.error('Gas calculation failed:', error)
            setCalculatedSpecs(null)
        }
    }

    // Generate safety warnings based on input
    const updateSafetyWarnings = (data) => {
        const warnings = []

        if (data.gasType === 'PROPANE' && parseInt(data.totalBtuInput) > 100000) {
            warnings.push('High BTU propane installations require special safety considerations')
        }

        if (data.installationType === 'UNDERGROUND' && parseInt(data.gasLineLengthFeet) > 100) {
            warnings.push('Long underground gas lines require additional inspection points')
        }

        if (data.workType === 'NEW_INSTALLATION' && parseInt(data.numberOfAppliances) > 5) {
            warnings.push('Multiple appliance installations may require upgraded gas service')
        }

        if (parseInt(data.totalBtuInput) > 200000) {
            warnings.push('Commercial-grade installation may require utility company coordination')
        }

        setSafetyWarnings(warnings)
    }

    const validateField = (field, value) => {
        switch (field) {
            case 'workType':
                return !value ? 'Work type is required' : ''
            case 'gasType':
                return !value ? 'Gas type is required' : ''
            case 'installationType':
                return !value ? 'Installation type is required' : ''
            case 'totalBtuInput':
                if (!value) return 'Total BTU input is required'
                const btu = parseInt(value)
                if (isNaN(btu) || btu <= 0) return 'Please enter a valid BTU value'
                if (btu > 1000000) return 'BTU input cannot exceed 1,000,000'
                return ''
            case 'gasLineLengthFeet':
                if (!value) return 'Gas line length is required'
                const length = parseInt(value)
                if (isNaN(length) || length <= 0) return 'Please enter a valid length'
                if (length > 500) return 'Gas line length cannot exceed 500 feet'
                return ''
            case 'numberOfAppliances':
                if (!value) return 'Number of appliances is required'
                const count = parseInt(value)
                if (isNaN(count) || count <= 0) return 'Please enter a valid number of appliances'
                if (count > 20) return 'Number of appliances cannot exceed 20'
                return ''
            case 'projectCost':
                if (!value) return 'Project cost is required'
                const cost = parseCurrency(value)
                if (isNaN(cost) || cost <= 0) return 'Please enter a valid project cost'
                return ''
            case 'workDescription':
                if (!value.trim()) return 'Work description is required'
                if (value.trim().length < 10) return 'Please provide a detailed description'
                return ''
            case 'applianceDetails':
                if (!value.trim()) return 'Appliance details are required'
                return ''
            default:
                return ''
        }
    }

    const updateField = (field, value) => {
        // Format project cost
        if (field === 'projectCost') {
            value = formatCurrency(value)
        }

        // Format numeric fields
        if (['totalBtuInput', 'gasLineLengthFeet', 'numberOfAppliances'].includes(field)) {
            value = value.replace(/\D/g, '')
        }

        // Format gas line size
        if (field === 'gasLineSizeInches') {
            value = value.replace(/[^\d.]/g, '')
        }

        const newData = { ...formData, [field]: value }
        setFormData(newData)
        onChange(newData)

        // Recalculate specifications when relevant fields change
        if (['totalBtuInput', 'gasLineLengthFeet', 'gasType'].includes(field)) {
            calculateGasSpecs(newData.totalBtuInput, newData.gasLineLengthFeet, newData.gasType)
        }

        // Update safety warnings
        updateSafetyWarnings(newData)

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
            {/* Gas Installation Details */}
            <Card
                title="Gas Installation Details"
                subtitle="Specify the type of gas work and installation requirements"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Work Type"
                            value={formData.workType}
                            onChange={(value) => updateField('workType', value)}
                            options={GAS_WORK_TYPE}
                            error={getFieldError('workType')}
                            required
                            disabled={readOnly}
                            placeholder="Select work type"
                        />

                        <Select
                            label="Gas Type"
                            value={formData.gasType}
                            onChange={(value) => updateField('gasType', value)}
                            options={GAS_TYPE}
                            error={getFieldError('gasType')}
                            required
                            disabled={readOnly}
                            placeholder="Select gas type"
                        />

                        <Select
                            label="Installation Type"
                            value={formData.installationType}
                            onChange={(value) => updateField('installationType', value)}
                            options={GAS_INSTALLATION_TYPE}
                            error={getFieldError('installationType')}
                            required
                            disabled={readOnly}
                            placeholder="Select installation type"
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
                            rows={3}
                            placeholder="Describe the gas work to be performed..."
                            readOnly={readOnly}
                            maxLength={500}
                        />
                        <div className="flex justify-between mt-1">
                            {getFieldError('workDescription') ? (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {getFieldError('workDescription')}
                                </p>
                            ) : (
                                 <p className="text-sm text-gray-500 dark:text-gray-400">
                                     Detailed description of gas installation work
                                 </p>
                             )}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formData.workDescription.length}/500
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Technical Specifications */}
            <Card
                title="Technical Specifications"
                subtitle="Gas system requirements and calculations"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Total BTU Input"
                            type="number"
                            value={formData.totalBtuInput}
                            onChange={(e) => updateField('totalBtuInput', e.target.value)}
                            onBlur={() => handleBlur('totalBtuInput')}
                            error={getFieldError('totalBtuInput')}
                            required
                            readOnly={readOnly}
                            placeholder="100000"
                            min="1"
                            max="1000000"
                            startIcon={<Gauge className="w-4 h-4" />}
                            helperText="Total BTU/hr for all appliances"
                        />

                        <Input
                            label="Gas Line Length (ft)"
                            type="number"
                            value={formData.gasLineLengthFeet}
                            onChange={(e) => updateField('gasLineLengthFeet', e.target.value)}
                            onBlur={() => handleBlur('gasLineLengthFeet')}
                            error={getFieldError('gasLineLengthFeet')}
                            required
                            readOnly={readOnly}
                            placeholder="50"
                            min="1"
                            max="500"
                            helperText="Total length of new gas line"
                        />

                        <Input
                            label="Number of Appliances"
                            type="number"
                            value={formData.numberOfAppliances}
                            onChange={(e) => updateField('numberOfAppliances', e.target.value)}
                            onBlur={() => handleBlur('numberOfAppliances')}
                            error={getFieldError('numberOfAppliances')}
                            required
                            readOnly={readOnly}
                            placeholder="3"
                            min="1"
                            max="20"
                            helperText="Total number of gas appliances"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Gas Line Size (inches)"
                            type="number"
                            value={formData.gasLineSizeInches}
                            onChange={(e) => updateField('gasLineSizeInches', e.target.value)}
                            readOnly={readOnly}
                            placeholder="0.75"
                            step="0.25"
                            min="0.5"
                            max="4"
                            helperText="Proposed gas line diameter"
                        />

                        <Input
                            label="Project Cost"
                            value={formData.projectCost}
                            onChange={(e) => updateField('projectCost', e.target.value)}
                            onBlur={() => handleBlur('projectCost')}
                            error={getFieldError('projectCost')}
                            required
                            readOnly={readOnly}
                            placeholder="$5,000"
                            startIcon={<DollarSign className="w-4 h-4" />}
                            helperText="Total estimated project cost"
                        />
                    </div>

                    {/* Calculated Specifications */}
                    {calculatedSpecs && (
                        <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                                <Calculator className="w-4 h-4 mr-2" />
                                Calculated Specifications
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">Recommended Size:</span>
                                    <div className="font-medium">{calculatedSpecs.recommendedSize}" diameter</div>
                                </div>
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">Pressure Drop:</span>
                                    <div className="font-medium">{calculatedSpecs.pressureDrop}" WC</div>
                                </div>
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">Max Capacity:</span>
                                    <div className="font-medium">{calculatedSpecs.maxCapacity.toLocaleString()} BTU/hr</div>
                                </div>
                                <div>
                                    <span className="text-blue-700 dark:text-blue-300">Regulator Required:</span>
                                    <div className="font-medium">{calculatedSpecs.requiresRegulator ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                *Calculations are estimates. Final sizing must be verified by licensed gas contractor
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Appliance Information */}
            <Card
                title="Appliance Information"
                subtitle="Details about gas appliances to be installed or connected"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Appliance Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.applianceDetails}
                        onChange={(e) => updateField('applianceDetails', e.target.value)}
                        onBlur={() => handleBlur('applianceDetails')}
                        className={`form-textarea ${getFieldError('applianceDetails') ? 'border-red-500' : ''}`}
                        rows={4}
                        placeholder="List all gas appliances with BTU ratings, manufacturers, and model numbers..."
                        readOnly={readOnly}
                        maxLength={1000}
                    />
                    <div className="flex justify-between mt-1">
                        {getFieldError('applianceDetails') ? (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {getFieldError('applianceDetails')}
                            </p>
                        ) : (
                             <p className="text-sm text-gray-500 dark:text-gray-400">
                                 Include make, model, and BTU rating for each appliance
                             </p>
                         )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formData.applianceDetails.length}/1000
                        </p>
                    </div>
                </div>
            </Card>

            {/* Safety Requirements */}
            <Card
                title="Safety Requirements"
                subtitle="Gas safety and utility requirements"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="requiresMeterUpgrade"
                                checked={formData.requiresMeterUpgrade}
                                onChange={(e) => updateField('requiresMeterUpgrade', e.target.checked)}
                                disabled={readOnly}
                                className="form-checkbox"
                            />
                            <label htmlFor="requiresMeterUpgrade" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Requires Meter Upgrade
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="requiresRegulator"
                                checked={formData.requiresRegulator}
                                onChange={(e) => updateField('requiresRegulator', e.target.checked)}
                                disabled={readOnly}
                                className="form-checkbox"
                            />
                            <label htmlFor="requiresRegulator" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Requires Pressure Regulator
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="requiresPressureTest"
                                checked={formData.requiresPressureTest}
                                onChange={(e) => updateField('requiresPressureTest', e.target.checked)}
                                disabled={readOnly}
                                className="form-checkbox"
                            />
                            <label htmlFor="requiresPressureTest" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Requires Pressure Test
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="emergencyShutoffRequired"
                                checked={formData.emergencyShutoffRequired}
                                onChange={(e) => updateField('emergencyShutoffRequired', e.target.checked)}
                                disabled={readOnly}
                                className="form-checkbox"
                            />
                            <label htmlFor="emergencyShutoffRequired" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Emergency Shutoff Required
                            </label>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Safety Warnings */}
            {safetyWarnings.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Safety Considerations
                            </h4>
                            <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                                {safetyWarnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

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
             formData.workType &&
             formData.gasType &&
             formData.installationType &&
             formData.totalBtuInput &&
             formData.gasLineLengthFeet &&
             formData.numberOfAppliances &&
             formData.projectCost &&
             formData.workDescription &&
             formData.applianceDetails &&
             !Object.keys(validationErrors).some(key => validationErrors[key]) && (
                 <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-md p-4">
                     <div className="flex items-center">
                         <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                         <p className="text-sm font-medium text-green-800 dark:text-green-200">
                             Gas permit information is complete and valid
                         </p>
                     </div>
                 </div>
             )}
        </div>
    )
}

export default GasPermitForm