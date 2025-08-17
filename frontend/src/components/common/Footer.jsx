import React from 'react'
import { ExternalLink, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        resources: [
            { name: 'API Documentation', href: import.meta.env.VITE_SWAGGER_URL, external: true },
            { name: 'Database Console', href: import.meta.env.VITE_H2_CONSOLE_URL, external: true },
            { name: 'Help Center', href: '/help' },
            { name: 'User Guide', href: '/guide' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'Accessibility', href: '/accessibility' },
        ],
        permits: [
            { name: 'Building Permits', href: '/building-permits' },
            { name: 'Gas Permits', href: '/gas-permits' },
            { name: 'Application Guide', href: '/guide' },
            { name: 'Fee Schedule', href: '/fees' },
        ]
    }

    const contactInfo = {
        email: 'permits@cityname.gov',
        phone: '(555) 123-4567',
        address: '123 City Hall Ave, City, State 12345'
    }

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-8 lg:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {/* Company/System Info */}
                        <div className="col-span-1 lg:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PMS</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                  Permit System
                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Streamlining the permit application process with modern technology
                                for faster, more efficient service.
                            </p>

                            {/* Contact Information */}
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <a
                                        href={`mailto:${contactInfo.email}`}
                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {contactInfo.email}
                                    </a>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <a
                                        href={`tel:${contactInfo.phone}`}
                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {contactInfo.phone}
                                    </a>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    <span>{contactInfo.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Permits */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Permits
                            </h3>
                            <ul className="space-y-2">
                                {footerLinks.permits.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Resources
                            </h3>
                            <ul className="space-y-2">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            target={link.external ? '_blank' : undefined}
                                            rel={link.external ? 'noopener noreferrer' : undefined}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center"
                                        >
                                            {link.name}
                                            {link.external && (
                                                <ExternalLink className="w-3 h-3 ml-1" />
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Legal
                            </h3>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">

                        {/* Copyright */}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            © {currentYear} {import.meta.env.VITE_APP_NAME}. All rights reserved.
                        </div>

                        {/* System Status & Version */}
                        <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>System Online</span>
                            </div>
                            <div>
                                v{import.meta.env.VITE_APP_VERSION}
                            </div>
                            <div>
                                {import.meta.env.VITE_APP_ENVIRONMENT}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer