// constants.js - Enhanced application constants

// US States for dropdowns
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

// Zoning Classifications
export const ZONING_CLASSIFICATIONS = [
    { value: 'RESIDENTIAL_SINGLE_FAMILY', label: 'Residential - Single Family', description: 'Single-family detached homes' },
    { value: 'RESIDENTIAL_MULTI_FAMILY', label: 'Residential - Multi-Family', description: 'Apartments, condos, townhomes' },
    { value: 'RESIDENTIAL_MIXED_USE', label: 'Residential - Mixed Use', description: 'Residential with commercial' },
    { value: 'COMMERCIAL_RETAIL', label: 'Commercial - Retail', description: 'Stores, shops, restaurants' },
    { value: 'COMMERCIAL_OFFICE', label: 'Commercial - Office', description: 'Office buildings, professional services' },
    { value: 'COMMERCIAL_MIXED_USE', label: 'Commercial - Mixed Use', description: 'Mixed commercial activities' },
    { value: 'INDUSTRIAL_LIGHT', label: 'Industrial - Light', description: 'Light manufacturing, warehouses' },
    { value: 'INDUSTRIAL_HEAVY', label: 'Industrial - Heavy', description: 'Heavy manufacturing, processing' },
    { value: 'AGRICULTURAL', label: 'Agricultural', description: 'Farming, agricultural use' },
    { value: 'INSTITUTIONAL', label: 'Institutional', description: 'Schools, hospitals, government' },
    { value: 'RECREATIONAL', label: 'Recreational', description: 'Parks, sports facilities' }
]

// Enhanced Building Permit Types
export const BUILDING_PERMIT_TYPE = [
    { value: 'NEW_CONSTRUCTION', label: 'New Construction', description: 'New building construction' },
    { value: 'ADDITION', label: 'Addition', description: 'Adding to existing structure' },
    { value: 'ALTERATION', label: 'Alteration', description: 'Modifying existing structure' },
    { value: 'RENOVATION', label: 'Renovation', description: 'Interior/exterior improvements' },
    { value: 'MAJOR_RENOVATION', label: 'Major Renovation', description: 'Extensive structural changes' },
    { value: 'REPAIR', label: 'Repair', description: 'Structural or system repairs' },
    { value: 'DEMOLITION', label: 'Demolition', description: 'Building demolition' },
    { value: 'DECK_PATIO', label: 'Deck/Patio', description: 'Outdoor structures' },
    { value: 'FENCE', label: 'Fence', description: 'Fencing installation' },
    { value: 'ROOFING', label: 'Roofing', description: 'Roof replacement or repair' },
    { value: 'SIDING', label: 'Siding', description: 'Exterior siding work' },
    { value: 'WINDOWS_DOORS', label: 'Windows/Doors', description: 'Window or door replacement' },
    { value: 'HVAC', label: 'HVAC', description: 'Heating, ventilation, A/C' },
    { value: 'PLUMBING', label: 'Plumbing', description: 'Plumbing installation/repair' },
    { value: 'ELECTRICAL', label: 'Electrical', description: 'Electrical work' },
    { value: 'ACCESSORY_STRUCTURE', label: 'Accessory Structure', description: 'Sheds, garages, etc.' }
]

// Enhanced Gas Work Types
export const GAS_WORK_TYPE = [
    { value: 'NEW_INSTALLATION', label: 'New Installation', description: 'New gas line and appliances' },
    { value: 'LINE_EXTENSION', label: 'Line Extension', description: 'Extending existing gas line' },
    { value: 'APPLIANCE_INSTALLATION', label: 'Appliance Installation', description: 'Installing new gas appliances' },
    { value: 'APPLIANCE_REPLACEMENT', label: 'Appliance Replacement', description: 'Replacing existing appliances' },
    { value: 'LINE_REPAIR', label: 'Line Repair', description: 'Repairing existing gas lines' },
    { value: 'METER_UPGRADE', label: 'Meter Upgrade', description: 'Gas meter replacement/upgrade' },
    { value: 'REGULATOR_INSTALLATION', label: 'Regulator Installation', description: 'Pressure regulator work' },
    { value: 'SYSTEM_MODIFICATION', label: 'System Modification', description: 'Modifying existing gas system' },
    { value: 'EMERGENCY_REPAIR', label: 'Emergency Repair', description: 'Emergency gas system repair' }
]

