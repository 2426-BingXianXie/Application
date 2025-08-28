import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building, Mail, Lock, LogIn, Eye, EyeOff, User, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { VALIDATION_PATTERNS, REGISTRATION_ALLOWED_ROLES, USER_ROLE_LABELS } from '../utils/constants'

// Utility functions for validation and formatting
const validateEmail = (email) => {
    return VALIDATION_PATTERNS.EMAIL.test(email)
}

const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '')

    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})/)
    if (match) {
        let formatted = match[1]
        if (match[2]) {
            formatted = `(${match[1]}) ${match[2]}`
        }
        if (match[3]) {
            formatted = `(${match[1]}) ${match[2]}-${match[3]}`
        }
        return formatted
    }
    return value
}

const Register = () => {
    const navigate = useNavigate()
    const { register } = useAuth()
    const { showSuccess, showError } = useNotifications()

    // Form state
    const [formData, setFormData] = useState({
                                                 firstName: '',
                                                 lastName: '',
                                                 email: '',
                                                 phone: '',
                                                 password: '',
                                                 confirmPassword: '',
                                                 role: 'APPLICANT', // Default to applicant (restricted registration)
                                                 agreeToTerms: false
                                             })

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Role options for registration (restricted to applicants and contractors)
    const roleOptions = REGISTRATION_ALLOWED_ROLES.map(role => ({
        value: role,
        label: USER_ROLE_LABELS[role]
    }))

    const validateForm = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
        } else if (!VALIDATION_PATTERNS.PHONE.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        try {
            const result = await register({
                                              firstName: formData.firstName,
                                              lastName: formData.lastName,
                                              email: formData.email,
                                              phone: formData.phone,
                                              password: formData.password,
                                              role: formData.role // Include role in registration
                                          })

            if (result.success) {
                showSuccess('Account created successfully! Welcome to the permit management system.')
                navigate('/dashboard')
            } else {
                showError(result.error || 'Registration failed. Please try again.')
            }
        } catch (err) {
            showError(err.message || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const updateField = (field, value) => {
        if (field === 'phone') {
            value = formatPhoneNumber(value)
        }

        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            PermitPro
                        </h1>
                    </div>
                </div>

                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => updateField('firstName', e.target.value)}
                                error={errors.firstName}
                                required
                                autoComplete="given-name"
                                placeholder="John"
                            />

                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => updateField('lastName', e.target.value)}
                                error={errors.lastName}
                                required
                                autoComplete="family-name"
                                placeholder="Doe"
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            error={errors.email}
                            required
                            autoComplete="email"
                            startIcon={<Mail className="w-4 h-4" />}
                            placeholder="your.email@example.com"
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            error={errors.phone}
                            required
                            autoComplete="tel"
                            startIcon={<Phone className="w-4 h-4" />}
                            placeholder="(555) 123-4567"
                        />

                        {/* Role Selection - Limited to Applicant and Contractor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                I am registering as
                            </label>
                            <div className="space-y-2">
                                {roleOptions.map(option => (
                                    <label key={option.value} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="role"
                                            value={option.value}
                                            checked={formData.role === option.value}
                                            onChange={(e) => updateField('role', e.target.value)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {formData.role === 'CONTRACTOR' && (
                                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                                    As a contractor, you'll be able to submit permits on behalf of clients and manage contractor information.
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => updateField('password', e.target.value)}
                                error={errors.password}
                                required
                                autoComplete="new-password"
                                startIcon={<Lock className="w-4 h-4" />}
                                helperText="Must be at least 8 characters"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => updateField('confirmPassword', e.target.value)}
                                error={errors.confirmPassword}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="agree-terms"
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) => updateField('agreeToTerms', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                            />
                            <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-900 dark:text-white">
                                I agree to the{' '}
                                <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            loading={isLoading}
                            startIcon={<LogIn className="w-5 h-5" />}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Registration Information */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                            Registration Information
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                            <li>• Registration is limited to applicants and contractors</li>
                            <li>• Administrator accounts are created by existing administrators</li>
                            <li>• All accounts require email verification</li>
                            <li>• You can update your profile information after registration</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Register