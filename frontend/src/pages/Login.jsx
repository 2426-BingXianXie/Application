import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Mail, Lock, Building } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { validateEmail } from '../utils/validators'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showSuccess, showError } = useNotifications()

  const [formData, setFormData] = useState({
                                             email: '',
                                             password: '',
                                             rememberMe: false
                                           })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const from = location.state?.from?.pathname || '/dashboard'

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else {
      const emailError = validateEmail(formData.email)
      if (emailError) {
        newErrors.email = emailError
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    console.log('Attempting login...')

    try {
      const result = await login({
                                   email: formData.email,
                                   password: formData.password,
                                   rememberMe: formData.rememberMe
                                 })

      console.log('Login result:', result)

      if (result.success) {
        showSuccess('Welcome back!')
        navigate(from, { replace: true })
      } else {
        showError(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      showError(err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field, value) => {
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                  startIcon={<Lock className="w-4 h-4" />}
                  placeholder="Enter your password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                      id="remember-me"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => updateField('rememberMe', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900 dark:text-white">
                    Remember me
                  </label>
                </div>

                <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                  startIcon={<LogIn className="w-5 h-5" />}
              >
                Sign In
              </Button>
            </form>
          </Card>
        </div>
      </div>
  )
}

export default Login