// Enhanced Gas Types
export const GAS_TYPE = [
    { value: 'NATURAL_GAS', label: 'Natural Gas', description: 'Utility-supplied natural gas' },
    { value: 'PROPANE', label: 'Propane (LP)', description: 'Liquefied petroleum gas' },
    { value: 'BUTANE', label: 'Butane', description: 'Butane gas systems' },
    { value: 'MIXED_GAS', label: 'Mixed Gas', description: 'Multiple gas types' }
]

// Gas Installation Types
export const GAS_INSTALLATION_TYPE = [
    { value: 'UNDERGROUND', label: 'Underground', description: 'Below-ground installation' },
    { value: 'ABOVE_GROUND', label: 'Above Ground', description: 'Above-ground installation' },
    { value: 'INTERIOR', label: 'Interior', description: 'Inside building' },
    { value: 'EXTERIOR', label: 'Exterior', description: 'Outside building' },
    { value: 'MIXED', label: 'Mixed', description: 'Combination of types' }
]

// Enhanced Building Types
export const BUILDING_TYPE = [
    { value: 'SINGLE_FAMILY', label: 'Single Family Home', description: 'Detached single-family residence' },
    { value: 'DUPLEX', label: 'Duplex', description: 'Two-unit residential building' },
    { value: 'TOWNHOUSE', label: 'Townhouse', description: 'Attached single-family unit' },
    { value: 'CONDOMINIUM', label: 'Condominium', description: 'Condo unit' },
    { value: 'APARTMENT', label: 'Apartment Building', description: 'Multi-unit residential' },
    { value: 'COMMERCIAL', label: 'Commercial', description: 'Business/retail building' },
    { value: 'INDUSTRIAL', label: 'Industrial', description: 'Manufacturing/warehouse' },
    { value: 'INSTITUTIONAL', label: 'Institutional', description: 'Schools, hospitals, etc.' },
    { value: 'MIXED_USE', label: 'Mixed Use', description: 'Combined residential/commercial' },
    { value: 'ACCESSORY', label: 'Accessory Structure', description: 'Garage, shed, etc.' }
]

// Enhanced Occupancy Types
export const OCCUPANCY_TYPE = [
    { value: 'RESIDENTIAL', label: 'Residential', description: 'Living quarters' },
    { value: 'COMMERCIAL', label: 'Commercial', description: 'Business use' },
    { value: 'INDUSTRIAL', label: 'Industrial', description: 'Manufacturing/processing' },
    { value: 'INSTITUTIONAL', label: 'Institutional', description: 'Public services' },
    { value: 'ASSEMBLY', label: 'Assembly', description: 'Gatherings, events' },
    { value: 'STORAGE', label: 'Storage', description: 'Warehouse, storage' },
    { value: 'UTILITY', label: 'Utility', description: 'Utilities, infrastructure' },
    { value: 'MIXED', label: 'Mixed Use', description: 'Multiple occupancy types' }
]

// Enhanced Applicant Types
export const APPLICANT_TYPE = [
    { value: 'OWNER', label: 'Property Owner', description: 'I own the property' },
    { value: 'CONTRACTOR', label: 'Licensed Contractor', description: 'I am a licensed contractor' },
    { value: 'ARCHITECT', label: 'Licensed Architect', description: 'I am a licensed architect' },
    { value: 'ENGINEER', label: 'Licensed Engineer', description: 'I am a licensed engineer' },
    { value: 'AGENT', label: 'Authorized Agent', description: 'I represent the property owner' },
    { value: 'OTHER', label: 'Other', description: 'Other relationship to property' }
]

