import React from 'react'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import Input from '../ui/Input'

const ContactInfoForm = ({
                             formData,
                             errors,
                             updateField,
                             getFieldValue
                         }) => {

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Please provide your contact information so we can reach you regarding your permit application.
                </p>
            </div>

            {/* Form Fields */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        required
                        value={getFieldValue('contactInfo.firstName')}
                        onChange={(e) => updateField('contactInfo.firstName', e.target.value)}
                        error={errors['contactInfo.firstName']}
                        placeholder="Enter your first name"
                    />

                    <Input
                        label="Last Name"
                        required
                        value={getFieldValue('contactInfo.lastName')}
                        onChange={(e) => updateField('contactInfo.lastName', e.target.value)}
                        error={errors['contactInfo.lastName']}
                        placeholder="Enter your last name"
                    />
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email Address"
                        type="email"
                        required
                        startIcon={<Mail className="h-4 w-4" />}
                        value={getFieldValue('contactInfo.email')}
                        onChange={(e) => updateField('contactInfo.email', e.target.value)}
                        error={errors['contactInfo.email']}
                        placeholder="your.email@example.com"
                        helperText="We'll use this to send permit updates"
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        required
                        startIcon={<Phone className="h-4 w-4" />}
                        value={getFieldValue('contactInfo.phone')}
                        onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                        error={errors['contactInfo.phone']}
                        placeholder="(555) 123-4567"
                        helperText="Include area code"
                    />
                </div>

                {/* Address Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center mb-4">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Mailing Address
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {/* Street Address */}
                        <Input
                            label="Street Address"
                            required
                            value={getFieldValue('contactInfo.address1')}
                            onChange={(e) => updateField('contactInfo.address1', e.target.value)}
                            error={errors['contactInfo.address1']}
                            placeholder="123 Main Street"
                        />

                        {/* Address Line 2 */}
                        <Input
                            label="Address Line 2"
                            value={getFieldValue('contactInfo.address2')}
                            onChange={(e) => updateField('contactInfo.address2', e.target.value)}
                            error={errors['contactInfo.address2']}
                            placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
                        />

                        {/* City, State, ZIP */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="City"
                                required
                                value={getFieldValue('contactInfo.city')}
                                onChange={(e) => updateField('contactInfo.city', e.target.value)}
                                error={errors['contactInfo.city']}
                                placeholder="City name"
                            />

                            <Input
                                label="State"
                                required
                                value={getFieldValue('contactInfo.state')}
                                onChange={(e) => updateField('contactInfo.state', e.target.value)}
                                error={errors['contactInfo.state']}
                                placeholder="MA"
                                helperText="Two-letter code"
                            />

                            <Input
                                label="ZIP Code"
                                required
                                value={getFieldValue('contactInfo.zipCode')}
                                onChange={(e) => updateField('contactInfo.zipCode', e.target.value)}
                                error={errors['contactInfo.zipCode']}
                                placeholder="12345"
                                helperText="5 or 9 digits"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        Important Information
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• All fields marked with (*) are required</li>
                        <li>• Your contact information will be used for permit notifications</li>
                        <li>• We may need to contact you for additional documentation or clarification</li>
                        <li>• Your information is kept confidential and secure</li>
                    </ul>
                </div>

                {/* Data Protection Notice */}
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        By providing your contact information, you agree to receive communications
                        related to your permit application. We protect your privacy and never share
                        your information with third parties.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ContactInfoForm