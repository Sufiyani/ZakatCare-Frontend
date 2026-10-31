// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Auth API
// export const authAPI = {
//   register: (data) => axios.post(`${API_URL}/auth/register`, data),
//   login: (data) => axios.post(`${API_URL}/auth/login`, data),
//   getProfile: () => axios.get(`${API_URL}/auth/profile`)
// };

// // Donation API
// export const donationAPI = {
//   create: (data) => axios.post(`${API_URL}/donations`, data),
//   getUserDonations: () => axios.get(`${API_URL}/donations/my-donations`),
//   getAllDonations: () => axios.get(`${API_URL}/donations`),
//   updateStatus: (id, status) => axios.put(`${API_URL}/donations/${id}/status`, { status }),
//   getStats: () => axios.get(`${API_URL}/donations/stats`)
// };

// // Campaign API
// export const campaignAPI = {
//   getAll: () => axios.get(`${API_URL}/campaigns`),
//   getAllAdmin: () => axios.get(`${API_URL}/campaigns/all`),
//   getById: (id) => axios.get(`${API_URL}/campaigns/${id}`),
//   create: (data) => axios.post(`${API_URL}/campaigns`, data),
//   update: (id, data) => axios.put(`${API_URL}/campaigns/${id}`, data),
//   delete: (id) => axios.delete(`${API_URL}/campaigns/${id}`)
// };

// export default { authAPI, donationAPI, campaignAPI };

// src/services/api.js

// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Unauthorized - clear token and redirect to login
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // ========================================
// // AUTH API ENDPOINTS
// // ========================================
// export const authAPI = {
//   // Standard login with email/password
//   login: (credentials) => api.post('/auth/login', credentials),
  
//   // Register new user
//   register: (userData) => api.post('/auth/register', userData),
  
//   // Google OAuth - redirects to Google
//   googleLogin: () => {
//     window.location.href = `${API_BASE_URL}/auth/google`;
//   },
  
//   // Google OAuth callback (backend will handle this)
//   googleCallback: (code) => api.get(`/auth/google/callback?code=${code}`),
  
//   // Forgot password - send OTP to email
//   forgotPassword: (data) => api.post('/auth/forgot-password', data),
  
//   // Verify OTP code
//   verifyOTP: (data) => api.post('/auth/verify-otp', data),
  
//   // Reset password with verified OTP
//   resetPassword: (data) => api.post('/auth/reset-password', data),
  
//   // Logout - clear local storage
//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   },
  
//   // Get current user profile
//   getCurrentUser: () => api.get('/auth/me'),
// };

// // ========================================
// // CAMPAIGN API ENDPOINTS
// // ========================================
// export const campaignAPI = {
//   // Get all campaigns (public)
//   getAll: () => api.get('/campaigns'),
  
//   // Get single campaign by ID
//   getById: (id) => api.get(`/campaigns/${id}`),
  
//   // Create new campaign (admin only)
//   create: (campaignData) => api.post('/campaigns', campaignData),
  
//   // Update campaign (admin only)
//   update: (id, campaignData) => api.put(`/campaigns/${id}`, campaignData),
  
//   // Delete campaign (admin only)
//   delete: (id) => api.delete(`/campaigns/${id}`),
  
//   // Get campaign statistics
//   getStats: (id) => api.get(`/campaigns/${id}/stats`),
// };

// // ========================================
// // DONATION API ENDPOINTS
// // ========================================
// export const donationAPI = {
//   // Create new donation
//   create: (donationData) => api.post('/donations', donationData),
  
//   // Get user's donations
//   getUserDonations: () => api.get('/donations/user'),
  
//   // Get all donations (admin only)
//   getAllDonations: () => api.get('/donations'),
  
//   // Get single donation by ID
//   getById: (id) => api.get(`/donations/${id}`),
  
//   // Get donations for a specific campaign
//   getByCampaign: (campaignId) => api.get(`/donations/campaign/${campaignId}`),
  
//   // Update donation status (admin only)
//   updateStatus: (id, status) => api.patch(`/donations/${id}/status`, { status }),
// };

// // ========================================
// // USER API ENDPOINTS
// // ========================================
// export const userAPI = {
//   // Get current user profile
//   getProfile: () => api.get('/users/profile'),
  
//   // Update user profile
//   updateProfile: (userData) => api.put('/users/profile', userData),
  
//   // Get all users (admin only)
//   getAllUsers: () => api.get('/users'),
  
//   // Get single user by ID (admin only)
//   getUserById: (id) => api.get(`/users/${id}`),
  
//   // Update user role (admin only)
//   updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  
//   // Delete user (admin only)
//   deleteUser: (id) => api.delete(`/users/${id}`),
  
