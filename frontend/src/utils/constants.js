/**
 * Application constants
 * Centralized location for all constant values used throughout the application
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
}

// Application Information
export const APP_INFO = {
    NAME: import.meta.env.VITE_APP_NAME || 'Permit Management System',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
}

// Permit Status Constants
export const PERMIT_STATUS = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
}

// Permit Status Display Names
export const PERMIT_STATUS_LABELS = {
    [PERMIT_STATUS.DRAFT]: 'Draft',
    [PERMIT_STATUS.SUBMITTED]: 'Submitted',
    [PERMIT_STATUS.UNDER_REVIEW]: 'Under Review',
    [PERMIT_STATUS.APPROVED]: 'Approved',
    [PERMIT_STATUS.REJECTED]: 'Rejected',
    [PERMIT_STATUS.EXPIRED]: 'Expired',
    [PERMIT_STATUS.CANCELLED]: 'Cancelled',
}

// Permit Status Colors for UI
export const PERMIT_STATUS_COLORS = {
    [PERMIT_STATUS.DRAFT]: 'gray',
    [PERMIT_STATUS.SUBMITTED]: 'blue',
    [PERMIT_STATUS.UNDER_REVIEW]: 'yellow',
    [PERMIT_STATUS.APPROVED]: 'green',
    [PERMIT_STATUS.REJECTED]: 'red',
    [PERMIT_STATUS.EXPIRED]: 'orange',
    [PERMIT_STATUS.CANCELLED]: 'gray',
}

// Applicant Types
export const APPLICANT_TYPE = {
    OWNER: 'OWNER',
    CONTRACTOR: 'CONTRACTOR',
    AGENT: 'AGENT',
    OTHER: 'OTHER',
}

// Applicant Type Labels
export const APPLICANT_TYPE_LABELS = {
    [APPLICANT_TYPE.OWNER]: 'Property Owner',
    [APPLICANT_TYPE.CONTRACTOR]: 'Licensed Contractor',
    [APPLICANT_TYPE.AGENT]: 'Authorized Agent',
    [APPLICANT_TYPE.OTHER]: 'Other',
}

// Building Permit Types
export const BUILDING_PERMIT_TYPE = {
    NEW_CONSTRUCTION: 'NEW_CONSTRUCTION',
    RENOVATION: 'RENOVATION',
    ADDITION: 'ADDITION',
    REPAIR: 'REPAIR',
    DEMOLITION: 'DEMOLITION',
    ALTERATION: 'ALTERATION',
}

// Building Permit Type Labels
export const BUILDING_PERMIT_TYPE_LABELS = {
    [BUILDING_PERMIT_TYPE.NEW_CONSTRUCTION]: 'New Construction',
    [BUILDING_PERMIT_TYPE.RENOVATION]: 'Renovation',
    [BUILDING_PERMIT_TYPE.ADDITION]: 'Addition',
    [BUILDING_PERMIT_TYPE.REPAIR]: 'Repair',
    [BUILDING_PERMIT_TYPE.DEMOLITION]: 'Demolition',
    [BUILDING_PERMIT_TYPE.ALTERATION]: 'Alteration',
}

// Building Types
export const BUILDING_TYPE = {
    RESIDENTIAL: 'RESIDENTIAL',
    COMMERCIAL: 'COMMERCIAL',
    INDUSTRIAL: 'INDUSTRIAL',
    MIXED_USE: 'MIXED_USE',
    INSTITUTIONAL: 'INSTITUTIONAL',
    AGRICULTURAL: 'AGRICULTURAL',
}

// Building Type Labels
export const BUILDING_TYPE_LABELS = {
    [BUILDING_TYPE.RESIDENTIAL]: 'Residential',
    [BUILDING_TYPE.COMMERCIAL]: 'Commercial',
    [BUILDING_TYPE.INDUSTRIAL]: 'Industrial',
    [BUILDING_TYPE.MIXED_USE]: 'Mixed Use',
    [BUILDING_TYPE.INSTITUTIONAL]: 'Institutional',
    [BUILDING_TYPE.AGRICULTURAL]: 'Agricultural',
}

// Occupancy Types
export const OCCUPANCY_TYPE = {
    SINGLE_FAMILY: 'SINGLE_FAMILY',
    MULTI_FAMILY: 'MULTI_FAMILY',
    OFFICE: 'OFFICE',
    RETAIL: 'RETAIL',
    WAREHOUSE: 'WAREHOUSE',
    RESTAURANT: 'RESTAURANT',
    HEALTHCARE: 'HEALTHCARE',
    EDUCATIONAL: 'EDUCATIONAL',
    ASSEMBLY: 'ASSEMBLY',
    OTHER: 'OTHER',
}

// Occupancy Type Labels
export const OCCUPANCY_TYPE_LABELS = {
    [OCCUPANCY_TYPE.SINGLE_FAMILY]: 'Single Family Home',
    [OCCUPANCY_TYPE.MULTI_FAMILY]: 'Multi Family Housing',
    [OCCUPANCY_TYPE.OFFICE]: 'Office Space',
    [OCCUPANCY_TYPE.RETAIL]: 'Retail Store',
    [OCCUPANCY_TYPE.WAREHOUSE]: 'Warehouse/Storage',
    [OCCUPANCY_TYPE.RESTAURANT]: 'Restaurant/Food Service',
    [OCCUPANCY_TYPE.HEALTHCARE]: 'Healthcare Facility',
    [OCCUPANCY_TYPE.EDUCATIONAL]: 'Educational Institution',
    [OCCUPANCY_TYPE.ASSEMBLY]: 'Assembly Hall/Theater',
    [OCCUPANCY_TYPE.OTHER]: 'Other',
}

// Gas Permit Work Types
export const GAS_WORK_TYPE = {
    NEW_SERVICE_LINE: 'NEW_SERVICE_LINE',
    SERVICE_UPGRADE: 'SERVICE_UPGRADE',
    NEW_APPLIANCE: 'NEW_APPLIANCE',
    APPLIANCE_REPLACEMENT: 'APPLIANCE_REPLACEMENT',
    LINE_EXTENSION: 'LINE_EXTENSION',
    LINE_REPAIR: 'LINE_REPAIR',
    METER_RELOCATION: 'METER_RELOCATION',
    SYSTEM_MODIFICATION: 'SYSTEM_MODIFICATION',
}

// Gas Work Type Labels
export const GAS_WORK_TYPE_LABELS = {
    [GAS_WORK_TYPE.NEW_SERVICE_LINE]: 'New Service Line',
    [GAS_WORK_TYPE.SERVICE_UPGRADE]: 'Service Line Upgrade',
    [GAS_WORK_TYPE.NEW_APPLIANCE]: 'New Appliance Installation',
    [GAS_WORK_TYPE.APPLIANCE_REPLACEMENT]: 'Appliance Replacement',
    [GAS_WORK_TYPE.LINE_EXTENSION]: 'Gas Line Extension',
    [GAS_WORK_TYPE.LINE_REPAIR]: 'Gas Line Repair',
    [GAS_WORK_TYPE.METER_RELOCATION]: 'Meter Relocation',
    [GAS_WORK_TYPE.SYSTEM_MODIFICATION]: 'System Modification',
}

// Gas Types
export const GAS_TYPE = {
    NATURAL_GAS: 'NATURAL_GAS',
    PROPANE: 'PROPANE',
    BUTANE: 'BUTANE',
    MIXED: 'MIXED',
}

// Gas Type Labels
export const GAS_TYPE_LABELS = {
    [GAS_TYPE.NATURAL_GAS]: 'Natural Gas',
    [GAS_TYPE.PROPANE]: 'Propane (LPG)',
    [GAS_TYPE.BUTANE]: 'Butane',
    [GAS_TYPE.MIXED]: 'Mixed Gas',
}

// Gas Installation Types
export const GAS_INSTALLATION_TYPE = {
    RESIDENTIAL: 'RESIDENTIAL',
    COMMERCIAL: 'COMMERCIAL',
    INDUSTRIAL: 'INDUSTRIAL',
    INSTITUTIONAL: 'INSTITUTIONAL',
}

// Gas Installation Type Labels
export const GAS_INSTALLATION_TYPE_LABELS = {
    [GAS_INSTALLATION_TYPE.RESIDENTIAL]: 'Residential',
    [GAS_INSTALLATION_TYPE.COMMERCIAL]: 'Commercial',
    [GAS_INSTALLATION_TYPE.INDUSTRIAL]: 'Industrial',
    [GAS_INSTALLATION_TYPE.INSTITUTIONAL]: 'Institutional',
}

// File Upload Constants
export const FILE_UPLOAD = {
    MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
    ALLOWED_TYPES: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx'],
}

// Validation Constants
export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_TEXT_LENGTH: 2000,
    MIN_TEXT_LENGTH: 10,
    PHONE_REGEX: /^[\+]?[1-9]?[0-9]{7,15}$/,
    EMAIL_REGEX: /^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})$/,
    ZIP_CODE_REGEX: /^[0-9]{5}(-[0-9]{4})?$/,
    SSN_REGEX: /^\d{3}-\d{2}-\d{4}$/,
}

// Pagination Constants
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE) || 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100,
}

// Date Format Constants
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    DISPLAY_WITH_TIME: 'MMM dd, yyyy h:mm a',
    INPUT: 'yyyy-MM-dd',
    INPUT_WITH_TIME: 'yyyy-MM-dd HH:mm',
    API: 'yyyy-MM-ddTHH:mm:ss.SSSZ',
}

// Theme Constants
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
}

// User Roles
export const USER_ROLES = {
    APPLICANT: 'applicant',
    REVIEWER: 'reviewer',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
}

// User Role Labels
export const USER_ROLE_LABELS = {
    [USER_ROLES.APPLICANT]: 'Applicant',
    [USER_ROLES.REVIEWER]: 'Reviewer',
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.SUPER_ADMIN]: 'Super Administrator',
}

// Permissions
export const PERMISSIONS = {
    READ: 'read',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    SUBMIT: 'submit',
    APPROVE: 'approve',
    REJECT: 'reject',
    ADMIN: 'admin',
    REVIEW: 'review',
}

// Error Messages
export const ERROR_MESSAGES = {
    GENERIC: 'An unexpected error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
    CREATED: 'Successfully created!',
    UPDATED: 'Successfully updated!',
    DELETED: 'Successfully deleted!',
    SUBMITTED: 'Successfully submitted!',
    APPROVED: 'Successfully approved!',
    REJECTED: 'Successfully rejected!',
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
}

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    THEME: 'theme',
    NOTIFICATIONS: 'notifications',
    FORM_DRAFTS: 'form_drafts',
}

// Notification Types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
}

// External URLs
export const EXTERNAL_URLS = {
    H2_CONSOLE: import.meta.env.VITE_H2_CONSOLE_URL || 'http://localhost:8080/h2-console',
    SWAGGER: import.meta.env.VITE_SWAGGER_URL || 'http://localhost:8080/swagger-ui.html',
    SUPPORT_EMAIL: 'mailto:support@permitmanagement.com',
    SUPPORT_PHONE: 'tel:+15551234567',
}

// Feature Flags
export const FEATURES = {
    DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
}

export default {
    API_CONFIG,
    APP_INFO,
    PERMIT_STATUS,
    PERMIT_STATUS_LABELS,
    PERMIT_STATUS_COLORS,
    APPLICANT_TYPE,
    APPLICANT_TYPE_LABELS,
    BUILDING_PERMIT_TYPE,
    BUILDING_PERMIT_TYPE_LABELS,
    BUILDING_TYPE,
    BUILDING_TYPE_LABELS,
    OCCUPANCY_TYPE,
    OCCUPANCY_TYPE_LABELS,
    GAS_WORK_TYPE,
    GAS_WORK_TYPE_LABELS,
    GAS_TYPE,
    GAS_TYPE_LABELS,
    GAS_INSTALLATION_TYPE,
    GAS_INSTALLATION_TYPE_LABELS,
    FILE_UPLOAD,
    VALIDATION,
    PAGINATION,
    DATE_FORMATS,
    THEMES,
    USER_ROLES,
    USER_ROLE_LABELS,
    PERMISSIONS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ROUTES,
    STORAGE_KEYS,
    NOTIFICATION_TYPES,
    EXTERNAL_URLS,
    FEATURES,
}