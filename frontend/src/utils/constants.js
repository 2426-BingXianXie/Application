// Application name and version
export const APP_INFO = {
    name: 'Permit Management System',
    version: '1.0.0',
    description: 'Municipal permit management and tracking system'
}

// API Configuration
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    timeout: 10000
}

// Route constants
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    APPLY: '/apply',
    BUILDING_PERMITS: '/building-permits',
    GAS_PERMITS: '/gas-permits',
    PERMITS: '/permits',
    PERMIT_DETAILS: '/permit/:id',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    REPORTS: '/reports',
    LOGIN: '/login',
    REGISTER: '/register',
    HELP: '/help',
    CONTACT: '/contact',
    TERMS: '/terms',
    PRIVACY: '/privacy'
}

// Permit statuses
export const PERMIT_STATUS = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED'
}

// Permit status labels
export const PERMIT_STATUS_LABELS = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    EXPIRED: 'Expired',
    CANCELLED: 'Cancelled'
}

// Applicant types
export const APPLICANT_TYPE = {
    OWNER: 'OWNER',
    CONTRACTOR: 'CONTRACTOR',
    ARCHITECT: 'ARCHITECT',
    ENGINEER: 'ENGINEER',
    OTHER: 'OTHER'
}

// Applicant type labels
export const APPLICANT_TYPE_LABELS = {
    OWNER: 'Property Owner',
    CONTRACTOR: 'Contractor',
    ARCHITECT: 'Architect',
    ENGINEER: 'Engineer',
    OTHER: 'Other'
}

// Building types
export const BUILDING_TYPE = {
    RESIDENTIAL: 'RESIDENTIAL',
    COMMERCIAL: 'COMMERCIAL',
    INDUSTRIAL: 'INDUSTRIAL',
    MIXED_USE: 'MIXED_USE',
    INSTITUTIONAL: 'INSTITUTIONAL'
}

// Building type labels
export const BUILDING_TYPE_LABELS = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    INDUSTRIAL: 'Industrial',
    MIXED_USE: 'Mixed Use',
    INSTITUTIONAL: 'Institutional'
}

// Occupancy types
export const OCCUPANCY_TYPE = {
    SINGLE_FAMILY: 'SINGLE_FAMILY',
    MULTI_FAMILY: 'MULTI_FAMILY',
    OFFICE: 'OFFICE',
    RETAIL: 'RETAIL',
    WAREHOUSE: 'WAREHOUSE',
    MANUFACTURING: 'MANUFACTURING',
    MIXED: 'MIXED'
}

// Occupancy type labels
export const OCCUPANCY_TYPE_LABELS = {
    SINGLE_FAMILY: 'Single Family',
    MULTI_FAMILY: 'Multi Family',
    OFFICE: 'Office',
    RETAIL: 'Retail',
    WAREHOUSE: 'Warehouse',
    MANUFACTURING: 'Manufacturing',
    MIXED: 'Mixed Use'
}

// Zoning classifications
export const ZONING_CLASSIFICATION = {
    RESIDENTIAL: 'RESIDENTIAL',
    COMMERCIAL: 'COMMERCIAL',
    INDUSTRIAL: 'INDUSTRIAL',
    MIXED: 'MIXED',
    AGRICULTURAL: 'AGRICULTURAL',
    INSTITUTIONAL: 'INSTITUTIONAL'
}

// Zoning classification labels
export const ZONING_CLASSIFICATION_LABELS = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    INDUSTRIAL: 'Industrial',
    MIXED: 'Mixed Use',
    AGRICULTURAL: 'Agricultural',
    INSTITUTIONAL: 'Institutional'
}

// Building Permit Types (enhanced list)
export const BUILDING_PERMIT_TYPE = {
    NEW_CONSTRUCTION: 'NEW_CONSTRUCTION',
    ADDITION: 'ADDITION',
    ALTERATION: 'ALTERATION',
    RENOVATION: 'RENOVATION',
    MAJOR_RENOVATION: 'MAJOR_RENOVATION',
    REPAIR: 'REPAIR',
    DEMOLITION: 'DEMOLITION',
    DECK_PATIO: 'DECK_PATIO',
    FENCE: 'FENCE',
    ROOFING: 'ROOFING',
    SIDING: 'SIDING',
    WINDOWS_DOORS: 'WINDOWS_DOORS',
    HVAC: 'HVAC',
    PLUMBING: 'PLUMBING',
    ELECTRICAL: 'ELECTRICAL',
    ACCESSORY_STRUCTURE: 'ACCESSORY_STRUCTURE'
}

