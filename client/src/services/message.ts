import { customFetch } from '@/lib/api';

export interface MessagePayload {
  content: string;
  created_at: string;
  _id: string;
  sender_info: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total_pages: number;
  total_messages: number;
}

export interface MessagesResponse {
  message: string;
  result: MessagePayload[];
  pagination: PaginationInfo;
}

export const messageService = {
  getMessagesByCourse: async (courseId: string, page: number = 1, limit: number = 50): Promise<MessagesResponse> => {
    return customFetch(`/messages/${courseId}?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  },
};
