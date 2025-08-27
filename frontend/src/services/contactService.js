import api from './api'

const locationService = {
    // Search addresses and parcels
    searchAddressOrParcel: async (query) => {
        const response = await api.get('/locations/search', {
            params: { q: query }
        })
        return response.data
    },

    // Get parcel information by ID
    getParcelInfo: async (parcelId) => {
        const response = await api.get(`/locations/parcel/${parcelId}`)
        return response.data
    },

    // Validate address
    validateAddress: async (address) => {
        const response = await api.post('/locations/validate-address', address)
        return response.data
    },

    // Get coordinates from address (geocoding)
    geocodeAddress: async (address) => {
        const response = await api.post('/locations/geocode', { address })
        return response.data
    },

    // Get address from coordinates (reverse geocoding)
    reverseGeocode: async (latitude, longitude) => {
        const response = await api.get('/locations/reverse-geocode', {
            params: { lat: latitude, lng: longitude }
        })
        return response.data
    },

    // Get zoning information
    getZoningInfo: async (parcelId) => {
        const response = await api.get(`/locations/zoning/${parcelId}`)
        return response.data
    },

    // Get property details
    getPropertyDetails: async (parcelId) => {
        const response = await api.get(`/locations/property/${parcelId}`)
        return response.data
    },

    // Search by coordinates
    searchByCoordinates: async (latitude, longitude, radius = 1000) => {
        const response = await api.get('/locations/search-by-coordinates', {
            params: { lat: latitude, lng: longitude, radius }
        })
        return response.data
    },

    // Get nearby properties
    getNearbyProperties: async (parcelId, radius = 500) => {
        const response = await api.get(`/locations/nearby/${parcelId}`, {
            params: { radius }
        })
        return response.data
    },

    // Validate property ownership
    validatePropertyOwnership: async (parcelId, ownerName) => {
        const response = await api.post('/locations/validate-ownership', {
            parcelId,
            ownerName
        })
        return response.data
    }
}

export default locationService