// Permit Status with enhanced information
export const PERMIT_STATUS = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    PENDING_REVIEW: 'PENDING_REVIEW',
    UNDER_REVIEW: 'UNDER_REVIEW',
    APPROVED: 'APPROVED',
    APPROVED_WITH_CONDITIONS: 'APPROVED_WITH_CONDITIONS',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
    WITHDRAWN: 'WITHDRAWN',
    ON_HOLD: 'ON_HOLD'
}

export const PERMIT_STATUS_LABELS = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    PENDING_REVIEW: 'Pending Review',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    APPROVED_WITH_CONDITIONS: 'Approved with Conditions',
    REJECTED: 'Rejected',
    EXPIRED: 'Expired',
    WITHDRAWN: 'Withdrawn',
    ON_HOLD: 'On Hold'
}

export const PERMIT_STATUS_COLORS = {
    DRAFT: 'gray',
    SUBMITTED: 'blue',
    PENDING_REVIEW: 'yellow',
    UNDER_REVIEW: 'orange',
    APPROVED: 'green',
    APPROVED_WITH_CONDITIONS: 'emerald',
    REJECTED: 'red',
    EXPIRED: 'gray',
    WITHDRAWN: 'purple',
    ON_HOLD: 'amber'
}

// License Types
export const LICENSE_TYPES = [
    { value: 'GENERAL_CONTRACTOR', label: 'General Contractor' },
    { value: 'ELECTRICAL_CONTRACTOR', label: 'Electrical Contractor' },
    { value: 'PLUMBING_CONTRACTOR', label: 'Plumbing Contractor' },
    { value: 'HVAC_CONTRACTOR', label: 'HVAC Contractor' },
    { value: 'ROOFING_CONTRACTOR', label: 'Roofing Contractor' },
    { value: 'MASONRY_CONTRACTOR', label: 'Masonry Contractor' },
    { value: 'DEMOLITION_CONTRACTOR', label: 'Demolition Contractor' },
    { value: 'SPECIALTY_CONTRACTOR', label: 'Specialty Contractor' }
]

// Gas License Types
export const GAS_LICENSE_TYPES = [
    { value: 'GAS_FITTER', label: 'Gas Fitter License' },
    { value: 'GAS_CONTRACTOR', label: 'Gas Contractor License' },
    { value: 'MASTER_GAS_FITTER', label: 'Master Gas Fitter' },
    { value: 'GAS_APPLIANCE_INSTALLER', label: 'Gas Appliance Installer' },
    { value: 'PROPANE_INSTALLER', label: 'Propane System Installer' }
]

// Debris Disposal Types
export const DEBRIS_DISPOSAL_TYPES = [
    { value: 'CONSTRUCTION', label: 'Construction Debris' },
    { value: 'DEMOLITION', label: 'Demolition Debris' },
    { value: 'RENOVATION', label: 'Renovation Debris' },
    { value: 'LANDSCAPING', label: 'Landscaping Waste' },
    { value: 'HAZARDOUS', label: 'Hazardous Materials' },
    { value: 'MIXED', label: 'Mixed Debris' }
]

// Disposal Methods
export const DISPOSAL_METHODS = [
    { value: 'DUMPSTER', label: 'Dumpster Rental' },
    { value: 'TRUCK_HAUL', label: 'Truck Haul Away' },
    { value: 'SELF_HAUL', label: 'Self Haul to Facility' },
    { value: 'ON_SITE', label: 'On-Site Processing' },
    { value: 'RECYCLING', label: 'Recycling Facility' }
]

// File Upload Configuration
export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx'],
    CHUNK_SIZE: 1024 * 1024 // 1MB chunks for large file uploads
}

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 second
}

// Application Information
export const APP_INFO = {
    NAME: 'PermitPro',
    VERSION: '1.0.0',
    DESCRIPTION: 'Professional Permit Management System',
    COMPANY: 'Municipality Services',
    SUPPORT_EMAIL: 'support@permitpro.com',
    SUPPORT_PHONE: '(555) 123-4567'
}

