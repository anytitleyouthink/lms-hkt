import { customFetch } from '@/lib/api';

export const enrollmentService = {
  requestEnrollment: async (courseId: string) => {
    return customFetch('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    });
  },

  getPendingEnrollments: async (courseId: string) => {
    return customFetch(`/enrollments/${courseId}/requests/pending`, {
      method: 'GET',
    });
  },

  approveEnrollment: async (enrollmentId: string) => {
    return customFetch(`/enrollments/${enrollmentId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 1 }), // 1 for Approved
    });
  },

  rejectEnrollment: async (enrollmentId: string) => {
    return customFetch(`/enrollments/${enrollmentId}/reject`, {
      method: 'DELETE',
    });
  },

  getMyEnrolledCourses: async () => {
    return customFetch('/enrollments/my-courses', {
      method: 'GET',
    });
  },

  getCourseEnrollments: async (courseId: string) => {
    return customFetch(`/enrollments/${courseId}/list-user-course`, {
      method: 'GET',
    });
  },

  updateEnrollmentStatus: async (enrollmentId: string, status: number) => {
    return customFetch(`/enrollments/${enrollmentId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
