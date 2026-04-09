import { customFetch } from '@/lib/api';

export const quizService = {
  generateQuizFromDoc: async (data: FormData) => {
    return customFetch('/quizzes/generate', {
      method: 'POST',
      body: data, // FormData containing 'document', 'lesson_id', 'title'
      // customFetch should handle FormData by not setting JSON headers if possible
    });
  },

  getQuiz: async (quizId: string) => {
    return customFetch(`/quizzes/${quizId}`, {
      method: 'GET',
    });
  },

  submitQuiz: async (quizId: string, userAnswers: { question_id: string; selected_option: number }[]) => {
    return customFetch(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ user_answers: userAnswers }),
    });
  },
};