// User Roles and Permissions
export const USER_ROLES = {
    USER: 'USER',
    CONTRACTOR: 'CONTRACTOR',
    REVIEWER: 'REVIEWER',
    ADMIN: 'ADMIN'
}

export const USER_ROLE_LABELS = {
    USER: 'Standard User',
    CONTRACTOR: 'Licensed Contractor',
    REVIEWER: 'Permit Reviewer',
    ADMIN: 'System Administrator'
}

export const PERMISSIONS = {
    READ: 'read',
    CREATE: 'create',
    UPDATE: 'update',
    UPDATE_OWN: 'update_own',
    DELETE: 'delete',
    SUBMIT: 'submit',
    REVIEW: 'review',
    APPROVE: 'approve',
    REJECT: 'reject',
    ADMIN: 'admin'
}

// Validation Rules
export const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\(\d{3}\) \d{3}-\d{4}$/,
    ZIP_REGEX: /^\d{5}(-\d{4})?$/,
    PARCEL_ID_REGEX: /^[A-Z0-9-]{3,20}$/i,
    LICENSE_REGEX: /^[A-Z0-9-]{6,20}$/i,
    MIN_PASSWORD_LENGTH: 8,
    MAX_DESCRIPTION_LENGTH: 1000,
    MAX_PROJECT_COST: 10000000,
    MAX_BTU_INPUT: 1000000,
    MAX_GAS_LINE_LENGTH: 500,
    MAX_APPLIANCES: 20
}

// Pagination Settings
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100
}

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'MM/dd/yyyy',
    INPUT: 'yyyy-MM-dd',
    TIMESTAMP: 'MM/dd/yyyy HH:mm',
    RELATIVE: 'relative' // For formatDistanceToNow
}

// Theme Configuration
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
}

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    TIMEOUT: 'Request timed out. Please try again.',
    FILE_TOO_LARGE: 'File is too large. Please choose a smaller file.',
    INVALID_FILE_TYPE: 'Invalid file type. Please choose a supported file format.',
    FORM_INCOMPLETE: 'Please complete all required fields.',
    LICENSE_EXPIRED: 'License has expired. Please renew before proceeding.',
    PERMIT_EXPIRED: 'Permit has expired.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
    WEAK_PASSWORD: 'Password does not meet security requirements.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
    CREATED: 'Successfully created!',
    UPDATED: 'Successfully updated!',
    DELETED: 'Successfully deleted!',
    SUBMITTED: 'Successfully submitted!',
    APPROVED: 'Successfully approved!',
    REJECTED: 'Application rejected.',
    SAVED: 'Changes saved successfully!',
    UPLOADED: 'File uploaded successfully!',
    DOWNLOADED: 'Download started!',
    EMAIL_SENT: 'Email sent successfully!',
    PASSWORD_CHANGED: 'Password changed successfully!',
    LOGGED_IN: 'Welcome back!',
    LOGGED_OUT: 'Logged out successfully!',
    REGISTERED: 'Account created successfully!'
}

// Navigation Routes
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    APPLY: '/apply',
    BUILDING_PERMITS: '/building-permits',
    GAS_PERMITS: '/gas-permits',
    PERMIT_DETAILS: '/permit/:id',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    REPORTS: '/reports',
    HELP: '/help',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    CONTACT: '/contact'
}

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    THEME: 'theme',
    NOTIFICATIONS: 'notifications',
    FORM_DRAFTS: 'form_drafts',
    PREFERENCES: 'user_preferences',
    LAST_VISITED: 'last_visited_page'
}

// Notification Types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
}

// Notification Categories
export const NOTIFICATION_CATEGORIES = {
    PERMIT_STATUS: 'permit_status',
    DEADLINE: 'deadline',
    DOCUMENT: 'document',
    SYSTEM: 'system',
    REMINDER: 'reminder'
}

