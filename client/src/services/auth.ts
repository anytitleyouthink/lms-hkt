import { customFetch } from '@/lib/api';

export const authService = {
  login: async (credentials: any) => {
    return customFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getMe: async () => {
    return customFetch('/users/me', {
      method: 'GET',
    });
  },

  updateMe: async (userData: any) => {
    return customFetch('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  getEmployeeDashboard: async () => {
    return customFetch('/users/dashboard/summary', {
      method: 'GET',
    });
  },

  getTrainerDashboard: async () => {
    return customFetch('/users/trainer/dashboard', {
      method: 'GET',
    });
  },
};
