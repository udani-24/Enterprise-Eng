import apiClient from './authApi';

// Patient API methods
export const patientApi = {
  // Get patient by ID
  getPatient: async (id) => {
    try {
      const response = await apiClient.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get patient');
    }
  },

  // Create a new patient
  createPatient: async (data) => {
    try {
      const response = await apiClient.post('/patients', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create patient');
    }
  },

  // Update patient by ID
  updatePatient: async (id, data) => {
    try {
      const response = await apiClient.put(`/patients/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  },

  // Get all visits for a patient
  getPatientVisits: async (id) => {
    try {
      const response = await apiClient.get(`/patients/${id}/visits`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get patient visits');
    }
  },

  // Add a new visit for a patient
  addPatientVisit: async (id, data) => {
    try {
      const response = await apiClient.post(`/patients/${id}/visits`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add patient visit');
    }
  }
};

export default patientApi;
