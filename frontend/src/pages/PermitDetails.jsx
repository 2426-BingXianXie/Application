import React from 'react'
import { useParams } from 'react-router-dom'
import { Building, Zap, Calendar, User, MapPin } from 'lucide-react'

const PermitDetails = () => {
    const { id } = useParams()

    // Mock data - in real app, this would come from usePermit(id)
    const permit = {
        permitId: id,
        permitNumber: `BP${id}`,
        status: 'UNDER_REVIEW',
        permitType: 'building',
        contactInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '(555) 123-4567'
        },
        submissionDate: '2024-01-15',
        projectCost: 75000
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Permit Details - {permit.permitNumber}
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {permit.contactInfo.firstName} {permit.contactInfo.lastName}</p>
                            <p><strong>Email:</strong> {permit.contactInfo.email}</p>
                            <p><strong>Phone:</strong> {permit.contactInfo.phone}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Permit Information</h3>
                        <div className="space-y-2">
                            <p><strong>Status:</strong> {permit.status}</p>
                            <p><strong>Submitted:</strong> {permit.submissionDate}</p>
                            <p><strong>Project Cost:</strong> ${permit.projectCost?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PermitDetails