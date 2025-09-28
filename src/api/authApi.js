import axios from 'axios';

// Base URL for Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'udani_jwt_token';

export const tokenManager = {
  // Save token to localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    // Set default authorization header for all requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  }
};

// Initialize token from localStorage on app start
const savedToken = tokenManager.getToken();
if (savedToken) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

// Request interceptor to add auth header
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      tokenManager.removeToken();
      // Redirect to login or trigger auth state update
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authApi = {
  // Register a new doctor
  registerDoctor: async (data) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login doctor and get JWT token
  loginDoctor: async (data) => {
    try {
      const response = await apiClient.post('/auth/login', data);
      const { token, user } = response.data;
      
      // Save token to localStorage
      tokenManager.setToken(token);
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Logout and clear token
  logout: () => {
    tokenManager.removeToken();
  },

  // Get current user info (if token exists)
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user info');
    }
  }
};

export default apiClient;
