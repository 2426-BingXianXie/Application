import React, { forwardRef, useState } from 'react'
import { ChevronDown, AlertCircle, CheckCircle2, Search } from 'lucide-react'
import clsx from 'clsx'

const Select = forwardRef(({
                               label,
                               options = [],
                               error,
                               success,
                               helperText,
                               required = false,
                               disabled = false,
                               placeholder = 'Select an option',
                               searchable = false,
                               multiple = false,
                               clearable = false,
                               className = '',
                               containerClassName = '',
                               labelClassName = '',
                               value,
                               onChange,
                               onBlur,
                               onFocus,
                               renderOption,
                               renderValue,
                               ...props
                           }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const hasError = Boolean(error)
    const hasSuccess = Boolean(success) && !hasError

    // Filter options based on search term
    const filteredOptions = searchable
                            ? options.filter(option =>
                                                 option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                 option.value?.toLowerCase().includes(searchTerm.toLowerCase())
        )
                            : options

    // Handle option selection
    const handleOptionSelect = (option) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : []
            const newValues = currentValues.includes(option.value)
                              ? currentValues.filter(v => v !== option.value)
                              : [...currentValues, option.value]
            onChange?.(newValues)
        } else {
            onChange?.(option.value)
            setIsOpen(false)
        }
        setSearchTerm('')
    }

    // Handle clear selection
    const handleClear = (e) => {
        e.stopPropagation()
        onChange?.(multiple ? [] : '')
    }

    // Get display value
    const getDisplayValue = () => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return placeholder
        }

        if (renderValue) {
            return renderValue(value, options)
        }

        if (multiple) {
            const selectedOptions = options.filter(opt => value.includes(opt.value))
            return selectedOptions.length > 0
                   ? `${selectedOptions.length} selected`
                   : placeholder
        }

        const selectedOption = options.find(opt => opt.value === value)
        return selectedOption?.label || value
    }

    // Check if option is selected
    const isOptionSelected = (option) => {
        if (multiple) {
            return Array.isArray(value) && value.includes(option.value)
        }
        return value === option.value
    }

    // Container classes
    const containerClasses = clsx(
        'relative',
        containerClassName
    )

    // Select button classes
    const selectClasses = clsx(
        // Base styles
        'w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800',
        'cursor-pointer text-left',

        // Background and text
        'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',

        // State-based styles
        hasError ? [
            'border-red-300 dark:border-red-600',
            'focus:border-red-500 focus:ring-red-500'
        ] : hasSuccess ? [
            'border-green-300 dark:border-green-600',
            'focus:border-green-500 focus:ring-green-500'
        ] : [
            'border-gray-300 dark:border-gray-600',
            'focus:border-blue-500 focus:ring-blue-500'
        ],

        // Open state
        isOpen && 'ring-2',
        isOpen && !hasError && !hasSuccess && 'ring-blue-500 border-blue-500',

        className
    )

    // Label classes
    const labelClasses = clsx(
        'block text-sm font-medium mb-2',
        hasError ? 'text-red-700 dark:text-red-400' :
        hasSuccess ? 'text-green-700 dark:text-green-400' :
        'text-gray-700 dark:text-gray-300',
        labelClassName
    )

    // Dropdown classes
    const dropdownClasses = clsx(
        'absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base',
        'ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm',
        'border border-gray-200 dark:border-gray-600'
    )

    return (
        <div className={containerClasses}>
            {/* Label */}
            {label && (
                <label className={labelClasses}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Select container */}
            <div className="relative">
                {/* Select button */}
                <button
                    ref={ref}
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={selectClasses}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    {...props}
                >
          <span className={clsx(
              'block truncate',
              (!value || (Array.isArray(value) && value.length === 0)) && 'text-gray-400 dark:text-gray-500'
          )}>
            {getDisplayValue()}
          </span>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            {clearable && value && !disabled && (
                <button
                    onClick={handleClear}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded mr-1"
                >
                    <span className="text-gray-400 hover:text-gray-600">×</span>
                </button>
            )}
                        <ChevronDown className={clsx(
                            'h-5 w-5 text-gray-400 transition-transform duration-200',
                            isOpen && 'transform rotate-180'
                        )} />
          </span>
                </button>

                {/* Success/Error Icons */}
                {(hasError || hasSuccess) && (
                    <div className="absolute inset-y-0 right-8 flex items-center pr-2">
                        {hasError ? (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                        ) : (
                             <CheckCircle2 className="h-5 w-5 text-green-400" />
                         )}
                    </div>
                )}

                {/* Dropdown */}
                {isOpen && (
                    <div className={dropdownClasses}>
                        {/* Search input */}
                        {searchable && (
                            <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-600">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search options..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options list */}
                        <div className="py-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'No options found' : 'No options available'}
                                </div>
                            ) : (
                                 filteredOptions.map((option, index) => {
                                     const selected = isOptionSelected(option)

                                     return (
                                         <button
                                             key={option.value || index}
                                             type="button"
                                             onClick={() => handleOptionSelect(option)}
                                             className={clsx(
                                                 'w-full text-left px-3 py-2 text-sm transition-colors duration-150',
                                                 'flex items-center justify-between',
                                                 selected
                                                 ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                                                 : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                                             )}
                                         >
                                             <div className="flex-1">
                                                 {renderOption ? renderOption(option, selected) : (
                                                     <div>
                                                         <div className="font-medium">{option.label}</div>
                                                         {option.description && (
                                                             <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                 {option.description}
                                                             </div>
                                                         )}
                                                     </div>
                                                 )}
                                             </div>

                                             {selected && (
                                                 <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                             )}
                                         </button>
                                     )
                                 })
                             )}
                        </div>
                    </div>
                )}
            </div>

            {/* Helper text / Error message */}
            {(error || helperText) && (
                <div className="mt-2">
                    {error ? (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            {error}
                        </p>
                    ) : helperText ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {helperText}
                        </p>
                    ) : null}
                </div>
            )}

            {/* Click outside handler */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
})

Select.displayName = 'Select'

export default Select