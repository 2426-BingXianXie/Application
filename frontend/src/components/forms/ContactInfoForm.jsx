import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, AlertCircle } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Card from '../ui/Card'
import { validateEmail, validatePhone, formatPhoneNumber } from '../../utils/validators'
import { US_STATES } from '../../utils/constants'

const ContactInfoForm = ({
                             data = {},
                             onChange,
                             errors = {},
                             readOnly = false,
                             showValidation = true
                         }) => {
    const [formData, setFormData] = useState({
                                                 firstName: '',
                                                 lastName: '',
                                                 email: '',
                                                 phone: '',
                                                 address1: '',
                                                 address2: '',
                                                 city: '',
                                                 state: '',
                                                 zipCode: '',
                                                 ...data
                                             })

    const [validationErrors, setValidationErrors] = useState({})
    const [touched, setTouched] = useState({})

    useEffect(() => {
        setFormData(prev => ({ ...prev, ...data }))
    }, [data])

    // Real-time validation
    const validateField = (field, value) => {
        switch (field) {
            case 'firstName':
            case 'lastName':
                return !value.trim() ? `${field === 'firstName' ? 'First' : 'Last'} name is required` : ''

            case 'email':
                if (!value.trim()) return 'Email is required'
                return !validateEmail(value) ? 'Please enter a valid email address' : ''

            case 'phone':
                if (!value.trim()) return 'Phone number is required'
                return !validatePhone(value) ? 'Please enter a valid phone number' : ''

            case 'address1':
                return !value.trim() ? 'Address is required' : ''

            case 'city':
                return !value.trim() ? 'City is required' : ''

            case 'state':
                return !value ? 'State is required' : ''

            case 'zipCode':
                if (!value.trim()) return 'ZIP code is required'
                return !/^\d{5}(-\d{4})?$/.test(value) ? 'Please enter a valid ZIP code' : ''

            default:
                return ''
        }
    }

    const updateField = (field, value) => {
        // Format phone number automatically
        if (field === 'phone') {
            value = formatPhoneNumber(value)
        }

        // Format ZIP code
        if (field === 'zipCode') {
            value = value.replace(/\D/g, '').substring(0, 5)
        }

        const newData = { ...formData, [field]: value }
        setFormData(newData)
        onChange(newData)

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

    // Auto-fill city and state from ZIP code (could integrate with ZIP API)
    const handleZipCodeChange = async (value) => {
        updateField('zipCode', value)

        // If ZIP code is complete, try to auto-fill city/state
        if (value.length === 5) {
            // This would typically call a ZIP code lookup service
            // For now, we'll just validate the format
        }
    }

    const getFieldError = (field) => {
        return errors[field] || validationErrors[field]
    }

    return (
        <Card
            title="Contact Information"
            subtitle="Provide your contact details for permit correspondence"
            className="max-w-4xl mx-auto"
        >
            <div className="space-y-6">
                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            onBlur={() => handleBlur('firstName')}
                            error={getFieldError('firstName')}
                            required
                            readOnly={readOnly}
                            placeholder="Enter your first name"
                            startIcon={<User className="w-4 h-4" />}
                        />

                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            onBlur={() => handleBlur('lastName')}
                            error={getFieldError('lastName')}
                            required
                            readOnly={readOnly}
                            placeholder="Enter your last name"
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-blue-600" />
                        Contact Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            error={getFieldError('email')}
                            required
                            readOnly={readOnly}
                            placeholder="your.email@example.com"
                            startIcon={<Mail className="w-4 h-4" />}
                            autoComplete="email"
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            onBlur={() => handleBlur('phone')}
                            error={getFieldError('phone')}
                            required
                            readOnly={readOnly}
                            placeholder="(555) 123-4567"
                            startIcon={<Phone className="w-4 h-4" />}
                            autoComplete="tel"
                            helperText="Format: (XXX) XXX-XXXX"
                        />
                    </div>
                </div>

                {/* Address Information */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                        Mailing Address
                    </h3>

                    <div className="space-y-4">
                        <Input
                            label="Street Address"
                            value={formData.address1}
                            onChange={(e) => updateField('address1', e.target.value)}
                            onBlur={() => handleBlur('address1')}
                            error={getFieldError('address1')}
                            required
                            readOnly={readOnly}
                            placeholder="123 Main Street"
                            autoComplete="address-line1"
                        />

                        <Input
                            label="Address Line 2 (Optional)"
                            value={formData.address2}
                            onChange={(e) => updateField('address2', e.target.value)}
                            readOnly={readOnly}
                            placeholder="Apartment, suite, unit, building, floor, etc."
                            autoComplete="address-line2"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div className="md:col-span-3">
                                <Input
                                    label="City"
                                    value={formData.city}
                                    onChange={(e) => updateField('city', e.target.value)}
                                    onBlur={() => handleBlur('city')}
                                    error={getFieldError('city')}
                                    required
                                    readOnly={readOnly}
                                    placeholder="City name"
                                    autoComplete="address-level2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Select
                                    label="State"
                                    value={formData.state}
                                    onChange={(value) => updateField('state', value)}
                                    options={US_STATES}
                                    error={getFieldError('state')}
                                    required
                                    disabled={readOnly}
                                    placeholder="Select state"
                                    searchable
                                />
                            </div>

                            <div className="md:col-span-1">
                                <Input
                                    label="ZIP Code"
                                    value={formData.zipCode}
                                    onChange={(e) => handleZipCodeChange(e.target.value)}
                                    onBlur={() => handleBlur('zipCode')}
                                    error={getFieldError('zipCode')}
                                    required
                                    readOnly={readOnly}
                                    placeholder="12345"
                                    autoComplete="postal-code"
                                    maxLength={5}
                                    pattern="\d{5}"
                                />
                            </div>
                        </div>
                    </div>
                </div>

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
                {showValidation && Object.keys(formData).every(key =>
                 !validateField(key, formData[key]) && formData[key]
                ) && (
                     <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-md p-4">
                         <div className="flex items-center">
                             <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                             <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                 Contact information is complete and valid
                             </p>
                         </div>
                     </div>
                 )}
            </div>
        </Card>
    )
}

export default ContactInfoForm