// Building permit type labels
export const BUILDING_PERMIT_TYPE_LABELS = {
    NEW_CONSTRUCTION: 'New Construction',
    ADDITION: 'Addition',
    ALTERATION: 'Alteration',
    RENOVATION: 'Renovation',
    MAJOR_RENOVATION: 'Major Renovation',
    REPAIR: 'Repair',
    DEMOLITION: 'Demolition',
    DECK_PATIO: 'Deck/Patio',
    FENCE: 'Fence',
    ROOFING: 'Roofing',
    SIDING: 'Siding',
    WINDOWS_DOORS: 'Windows/Doors',
    HVAC: 'HVAC',
    PLUMBING: 'Plumbing',
    ELECTRICAL: 'Electrical',
    ACCESSORY_STRUCTURE: 'Accessory Structure'
}

// Gas work types
export const GAS_WORK_TYPE = {
    NEW_INSTALLATION: 'NEW_INSTALLATION',
    REPAIR: 'REPAIR',
    MODIFICATION: 'MODIFICATION',
    REPLACEMENT: 'REPLACEMENT',
    INSPECTION: 'INSPECTION',
    EMERGENCY: 'EMERGENCY'
}

// Gas work type labels
export const GAS_WORK_TYPE_LABELS = {
    NEW_INSTALLATION: 'New Installation',
    REPAIR: 'Repair',
    MODIFICATION: 'Modification',
    REPLACEMENT: 'Replacement',
    INSPECTION: 'Inspection',
    EMERGENCY: 'Emergency Work'
}

// Gas types
export const GAS_TYPE = {
    NATURAL_GAS: 'NATURAL_GAS',
    PROPANE: 'PROPANE',
    LPG: 'LPG',
    OTHER: 'OTHER'
}

// Gas type labels
export const GAS_TYPE_LABELS = {
    NATURAL_GAS: 'Natural Gas',
    PROPANE: 'Propane',
    LPG: 'Liquefied Petroleum Gas (LPG)',
    OTHER: 'Other'
}

// Installation types for gas permits
export const GAS_INSTALLATION_TYPE = {
    RESIDENTIAL: 'RESIDENTIAL',
    COMMERCIAL: 'COMMERCIAL',
    INDUSTRIAL: 'INDUSTRIAL',
    INSTITUTIONAL: 'INSTITUTIONAL'
}

// Gas installation type labels
export const GAS_INSTALLATION_TYPE_LABELS = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    INDUSTRIAL: 'Industrial',
    INSTITUTIONAL: 'Institutional'
}

// License types
export const LICENSE_TYPE = {
    GENERAL_CONTRACTOR: 'GENERAL_CONTRACTOR',
    ELECTRICAL: 'ELECTRICAL',
    PLUMBING: 'PLUMBING',
    HVAC: 'HVAC',
    GAS_FITTING: 'GAS_FITTING',
    DEMOLITION: 'DEMOLITION',
    ROOFING: 'ROOFING',
    OTHER: 'OTHER'
}

// License type labels
export const LICENSE_TYPE_LABELS = {
    GENERAL_CONTRACTOR: 'General Contractor',
    ELECTRICAL: 'Electrical',
    PLUMBING: 'Plumbing',
    HVAC: 'HVAC',
    GAS_FITTING: 'Gas Fitting',
    DEMOLITION: 'Demolition',
    ROOFING: 'Roofing',
    OTHER: 'Other'
}

// Disposal methods
export const DISPOSAL_METHOD = {
    DUMPSTER: 'DUMPSTER',
    TRUCK_HAUL: 'TRUCK_HAUL',
    ON_SITE: 'ON_SITE',
    RECYCLING: 'RECYCLING',
    OTHER: 'OTHER'
}

// Disposal method labels
export const DISPOSAL_METHOD_LABELS = {
    DUMPSTER: 'Dumpster',
    TRUCK_HAUL: 'Truck Haul Away',
    ON_SITE: 'On-Site Processing',
    RECYCLING: 'Recycling Center',
    OTHER: 'Other Method'
}

// Debris types
export const DEBRIS_TYPE = {
    CONSTRUCTION: 'CONSTRUCTION',
    DEMOLITION: 'DEMOLITION',
    RENOVATION: 'RENOVATION',
    LANDSCAPING: 'LANDSCAPING',
    HAZARDOUS: 'HAZARDOUS',
    MIXED: 'MIXED'
}

// Debris type labels
export const DEBRIS_TYPE_LABELS = {
    CONSTRUCTION: 'Construction Debris',
    DEMOLITION: 'Demolition Debris',
    RENOVATION: 'Renovation Debris',
    LANDSCAPING: 'Landscaping Debris',
    HAZARDOUS: 'Hazardous Materials',
    MIXED: 'Mixed Debris'
}

// File types allowed for uploads
export const ALLOWED_FILE_TYPES = [
    'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'dwg', 'dxf'
]

