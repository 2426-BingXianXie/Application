import React, { forwardRef, useState } from 'react'
import { clsx } from 'clsx'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

const Input = forwardRef(({
                              label,
                              type = 'text',
                              placeholder,
                              value,
                              onChange,
                              onBlur,
                              error,
                              success,
                              helperText,
                              required = false,
                              disabled = false,
                              readOnly = false,
                              startIcon,
                              endIcon,
                              className = '',
                              inputClassName = '',
                              size = 'md',
                              variant = 'default',
                              autoComplete,
                              maxLength,
                              pattern,
                              min,
                              max,
                              step,
                              ...props
                          }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    }

    const variants = {
        default: 'border-gray-300 dark:border-gray-600',
        filled: 'border-0 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600'
    }

    const inputClasses = clsx(
        'block w-full rounded-md shadow-sm transition-all duration-200',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
        'placeholder-gray-500 dark:placeholder-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        variants[variant],
        sizes[size],
        {
            'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500': error,
            'border-green-500 dark:border-green-400 focus:ring-green-500 focus:border-green-500': success,
            'opacity-50 cursor-not-allowed': disabled,
            'cursor-default': readOnly,
            'pl-10': startIcon,
            'pr-10': endIcon || isPassword,
        },
        inputClassName
    )

    const handleChange = (e) => {
        if (onChange) {
            onChange(e)
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = (e) => {
        setIsFocused(false)
        if (onBlur) {
            onBlur(e)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className={clsx('space-y-1', className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {startIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">{startIcon}</span>
                    </div>
                )}

                <input
                    ref={ref}
                    type={inputType}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={inputClasses}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    pattern={pattern}
                    min={min}
                    max={max}
                    step={step}
                    {...props}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                             <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                         )}
                    </button>
                )}

                {/* End Icon */}
                {endIcon && !isPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">{endIcon}</span>
                    </div>
                )}

                {/* Status Icons */}
                {error && !endIcon && !isPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                )}

                {success && !endIcon && !isPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CheckCircle className="h-4 w-4 text-green-500" />
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

Input.displayName = 'Input'

export default Input