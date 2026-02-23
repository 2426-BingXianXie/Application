import api from './api'

const documentService = {
    // Document Center: list public documents with categories and search by name
    async listDocuments(params = {}) {
        const response = await api.get('/documents', { params })
        return response.data
    },

    // Upload document
    uploadDocument: async (permitId, file, documentType, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('documentType', documentType)
        formData.append('permitId', permitId)

        const response = await api.upload('/documents/upload', formData, onProgress)
        return response.data
    },

    // Upload multiple documents
    uploadMultipleDocuments: async (permitId, files, documentTypes, onProgress) => {
        const formData = new FormData()

        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file)
            formData.append(`documentTypes[${index}]`, documentTypes[index])
        })
        formData.append('permitId', permitId)

        const response = await api.upload('/documents/upload-multiple', formData, onProgress)
        return response.data
    },

    // Get documents for permit
    getPermitDocuments: async (permitId) => {
        const response = await api.get(`/documents/permit/${permitId}`)
        return response.data
    },

    // Download document
    downloadDocument: async (documentId, filename) => {
        return api.download(`/documents/${documentId}/download`, filename)
    },

    // Delete document
    deleteDocument: async (documentId) => {
        const response = await api.delete(`/documents/${documentId}`)
        return response.data
    },

    // Get document preview
    getDocumentPreview: async (documentId) => {
        const response = await api.get(`/documents/${documentId}/preview`)
        return response.data
    },

    // Generate permit certificate
    generateCertificate: async (permitId) => {
        const response = await api.post(`/documents/permit/${permitId}/certificate`)
        return response.data
    },

    // Get document by ID
    getDocumentById: async (documentId) => {
        const response = await api.get(`/documents/${documentId}`)
        return response.data
    },

    // Update document metadata
    updateDocument: async (documentId, metadata) => {
        const response = await api.put(`/documents/${documentId}`, metadata)
        return response.data
    },

    // Get document types
    getDocumentTypes: async () => {
        const response = await api.get('/documents/types')
        return response.data
    },

    // Validate document
    validateDocument: async (file, documentType) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('documentType', documentType)

        const response = await api.post('/documents/validate', formData)
        return response.data
    }
}

export default documentService