// External URLs
export const EXTERNAL_URLS = {
    H2_CONSOLE: import.meta.env.VITE_H2_CONSOLE_URL || 'http://localhost:8080/h2-console',
    SWAGGER: import.meta.env.VITE_SWAGGER_URL || 'http://localhost:8080/swagger-ui.html',
    SUPPORT_EMAIL: 'mailto:support@permitpro.com',
    SUPPORT_PHONE: 'tel:+15551234567',
    MUNICIPALITY_WEBSITE: 'https://www.municipality.gov',
    BUILDING_CODES: 'https://www.municipality.gov/building-codes',
    FEE_SCHEDULE: 'https://www.municipality.gov/permit-fees'
}

// Feature Flags
export const FEATURES = {
    DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    FILE_UPLOAD: import.meta.env.VITE_ENABLE_FILE_UPLOAD !== 'false',
    NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    REAL_TIME_UPDATES: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
    GEOLOCATION: import.meta.env.VITE_ENABLE_GEOLOCATION !== 'false'
}

// Chart Colors
export const CHART_COLORS = [
    '#3B82F6', // Blue
    '#F59E0B', // Yellow
    '#10B981', // Green
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280'  // Gray
]

// Time Periods for Reports
export const TIME_PERIODS = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: '365', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
]

// Form Steps Configuration
export const FORM_STEPS = {
    BUILDING: [
        { id: 'permit-type', title: 'Permit Type', required: true },
        { id: 'contact', title: 'Contact Information', required: true },
        { id: 'location', title: 'Property Location', required: true },
        { id: 'building-details', title: 'Building Details', required: true },
        { id: 'contractor', title: 'Contractor Information', required: false },
        { id: 'debris', title: 'Debris Disposal', required: false },
        { id: 'review', title: 'Review & Submit', required: true }
    ],
    GAS: [
        { id: 'permit-type', title: 'Permit Type', required: true },
        { id: 'contact', title: 'Contact Information', required: true },
        { id: 'location', title: 'Property Location', required: true },
        { id: 'gas-details', title: 'Gas Installation', required: true },
        { id: 'gas-contractor', title: 'Gas Contractor', required: true },
        { id: 'review', title: 'Review & Submit', required: true }
    ]
}

// Processing Time Estimates (in business days)
export const PROCESSING_TIMES = {
    BUILDING: {
        MINOR_REPAIR: { min: 1, max: 3 },
        ALTERATION: { min: 3, max: 7 },
        ADDITION: { min: 5, max: 10 },
        NEW_CONSTRUCTION: { min: 10, max: 21 },
        MAJOR_RENOVATION: { min: 7, max: 14 }
    },
    GAS: {
        APPLIANCE_INSTALLATION: { min: 1, max: 3 },
        LINE_EXTENSION: { min: 2, max: 5 },
        NEW_INSTALLATION: { min: 3, max: 7 },
        SYSTEM_MODIFICATION: { min: 2, max: 5 }
    }
}

// Fee Calculation Factors
export const FEE_STRUCTURE = {
    BUILDING: {
        BASE_FEE: 150,
        PERCENTAGE_RATE: 0.005, // 0.5% of project cost
        MINIMUM_FEE: 150,
        RUSH_PROCESSING_MULTIPLIER: 2.0,
        REINSPECTION_FEE: 75
    },
    GAS: {
        BASE_FEE: 100,
        BTU_RATE: 0.00005, // per BTU
        MINIMUM_FEE: 100,
        EMERGENCY_MULTIPLIER: 1.5,
        PRESSURE_TEST_FEE: 50
    }
}

