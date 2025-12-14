import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized access - session may have expired');
      }
      return Promise.reject(error);
    }
);

export const apiService = {
  auth: {
    login: (data: { email: string; role: string; faculty?: string }) =>
        apiClient.post('/auth/login', data),
    logout: () => apiClient.post('/auth/logout')
  },

  societies: {
    getAll: (params?: { page?: number; size?: number; search?: string; status?: string; year?: number }) =>
        apiClient.get('/societies/public', { params }),
    getById: (id: string) => apiClient.get(`/societies/public/${id}`),
    getActive: () => apiClient.get('/societies/active'),
    getStatistics: () => apiClient.get('/societies/statistics'),
    register: (data: any) => apiClient.post('/societies/register', data),
    getLatestData: (societyName: string) => apiClient.get(`/societies/latest-data?societyName=${encodeURIComponent(societyName)}`),
    downloadRegistrationPDF: (id: string) => apiClient.get(`/societies/registration/download/${id}`, { responseType: 'blob' }),
  },

  renewals: {
    submit: (data: any) => apiClient.post('/renewals/submit', data),
    getById: (id: string) => apiClient.get(`/renewals/${id}`),
    getLatestData: (societyName: string) => apiClient.get(`/renewals/latest-data?societyName=${encodeURIComponent(societyName)}`),
    downloadPDF: (id: string) => apiClient.get(`/renewals/download/${id}`, { responseType: 'blob' }),
    getStatistics: () => apiClient.get('/renewals/statistics'),
    getPending: (params?: { faculty?: string; status?: string }) =>
        apiClient.get('/renewals/admin/pending', { params }),
    getAll: (params?: { page?: number; size?: number; year?: number; status?: string }) =>
        apiClient.get('/renewals/admin/all', { params }),
    approve: (id: string, data: { comment?: string }) =>
        apiClient.post(`/renewals/admin/approve/${id}`, data),
    reject: (id: string, data: { comment: string }) =>
        apiClient.post(`/renewals/admin/reject/${id}`, data),
  },

  events: {
    request: (data: any) => apiClient.post('/events/request', data),
    getById: (id: string) => apiClient.get(`/events/${id}`),
    getUpcoming: (limit?: number) => apiClient.get('/events/public/upcoming', { params: { limit: limit || 5 } }),
    downloadPDF: (id: string) => apiClient.get(`/events/download/${id}`, { responseType: 'blob' }),
    getPending: () => apiClient.get('/events/admin/pending'),
    getAll: (params?: { page?: number; size?: number; status?: string }) =>
        apiClient.get('/events/admin/all', { params }),
    validateApplicant: (data: { societyName: string; position: string; regNo: string; email: string }) =>
        apiClient.post('/events/validate-applicant', data),
    getApplicantDetails: (societyName: string, position: string) =>
        apiClient.get('/events/applicant-details', { params: { societyName, position } }),

    // Direct Event Approvals
    approve: (id: string, data: { comment?: string }) =>
        apiClient.post(`/events/admin/approve/${id}`, data),
    reject: (id: string, data: { comment: string }) =>
        apiClient.post(`/events/admin/reject/${id}`, data),
  },

  admin: {
    getCurrentUser: () => apiClient.get('/admin/user-info'),
    getDashboard: () => apiClient.get('/admin/dashboard'),
    getPendingApprovals: () => apiClient.get('/admin/pending-approvals'),
    getDeanPending: () => apiClient.get('/admin/dean/pending-applications'),
    getARPending: () => apiClient.get('/admin/ar/pending-applications'),
    getVCPending: () => apiClient.get('/admin/vc/pending-applications'),
    getSSMonitoring: () => apiClient.get('/admin/ss/monitoring-applications'),
    getActivityLogs: (params?: { user?: string; action?: string; page?: number; size?: number }) =>
        apiClient.get('/admin/activity-logs', { params }),
    getSocieties: (params?: { year?: number; status?: string; page?: number; size?: number }) =>
        apiClient.get('/admin/societies', { params }),
    sendBulkEmail: (data: { subject: string; body: string; recipients: string[] }) =>
        apiClient.post('/admin/send-email', data),

    // --- Centralized Approvals (Corrected Paths) ---
    approveRegistration: (id: string, data: { comment?: string }) =>
        apiClient.post(`/admin/approve-registration/${id}`, data),
    rejectRegistration: (id: string, data: { comment: string }) =>
        apiClient.post(`/admin/reject-registration/${id}`, data),

    approveRenewal: (id: string, data: { comment?: string }) =>
        apiClient.post(`/renewals/admin/approve/${id}`, data),
    rejectRenewal: (id: string, data: { comment: string }) =>
        apiClient.post(`/renewals/admin/reject/${id}`, data),

    approveEvent: (id: string, data: { comment?: string }) =>
        apiClient.post(`/events/admin/approve/${id}`, data),
    rejectEvent: (id: string, data: { comment: string }) =>
        apiClient.post(`/events/admin/reject/${id}`, data),

    addUser: (data: any) => apiClient.post('/admin/ar/manage-admin/add', data),
    removeUser: (email: string) => apiClient.post(`/admin/ar/manage-admin/remove?email=${email}`),
    toggleUserActive: (id: string) => apiClient.post(`/admin/ar/manage-admin/toggle-active?id=${id}`),
    getUsers: () => apiClient.get('/admin/ar/manage-admin/all'),
  },

  files: {
    downloadRegistrationPDF: (id: string) =>
        apiClient.get(`/files/download/registration/${id}`, { responseType: 'blob' }),
    downloadEventPDF: (id: string) =>
        apiClient.get(`/files/download/event/${id}`, { responseType: 'blob' }),
    exportSocieties: () =>
        apiClient.get('/files/export/societies', { responseType: 'blob' }),
  },

  validation: {
    validateEmail: (email: string, position: string) =>
        apiClient.post('/validation/email', { email, position }),
    validateMobile: (mobile: string) =>
        apiClient.post('/validation/mobile', { mobile }),
    validateRegistrationNumber: (regNo: string) =>
        apiClient.post('/validation/registration-number', { regNo }),
    validateBulkEmails: (emails: string[]) =>
        apiClient.post('/validation/bulk-emails', { emails }),
  },
};

export default apiService;