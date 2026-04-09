import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export const useAuth = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data: any) => {
      // Backend returns: { message: "Login successful", result: { access_token, refresh_token } }
      // the exact structure might vary slightly, based on `auth.routes.ts`:
      // Return: { message: string, result: { access_token, refresh_token } }
      const token = data?.result?.access_token || data?.access_token;
      
      if (token) {
        localStorage.setItem('access_token', token);
        // After saving token, get user profile
        try {
          const userResponse = await authService.getMe();
          const userRole = userResponse?.role || userResponse?.result?.role;
          
          // Role Based Redirection
          if (userRole === 'employee') {
            router.push('/dashboard/employee');
          } else if (userRole === 'trainer') {
            router.push('/dashboard/trainer');
          } else if (userRole === 'admin') {
            router.push('/dashboard/admin');
          } else {
            router.push('/dashboard/employee');
          }
        } catch (error) {
          console.error('Lỗi lấy thông tin user', error);
        }
      }
    },
    onError: (error: any) => {
      console.error('Đăng nhập thất bại', error);
    }
  });

  const userQuery = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    retry: 1,
    enabled: !!(
      typeof window !== 'undefined' && 
      localStorage.getItem('access_token') && 
      localStorage.getItem('access_token') !== 'undefined' && 
      localStorage.getItem('access_token') !== 'null'
    ),
  });

  // Chỉ lấy lỗi từ login mutation nếu đang ở trang login
  // Hoặc bỏ qua lỗi 401 từ userQuery vì nó chỉ đơn giản là chưa đăng nhập
  const authError = userQuery.error && (userQuery.error as any).message?.includes('401') 
    ? null 
    : userQuery.error;

  return {
    login: loginMutation.mutate,
    isLoading: mounted && (loginMutation.isPending || userQuery.isLoading),
    error: loginMutation.error || authError,
    user: userQuery.data?.result || userQuery.data, 
    refetchUser: userQuery.refetch
  };
};
