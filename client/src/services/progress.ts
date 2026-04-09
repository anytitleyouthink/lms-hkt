import { customFetch } from '@/lib/api';

export const progressService = {
  completeLesson: async (data: { course_id: string; lesson_id: string }) => {
    return customFetch('/progress/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProgress: async (courseId: string) => {
    return customFetch(`/progress/course/${courseId}`, {
      method: 'GET',
    });
  },
};
