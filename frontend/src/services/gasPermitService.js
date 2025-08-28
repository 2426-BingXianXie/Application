import { PermitService } from './permitService'
import api from './api'

/**
 * Gas Permit Service - Extends generic PermitService
 * Inherits all common permit operations and adds gas-specific functionality
 */
class GasPermitService extends PermitService {
    constructor() {
        super('/gas-permits') // Pass gas permits API path to parent
    }


    // Get permits by work type
    async getByWorkType(workType, params = {}) {
        const response = await api.get(`${this.basePath}/work-type/${workType}`, { params })
        return response.data
    }

    // Get permits by gas type
    async getByGasType(gasType, params = {}) {
        const response = await api.get(`${this.basePath}/gas-type/${gasType}`, { params })
        return response.data
    }

    // Get permits by installation type
    async getByInstallationType(installationType, params = {}) {
        const response = await api.get(`${this.basePath}/installation-type/${installationType}`, { params })
        return response.data
    }

    // Get high BTU installations (over 400,000 BTU)
    async getHighBTUInstallations(params = {}) {
        const response = await api.get(`${this.basePath}/high-btu`, { params })
        return response.data
    }

    // Get permits requiring utility coordination
    async getRequiringUtilityCoordination(params = {}) {
        const response = await api.get(`${this.basePath}/utility-coordination`, { params })
        return response.data
    }

    // Get commercial gas installations
    async getCommercialInstallations(params = {}) {
        const response = await api.get(`${this.basePath}/commercial`, { params })
        return response.data
    }

    // Get permits by gas contractor
    async getByGasContractor(licenseNumber, params = {}) {
        const response = await api.get(`${this.basePath}/gas-contractor/${licenseNumber}`, { params })
        return response.data
    }


    // Calculate BTU requirements
    async calculateBTURequirements(applianceData) {
        const response = await api.post(`${this.basePath}/calculate-btu`, applianceData)
        return response.data
    }

    // Calculate gas line sizing
    async calculateGasLineSizing(btuInput, lineLength, gasType = 'NATURAL') {
        const response = await api.post(`${this.basePath}/calculate-line-size`, {
            btuInput,
            lineLength,
            gasType
        })
        return response.data
    }

    // Validate gas safety requirements
    async validateGasSafety(permitData) {
        const response = await api.post(`${this.basePath}/validate-safety`, permitData)
        return response.data
    }

    // Check pressure requirements
    async checkPressureRequirements(permitData) {
        const response = await api.post(`${this.basePath}/check-pressure`, permitData)
        return response.data
    }

    // Validate emergency shutoff requirements
    async validateEmergencyShutoff(permitData) {
        const response = await api.post(`${this.basePath}/validate-shutoff`, permitData)
        return response.data
    }


    // Schedule gas inspections
    async scheduleGasInspections(permitId, inspectionTypes) {
        const response = await api.post(`${this.basePath}/${permitId}/schedule-gas-inspections`, {
            inspectionTypes
        })
        return response.data
    }

    // Get required gas inspections
    async getRequiredGasInspections(permitId) {
        const response = await api.get(`${this.basePath}/${permitId}/required-gas-inspections`)
        return response.data
    }

    // Schedule pressure test
    async schedulePressureTest(permitId, testDate) {
        const response = await api.post(`${this.basePath}/${permitId}/schedule-pressure-test`, {
            testDate
        })
        return response.data
    }

    // Get gas inspection history
    async getGasInspectionHistory(permitId) {
        const response = await api.get(`${this.basePath}/${permitId}/gas-inspection-history`)
        return response.data
    }

    // Validate gas contractor license
    async validateGasContractorLicense(licenseNumber) {
        const response = await api.get(`${this.basePath}/validate-gas-contractor/${licenseNumber}`)
        return response.data
    }

    // Check gas contractor certifications
    async checkGasContractorCertifications(licenseNumber) {
        const response = await api.get(`${this.basePath}/contractor-certifications/${licenseNumber}`)
        return response.data
    }


    // Request utility coordination
    async requestUtilityCoordination(permitId, utilityCompany) {
        const response = await api.post(`${this.basePath}/${permitId}/utility-coordination`, {
            utilityCompany
        })
        return response.data
    }

    // Get utility coordination status
    async getUtilityCoordinationStatus(permitId) {
        const response = await api.get(`${this.basePath}/${permitId}/utility-status`)
        return response.data
    }

    // Get available utility companies
    async getUtilityCompanies(location) {
        const response = await api.get(`${this.basePath}/utility-companies`, {
            params: { location }
        })
        return response.data
    }


    // Check gas code compliance
    async checkGasCodeCompliance(permitData) {
        const response = await api.post(`${this.basePath}/check-gas-code`, permitData)
        return response.data
    }

    // Validate appliance specifications
    async validateApplianceSpecs(applianceData) {
        const response = await api.post(`${this.basePath}/validate-appliances`, applianceData)
        return response.data
    }


    // Upload gas appliance specifications
    async uploadApplianceSpecs(permitId, files, onProgress) {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`specs[${index}]`, file)
        })

        const response = await api.upload(
            `${this.basePath}/${permitId}/upload-specs`,
            formData,
            onProgress
        )
        return response.data
    }

    // Upload gas contractor license
    async uploadGasContractorLicense(permitId, file, onProgress) {
        const formData = new FormData()
        formData.append('gasLicense', file)

        const response = await api.upload(
            `${this.basePath}/${permitId}/upload-gas-license`,
            formData,
            onProgress
        )
        return response.data
    }

    // Upload pressure test results
    async uploadPressureTestResults(permitId, file, onProgress) {
        const formData = new FormData()
        formData.append('testResults', file)

        const response = await api.upload(
            `${this.basePath}/${permitId}/upload-pressure-test`,
            formData,
            onProgress
        )
        return response.data
    }


    // Get gas safety statistics
    async getGasSafetyStatistics(timeframe = 'month') {
        const response = await api.get(`${this.basePath}/safety-statistics`, {
            params: { timeframe }
        })
        return response.data
    }

    // Get BTU usage statistics
    async getBTUStatistics(params = {}) {
        const response = await api.get(`${this.basePath}/btu-statistics`, { params })
        return response.data
    }

    // Get gas permit trends
    async getGasPermitTrends(timeframe = 'year') {
        const response = await api.get(`${this.basePath}/trends`, {
            params: { timeframe }
        })
        return response.data
    }


    // Generate gas permit safety report
    async generateGasSafetyReport(params = {}) {
        return api.download(
            `${this.basePath}/reports/safety?${new URLSearchParams(params)}`,
            'gas-permits-safety.pdf'
        )
    }

    // Generate BTU analysis report
    async generateBTUAnalysisReport(params = {}) {
        return api.download(
            `${this.basePath}/reports/btu-analysis?${new URLSearchParams(params)}`,
            'gas-permits-btu-analysis.pdf'
        )
    }
}

// Create and export instance
const gasPermitService = new GasPermitService()

export default gasPermitService