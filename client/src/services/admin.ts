import { customFetch } from '@/lib/api';

export const adminService = {
  getUsers: async (emailSearch?: string) => {
    const url = emailSearch ? `/admin/users?email=${encodeURIComponent(emailSearch)}` : '/admin/users';
    return customFetch(url, { method: 'GET' });
  },

  createUser: async (userData: any) => {
    return customFetch('/admin/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  toggleUserStatus: async (user_id: string) => {
    return customFetch(`/admin/users/${user_id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  getCourseEnrollments: async (course_id: string) => {
    return customFetch(`/enrollments/${course_id}/list-user-course`, {
      method: 'GET',
    });
  },

  getAllCourses: async () => {
    return customFetch('/courses', {
      method: 'GET',
    });
  }
};
