import { customFetch } from '@/lib/api';

export const trainerService = {
  getDashboardSummary: async () => {
    return customFetch('/users/trainer/dashboard', {
      method: 'GET',
    });
  },

  getPendingRequestsForCourse: async (courseId: string) => {
    return customFetch(`/enrollments/${courseId}/requests/pending`, { // Backend route specific as per user
      method: 'GET',
    });
  },

  approveRequest: async (enrollmentId: string) => {
    return customFetch(`/enrollments/${enrollmentId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 1 }), // 1 for Approved
    });
  },

  rejectRequest: async (enrollmentId: string) => {
    // Calling backend DELETE reject endpoint
    return customFetch(`/enrollments/${enrollmentId}/reject`, {
      method: 'DELETE',
    });
  }
};
