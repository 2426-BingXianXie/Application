import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
    Search as SearchIcon, Filter, X, Calendar, User,
    Building, Flame, FileText, MapPin, DollarSign, Clock,
    ChevronDown, ChevronUp, SlidersHorizontal
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import PermitCard from '../components/permits/PermitCard'
import {
    PERMIT_STATUS_LABELS,
    PERMIT_TYPE_LABELS,
    BUILDING_TYPE_LABELS,
    APPLICANT_TYPE_LABELS,
    US_STATES
} from '../utils/constants'
import { formatDate, formatCurrency } from '../utils/formatters'

const Search = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { hasPermission } = useAuth()
    const { showError } = useNotifications()

    // State management
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
    const [isLoading, setIsLoading] = useState(false)
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [results, setResults] = useState([])
    const [totalResults, setTotalResults] = useState(0)
    const [page, setPage] = useState(0)

    // Search filters
    const [filters, setFilters] = useState({
                                               permitType: searchParams.get('type') || '',
                                               status: searchParams.get('status') || '',
                                               applicantType: searchParams.get('applicant') || '',
                                               buildingType: searchParams.get('building') || '',
                                               city: searchParams.get('city') || '',
                                               state: searchParams.get('state') || 'MA',
                                               dateFrom: searchParams.get('from') || '',
                                               dateTo: searchParams.get('to') || '',
                                               costMin: searchParams.get('costMin') || '',
                                               costMax: searchParams.get('costMax') || '',
                                               contractorName: searchParams.get('contractor') || '',
                                               permitNumber: searchParams.get('number') || ''
                                           })

    // Filter options
    const permitTypeOptions = [
        { value: '', label: 'All Types' },
        ...Object.entries(PERMIT_TYPE_LABELS).map(([key, label]) => ({ value: key, label }))
    ]

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        ...Object.entries(PERMIT_STATUS_LABELS).map(([key, label]) => ({ value: key, label }))
    ]

    const applicantTypeOptions = [
        { value: '', label: 'All Applicant Types' },
        ...Object.entries(APPLICANT_TYPE_LABELS).map(([key, label]) => ({ value: key, label }))
    ]

    const buildingTypeOptions = [
        { value: '', label: 'All Building Types' },
        ...Object.entries(BUILDING_TYPE_LABELS).map(([key, label]) => ({ value: key, label }))
    ]

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams()

        if (searchQuery) params.set('q', searchQuery)
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value)
        })

        setSearchParams(params)
    }, [searchQuery, filters, setSearchParams])

    // Mock search function - replace with actual API call
    const performSearch = async () => {
        if (!hasPermission('VIEW_ALL_PERMITS')) {
            showError('Access Denied', 'You do not have permission to search all permits.')
            return
        }

        setIsLoading(true)
        try {
            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock results
            const mockResults = [
                {
                    id: 1,
                    permitNumber: 'BP-2024-001',
                    permitType: 'BUILDING',
                    status: 'APPROVED',
                    submissionDate: '2024-01-15T10:00:00Z',
                    applicantName: 'John Smith',
                    buildingPermitInfo: {
                        projectCost: 150000,
                        workDescription: 'Single family home construction',
                        buildingType: 'RESIDENTIAL'
                    },
                    locationInfo: {
                        propertyAddress: '123 Main Street, Springfield, MA 01103'
                    }
                },
                {
                    id: 2,
                    permitNumber: 'GP-2024-005',
                    permitType: 'GAS',
                    status: 'UNDER_REVIEW',
                    submissionDate: '2024-02-01T09:15:00Z',
                    applicantName: 'ABC Construction LLC',
                    gasPermitInfo: {
                        projectCost: 2500,
                        workDescription: 'Gas line installation for new water heater'
                    },
                    locationInfo: {
                        propertyAddress: '456 Oak Avenue, Springfield, MA 01104'
                    }
                }
            ]

            // Filter results based on search criteria
            let filteredResults = mockResults

            if (searchQuery) {
                filteredResults = filteredResults.filter(permit =>
                                                             permit.permitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                             permit.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                             permit.buildingPermitInfo?.workDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                             permit.gasPermitInfo?.workDescription?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            }

            if (filters.permitType) {
                filteredResults = filteredResults.filter(permit => permit.permitType === filters.permitType)
            }

            if (filters.status) {
                filteredResults = filteredResults.filter(permit => permit.status === filters.status)
            }

            setResults(filteredResults)
            setTotalResults(filteredResults.length)
        } catch (error) {
            showError('Search Failed', 'Unable to perform search. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const clearAllFilters = () => {
        setSearchQuery('')
        setFilters({
                       permitType: '',
                       status: '',
                       applicantType: '',
                       buildingType: '',
                       city: '',
                       state: 'MA',
                       dateFrom: '',
                       dateTo: '',
                       costMin: '',
                       costMax: '',
                       contractorName: '',
                       permitNumber: ''
                   })
        setResults([])
        setTotalResults(0)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        performSearch()
    }

    const hasActiveFilters = Object.values(filters).some(value => value && value !== 'MA') || searchQuery

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <SearchIcon className="w-6 h-6 mr-3" />
                        Search Permits
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Search and filter permits across the system
                    </p>
                </div>
            </div>

            {/* Search Form */}
            <Card>
                <Card.Body>
                    <form onSubmit={handleSearch} className="space-y-4">
                        {/* Main Search */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by permit number, applicant name, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={isLoading}
                                    className="px-8"
                                >
                                    <SearchIcon className="w-4 h-4 mr-2" />
                                    Search
                                </Button>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filters
                                    {showAdvancedFilters ?
                                     <ChevronUp className="w-4 h-4 ml-1" /> :
                                     <ChevronDown className="w-4 h-4 ml-1" />
                                    }
                                </Button>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showAdvancedFilters && (
                            <div className="border-t pt-4 space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Advanced Filters</h3>

                                {/* Basic Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Select
                                        label="Permit Type"
                                        options={permitTypeOptions}
                                        value={filters.permitType}
                                        onChange={(e) => updateFilter('permitType', e.target.value)}
                                    />

                                    <Select
                                        label="Status"
                                        options={statusOptions}
                                        value={filters.status}
                                        onChange={(e) => updateFilter('status', e.target.value)}
                                    />

                                    <Select
                                        label="Applicant Type"
                                        options={applicantTypeOptions}
                                        value={filters.applicantType}
                                        onChange={(e) => updateFilter('applicantType', e.target.value)}
                                    />
                                </div>

                                {/* Location Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        label="City"
                                        value={filters.city}
                                        onChange={(e) => updateFilter('city', e.target.value)}
                                        placeholder="Enter city name"
                                    />

                                    <Select
                                        label="State"
                                        options={[{ value: '', label: 'All States' }, ...US_STATES]}
                                        value={filters.state}
                                        onChange={(e) => updateFilter('state', e.target.value)}
                                    />

                                    <Input
                                        label="Permit Number"
                                        value={filters.permitNumber}
                                        onChange={(e) => updateFilter('permitNumber', e.target.value)}
                                        placeholder="Enter permit number"
                                    />
                                </div>

                                {/* Date Range */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Date From"
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => updateFilter('dateFrom', e.target.value)}
                                    />

                                    <Input
                                        label="Date To"
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => updateFilter('dateTo', e.target.value)}
                                    />
                                </div>

                                {/* Cost Range */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Min Cost ($)"
                                        type="number"
                                        value={filters.costMin}
                                        onChange={(e) => updateFilter('costMin', e.target.value)}
                                        placeholder="0"
                                    />

                                    <Input
                                        label="Max Cost ($)"
                                        type="number"
                                        value={filters.costMax}
                                        onChange={(e) => updateFilter('costMax', e.target.value)}
                                        placeholder="No limit"
                                    />
                                </div>

                                {/* Clear Filters */}
                                {hasActiveFilters && (
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={clearAllFilters}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Clear All Filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </Card.Body>
            </Card>

            {/* Search Results */}
            {isLoading ? (
                <Card>
                    <Card.Body>
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Searching permits...</p>
                        </div>
                    </Card.Body>
                </Card>
            ) : results.length > 0 ? (
                <div className="space-y-4">
                    {/* Results Header */}
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Found {totalResults} permit{totalResults !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                            <Select
                                options={[
                                    { value: 'relevance', label: 'Relevance' },
                                    { value: 'date', label: 'Date' },
                                    { value: 'status', label: 'Status' },
                                    { value: 'cost', label: 'Cost' }
                                ]}
                                value="relevance"
                                onChange={() => {}}
                                className="w-32"
                            />
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {results.map((permit) => (
                            <PermitCard
                                key={permit.id}
                                permit={permit}
                                showApplicantInfo={true}
                                actions={['view']}
                                onClick={() => navigate(`/permit/${permit.id}`)}
                            />
                        ))}
                    </div>

                    {/* Pagination would go here */}
                </div>
            ) : searchQuery || hasActiveFilters ? (
                <Card>
                    <Card.Body>
                        <div className="text-center py-12">
                            <SearchIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No permits found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Try adjusting your search criteria or filters.
                            </p>
                            <Button variant="secondary" onClick={clearAllFilters}>
                                Clear All Filters
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                    <Card>
                        <Card.Body>
                            <div className="text-center py-12">
                                <SearchIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Search Permits
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Enter a search term or use filters to find specific permits.
                                </p>
                                <div className="max-w-md mx-auto space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                    <p>Search by:</p>
                                    <ul className="space-y-1">
                                        <li>• Permit number (e.g., BP-2024-001)</li>
                                        <li>• Applicant name</li>
                                        <li>• Work description</li>
                                        <li>• Property address</li>
                                        <li>• Contractor name</li>
                                    </ul>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                )}

            {/* Search Tips */}
            <Card>
                <Card.Body>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                            Search Tips
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                            <li>• Use quotation marks for exact phrases</li>
                            <li>• Combine multiple filters for more specific results</li>
                            <li>• Date ranges help narrow down results by time period</li>
                            <li>• Cost filters help find projects in specific budget ranges</li>
                        </ul>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Search