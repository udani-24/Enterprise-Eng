// Export all API modules
export { authApi, tokenManager } from './authApi';
export { patientApi } from './patientApi';
export { doctorApi } from './doctorApi';

// Default export for convenience
import { authApi } from './authApi';
import { patientApi } from './patientApi';
import { doctorApi } from './doctorApi';

export default {
  authApi,
  patientApi,
  doctorApi
};
