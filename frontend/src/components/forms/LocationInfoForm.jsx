import React, { useState, useEffect } from 'react'
import { MapPin, Search, Building, User, AlertCircle, CheckCircle, Navigation } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { validateRequired } from '../../utils/validators'
import { US_STATES, ZONING_CLASSIFICATIONS } from '../../utils/constants'

const LocationInfoForm = ({
                              data = {},
                              onChange,
                              errors = {},
                              readOnly = false,
                              showValidation = true
                          }) => {
    const [formData, setFormData] = useState({
                                                 parcelId: '',
                                                 propertyAddress: '',
                                                 city: '',
                                                 state: '',
                                                 zipCode: '',
                                                 propertyOwnerName: '',
                                                 latitude: '',
                                                 longitude: '',
                                                 lotSizeSqft: '',
                                                 zoningClassification: '',
                                                 ...data
                                             })

    const [addressSearch, setAddressSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})
    const [touched, setTouched] = useState({})

    useEffect(() => {
        setFormData(prev => ({ ...prev, ...data }))
    }, [data])

    // Address/Parcel search functionality
    const searchAddressOrParcel = async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 3) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            // This would call your address/parcel lookup service
            // For now, we'll simulate with mock data
            await new Promise(resolve => setTimeout(resolve, 500))

            const mockResults = [
                {
                    id: '1',
                    parcelId: 'PAR-001-001',
                    address: '123 Main Street, Springfield, MA 01101',
                    propertyOwner: 'John Smith',
                    zoning: 'RESIDENTIAL_SINGLE_FAMILY',
                    lotSize: 7500
                },
                {
                    id: '2',
                    parcelId: 'PAR-001-002',
                    address: '125 Main Street, Springfield, MA 01101',
                    propertyOwner: 'Jane Doe',
                    zoning: 'RESIDENTIAL_SINGLE_FAMILY',
                    lotSize: 8200
                }
            ]

            setSearchResults(mockResults.filter(result =>
                                                    result.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    result.parcelId.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        } catch (error) {
            console.error('Address search failed:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const selectAddress = (result) => {
        const [address, cityState] = result.address.split(', ')
        const [city, stateZip] = cityState.split(', ')
        const [state, zipCode] = stateZip.split(' ')

        const newData = {
            ...formData,
            parcelId: result.parcelId,
            propertyAddress: address,
            city,
            state,
            zipCode,
            propertyOwnerName: result.propertyOwner,
            zoningClassification: result.zoning,
            lotSizeSqft: result.lotSize.toString()
        }

        setFormData(newData)
        onChange(newData)
        setAddressSearch('')
        setSearchResults([])
    }

    // Geolocation functionality
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.')
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newData = {
                    ...formData,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString()
                }
                setFormData(newData)
                onChange(newData)
            },
            (error) => {
                console.error('Geolocation error:', error)
                alert('Unable to retrieve your location. Please enter coordinates manually.')
            }
        )
    }

    const validateField = (field, value) => {
        switch (field) {
            case 'parcelId':
                return !value.trim() ? 'Parcel ID is required' : ''
            case 'propertyAddress':
                return !value.trim() ? 'Property address is required' : ''
            case 'city':
                return !value.trim() ? 'City is required' : ''
            case 'state':
                return !value ? 'State is required' : ''
            case 'zipCode':
                if (!value.trim()) return 'ZIP code is required'
                return !/^\d{5}(-\d{4})?$/.test(value) ? 'Please enter a valid ZIP code' : ''
            case 'propertyOwnerName':
                return !value.trim() ? 'Property owner name is required' : ''
            case 'zoningClassification':
                return !value ? 'Zoning classification is required' : ''
            default:
                return ''
        }
    }

    const updateField = (field, value) => {
        // Format ZIP code
        if (field === 'zipCode') {
            value = value.replace(/\D/g, '').substring(0, 5)
        }

        // Format lot size (numbers only)
        if (field === 'lotSizeSqft') {
            value = value.replace(/[^\d.]/g, '')
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

    const getFieldError = (field) => {
        return errors[field] || validationErrors[field]
    }

    return (
        <Card
            title="Property Location"
            subtitle="Select the primary location for this permit application"
            className="max-w-4xl mx-auto"
        >
            <div className="space-y-6">
                {/* Address/Parcel Search */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Search className="w-5 h-5 mr-2 text-blue-600" />
                        Search for Address or Parcel
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Search for an address or parcel by name, address, or Parcel ID.
                    </p>

                    <div className="relative">
                        <Input
                            value={addressSearch}
                            onChange={(e) => {
                                setAddressSearch(e.target.value)
                                searchAddressOrParcel(e.target.value)
                            }}
                            placeholder="Search for a name, address, or Parcel ID"
                            startIcon={<Search className="w-4 h-4" />}
                            disabled={readOnly}
                        />

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-300 dark:border-gray-600 max-h-60 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => selectAddress(result)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {result.address}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Parcel: {result.parcelId} • Owner: {result.propertyOwner}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Manual Entry */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-blue-600" />
                        Property Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Parcel ID"
                            value={formData.parcelId}
                            onChange={(e) => updateField('parcelId', e.target.value)}
                            onBlur={() => handleBlur('parcelId')}
                            error={getFieldError('parcelId')}
                            required
                            readOnly={readOnly}
                            placeholder="PAR-001-001"
                            helperText="Official parcel identification number"
                        />

                        <Input
                            label="Property Owner Name"
                            value={formData.propertyOwnerName}
                            onChange={(e) => updateField('propertyOwnerName', e.target.value)}
                            onBlur={() => handleBlur('propertyOwnerName')}
                            error={getFieldError('propertyOwnerName')}
                            required
                            readOnly={readOnly}
                            placeholder="Property owner's full name"
                            startIcon={<User className="w-4 h-4" />}
                        />
                    </div>

                    <div className="mt-4">
                        <Input
                            label="Property Address"
                            value={formData.propertyAddress}
                            onChange={(e) => updateField('propertyAddress', e.target.value)}
                            onBlur={() => handleBlur('propertyAddress')}
                            error={getFieldError('propertyAddress')}
                            required
                            readOnly={readOnly}
                            placeholder="123 Main Street"
                            startIcon={<MapPin className="w-4 h-4" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
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
                                onChange={(e) => updateField('zipCode', e.target.value)}
                                onBlur={() => handleBlur('zipCode')}
                                error={getFieldError('zipCode')}
                                required
                                readOnly={readOnly}
                                placeholder="12345"
                                maxLength={5}
                                pattern="\d{5}"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Property Information */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-blue-600" />
                        Additional Property Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Zoning Classification"
                            value={formData.zoningClassification}
                            onChange={(value) => updateField('zoningClassification', value)}
                            options={ZONING_CLASSIFICATIONS}
                            error={getFieldError('zoningClassification')}
                            required
                            disabled={readOnly}
                            placeholder="Select zoning type"
                            helperText="Property zoning classification"
                        />

                        <Input
                            label="Lot Size (sq ft)"
                            type="number"
                            value={formData.lotSizeSqft}
                            onChange={(e) => updateField('lotSizeSqft', e.target.value)}
                            readOnly={readOnly}
                            placeholder="7500"
                            min="0"
                            step="1"
                            helperText="Total lot size in square feet"
                        />
                    </div>

                    {/* Coordinates */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Coordinates (Optional)
                            </label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={getCurrentLocation}
                                disabled={readOnly}
                                startIcon={<Navigation className="w-4 h-4" />}
                            >
                                Use My Location
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Latitude"
                                type="number"
                                value={formData.latitude}
                                onChange={(e) => updateField('latitude', e.target.value)}
                                readOnly={readOnly}
                                placeholder="42.1015"
                                step="any"
                                helperText="Decimal degrees"
                            />

                            <Input
                                label="Longitude"
                                type="number"
                                value={formData.longitude}
                                onChange={(e) => updateField('longitude', e.target.value)}
                                readOnly={readOnly}
                                placeholder="-72.5898"
                                step="any"
                                helperText="Decimal degrees"
                            />
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
                {showValidation && formData.parcelId && formData.propertyAddress && formData.city && formData.state && formData.zipCode && formData.propertyOwnerName && formData.zoningClassification && (
                    <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-md p-4">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                Property location information is complete
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default LocationInfoForm