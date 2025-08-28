import React from 'react'
import { Calendar, X } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const PermitFilters = ({
                           dateRange,
                           onDateRangeChange,
                           additionalFilters = {},
                           onAdditionalFiltersChange,
                           permitType = 'all',
                           onClear
                       }) => {

    const handleDateChange = (field, value) => {
        onDateRangeChange({
                              ...dateRange,
                              [field]: value
                          })
    }

    const handleAdditionalFilterChange = (field, value) => {
        onAdditionalFiltersChange({
                                      ...additionalFilters,
                                      [field]: value
                                  })
    }

    const clearAllFilters = () => {
        onDateRangeChange({ start: '', end: '' })
        onAdditionalFiltersChange({})
        onClear?.()
    }

    const hasActiveFilters = dateRange.start || dateRange.end || Object.values(additionalFilters).some(v => v)

    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Advanced Filters
                </h4>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        startIcon={<X className="h-3 w-3" />}
                    >
                        Clear All
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Range */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date Range
                    </label>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                            placeholder="Start date"
                            size="sm"
                        />
                        <span className="text-gray-400">to</span>
                        <Input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                            placeholder="End date"
                            size="sm"
                        />
                    </div>
                </div>

                {/* Project Cost Range */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Project Cost Range
                    </label>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={additionalFilters.minCost || ''}
                            onChange={(e) => handleAdditionalFilterChange('minCost', e.target.value)}
                            placeholder="Min cost"
                            size="sm"
                        />
                        <span className="text-gray-400">to</span>
                        <Input
                            type="number"
                            value={additionalFilters.maxCost || ''}
                            onChange={(e) => handleAdditionalFilterChange('maxCost', e.target.value)}
                            placeholder="Max cost"
                            size="sm"
                        />
                    </div>
                </div>

                {/* Building Type (for building permits) */}
                {permitType === 'building' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Building Type
                        </label>
                        <Select
                            value={additionalFilters.buildingType || ''}
                            onChange={(value) => handleAdditionalFilterChange('buildingType', value)}
                            options={[
                                { value: '', label: 'All Building Types' },
                                { value: 'RESIDENTIAL', label: 'Residential' },
                                { value: 'COMMERCIAL', label: 'Commercial' },
                                { value: 'INDUSTRIAL', label: 'Industrial' },
                                { value: 'MIXED_USE', label: 'Mixed Use' }
                            ]}
                            size="sm"
                        />
                    </div>
                )}

                {/* Gas Type (for gas permits) */}
                {permitType === 'gas' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Gas Type
                        </label>
                        <Select
                            value={additionalFilters.gasType || ''}
                            onChange={(value) => handleAdditionalFilterChange('gasType', value)}
                            options={[
                                { value: '', label: 'All Gas Types' },
                                { value: 'NATURAL_GAS', label: 'Natural Gas' },
                                { value: 'PROPANE', label: 'Propane' },
                                { value: 'LPG', label: 'LPG' }
                            ]}
                            size="sm"
                        />
                    </div>
                )}

                {/* Applicant Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Applicant Type
                    </label>
                    <Select
                        value={additionalFilters.applicantType || ''}
                        onChange={(value) => handleAdditionalFilterChange('applicantType', value)}
                        options={[
                            { value: '', label: 'All Applicant Types' },
                            { value: 'OWNER', label: 'Property Owner' },
                            { value: 'CONTRACTOR', label: 'Contractor' },
                            { value: 'ARCHITECT', label: 'Architect' },
                            { value: 'OTHER', label: 'Other' }
                        ]}
                        size="sm"
                    />
                </div>

                {/* Has Professional Services */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Professional Services
                    </label>
                    <Select
                        value={additionalFilters.hasArchitect || ''}
                        onChange={(value) => handleAdditionalFilterChange('hasArchitect', value)}
                        options={[
                            { value: '', label: 'Any' },
                            { value: 'true', label: 'Has Architect' },
                            { value: 'false', label: 'No Architect' }
                        ]}
                        size="sm"
                    />
                </div>
            </div>

            {/* Filter Summary */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                        {dateRange.start && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                From: {new Date(dateRange.start).toLocaleDateString()}
              </span>
                        )}
                        {dateRange.end && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                To: {new Date(dateRange.end).toLocaleDateString()}
              </span>
                        )}
                        {additionalFilters.minCost && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Min Cost: ${Number(additionalFilters.minCost).toLocaleString()}
              </span>
                        )}
                        {additionalFilters.maxCost && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Max Cost: ${Number(additionalFilters.maxCost).toLocaleString()}
              </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PermitFilters