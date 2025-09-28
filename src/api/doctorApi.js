import apiClient from './authApi';

// Doctor API methods
export const doctorApi = {
  // Get all patients for a doctor
  getPatients: async () => {
    try {
      const response = await apiClient.get('/doctors/patients');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get patients');
    }
  },

  // Get doctor by ID
  getDoctor: async (id) => {
    try {
      const response = await apiClient.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get doctor');
    }
  },

  // Get patients for a specific doctor
  getDoctorPatients: async (id) => {
    try {
      const response = await apiClient.get(`/doctors/${id}/patients`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get doctor patients');
    }
  }
};

export default doctorApi;
