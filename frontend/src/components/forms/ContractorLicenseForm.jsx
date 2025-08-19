import React, { useState } from 'react'
import { Search, AlertTriangle, CheckCircle } from 'lucide-react'

const ContractorLicenseForm = ({
                                   data = {},
                                   onChange,
                                   permitType = 'building',
                                   readOnly = false,
                                   errors = {}
                               }) => {
    const [formData, setFormData] = useState({
                                                 name: '',
                                                 address: '',
                                                 city: '',
                                                 state: '',
                                                 zipCode: '',
                                                 phoneNumber: '',
                                                 email: '',
                                                 dba: '',
                                                 licenseType: '',
                                                 licenseNumber: '',
                                                 licenseExpiration: '',
                                                 ...data
                                             })
    const [searchQuery, setSearchQuery] = useState('')
    const [licenseValid, setLicenseValid] = useState(null)

    const updateFormData = (field, value) => {
        const newData = { ...formData, [field]: value }
        setFormData(newData)
        onChange && onChange(newData)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        // In real app, this would search contractor database
        console.log('Searching for contractor:', searchQuery)
    }

    const validateLicense = async () => {
        if (formData.licenseNumber && formData.licenseNumber.length >= 6) {
            // In real app, this would validate against contractor licensing database
            setLicenseValid(true)
        }
    }

    const isGasPermit = permitType === 'gas'

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {isGasPermit ? 'Gas Contractor' : 'Contractor'} License Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {isGasPermit
                     ? 'All gas work must be performed by a licensed gas contractor.'
                     : 'Provide information about the licensed contractor performing the work.'
                    }
                </p>
            </div>

            {/* Contractor Search */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                    Search Licensed Contractors
                </h3>

                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by contractor name or license number..."
                        className="form-input pl-10"
                        disabled={readOnly}
                    />
                </form>
            </div>

            {/* Manual Entry */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Contractor Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contractor Name */}
                    <div>
                        <label className="form-label">
                            Contractor Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateFormData('name', e.target.value)}
                            className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Full business name"
                            readOnly={readOnly}
                        />
                        {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>

                    {/* DBA */}
                    <div>
                        <label className="form-label">
                            DBA (Doing Business As)
                        </label>
                        <input
                            type="text"
                            value={formData.dba}
                            onChange={(e) => updateFormData('dba', e.target.value)}
                            className="form-input"
                            placeholder="Business operating name"
                            readOnly={readOnly}
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="form-label">
                            Business Address *
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => updateFormData('address', e.target.value)}
                            className={`form-input ${errors.address ? 'border-red-500' : ''}`}
                            placeholder="Street address"
                            readOnly={readOnly}
                        />
                        {errors.address && <p className="form-error">{errors.address}</p>}
                    </div>

                    {/* City */}
                    <div>
                        <label className="form-label">
                            City *
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            className={`form-input ${errors.city ? 'border-red-500' : ''}`}
                            placeholder="City"
                            readOnly={readOnly}
                        />
                        {errors.city && <p className="form-error">{errors.city}</p>}
                    </div>

                    {/* State */}
                    <div>
                        <label className="form-label">
                            State *
                        </label>
                        <select
                            value={formData.state}
                            onChange={(e) => updateFormData('state', e.target.value)}
                            className={`form-select ${errors.state ? 'border-red-500' : ''}`}
                            disabled={readOnly}
                        >
                            <option value="">Select State</option>
                            <option value="MA">Massachusetts</option>
                            <option value="CT">Connecticut</option>
                            <option value="RI">Rhode Island</option>
                            <option value="NH">New Hampshire</option>
                            <option value="VT">Vermont</option>
                            <option value="ME">Maine</option>
                        </select>
                        {errors.state && <p className="form-error">{errors.state}</p>}
                    </div>

                    {/* ZIP Code */}
                    <div>
                        <label className="form-label">
                            ZIP Code *
                        </label>
                        <input
                            type="text"
                            value={formData.zipCode}
                            onChange={(e) => updateFormData('zipCode', e.target.value)}
                            className={`form-input ${errors.zipCode ? 'border-red-500' : ''}`}
                            placeholder="12345"
                            readOnly={readOnly}
                        />
                        {errors.zipCode && <p className="form-error">{errors.zipCode}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="form-label">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                            className={`form-input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                            placeholder="(555) 123-4567"
                            readOnly={readOnly}
                        />
                        {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            className="form-input"
                            placeholder="contractor@email.com"
                            readOnly={readOnly}
                        />
                    </div>

                    {/* License Type */}
                    <div>
                        <label className="form-label">
                            License Type *
                        </label>
                        <select
                            value={formData.licenseType}
                            onChange={(e) => updateFormData('licenseType', e.target.value)}
                            className={`form-select ${errors.licenseType ? 'border-red-500' : ''}`}
                            disabled={readOnly}
                        >
                            <option value="">Select license type</option>
                            {isGasPermit ? (
                                <>
                                    <option value="GAS_FITTER">Gas Fitter License</option>
                                    <option value="MASTER_GAS_FITTER">Master Gas Fitter License</option>
                                    <option value="GAS_APPLIANCE_TECHNICIAN">Gas Appliance Technician</option>
                                </>
                            ) : (
                                 <>
                                     <option value="CONSTRUCTION_SUPERVISOR">Construction Supervisor License</option>
                                     <option value="HOME_IMPROVEMENT">Home Improvement Contractor</option>
                                     <option value="GENERAL_CONTRACTOR">General Contractor</option>
                                     <option value="SPECIALTY_CONTRACTOR">Specialty Contractor</option>
                                 </>
                             )}
                        </select>
                        {errors.licenseType && <p className="form-error">{errors.licenseType}</p>}
                    </div>

                    {/* License Number */}
                    <div>
                        <label className="form-label">
                            License Number *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.licenseNumber}
                                onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                                onBlur={validateLicense}
                                className={`form-input pr-10 ${errors.licenseNumber ? 'border-red-500' : ''}`}
                                placeholder="Enter license number"
                                readOnly={readOnly}
                            />
                            {licenseValid !== null && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    {licenseValid ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                         <AlertTriangle className="w-4 h-4 text-red-500" />
                                     )}
                                </div>
                            )}
                        </div>
                        {errors.licenseNumber && <p className="form-error">{errors.licenseNumber}</p>}
                    </div>

                    {/* License Expiration */}
                    <div className="md:col-span-2">
                        <label className="form-label">
                            License Expiration Date *
                        </label>
                        <input
                            type="date"
                            value={formData.licenseExpiration}
                            onChange={(e) => updateFormData('licenseExpiration', e.target.value)}
                            className={`form-input ${errors.licenseExpiration ? 'border-red-500' : ''}`}
                            readOnly={readOnly}
                        />
                        {errors.licenseExpiration && <p className="form-error">{errors.licenseExpiration}</p>}
                    </div>
                </div>
            </div>

            {/* License Requirements Notice */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Note:</strong> {isGasPermit ? 'Gas contractors' : 'Contractors'} will need to upload a copy of a valid {isGasPermit ? 'Gas Fitter' : 'Construction Supervisor'} License.
                </p>
            </div>
        </div>
    )
}

export default ContractorLicenseForm