//   // Get user statistics
//   getUserStats: () => api.get('/users/stats'),
// };

// // ========================================
// // ADMIN API ENDPOINTS
// // ========================================
// export const adminAPI = {
//   // Get dashboard statistics
//   getDashboardStats: () => api.get('/admin/stats'),
  
//   // Get recent activities
//   getRecentActivities: () => api.get('/admin/activities'),
  
//   // Get all transactions
//   getTransactions: () => api.get('/admin/transactions'),
  
//   // Export data
//   exportData: (type) => api.get(`/admin/export/${type}`, { responseType: 'blob' }),
// };

// export default api;


// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Sirf 401 (Unauthorized) par logout karein, aur check karein ke path login na ho
//     if (error.response?.status === 401 && window.location.pathname !== '/login') {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // ========================================
// // AUTH API ENDPOINTS
// // ========================================
// export const authAPI = {
//   login: (credentials) => api.post('/auth/login', credentials),
//   register: (userData) => api.post('/auth/register', userData),
//   googleLogin: () => {
//     window.location.href = `${API_BASE_URL}/auth/google`;
//   },
//   googleCallback: (code) => api.get(`/auth/google/callback?code=${code}`),
//   forgotPassword: (data) => api.post('/auth/forgot-password', data),
//   verifyOTP: (data) => api.post('/auth/verify-otp', data),
//   resetPassword: (data) => api.post('/auth/reset-password', data),
//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   },
//   getCurrentUser: () => api.get('/auth/me'),
// };

// // ========================================
// // CAMPAIGN API ENDPOINTS
// // ========================================
// export const campaignAPI = {
//   getAll: () => api.get('/campaigns'),
//   getById: (id) => api.get(`/campaigns/${id}`),
//   create: (campaignData) => api.post('/campaigns', campaignData),
//   update: (id, campaignData) => api.put(`/campaigns/${id}`, campaignData),
//   delete: (id) => api.delete(`/campaigns/${id}`),
//   getStats: (id) => api.get(`/campaigns/${id}/stats`),
// };

// // ========================================
// // DONATION API ENDPOINTS
// // ========================================
// export const donationAPI = {
//   create: (donationData) => api.post('/donations', donationData),
//   getUserDonations: () => api.get('/donations/user'), // Ensure backend route is /user
//   getAllDonations: () => api.get('/donations'),
//   getById: (id) => api.get(`/donations/${id}`),
//   getByCampaign: (campaignId) => api.get(`/donations/campaign/${campaignId}`),
//   updateStatus: (id, status) => api.patch(`/donations/${id}/status`, { status }),
// };

// // ========================================
// // USER API ENDPOINTS
// // ========================================
// export const userAPI = {
//   getProfile: () => api.get('/users/profile'),
//   updateProfile: (userData) => api.put('/users/profile', userData),
//   getAllUsers: () => api.get('/users'),
//   getUserById: (id) => api.get(`/users/${id}`),
//   updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
//   deleteUser: (id) => api.delete(`/users/${id}`),
//   getUserStats: () => api.get('/users/stats'),
// };

// export default api;



import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Har request se pehle token add karega
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log("Token attached to request:", token.substring(0, 10) + "...");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: 401 aane par logout karega
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Agar 401 aaye aur hum login page par na hoon
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========================================
// API ENDPOINTS
// ========================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: () => { window.location.href = `${API_BASE_URL}/auth/google`; },
  googleCallback: (code) => api.get(`/auth/google/callback?code=${code}`),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  getCurrentUser: () => api.get('/auth/me'),
};
export const campaignAPI = {
  getAll: () => api.get('/campaigns'),
  getAllAdmin: () => api.get('/campaigns'), // Ye line add karein
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (campaignData) => api.post('/campaigns', campaignData),
  update: (id, campaignData) => api.put(`/campaigns/${id}`, campaignData),
  delete: (id) => api.delete(`/campaigns/${id}`),
  getStats: (id) => api.get(`/campaigns/${id}/stats`),
};

export const donationAPI = {
  create: (donationData) => api.post('/donations', donationData),
  getUserDonations: () => api.get('/donations/user'), 
  getAllDonations: () => api.get('/donations'),
  getStats: () => api.get('/donations/stats'), // Ye line update karein (no ID needed)
  getById: (id) => api.get(`/donations/${id}`),
  getByCampaign: (campaignId) => api.get(`/donations/campaign/${campaignId}`),
  updateStatus: (id, status) => api.put(`/donations/${id}/status`, { status }), // .patch ko .put karein backend ke mutabiq
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),
};

export default api;