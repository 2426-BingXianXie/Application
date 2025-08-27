import React, { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

// Button variants and sizes
const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-sm',
    info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 shadow-sm',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700',
    link: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline focus:ring-blue-500'
}

const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
}

const Button = forwardRef(({
                               children,
                               variant = 'primary',
                               size = 'md',
                               loading = false,
                               disabled = false,
                               fullWidth = false,
                               startIcon = null,
                               endIcon = null,
                               className = '',
                               type = 'button',
                               onClick,
                               ...props
                           }, ref) => {
    const isDisabled = disabled || loading

    const buttonClasses = clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Variant styles
        variants[variant],

        // Size styles
        sizes[size],

        // Full width
        fullWidth && 'w-full',

        // Custom classes
        className
    )

    const handleClick = (e) => {
        if (!isDisabled && onClick) {
            onClick(e)
        }
    }

    return (
        <button
            ref={ref}
            type={type}
            className={buttonClasses}
            disabled={isDisabled}
            onClick={handleClick}
            {...props}
        >
            {/* Start Icon */}
            {startIcon && !loading && (
                <span className={clsx(
                    'flex-shrink-0',
                    children ? 'mr-2' : ''
                )}>
          {startIcon}
        </span>
            )}

            {/* Loading Spinner */}
            {loading && (
                <Loader2 className={clsx(
                    'animate-spin flex-shrink-0',
                    children ? 'mr-2' : '',
                    size === 'xs' ? 'h-3 w-3' :
                    size === 'sm' ? 'h-4 w-4' :
                    size === 'lg' ? 'h-5 w-5' :
                    size === 'xl' ? 'h-6 w-6' : 'h-4 w-4'
                )} />
            )}

            {/* Button text */}
            {children && (
                <span className={loading ? 'opacity-75' : ''}>
          {children}
        </span>
            )}

            {/* End Icon */}
            {endIcon && !loading && (
                <span className={clsx(
                    'flex-shrink-0',
                    children ? 'ml-2' : ''
                )}>
          {endIcon}
        </span>
            )}
        </button>
    )
})

Button.displayName = 'Button'

// Button group component for related actions
export const ButtonGroup = ({ children, className = '', orientation = 'horizontal' }) => {
    return (
        <div className={clsx(
            'inline-flex',
            orientation === 'horizontal' ? 'flex-row' : 'flex-col',
            '[&>button]:rounded-none',
            '[&>button:first-child]:rounded-l-md',
            '[&>button:last-child]:rounded-r-md',
            orientation === 'vertical' && '[&>button:first-child]:rounded-t-md [&>button:first-child]:rounded-l-none',
            orientation === 'vertical' && '[&>button:last-child]:rounded-b-md [&>button:last-child]:rounded-r-none',
            '[&>button:not(:first-child)]:border-l-0',
            orientation === 'vertical' && '[&>button:not(:first-child)]:border-l [&>button:not(:first-child)]:border-t-0',
            className
        )}>
            {children}
        </div>
    )
}

// Icon button component
export const IconButton = forwardRef(({
                                          icon: Icon,
                                          variant = 'ghost',
                                          size = 'md',
                                          'aria-label': ariaLabel,
                                          title,
                                          ...props
                                      }, ref) => {
    const iconSizes = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-7 w-7'
    }

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            aria-label={ariaLabel || title}
            title={title}
            {...props}
        >
            <Icon className={iconSizes[size]} />
        </Button>
    )
})

IconButton.displayName = 'IconButton'

// Floating action button
export const FloatingActionButton = forwardRef(({
                                                    icon: Icon,
                                                    className = '',
                                                    ...props
                                                }, ref) => {
    return (
        <Button
            ref={ref}
            variant="primary"
            size="lg"
            className={clsx(
                'fixed bottom-6 right-6 z-40 rounded-full shadow-lg hover:shadow-xl transition-shadow',
                'w-14 h-14 p-0',
                className
            )}
            {...props}
        >
            <Icon className="h-6 w-6" />
        </Button>
    )
})

FloatingActionButton.displayName = 'FloatingActionButton'

export default Button