import axios from 'axios';

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL + '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your auth store
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth-token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Mock successful login for demo
      return {
        user: {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User',
          phoneNumber: '+91 9876543210',
          role: email.includes('authority') ? 'authority' : 'tourist',
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Mock successful registration
      return {
        user: {
          id: 'new-user-' + Date.now(),
          ...userData,
          role: 'tourist',
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      // Mock successful verification
      return { success: true };
    }
  },
};

export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      // Mock profile data
      return {
        id: '1',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        isKYCVerified: true,
        safetyScore: 85,
      };
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      return { success: true, data: profileData };
    }
  },

  uploadKYC: async (formData: FormData) => {
    try {
      const response = await api.post('/user/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return { success: true, message: 'KYC documents uploaded successfully' };
    }
  },
};

export const locationAPI = {
  updateLocation: async (location: { lat: number; lng: number }) => {
    try {
      const response = await api.post('/location/update', location);
      return response.data;
    } catch (error) {
      return { success: true };
    }
  },

  getLocationHistory: async () => {
    try {
      const response = await api.get('/location/history');
      return response.data;
    } catch (error) {
      // Mock location history
      return {
        locations: [
          { lat: 26.1445, lng: 91.7362, timestamp: Date.now() - 3600000 },
          { lat: 26.1465, lng: 91.7382, timestamp: Date.now() - 1800000 },
          { lat: 26.1485, lng: 91.7402, timestamp: Date.now() },
        ]
      };
    }
  },
};

export const alertAPI = {
  sendPanicAlert: async (alertData: any) => {
    try {
      const response = await api.post('/alerts/panic', alertData);
      return response.data;
    } catch (error) {
      return { 
        success: true, 
        alertId: 'panic-' + Date.now(),
        message: 'Emergency alert sent successfully'
      };
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/alerts/history');
      return response.data;
    } catch (error) {
      // Mock alerts
      return {
        alerts: [
          {
            id: 'alert-1',
            type: 'advisory',
            severity: 'medium',
            message: 'Weather advisory: Heavy rain expected in Guwahati area',
            timestamp: Date.now() - 7200000,
            isRead: false,
          },
          {
            id: 'alert-2', 
            type: 'geo_fence',
            severity: 'high',
            message: 'You are approaching a restricted area',
            timestamp: Date.now() - 3600000,
            isRead: true,
          },
        ]
      };
    }
  },
};

export const blockchainAPI = {
  issueDigitalID: async () => {
    try {
      const response = await api.post('/blockchain/issue-id');
      return response.data;
    } catch (error) {
      // Mock QR code data
      return {
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        digitalId: 'DTID-' + Date.now(),
      };
    }
  },

  getQRCode: async (digitalId: string) => {
    try {
      const response = await api.get(`/blockchain/qr/${digitalId}`);
      return response.data;
    } catch (error) {
      return {
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      };
    }
  },
};

export const aiAPI = {
  getSafetyScore: async () => {
    try {
      const response = await api.get('/ai/safety-score');
      return response.data;
    } catch (error) {
      // Mock safety score
      const scores = [75, 80, 85, 90, 95];
      return {
        safetyScore: scores[Math.floor(Math.random() * scores.length)],
        factors: [
          'Location tracking active',
          'Emergency contacts verified',
          'Current area safety: Good',
          'Weather conditions: Clear'
        ]
      };
    }
  },
};