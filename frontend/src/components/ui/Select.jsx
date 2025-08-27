import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { ChevronDown, Search, X, Check, AlertCircle, CheckCircle } from 'lucide-react'

const Select = forwardRef(({
                               label,
                               placeholder = 'Select an option',
                               value,
                               onChange,
                               options = [],
                               error,
                               success,
                               helperText,
                               required = false,
                               disabled = false,
                               readOnly = false,
                               searchable = false,
                               clearable = false,
                               multiple = false,
                               className = '',
                               size = 'md',
                               variant = 'default',
                               renderOption,
                               ...props
                           }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedValues, setSelectedValues] = useState(multiple ? (value || []) : value)

    const selectRef = useRef(null)
    const searchInputRef = useRef(null)

    // Filter options based on search term
    const filteredOptions = searchable && searchTerm
                            ? options.filter(option =>
                                                 option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                 option.value?.toLowerCase().includes(searchTerm.toLowerCase())
        )
                            : options

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isOpen, searchable])

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    }

    const variants = {
        default: 'border-gray-300 dark:border-gray-600',
        filled: 'border-0 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600'
    }

    const selectClasses = clsx(
        'relative block w-full rounded-md shadow-sm transition-all duration-200',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
        'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        variants[variant],
        sizes[size],
        {
            'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500': error,
            'border-green-500 dark:border-green-400 focus:ring-green-500 focus:border-green-500': success,
            'opacity-50 cursor-not-allowed': disabled,
            'cursor-default': readOnly,
        }
    )

    const getDisplayValue = () => {
        if (multiple) {
            if (!selectedValues || selectedValues.length === 0) return placeholder
            if (selectedValues.length === 1) {
                const option = options.find(opt => opt.value === selectedValues[0])
                return option?.label || selectedValues[0]
            }
            return `${selectedValues.length} selected`
        }

        if (!selectedValues) return placeholder
        const option = options.find(opt => opt.value === selectedValues)
        return option?.label || selectedValues
    }

    const handleOptionClick = (option) => {
        if (multiple) {
            const newValues = selectedValues.includes(option.value)
                              ? selectedValues.filter(val => val !== option.value)
                              : [...selectedValues, option.value]

            setSelectedValues(newValues)
            onChange?.(newValues)
        } else {
            setSelectedValues(option.value)
            onChange?.(option.value)
            setIsOpen(false)
            setSearchTerm('')
        }
    }

    const handleClear = (e) => {
        e.stopPropagation()
        const newValue = multiple ? [] : ''
        setSelectedValues(newValue)
        onChange?.(newValue)
    }

    const toggleDropdown = () => {
        if (!disabled && !readOnly) {
            setIsOpen(!isOpen)
        }
    }

    const isSelected = (option) => {
        return multiple
               ? selectedValues?.includes(option.value)
               : selectedValues === option.value
    }

    return (
        <div className={clsx('space-y-1', className)} ref={selectRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <div
                    className={selectClasses}
                    onClick={toggleDropdown}
                    {...props}
                >
                    <span className="block truncate pr-8">
                        {getDisplayValue()}
                    </span>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        {clearable && selectedValues && !disabled && !readOnly && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="mr-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded pointer-events-auto"
                            >
                                <X className="h-3 w-3 text-gray-400" />
                            </button>
                        )}
                        <ChevronDown
                            className={clsx(
                                'h-4 w-4 text-gray-400 transition-transform duration-200',
                                isOpen && 'transform rotate-180'
                            )}
                        />
                    </span>
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-300 dark:border-gray-600 max-h-60 overflow-hidden">
                        {searchable && (
                            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search options..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="max-h-48 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                                    {searchTerm ? 'No options found' : 'No options available'}
                                </div>
                            ) : (
                                 filteredOptions.map((option, index) => (
                                     <button
                                         key={option.value || index}
                                         type="button"
                                         onClick={() => handleOptionClick(option)}
                                         className={clsx(
                                             'w-full text-left px-3 py-2 text-sm transition-colors duration-150',
                                             'hover:bg-gray-100 dark:hover:bg-gray-700',
                                             'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700',
                                             {
                                                 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200': isSelected(option)
                                             }
                                         )}
                                     >
                                         <div className="flex items-center justify-between">
                                            <span className="truncate">
                                                {renderOption ? renderOption(option) : option.label}
                                            </span>
                                             {isSelected(option) && (
                                                 <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                             )}
                                         </div>
                                         {option.description && (
                                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                 {option.description}
                                             </p>
                                         )}
                                     </button>
                                 ))
                             )}
                        </div>
                    </div>
                )}
            </div>

            {/* Helper Text */}
            {(error || success || helperText) && (
                <div className="flex items-start space-x-1">
                    {error && (
                        <>
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </>
                    )}

                    {success && !error && (
                        <>
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                        </>
                    )}

                    {helperText && !error && !success && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
                    )}
                </div>
            )}
        </div>
    )
})

Select.displayName = 'Select'

export default Select