import React, { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronUp, ChevronDown, Search, Filter, MoreHorizontal } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

const Table = ({
                   columns = [],
                   data = [],
                   loading = false,
                   sortable = true,
                   filterable = false,
                   searchable = false,
                   pagination,
                   onSort,
                   onFilter,
                   onSearch,
                   rowActions,
                   emptyMessage = 'No data available',
                   className = '',
                   ...props
               }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({})

    // Handle sorting
    const handleSort = (column) => {
        if (!sortable || !column.sortable) return

        const direction =
            sortConfig.key === column.key && sortConfig.direction === 'asc'
            ? 'desc'
            : 'asc'

        const newSortConfig = { key: column.key, direction }
        setSortConfig(newSortConfig)
        onSort?.(newSortConfig)
    }

    // Handle search
    const handleSearch = (e) => {
        const term = e.target.value
        setSearchTerm(term)
        onSearch?.(term)
    }

    // Handle filter
    const handleFilter = (column, value) => {
        const newFilters = { ...filters, [column.key]: value }
        setFilters(newFilters)
        onFilter?.(newFilters)
    }

    // Get sort icon
    const getSortIcon = (column) => {
        if (!sortable || !column.sortable) return null

        if (sortConfig.key !== column.key) {
            return <ChevronUp className="w-4 h-4 text-gray-300" />
        }

        return sortConfig.direction === 'asc'
               ? <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               : <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    }

    // Render cell content
    const renderCell = (column, row, rowIndex) => {
        if (column.render) {
            return column.render(row[column.key], row, rowIndex)
        }

        const value = row[column.key]

        if (value === null || value === undefined) {
            return <span className="text-gray-400">—</span>
        }

        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No'
        }

        if (column.type === 'date' && value) {
            return new Date(value).toLocaleDateString()
        }

        if (column.type === 'currency' && value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value)
        }

        return String(value)
    }

    return (
        <div className={clsx('bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden', className)}>
            {/* Table Header Actions */}
            {(searchable || filterable) && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between space-x-4">
                        {searchable && (
                            <div className="flex-1 max-w-sm">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        placeholder="Search..."
                                        className="pl-9 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {filterable && (
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
                    <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={clsx(
                                    'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                                    sortable && column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors',
                                    column.headerClassName
                                )}
                                onClick={() => handleSort(column)}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>{column.title}</span>
                                    {getSortIcon(column)}
                                </div>
                            </th>
                        ))}

                        {rowActions && (
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        )}
                    </tr>
                    </thead>

                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-6 py-12 text-center">
                                <LoadingSpinner size="md" />
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-6 py-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                            </td>
                        </tr>
                    ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id || rowIndex}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={clsx(
                                                'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white',
                                                column.cellClassName
                                            )}
                                        >
                                            {renderCell(column, row, rowIndex)}
                                        </td>
                                    ))}

                                    {rowActions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                {typeof rowActions === 'function'
                                                 ? rowActions(row, rowIndex)
                                                 : rowActions
                                                }
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    {pagination}
                </div>
            )}
        </div>
    )
}

// Pagination component
export const TablePagination = ({
                                    currentPage,
                                    totalPages,
                                    totalItems,
                                    itemsPerPage,
                                    onPageChange,
                                    onPageSizeChange,
                                    pageSizeOptions = [10, 20, 50, 100]
                                }) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {startItem} to {endItem} of {totalItems} results
                </p>

                <select
                    value={itemsPerPage}
                    onChange={(e) => onPageSizeChange?.(parseInt(e.target.value))}
                    className="ml-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1"
                >
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>
                            {size} per page
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {/* Page numbers */}
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                    if (pageNum > totalPages) return null

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange?.(pageNum)}
                            className={clsx(
                                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                                pageNum === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                            )}
                        >
                            {pageNum}
                        </button>
                    )
                })}

                <button
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Table