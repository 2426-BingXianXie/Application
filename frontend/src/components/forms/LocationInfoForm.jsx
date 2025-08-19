import React, { useState } from 'react'
import { Search, MapPin } from 'lucide-react'

const LocationInfoForm = ({ data = {}, onChange }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
                                                 propertyAddress: '',
                                                 propertyAddress2: '',
                                                 city: '',
                                                 state: '',
                                                 zipCode: '',
                                                 parcelId: '',
                                                 propertyOwnerName: '',
                                                 ...data
                                             })

    const updateFormData = (field, value) => {
        const newData = { ...formData, [field]: value }
        setFormData(newData)
        onChange && onChange(newData)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        // In a real app, this would search for addresses/parcels
        console.log('Searching for:', searchQuery)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Property Location
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Select the property where the work will be performed.
                </p>
            </div>

            {/* Address/Parcel Search */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Search for Address or Parcel
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Search for an address or parcel by name, address, or Parcel ID.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a name, address, or Parcel ID"
                        className="form-input pl-10"
                    />
                </form>
            </div>

            {/* Manual Entry */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Or Enter Property Information Manually
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Address */}
                    <div className="md:col-span-2">
                        <label className="form-label">
                            Property Address *
                        </label>
                        <input
                            type="text"
                            value={formData.propertyAddress}
                            onChange={(e) => updateFormData('propertyAddress', e.target.value)}
                            className="form-input"
                            placeholder="Enter property street address"
                        />
                    </div>

                    {/* Property Address 2 */}
                    <div className="md:col-span-2">
                        <label className="form-label">
                            Property Address Line 2
                        </label>
                        <input
                            type="text"
                            value={formData.propertyAddress2}
                            onChange={(e) => updateFormData('propertyAddress2', e.target.value)}
                            className="form-input"
                            placeholder="Apartment, suite, unit, etc. (optional)"
                        />
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
                            className="form-input"
                            placeholder="Enter city"
                        />
                    </div>

                    {/* State */}
                    <div>
                        <label className="form-label">
                            State *
                        </label>
                        <select
                            value={formData.state}
                            onChange={(e) => updateFormData('state', e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select State</option>
                            <option value="MA">Massachusetts</option>
                            <option value="CT">Connecticut</option>
                            <option value="RI">Rhode Island</option>
                            <option value="NH">New Hampshire</option>
                            <option value="VT">Vermont</option>
                            <option value="ME">Maine</option>
                        </select>
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
                            className="form-input"
                            placeholder="12345 or 12345-6789"
                        />
                    </div>

                    {/* Parcel ID */}
                    <div>
                        <label className="form-label">
                            Parcel ID
                        </label>
                        <input
                            type="text"
                            value={formData.parcelId}
                            onChange={(e) => updateFormData('parcelId', e.target.value)}
                            className="form-input"
                            placeholder="Enter parcel identification number"
                        />
                        <p className="form-help">
                            You can find this on your property tax bill
                        </p>
                    </div>

                    {/* Property Owner Name */}
                    <div className="md:col-span-2">
                        <label className="form-label">
                            Property Owner Name
                        </label>
                        <input
                            type="text"
                            value={formData.propertyOwnerName}
                            onChange={(e) => updateFormData('propertyOwnerName', e.target.value)}
                            className="form-input"
                            placeholder="Enter property owner's full name"
                        />
                        <p className="form-help">
                            If different from applicant
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LocationInfoForm