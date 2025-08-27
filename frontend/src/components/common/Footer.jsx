import React from 'react'
import { Link } from 'react-router-dom'
import {
    Building,
    Mail,
    Phone,
    ExternalLink,
    Heart,
    Shield,
    FileText,
    HelpCircle
} from 'lucide-react'
import { APP_INFO, EXTERNAL_URLS, ROUTES } from '../../utils/constants'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        product: [
            { name: 'Dashboard', href: ROUTES.DASHBOARD },
            { name: 'Apply for Permit', href: ROUTES.APPLY },
            { name: 'Building Permits', href: ROUTES.BUILDING_PERMITS },
            { name: 'Gas Permits', href: ROUTES.GAS_PERMITS },
            { name: 'Reports', href: ROUTES.REPORTS }
        ],
        support: [
            { name: 'Help Center', href: ROUTES.HELP },
            { name: 'Contact Support', href: ROUTES.CONTACT },
            { name: 'Fee Schedule', href: EXTERNAL_URLS.FEE_SCHEDULE, external: true },
            { name: 'Building Codes', href: EXTERNAL_URLS.BUILDING_CODES, external: true }
        ],
        legal: [
            { name: 'Terms of Service', href: ROUTES.TERMS },
            { name: 'Privacy Policy', href: ROUTES.PRIVACY },
            { name: 'Municipality Website', href: EXTERNAL_URLS.MUNICIPALITY_WEBSITE, external: true }
        ]
    }

    const renderLinkGroup = (title, links) => (
        <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {title}
            </h3>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.name}>
                        {link.external ? (
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center"
                            >
                                {link.name}
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        ) : (
                             <Link
                                 to={link.href}
                                 className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                             >
                                 {link.name}
                             </Link>
                         )}
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main footer content */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Building className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {APP_INFO.NAME}
                                </h2>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                {APP_INFO.DESCRIPTION} - Streamlining the permit application process
                                for contractors, property owners, and municipal staff.
                            </p>

                            {/* Contact Information */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail className="w-4 h-4" />
                                    <a
                                        href={EXTERNAL_URLS.SUPPORT_EMAIL}
                                        className="hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {APP_INFO.SUPPORT_EMAIL}
                                    </a>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Phone className="w-4 h-4" />
                                    <a
                                        href={EXTERNAL_URLS.SUPPORT_PHONE}
                                        className="hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {APP_INFO.SUPPORT_PHONE}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Product Links */}
                        {renderLinkGroup('Product', footerLinks.product)}

                        {/* Support Links */}
                        {renderLinkGroup('Support', footerLinks.support)}

                        {/* Legal Links */}
                        {renderLinkGroup('Legal', footerLinks.legal)}
                    </div>
                </div>

                {/* Bottom section */}
                <div className="py-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                            <span>© {currentYear} {APP_INFO.COMPANY}. All rights reserved.</span>
                            <Heart className="w-3 h-3 text-red-500 mx-1" />
                            <span>Made for our community</span>
                        </div>

                        {/* Security & Compliance */}
                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span>SSL Secured</span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span>GDPR Compliant</span>
                            </div>

                            <div className="text-xs">
                                v{APP_INFO.VERSION}
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Bar */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-500 space-y-2 sm:space-y-0">
                            <p>
                                This system is for official permit applications only.
                                For emergencies, call your local emergency services.
                            </p>

                            <div className="flex items-center space-x-4">
                                <span>Server Status: </span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-600 dark:text-green-400">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer