import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Validation schema
const contactSchema = yup.object({
                                     firstName: yup.string().required('First name is required').max(50, 'First name must not exceed 50 characters'),
                                     lastName: yup.string().required('Last name is required').max(50, 'Last name must not exceed 50 characters'),
                                     email: yup.string().required('Email is required').email('Invalid email format').max(100, 'Email must not exceed 100 characters'),
                                     phone: yup.string().required('Phone number is required').matches(/^[\+]?[1-9]?[0-9]{7,15}$/, 'Invalid phone number format'),
                                     address1: yup.string().required('Address is required').max(200, 'Address must not exceed 200 characters'),
                                     address2: yup.string().max(200, 'Address 2 must not exceed 200 characters'),
                                     city: yup.string().required('City is required').max(100, 'City must not exceed 100 characters'),
                                     state: yup.string().required('State is required').length(2, 'State must be 2 characters'),
                                     zipCode: yup.string().required('ZIP code is required').matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Invalid ZIP code format'),
                                 })

const ContactInfoForm = ({ data = {}, onChange }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
                    resolver: yupResolver(contactSchema),
                    defaultValues: data,
                    mode: 'onChange'
                })

    // Watch all form fields to trigger onChange
    const watchedFields = watch()

    React.useEffect(() => {
        onChange && onChange(watchedFields)
    }, [watchedFields, onChange])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Please provide your contact information for this permit application.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label className="form-label">
                        First Name *
                    </label>
                    <input
                        {...register('firstName')}
                        type="text"
                        className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                        <p className="form-error">{errors.firstName.message}</p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <label className="form-label">
                        Last Name *
                    </label>
                    <input
                        {...register('lastName')}
                        type="text"
                        className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                        <p className="form-error">{errors.lastName.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="form-label">
                        Email Address *
                    </label>
                    <input
                        {...register('email')}
                        type="email"
                        className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email address"
                    />
                    {errors.email && (
                        <p className="form-error">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="form-label">
                        Phone Number *
                    </label>
                    <input
                        {...register('phone')}
                        type="tel"
                        className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                        <p className="form-error">{errors.phone.message}</p>
                    )}
                </div>

                {/* Address 1 */}
                <div>
                    <label className="form-label">
                        Address Line 1 *
                    </label>
                    <input
                        {...register('address1')}
                        type="text"
                        className={`form-input ${errors.address1 ? 'border-red-500' : ''}`}
                        placeholder="Street address"
                    />
                    {errors.address1 && (
                        <p className="form-error">{errors.address1.message}</p>
                    )}
                </div>

                {/* Address 2 */}
                <div>
                    <label className="form-label">
                        Address Line 2
                    </label>
                    <input
                        {...register('address2')}
                        type="text"
                        className={`form-input ${errors.address2 ? 'border-red-500' : ''}`}
                        placeholder="Apartment, suite, etc. (optional)"
                    />
                    {errors.address2 && (
                        <p className="form-error">{errors.address2.message}</p>
                    )}
                </div>

                {/* City */}
                <div>
                    <label className="form-label">
                        City *
                    </label>
                    <input
                        {...register('city')}
                        type="text"
                        className={`form-input ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="Enter city"
                    />
                    {errors.city && (
                        <p className="form-error">{errors.city.message}</p>
                    )}
                </div>

                {/* State */}
                <div>
                    <label className="form-label">
                        State *
                    </label>
                    <select
                        {...register('state')}
                        className={`form-select ${errors.state ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select State</option>
                        <option value="MA">Massachusetts</option>
                        <option value="CT">Connecticut</option>
                        <option value="RI">Rhode Island</option>
                        <option value="NH">New Hampshire</option>
                        <option value="VT">Vermont</option>
                        <option value="ME">Maine</option>
                    </select>
                    {errors.state && (
                        <p className="form-error">{errors.state.message}</p>
                    )}
                </div>

                {/* ZIP Code */}
                <div>
                    <label className="form-label">
                        ZIP Code *
                    </label>
                    <input
                        {...register('zipCode')}
                        type="text"
                        className={`form-input ${errors.zipCode ? 'border-red-500' : ''}`}
                        placeholder="12345 or 12345-6789"
                    />
                    {errors.zipCode && (
                        <p className="form-error">{errors.zipCode.message}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContactInfoForm