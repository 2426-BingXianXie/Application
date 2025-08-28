import { PermitService } from './permitService'
import api from './api'

/**
 * Building Permit Service - Extends generic PermitService
 * Inherits all common permit operations and adds building-specific functionality
 */
class BuildingPermitService extends PermitService {
    constructor() {
        super('/building-permits') // Pass building permits API path to parent
    }

    // Get permits by building type
    async getByBuildingType(buildingType, params = {}) {
        const response = await api.get(`${this.basePath}/building-type/${buildingType}`, { params })
        return response.data
    }

    // Get permits by permit type (NEW_CONSTRUCTION, RENOVATION, etc.)
    async getByPermitType(permitType, params = {}) {
        const response = await api.get(`${this.basePath}/permit-type/${permitType}`, { params })
        return response.data
    }

    // Get permits requiring architect
    async getRequiringArchitect(params = {}) {
        const response = await api.get(`${this.basePath}/with-architect`, { params })
        return response.data
    }

    // Get permits requiring engineer
    async getRequiringEngineer(params = {}) {
        const response = await api.get(`${this.basePath}/with-engineer`, { params })
        return response.data
    }

    // Get permits by project cost range
    async getByProjectCostRange(minCost, maxCost, params = {}) {
        const response = await api.get(`${this.basePath}/cost-range`, {
            params: { minCost, maxCost, ...params }
        })
        return response.data
    }

    // Get major projects (over $50,000)
    async getMajorProjects(params = {}) {
        const response = await api.get(`${this.basePath}/major-projects`, { params })
        return response.data
    }

    // Get permits with contractor
    async getWithContractor(params = {}) {
        const response = await api.get(`${this.basePath}/with-contractor`, { params })
        return response.data
    }

    // Get owner-performed work permits
    async getOwnerPerformed(params = {}) {
        const response = await api.get(`${this.basePath}/owner-performed`, { params })
        return response.data
    }

    // Get permits by contractor license number
    async getByContractorLicense(licenseNumber, params = {}) {
        const response = await api.get(`${this.basePath}/contractor/${licenseNumber}`, { params })
        return response.data
    }

    // Get permits by occupancy type
    async getByOccupancyType(occupancyType, params = {}) {
        const response = await api.get(`${this.basePath}/occupancy/${occupancyType}`, { params })
        return response.data
    }

    // Schedule building inspections
    async scheduleInspections(permitId, inspectionTypes) {
        const response = await api.post(`${this.basePath}/${permitId}/schedule-inspections`, {
            inspectionTypes
        })
        return response.data
    }

    // Get required inspections for permit
    async getRequiredInspections(permitId) {
        const response = await api.get(`${this.basePath}/${permitId}/required-inspections`)
        return response.data
    }

    // Get inspection history
    async getInspectionHistory(permitId) {
        const response = await api.get(`${this.basePath}/${permitId}/inspection-history`)
        return response.data
    }


    // Validate architect requirements
    async validateArchitectRequirements(permitData) {
        const response = await api.post(`${this.basePath}/validate-architect`, permitData)
        return response.data
    }

    // Validate engineer requirements
    async validateEngineerRequirements(permitData) {
        const response = await api.post(`${this.basePath}/validate-engineer`, permitData)
        return response.data
    }


    // Check building code compliance
    async checkBuildingCodeCompliance(permitData) {
        const response = await api.post(`${this.basePath}/check-building-code`, permitData)
        return response.data
    }

    // Validate zoning compliance
    async validateZoningCompliance(permitData) {
        const response = await api.post(`${this.basePath}/validate-zoning`, permitData)
        return response.data
    }


    // Calculate building permit fees
    async calculateFees(permitData) {
        const response = await api.post(`${this.basePath}/calculate-fees`, permitData)
        return response.data
    }

    // Get fee structure
    async getFeeStructure() {
        const response = await api.get(`${this.basePath}/fee-structure`)
        return response.data
    }


    // Upload building plans
    async uploadBuildingPlans(permitId, files, onProgress) {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`plans[${index}]`, file)
        })

        const response = await api.upload(
            `${this.basePath}/${permitId}/upload-plans`,
            formData,
            onProgress
        )
        return response.data
    }

    // Upload contractor license
    async uploadContractorLicense(permitId, file, onProgress) {
        const formData = new FormData()
        formData.append('license', file)

        const response = await api.upload(
            `${this.basePath}/${permitId}/upload-contractor-license`,
            formData,
            onProgress
        )
        return response.data
    }


    // Validate contractor license
    async validateContractorLicense(licenseNumber) {
        const response = await api.get(`${this.basePath}/validate-contractor/${licenseNumber}`)
        return response.data
    }

    // Validate HIC registration
    async validateHICRegistration(registrationNumber) {
        const response = await api.get(`${this.basePath}/validate-hic/${registrationNumber}`)
        return response.data
    }


    // Validate debris disposal requirements
    async validateDebrisDisposal(debrisData) {
        const response = await api.post(`${this.basePath}/validate-debris`, debrisData)
        return response.data
    }

    // Get approved debris disposal companies
    async getApprovedDebrisCompanies(location) {
        const response = await api.get(`${this.basePath}/debris-companies`, {
            params: { location }
        })
        return response.data
    }

    // Generate building permit summary report
    async generateBuildingSummaryReport(params = {}) {
        return api.download(
            `${this.basePath}/reports/summary?${new URLSearchParams(params)}`,
            'building-permits-summary.pdf'
        )
    }

    // Get construction statistics
    async getConstructionStatistics(timeframe = 'month') {
        const response = await api.get(`${this.basePath}/construction-statistics`, {
            params: { timeframe }
        })
        return response.data
    }
}

// Create and export instance
const buildingPermitService = new BuildingPermitService()

export default buildingPermitService