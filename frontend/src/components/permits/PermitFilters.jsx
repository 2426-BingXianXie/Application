import React, { useState } from 'react'
import { Calendar, DollarSign, User, Building, Zap, X } from 'lucide-react'
import {
    PERMIT_STATUS,
    APPLICANT_TYPE,
    BUILDING_PERMIT_TYPE,
    BUILDING_TYPE,
    GAS_WORK_TYPE,
    GAS_INSTALLATION_TYPE
} from '../../utils/constants'

const PermitFilters = ({ permitType = '', onFilterChange, initialFilters = {} }) => {
    const [filters, setFilters] = useState({
                                               status: '',
                                               applicantType: '',
                                               dateFrom: '',
                                               dateTo: '',
                                               minCost: '',
                                               maxCost: '',
                                               // Building-specific filters
                                               buildingType: '',
                                               permitFor: '',
                                               // Gas-specific filters
                                               workType: '',
                                               installationType: '',
                                               minBtu: '',
                                               maxBtu: '',
                                               ...initialFilters
                                           })

    const updateFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange && onFilterChange(newFilters)
    }

    const clearFilter = (key) => {
        updateFilter(key, '')
    }

    const clearAllFilters = () => {
        const clearedFilters = Object.keys(filters).reduce((acc, key) => {
            acc[key] = ''
            return acc
        }, {})
        setFilters(clearedFilters)
        onFilterChange && onFilterChange(clearedFilters)
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== '')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Filter Permits
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Common Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="form-label">
                        Status
                    </label>
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => updateFilter('status', e.target.value)}
                            className="form-select"
                        >
                            <option value="">All Statuses</option>
                            {Object.entries(PERMIT_STATUS).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                        {filters.status && (
                            <button
                                onClick={() => clearFilter('status')}
                                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Applicant Type Filter */}
                <div>
                    <label className="form-label">
                        Applicant Type
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={filters.applicantType}
                            onChange={(e) => updateFilter('applicantType', e.target.value)}
                            className="form-select pl-10"
                        >
                            <option value="">All Applicant Types</option>
                            {Object.entries(APPLICANT_TYPE).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                        {filters.applicantType && (
                            <button
                                onClick={() => clearFilter('applicantType')}
                                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Date Range Filter */}
                <div>
                    <label className="form-label">
                        Submission Date From
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => updateFilter('dateFrom', e.target.value)}
                            className="form-input pl-10"
                        />
                        {filters.dateFrom && (
                            <button
                                onClick={() => clearFilter('dateFrom')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label className="form-label">
                        Submission Date To
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => updateFilter('dateTo', e.target.value)}
                            className="form-input pl-10"
                        />
                        {filters.dateTo && (
                            <button
                                onClick={() => clearFilter('dateTo')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Project Cost Range */}
                <div>
                    <label className="form-label">
                        Min Project Cost
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            value={filters.minCost}
                            onChange={(e) => updateFilter('minCost', e.target.value)}
                            className="form-input pl-10"
                            placeholder="0"
                            min="0"
                        />
                        {filters.minCost && (
                            <button
                                onClick={() => clearFilter('minCost')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label className="form-label">
                        Max Project Cost
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            value={filters.maxCost}
                            onChange={(e) => updateFilter('maxCost', e.target.value)}
                            className="form-input pl-10"
                            placeholder="1000000"
                            min="0"
                        />
                        {filters.maxCost && (
                            <button
                                onClick={() => clearFilter('maxCost')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Building-Specific Filters */}
            {permitType === 'building' && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Building Permit Filters
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">
                                Building Type
                            </label>
                            <select
                                value={filters.buildingType}
                                onChange={(e) => updateFilter('buildingType', e.target.value)}
                                className="form-select"
                            >
                                <option value="">All Building Types</option>
                                {Object.entries(BUILDING_TYPE).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">
                                Permit Type
                            </label>
                            <select
                                value={filters.permitFor}
                                onChange={(e) => updateFilter('permitFor', e.target.value)}
                                className="form-select"
                            >
                                <option value="">All Permit Types</option>
                                {Object.entries(BUILDING_PERMIT_TYPE).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Gas-Specific Filters */}
            {permitType === 'gas' && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Gas Permit Filters
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="form-label">
                                Work Type
                            </label>
                            <select
                                value={filters.workType}
                                onChange={(e) => updateFilter('workType', e.target.value)}
                                className="form-select"
                            >
                                <option value="">All Work Types</option>
                                {Object.entries(GAS_WORK_TYPE).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">
                                Installation Type
                            </label>
                            <select
                                value={filters.installationType}
                                onChange={(e) => updateFilter('installationType', e.target.value)}
                                className="form-select"
                            >
                                <option value="">All Installation Types</option>
                                {Object.entries(GAS_INSTALLATION_TYPE).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">
                                Min BTU Input
                            </label>
                            <input
                                type="number"
                                value={filters.minBtu}
                                onChange={(e) => updateFilter('minBtu', e.target.value)}
                                className="form-input"
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Max BTU Input
                            </label>
                            <input
                                type="number"
                                value={filters.maxBtu}
                                onChange={(e) => updateFilter('maxBtu', e.target.value)}
                                className="form-input"
                                placeholder="10000000"
                                min="0"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Active Filters
                        </h4>
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {Object.entries(filters).map(([key, value]) => {
                            if (!value) return null

                            return (
                                <span
                                    key={key}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
                                    <button
                                        onClick={() => clearFilter(key)}
                                        className="ml-1 hover:text-blue-600"
                                    >
                    <X className="w-3 h-3" />
                  </button>
                </span>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PermitFilters