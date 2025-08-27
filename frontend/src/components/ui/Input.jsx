import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

const Input = forwardRef(({
                              label,
                              type = 'text',
                              error,
                              success,
                              helperText,
                              required = false,
                              disabled = false,
                              placeholder,
                              startIcon,
                              endIcon,
                              className = '',
                              containerClassName = '',
                              labelClassName = '',
                              value,
                              onChange,
                              onBlur,
                              onFocus,
                              ...props
                          }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const isPasswordType = type === 'password'
    const actualType = isPasswordType && showPassword ? 'text' : type
    const hasError = Boolean(error)
    const hasSuccess = Boolean(success)

    const handleFocus = (e) => {
        setIsFocused(true)
        onFocus?.(e)
    }

    const handleBlur = (e) => {
        setIsFocused(false)
        onBlur?.(e)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    // Input styles based on state
    const inputClasses = clsx(
        // Base styles
        'w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',

        // Background and text
        'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',

        // Icon padding
        startIcon && 'pl-10',
        (endIcon || isPasswordType) && 'pr-10',

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

        // Custom classes
        className
    )

    const labelClasses = clsx(
        'block text-sm font-medium mb-2',
        hasError ? 'text-red-700 dark:text-red-400' :
        hasSuccess ? 'text-green-700 dark:text-green-400' :
        'text-gray-700 dark:text-gray-300',
        labelClassName
    )

    return (
        <div className={clsx('w-full', containerClassName)}>
            {/* Label */}
            {label && (
                <label className={labelClasses}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input container */}
            <div className="relative">
                {/* Start Icon */}
                {startIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className={clsx(
                            'h-5 w-5',
                            hasError ? 'text-red-400' :
                            hasSuccess ? 'text-green-400' :
                            isFocused ? 'text-blue-500' : 'text-gray-400'
                        )}>
                            {startIcon}
                        </div>
                    </div>
                )}

                {/* Input field */}
                <input
                    ref={ref}
                    type={actualType}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={inputClasses}
                    aria-invalid={hasError}
                    aria-describedby={
                        error ? `${props.id || 'input'}-error` :
                        helperText ? `${props.id || 'input'}-helper` :
                        undefined
                    }
                    {...props}
                />

                {/* End Icon / Password Toggle */}
                <div className="absolute inset-y-0 right-0 flex items-center">
                    {/* Success/Error Icons */}
                    {(hasError || hasSuccess) && !isPasswordType && (
                        <div className="pr-3">
                            {hasError ? (
                                <AlertCircle className="h-5 w-5 text-red-400" />
                            ) : (
                                 <CheckCircle2 className="h-5 w-5 text-green-400" />
                             )}
                        </div>
                    )}

                    {/* Password Toggle */}
                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="pr-3 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                 <Eye className="h-5 w-5" />
                             )}
                        </button>
                    )}

                    {/* Custom End Icon */}
                    {endIcon && !isPasswordType && !hasError && !hasSuccess && (
                        <div className="pr-3 text-gray-400">
                            {endIcon}
                        </div>
                    )}
                </div>
            </div>

            {/* Helper text / Error message */}
            {(error || helperText) && (
                <div className="mt-2">
                    {error ? (
                        <p
                            id={`${props.id || 'input'}-error`}
                            className="text-sm text-red-600 dark:text-red-400 flex items-center"
                        >
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            {error}
                        </p>
                    ) : helperText ? (
                        <p
                            id={`${props.id || 'input'}-helper`}
                            className="text-sm text-gray-500 dark:text-gray-400"
                        >
                            {helperText}
                        </p>
                    ) : null}
                </div>
            )}
        </div>
    )
})

Input.displayName = 'Input'

// Textarea component
export const Textarea = forwardRef(({
                                        label,
                                        error,
                                        success,
                                        helperText,
                                        required = false,
                                        disabled = false,
                                        placeholder,
                                        rows = 4,
                                        resize = true,
                                        className = '',
                                        containerClassName = '',
                                        labelClassName = '',
                                        value,
                                        onChange,
                                        onBlur,
                                        onFocus,
                                        ...props
                                    }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const hasError = Boolean(error)
    const hasSuccess = Boolean(success)

    const handleFocus = (e) => {
        setIsFocused(true)
        onFocus?.(e)
    }

    const handleBlur = (e) => {
        setIsFocused(false)
        onBlur?.(e)
    }

    const textareaClasses = clsx(
        // Base styles
        'w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',

        // Background and text
        'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',

        // Resize behavior
        resize ? 'resize-y' : 'resize-none',

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

        // Custom classes
        className
    )

    const labelClasses = clsx(
        'block text-sm font-medium mb-2',
        hasError ? 'text-red-700 dark:text-red-400' :
        hasSuccess ? 'text-green-700 dark:text-green-400' :
        'text-gray-700 dark:text-gray-300',
        labelClassName
    )

    return (
        <div className={clsx('w-full', containerClassName)}>
            {/* Label */}
            {label && (
                <label className={labelClasses}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Textarea container */}
            <div className="relative">
        <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            rows={rows}
            className={textareaClasses}
            aria-invalid={hasError}
            aria-describedby={
                error ? `${props.id || 'textarea'}-error` :
                helperText ? `${props.id || 'textarea'}-helper` :
                undefined
            }
            {...props}
        />

                {/* Success/Error Icons */}
                {(hasError || hasSuccess) && (
                    <div className="absolute top-3 right-3">
                        {hasError ? (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                        ) : (
                             <CheckCircle2 className="h-5 w-5 text-green-400" />
                         )}
                    </div>
                )}
            </div>

            {/* Helper text / Error message */}
            {(error || helperText) && (
                <div className="mt-2">
                    {error ? (
                        <p
                            id={`${props.id || 'textarea'}-error`}
                            className="text-sm text-red-600 dark:text-red-400 flex items-center"
                        >
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            {error}
                        </p>
                    ) : helperText ? (
                        <p
                            id={`${props.id || 'textarea'}-helper`}
                            className="text-sm text-gray-500 dark:text-gray-400"
                        >
                            {helperText}
                        </p>
                    ) : null}
                </div>
            )}
        </div>
    )
})

Textarea.displayName = 'Textarea'

export default Input