// Default Form Values
export const DEFAULT_FORM_VALUES = {
    CONTACT_INFO: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: ''
    },
    LOCATION_INFO: {
        parcelId: '',
        propertyAddress: '',
        city: '',
        state: '',
        zipCode: '',
        propertyOwnerName: '',
        latitude: '',
        longitude: '',
        lotSizeSqft: '',
        zoningClassification: ''
    },
    BUILDING_PERMIT_INFO: {
        permitFor: '',
        projectCost: '',
        workDescription: '',
        tenantOwnerName: '',
        tenantOwnerPhone: '',
        tenantOwnerAddress: '',
        developmentTitle: '',
        buildingType: '',
        occupancyType: '',
        ownerDoingWork: false,
        hasArchitect: false,
        hasEngineer: false
    },
    GAS_PERMIT_INFO: {
        workType: '',
        gasType: '',
        installationType: '',
        totalBtuInput: '',
        gasLineLengthFeet: '',
        numberOfAppliances: '',
        gasLineSizeInches: '',
        projectCost: '',
        workDescription: '',
        applianceDetails: '',
        requiresMeterUpgrade: false,
        requiresRegulator: false,
        requiresPressureTest: false,
        emergencyShutoffRequired: false
    },
    CONTRACTOR_LICENSE: {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        email: '',
        dba: '',
        licenseType: '',
        licenseNumber: '',
        expirationDate: ''
    },
    DEBRIS_DISPOSAL: {
        dumpsterLocation: '',
        companyName: '',
        disposalMethod: '',
        debrisType: '',
        estimatedVolumeCubicYards: '',
        isHazardousMaterial: false
    }
}

// Regular Expressions
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\(\d{3}\) \d{3}-\d{4}$/,
    ZIP_CODE: /^\d{5}(-\d{4})?$/,
    PARCEL_ID: /^[A-Z0-9-]{3,20}$/i,
    LICENSE_NUMBER: /^[A-Z0-9-]{6,20}$/i,
    CURRENCY: /^\$?[\d,]+(\.\d{1,2})?$/,
    DIGITS_ONLY: /^\d+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    ALPHANUMERIC_SPACES: /^[a-zA-Z0-9\s]+$/
}

// Environment Helpers
export const ENV = {
    IS_DEVELOPMENT: import.meta.env.MODE === 'development',
    IS_PRODUCTION: import.meta.env.MODE === 'production',
    IS_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
}

// Browser Support
export const BROWSER_SUPPORT = {
    GEOLOCATION: 'geolocation' in navigator,
    FILE_API: window.File && window.FileReader && window.FileList && window.Blob,
    LOCAL_STORAGE: typeof Storage !== 'undefined',
    NOTIFICATIONS: 'Notification' in window,
    SERVICE_WORKER: 'serviceWorker' in navigator
}

// Export all constants as default object
export default {
    US_STATES,
    ZONING_CLASSIFICATIONS,
    BUILDING_PERMIT_TYPE,
    GAS_WORK_TYPE,
    GAS_TYPE,
    GAS_INSTALLATION_TYPE,
    BUILDING_TYPE,
    OCCUPANCY_TYPE,
    APPLICANT_TYPE,
    PERMIT_STATUS,
    PERMIT_STATUS_LABELS,
    PERMIT_STATUS_COLORS,
    LICENSE_TYPES,
    GAS_LICENSE_TYPES,
    DEBRIS_DISPOSAL_TYPES,
    DISPOSAL_METHODS,
    FILE_UPLOAD,
    API_CONFIG,
    APP_INFO,
    USER_ROLES,
    USER_ROLE_LABELS,
    PERMISSIONS,
    VALIDATION,
    PAGINATION,
    DATE_FORMATS,
    THEMES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ROUTES,
    STORAGE_KEYS,
    NOTIFICATION_TYPES,
    NOTIFICATION_CATEGORIES,
    EXTERNAL_URLS,
    FEATURES,
    CHART_COLORS,
    TIME_PERIODS,
    FORM_STEPS,
    PROCESSING_TIMES,
    FEE_STRUCTURE,
    DEFAULT_FORM_VALUES,
    REGEX_PATTERNS,
    ENV,
    BROWSER_SUPPORT
}