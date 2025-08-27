export const Register = () => {
    const navigate = useNavigate()
    const { register } = useAuth()
    const { success, error } = useToast()

    const [formData, setFormData] = useState({
                                                 firstName: '',
                                                 lastName: '',
                                                 email: '',
                                                 phone: '',
                                                 password: '',
                                                 confirmPassword: '',
                                                 agreeToTerms: false
                                             })

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'

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
            await register({
                               firstName: formData.firstName,
                               lastName: formData.lastName,
                               email: formData.email,
                               phone: formData.phone,
                               password: formData.password
                           })
            success('Account created successfully! Please check your email to verify your account.')
            navigate('/login')
        } catch (err) {
            error(err.message || 'Registration failed. Please try again.')
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
                            placeholder="(555) 123-4567"
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => updateField('password', e.target.value)}
                            error={errors.password}
                            required
                            autoComplete="new-password"
                            startIcon={<Lock className="w-4 h-4" />}
                            helperText="Must be at least 8 characters"
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateField('confirmPassword', e.target.value)}
                            error={errors.confirmPassword}
                            required
                            autoComplete="new-password"
                        />

                        <div className="flex items-start">
                            <input
                                id="agree-terms"
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) => updateField('agreeToTerms', e.target.checked)}
                                className="form-checkbox mt-1"
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
                </Card>
            </div>
        </div>
    )
}

export default Login