import { customFetch } from '@/lib/api';

export const courseService = {
  createCourse: async (data: any) => {
    return customFetch('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createSection: async (data: any) => {
    return customFetch('/sections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createLesson: async (data: any) => {
    return customFetch('/lessons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  generateAIQuiz: async (data: { lesson_id: string; title: string }) => {
    return customFetch('/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  uploadMedia: async (file: File) => {
    const formData = new FormData();
    const isVideo = file.type.startsWith('video');
    const endpoint = isVideo ? '/medias/upload-video' : '/medias/upload-image';
    const fieldName = isVideo ? 'video' : 'image';
    
    formData.append(fieldName, file);
    return customFetch(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
  deleteLesson: async (lessonId: string) => {
    return customFetch(`/lessons/${lessonId}`, {
      method: 'DELETE',
    });
  },

  updateLesson: async ({ lessonId, data }: { lessonId: string, data: any }) => {
    return customFetch(`/lessons/${lessonId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteSection: async (sectionId: string) => {
    return customFetch(`/sections/${sectionId}`, {
      method: 'DELETE',
    });
  },
  
  updateSection: async ({ sectionId, data }: { sectionId: string, data: any }) => {
    return customFetch(`/sections/${sectionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  updateCourse: async ({ courseId, data }: { courseId: string, data: any }) => {
    return customFetch(`/courses/${courseId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getCourseDetail: async (courseId: string) => {
    return customFetch(`/courses/${courseId}/detail`, {
      method: 'GET',
    });
  },
};