// Max file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// Document types
export const DOCUMENT_TYPE = {
    PLANS: 'PLANS',
    SPECIFICATIONS: 'SPECIFICATIONS',
    LICENSE: 'LICENSE',
    INSURANCE: 'INSURANCE',
    CONTRACT: 'CONTRACT',
    PHOTOS: 'PHOTOS',
    OTHER: 'OTHER'
}

// Document type labels
export const DOCUMENT_TYPE_LABELS = {
    PLANS: 'Building Plans',
    SPECIFICATIONS: 'Specifications',
    LICENSE: 'License Documentation',
    INSURANCE: 'Insurance Certificate',
    CONTRACT: 'Contract Documents',
    PHOTOS: 'Photographs',
    OTHER: 'Other Documents'
}

// External URLs
export const EXTERNAL_URLS = {
    MUNICIPALITY_WEBSITE: 'https://municipality.gov',
    FEE_SCHEDULE: 'https://municipality.gov/permits/fees',
    BUILDING_CODES: 'https://municipality.gov/permits/codes',
    CONTACT_US: 'https://municipality.gov/contact'
}

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
}

// Notification types
export const NOTIFICATION_TYPE = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    INFO: 'INFO'
}

// User roles
export const USER_ROLE = {
    ADMIN: 'ADMIN',
    REVIEWER: 'REVIEWER',
    APPLICANT: 'APPLICANT',
    CONTRACTOR: 'CONTRACTOR'
}

// User role labels
export const USER_ROLE_LABELS = {
    ADMIN: 'Administrator',
    REVIEWER: 'Permit Reviewer',
    APPLICANT: 'Applicant',
    CONTRACTOR: 'Contractor'
}

// Form validation patterns
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})(\s?(ext|x|extension)[-.\s]?(\d+))?$/,
    ZIP_CODE: /^\d{5}(-\d{4})?$/,
    LICENSE_NUMBER: /^[A-Za-z0-9-]+$/
}

// US States list
export const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
]

// Zoning classifications with detailed options
export const ZONING_CLASSIFICATIONS = [
    { value: 'R1', label: 'R1 - Single Family Residential', description: 'Single family residential low density' },
    { value: 'R2', label: 'R2 - Single Family Residential', description: 'Single family residential medium density' },
    { value: 'R3', label: 'R3 - Multi-Family Residential', description: 'Multi-family residential' },
    { value: 'R4', label: 'R4 - High Density Residential', description: 'High density residential' },
    { value: 'C1', label: 'C1 - Neighborhood Commercial', description: 'Local commercial services' },
    { value: 'C2', label: 'C2 - General Commercial', description: 'General commercial and retail' },
    { value: 'C3', label: 'C3 - Central Business', description: 'Central business district' },
    { value: 'I1', label: 'I1 - Light Industrial', description: 'Light industrial and manufacturing' },
    { value: 'I2', label: 'I2 - Heavy Industrial', description: 'Heavy industrial and manufacturing' },
    { value: 'M1', label: 'M1 - Mixed Use', description: 'Mixed use development' },
    { value: 'AG', label: 'AG - Agricultural', description: 'Agricultural and farming' },
    { value: 'OS', label: 'OS - Open Space', description: 'Parks and open space' },
    { value: 'PUD', label: 'PUD - Planned Unit Development', description: 'Planned development' }
]

// Permit status colors for UI theming
export const PERMIT_STATUS_COLORS = {
    DRAFT: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
        darkBg: 'dark:bg-gray-800',
        darkText: 'dark:text-gray-200',
        darkBorder: 'dark:border-gray-600'
    },
    SUBMITTED: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300',
        darkBg: 'dark:bg-blue-900',
        darkText: 'dark:text-blue-200',
        darkBorder: 'dark:border-blue-700'
    },
    UNDER_REVIEW: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-300',
        darkBg: 'dark:bg-amber-900',
        darkText: 'dark:text-amber-200',
        darkBorder: 'dark:border-amber-700'
    },
    APPROVED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        darkBg: 'dark:bg-green-900',
        darkText: 'dark:text-green-200',
        darkBorder: 'dark:border-green-700'
    },
    REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        darkBg: 'dark:bg-red-900',
        darkText: 'dark:text-red-200',
        darkBorder: 'dark:border-red-700'
    },
    EXPIRED: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-300',
        darkBg: 'dark:bg-gray-800',
        darkText: 'dark:text-gray-400',
        darkBorder: 'dark:border-gray-600'
    },
    CANCELLED: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-300',
        darkBg: 'dark:bg-gray-800',
        darkText: 'dark:text-gray-400',
        darkBorder: 'dark:border-gray-600'
    }
}