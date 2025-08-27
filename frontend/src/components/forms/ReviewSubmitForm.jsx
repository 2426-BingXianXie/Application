import React from 'react'
import { CheckCircle, FileText, User, MapPin, Building, Flame, Shield, AlertCircle } from 'lucide-react'

const ReviewSubmitForm = ({
                              formData,
                              errors,
                              permitType
                          }) => {

    const getFieldValue = (path) => {
        const keys = path.split('.')
        let current = formData

        for (const key of keys) {
            if (current && current[key] !== undefined) {
                current = current[key]
            } else {
                return ''
            }
        }

        return current
    }

    const hasErrors = Object.keys(errors).length > 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Review & Submit Application
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Please review your application details before submitting.
                </p>
            </div>

            {/* Error Summary */}
            {hasErrors && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-red-900 dark:text-red-200">
                                    Please Fix Errors Before Submitting
                                </h4>
                                <ul className="text-sm text-red-800 dark:text-red-300 mt-2 space-y-1">
                                    {Object.entries(errors).map(([field, error]) => (
                                        <li key={field}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Application Summary */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Contact Information Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center mb-4">
                            <User className="h-5 w-5 text-gray-400 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Contact Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {getFieldValue('contactInfo.firstName')} {getFieldValue('contactInfo.lastName')}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {getFieldValue('contactInfo.email')}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {getFieldValue('contactInfo.phone')}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Address:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {getFieldValue('contactInfo.address1')}, {getFieldValue('contactInfo.city')}, {getFieldValue('contactInfo.state')} {getFieldValue('contactInfo.zipCode')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Location Information Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center mb-4">
                            <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Property Location
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Property Address:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {getFieldValue('locationInfo.propertyAddress')}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Applicant Type:</span>
                                <p className="font-medium text-gray-900 dark:text-white capitalize">
                                    {getFieldValue('permitInfo.applicantType')}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Property Owner:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {getFieldValue('locationInfo.propertyOwnerName') || 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Parcel ID:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {getFieldValue('locationInfo.parcelId') || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Permit Information Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center mb-4">
                            {permitType === 'building' ? (
                                <Building className="h-5 w-5 text-gray-400 mr-3" />
                            ) : (
                                 <Flame className="h-5 w-5 text-gray-400 mr-3" />
                             )}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {permitType === 'building' ? 'Building' : 'Gas'} Permit Details
                            </h3>
                        </div>

                        {permitType === 'building' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Permit For:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('buildingPermitInfo.permitFor')?.replace('_', ' ') || 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Project Cost:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        ${getFieldValue('buildingPermitInfo.projectCost') ? Number(getFieldValue('buildingPermitInfo.projectCost')).toLocaleString() : '0'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Building Type:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('buildingPermitInfo.buildingType')?.replace('_', ' ') || 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Occupancy Type:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('buildingPermitInfo.occupancyType')?.replace('_', ' ') || 'Not specified'}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-gray-600 dark:text-gray-400">Work Description:</span>
                                    <p className="font-medium text-gray-900 dark:text-white mt-1">
                                        {getFieldValue('buildingPermitInfo.workDescription') || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                 <div>
                                     <span className="text-gray-600 dark:text-gray-400">Work Type:</span>
                                     <p className="font-medium text-gray-900 dark:text-white">
                                         {getFieldValue('gasPermitInfo.workType')?.replace('_', ' ') || 'Not specified'}
                                     </p>
                                 </div>
                                 <div>
                                     <span className="text-gray-600 dark:text-gray-400">Gas Type:</span>
                                     <p className="font-medium text-gray-900 dark:text-white">
                                         {getFieldValue('gasPermitInfo.gasType')?.replace('_', ' ') || 'Not specified'}
                                     </p>
                                 </div>
                                 <div>
                                     <span className="text-gray-600 dark:text-gray-400">Total BTU Input:</span>
                                     <p className="font-medium text-gray-900 dark:text-white">
                                         {getFieldValue('gasPermitInfo.totalBtuInput') || 'Not specified'} BTU
                                     </p>
                                 </div>
                                 <div>
                                     <span className="text-gray-600 dark:text-gray-400">Installation Type:</span>
                                     <p className="font-medium text-gray-900 dark:text-white">
                                         {getFieldValue('gasPermitInfo.installationType') || 'Not specified'}
                                     </p>
                                 </div>
                                 <div className="md:col-span-2">
                                     <span className="text-gray-600 dark:text-gray-400">Work Description:</span>
                                     <p className="font-medium text-gray-900 dark:text-white mt-1">
                                         {getFieldValue('gasPermitInfo.workDescription') || 'Not specified'}
                                     </p>
                                 </div>
                             </div>
                         )}
                    </div>

                    {/* Contractor Information Section */}
                    {getFieldValue('permitInfo.applicantType') === 'contractor' && (
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-4">
                                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Contractor License
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Contractor Name:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('contractorLicense.name') || 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">License Number:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('contractorLicense.licenseNumber') || 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">License Type:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('contractorLicense.licenseType')?.replace('_', ' ') || 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Expiration Date:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('contractorLicense.licenseExpiration') ?
                                         new Date(getFieldValue('contractorLicense.licenseExpiration')).toLocaleDateString() :
                                         'Not specified'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Debris Disposal Section */}
                    {permitType === 'building' && (
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Debris Disposal
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Disposal Location:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('debrisDisposal.dumpsterLocation') || 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Company Name:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {getFieldValue('debrisDisposal.companyName') || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submission Status */}
                <div className="max-w-2xl mx-auto">
                    {!hasErrors ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                                    Application Ready for Submission
                                </h3>
                            </div>

                            <div className="text-sm text-green-800 dark:text-green-300 space-y-2">
                                <p>Your {permitType} permit application is complete and ready to submit.</p>
                                <p>After submission, you will receive:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Email confirmation with permit number</li>
                                    <li>Updates on application review status</li>
                                    <li>Notification when permit is approved or requires changes</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                         <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                             <div className="flex items-center space-x-3 mb-4">
                                 <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                 <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
                                     Application Incomplete
                                 </h3>
                             </div>

                             <div className="text-sm text-amber-800 dark:text-amber-300">
                                 <p>Please complete all required fields and fix any errors before submitting.</p>
                                 <p className="mt-2">You can save your progress as a draft and return later.</p>
                             </div>
                         </div>
                     )}
                </div>

                {/* Terms and Conditions */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Terms and Conditions
                        </h4>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                            <p>By submitting this application, I certify that:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>All information provided is true and accurate to the best of my knowledge</li>
                                <li>I understand that false information may result in permit denial or revocation</li>
                                <li>I will comply with all applicable building codes and regulations</li>
                                <li>I will obtain all required inspections before work completion</li>
                                <li>I understand that work performed without proper permits may be subject to penalties</li>
                            </ul>
                            <p className="mt-3">
                                I acknowledge that submission of this application does not constitute approval
                                and that work may not commence until the permit is officially approved and issued.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-3">
                            What Happens Next?
                        </h4>
                        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-medium">1</div>
                                <span>Application reviewed for completeness</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-medium">2</div>
                                <span>Technical review by qualified staff</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-medium">3</div>
                                <span>Permit issued or additional information requested</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-medium">4</div>
                                <span>Email notification sent with next steps</span>
                            </div>
                        </div>

                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">
                            Average processing time: {permitType === 'building' ? '5-10' : '3-7'} business days
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewSubmitForm