import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react'

const FormValidation = ({ formData, permitType, className = '' }) => {
    const [validationResults, setValidationResults] = useState({
                                                                   isValid: false,
                                                                   errors: [],
                                                                   warnings: [],
                                                                   completionRate: 0,
                                                               })

    useEffect(() => {
        validateForm()
    }, [formData, permitType])

    const validateForm = () => {
        const errors = []
        const warnings = []
        let completedFields = 0
        let totalFields = 0

        // Contact Info Validation
        if (formData.contactInfo) {
            const contact = formData.contactInfo
            totalFields += 9

            if (contact.firstName) completedFields++
            else errors.push('First name is required')

            if (contact.lastName) completedFields++
            else errors.push('Last name is required')

            if (contact.email) {
                completedFields++
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
                    errors.push('Valid email address is required')
                }
            } else {
                errors.push('Email address is required')
            }

            if (contact.phone) {
                completedFields++
                if (!/^[\+]?[1-9]?[0-9]{7,15}$/.test(contact.phone.replace(/[^\d]/g, ''))) {
                    errors.push('Valid phone number is required')
                }
            } else {
                errors.push('Phone number is required')
            }

            if (contact.address1) completedFields++
            else errors.push('Address is required')

            if (contact.city) completedFields++
            else errors.push('City is required')

            if (contact.state) completedFields++
            else errors.push('State is required')

            if (contact.zipCode) {
                completedFields++
                if (!/^[0-9]{5}(-[0-9]{4})?$/.test(contact.zipCode)) {
                    errors.push('Valid ZIP code is required')
                }
            } else {
                errors.push('ZIP code is required')
            }

            // Address2 is optional
            if (contact.address2) completedFields++
            totalFields++ // Still count it for completion rate
        }

        // Location Info Validation
        if (formData.locationInfo) {
            const location = formData.locationInfo
            totalFields += 3

            if (location.propertyAddress) completedFields++
            else errors.push('Property address is required')

            if (location.city) completedFields++
            else errors.push('Property city is required')

            if (location.state) completedFields++
            else errors.push('Property state is required')
        }

        // Permit-specific validation
        if (permitType === 'building' && formData.permitInfo) {
            const permit = formData.permitInfo
            totalFields += 6

            if (permit.permitFor) completedFields++
            else errors.push('Permit type is required')

            if (permit.projectCost) {
                completedFields++
                if (parseFloat(permit.projectCost) <= 0) {
                    errors.push('Project cost must be greater than 0')
                }
                if (parseFloat(permit.projectCost) > 50000 && !formData.hasArchitect && !formData.hasEngineer) {
                    warnings.push('Projects over $50,000 typically require professional services')
                }
            } else {
                errors.push('Project cost is required')
            }

            if (permit.workDescription) {
                completedFields++
                if (permit.workDescription.length < 10) {
                    errors.push('Work description must be at least 10 characters')
                }
            } else {
                errors.push('Work description is required')
            }

            if (permit.buildingType) completedFields++
            else errors.push('Building type is required')

            if (permit.occupancyType) completedFields++
            else errors.push('Occupancy type is required')

            if (permit.tenantOwnerName) completedFields++
            else errors.push('Tenant/Owner name is required')
        } else if (permitType === 'gas' && formData.permitInfo) {
            const permit = formData.permitInfo
            totalFields += 5

            if (permit.workType) completedFields++
            else errors.push('Gas work type is required')

            if (permit.gasType) completedFields++
            else errors.push('Gas type is required')

            if (permit.installationType) completedFields++
            else errors.push('Installation type is required')

            if (permit.totalBtuInput) {
                completedFields++
                if (parseInt(permit.totalBtuInput) > 400000) {
                    warnings.push('High BTU installations require pressure testing')
                }
            } else {
                errors.push('Total BTU input is required')
            }

            if (permit.workDescription) {
                completedFields++
                if (permit.workDescription.length < 10) {
                    errors.push('Work description must be at least 10 characters')
                }
            } else {
                errors.push('Work description is required')
            }
        }

        // Contractor validation (if applicable)
        if (formData.applicantType === 'CONTRACTOR' && formData.contractorLicense) {
            const contractor = formData.contractorLicense
            totalFields += 6

            if (contractor.name) completedFields++
            else errors.push('Contractor name is required')

            if (contractor.licenseNumber) {
                completedFields++
                if (contractor.licenseNumber.length < 6) {
                    errors.push('License number must be at least 6 characters')
                }
            } else {
                errors.push('Contractor license number is required')
            }

            if (contractor.licenseExpiration) {
                completedFields++
                const expirationDate = new Date(contractor.licenseExpiration)
                if (expirationDate < new Date()) {
                    errors.push('Contractor license has expired')
                } else if (expirationDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
                    warnings.push('Contractor license expires within 30 days')
                }
            } else {
                errors.push('License expiration date is required')
            }

            if (contractor.address) completedFields++
            else errors.push('Contractor address is required')

            if (contractor.city) completedFields++
            else errors.push('Contractor city is required')

            if (contractor.phoneNumber) completedFields++
            else errors.push('Contractor phone number is required')
        }

        const completionRate = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
        const isValid = errors.length === 0 && completionRate >= 90

        setValidationResults({
                                 isValid,
                                 errors,
                                 warnings,
                                 completionRate,
                             })
    }

    const getCompletionColor = () => {
        if (validationResults.completionRate >= 90) return 'text-green-600'
        if (validationResults.completionRate >= 70) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getCompletionIcon = () => {
        if (validationResults.isValid) {
            return <CheckCircle className="w-5 h-5 text-green-500" />
        }
        if (validationResults.errors.length > 0) {
            return <AlertTriangle className="w-5 h-5 text-red-500" />
        }
        return <Clock className="w-5 h-5 text-yellow-500" />
    }

    return (
        <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Application Validation
                </h3>
                <div className="flex items-center space-x-2">
                    {getCompletionIcon()}
                    <span className={`text-sm font-medium ${getCompletionColor()}`}>
            {validationResults.completionRate}% Complete
          </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                        validationResults.completionRate >= 90
                        ? 'bg-green-500'
                        : validationResults.completionRate >= 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${validationResults.completionRate}%` }}
                />
            </div>

            {/* Validation Status */}
            {validationResults.isValid ? (
                <div className="flex items-center space-x-2 text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/20 rounded-md p-3">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Ready to submit</span>
                </div>
            ) : (
                 <div className="space-y-3">
                     {/* Errors */}
                     {validationResults.errors.length > 0 && (
                         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                             <div className="flex items-start space-x-2">
                                 <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                                 <div>
                                     <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                                         Required Information Missing
                                     </h4>
                                     <ul className="text-sm text-red-700 dark:text-red-300 mt-1 space-y-1">
                                         {validationResults.errors.slice(0, 5).map((error, index) => (
                                             <li key={index}>• {error}</li>
                                         ))}
                                         {validationResults.errors.length > 5 && (
                                             <li>• ... and {validationResults.errors.length - 5} more issues</li>
                                         )}
                                     </ul>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* Warnings */}
                     {validationResults.warnings.length > 0 && (
                         <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                             <div className="flex items-start space-x-2">
                                 <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                 <div>
                                     <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                         Recommendations
                                     </h4>
                                     <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                                         {validationResults.warnings.map((warning, index) => (
                                             <li key={index}>• {warning}</li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             )}
        </div>
    )
}

export default FormValidation