import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, CheckCircle, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Register = () => {
    const [formData, setFormData] = useState({
                                                 firstName: '',
                                                 lastName: '',
                                                 email: '',
                                                 phone: '',
                                                 password: '',
                                                 confirmPassword: '',
                                                 agreeToTerms: false,
                                                 accountType: 'applicant',
                                             })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [passwordStrength, setPasswordStrength] = useState({
                                                                 score: 0,
                                                                 feedback: []
                                                             })

    const { isLoading } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const newValue = type === 'checkbox' ? checked : value

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }))

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        // Check password strength
        if (name === 'password') {
            checkPasswordStrength(newValue)
        }
    }

    const checkPasswordStrength = (password) => {
        const feedback = []
        let score = 0

        if (password.length >= 8) {
            score += 1
        } else {
            feedback.push('At least 8 characters')
        }

        if (/[a-z]/.test(password)) {
            score += 1
        } else {
            feedback.push('Include lowercase letters')
        }

        if (/[A-Z]/.test(password)) {
            score += 1
        } else {
            feedback.push('Include uppercase letters')
        }

        if (/\d/.test(password)) {
            score += 1
        } else {
            feedback.push('Include numbers')
        }

        if (/[^a-zA-Z\d]/.test(password)) {
            score += 1
        } else {
            feedback.push('Include special characters')
        }

        setPasswordStrength({ score, feedback })
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required'
        } else if (!/^[\+]?[1-9]?[0-9]{7,15}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (passwordStrength.score < 3) {
            newErrors.password = 'Password is too weak'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms of service'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            // In real app, this would call registration API
            console.log('Registering user:', formData)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            navigate('/login', {
                state: { message: 'Account created successfully! Please sign in.' }
            })
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score <= 2) return 'bg-red-500'
        if (passwordStrength.score <= 3) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength.score <= 2) return 'Weak'
        if (passwordStrength.score <= 3) return 'Medium'
        return 'Strong'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-white font-bold text-xl">PMS</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Join the permit management system
                    </p>
                </div>

                {/* Registration Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="form-label">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                                    placeholder="First name"
                                />
                                {errors.firstName && (
                                    <p className="form-error">{errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                                    placeholder="Last name"
                                />
                                {errors.lastName && (
                                    <p className="form-error">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Enter your email address"
                            />
                            {errors.email && (
                                <p className="form-error">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="form-label">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                                placeholder="(555) 123-4567"
                            />
                            {errors.phone && (
                                <p className="form-error">{errors.phone}</p>
                            )}
                        </div>

                        {/* Account Type */}
                        <div>
                            <label htmlFor="accountType" className="form-label">
                                Account Type
                            </label>
                            <select
                                id="accountType"
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="applicant">Property Owner/Applicant</option>
                                <option value="contractor">Licensed Contractor</option>
                                <option value="agent">Authorized Agent</option>
                            </select>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                         <Eye className="h-4 w-4 text-gray-400" />
                                     )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                            <div
                                                className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                      {getPasswordStrengthText()}
                    </span>
                                    </div>

                                    {passwordStrength.feedback.length > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Suggestions: {passwordStrength.feedback.join(', ')}
                                        </div>
                                    )}
                                </div>
                            )}

                            {errors.password && (
                                <p className="form-error">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`form-input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                         <Eye className="h-4 w-4 text-gray-400" />
                                     )}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {formData.confirmPassword && (
                                <div className="mt-1 flex items-center space-x-1">
                                    {formData.password === formData.confirmPassword ? (
                                        <>
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            <span className="text-xs text-green-600">Passwords match</span>
                                        </>
                                    ) : (
                                         <>
                                             <X className="w-3 h-3 text-red-500" />
                                             <span className="text-xs text-red-600">Passwords don't match</span>
                                         </>
                                     )}
                                </div>
                            )}

                            {errors.confirmPassword && (
                                <p className="form-error">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Terms Agreement */}
                    <div>
                        <div className="flex items-start">
                            <input
                                id="agreeToTerms"
                                name="agreeToTerms"
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className={`form-checkbox mt-1 ${errors.agreeToTerms ? 'border-red-500' : ''}`}
                            />
                            <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                I agree to the{' '}
                                <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="form-error">{errors.agreeToTerms}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.agreeToTerms}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" color="white" />
                            ) : (
                                 <>
                                     <UserPlus className="w-4 h-4 mr-2" />
                                     Create Account
                                 </>
                             )}
                        </button>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Account Type Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                        Account Types
                    </h3>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <li><strong>Property Owner:</strong> Apply for permits for your own property</li>
                        <li><strong>Licensed Contractor:</strong> Apply for permits on behalf of clients</li>
                        <li><strong>Authorized Agent:</strong> Apply for permits as an authorized representative</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Register