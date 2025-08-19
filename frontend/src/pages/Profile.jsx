import React from 'react'
import { User } from 'lucide-react'

const Profile = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Profile</h2>
                        <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
                    </div>
                </div>

                <div className="text-center text-gray-500 dark:text-gray-400">
                    Profile management coming soon...
                </div>
            </div>
        </div>
    )
}

export default Profile