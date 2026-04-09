'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { adminService } from '@/services/admin';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, UserCheck, UserX, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getUsers()
  });

  const toggleStatusMutation = useMutation({
    mutationFn: adminService.toggleUserStatus,
    // Optimistic Update: Cập nhật UI ngay lập tức trước khi server phản hồi
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['adminUsers'] });
      const previousUsers = queryClient.getQueryData(['adminUsers']);
      
      queryClient.setQueryData(['adminUsers'], (old: any) => {
        if (!old || !old.result) return old;
        return {
          ...old,
          result: old.result.map((u: any) => 
            // 0 là Active, 2 là InActive (theo Backend Enum)
            u._id === userId ? { ...u, status: u.status === 0 ? 2 : 0 } : u
          )
        };
      });

      return { previousUsers };
    },
    onError: (err: any, userId, context) => {
      queryClient.setQueryData(['adminUsers'], context?.previousUsers);
      toast.error("Lỗi cập nhật trạng thái: " + (err.message || "Lỗi hệ thống"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const createUserMutation = useMutation({
    mutationFn: adminService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setRole('employee');
      toast.success("Tạo người dùng thành công!");
    },
    onError: (err: any) => {
      toast.error("Lỗi tạo user: " + (err.message || "Lỗi hệ thống"));
    }
  });

  const handleCreateUser = () => {
    createUserMutation.mutate({ name, email, role });
  };

  const usersList = useMemo(() => {
    if (!usersData?.result) return [];
    if (!searchEmail) return usersData.result;
    return usersData.result.filter((u: any) => 
      u.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
  }, [usersData, searchEmail]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Quản lý hệ thống Users</h1>
          <p className="text-gray-500">Giám sát tài khoản, phân quyền và khóa truy cập.</p>
        </div>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full" onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Tạo Tài Khoản
        </Button>
      </div>

      <div className="rounded-xl bg-white shadow-sm p-6 border border-gray-100">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-700">Danh Sách Người Dùng</h2>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo Email..."
              className="pl-10 bg-gray-50 border-gray-200 rounded-lg text-sm"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Họ và Tên</th>
                <th className="px-6 py-4">Vai Trò</th>
                <th className="px-6 py-4">Tình Trạng</th>
                <th className="px-6 py-4">Ngày Tham Gia</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : usersList?.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Không tìm thấy người dùng phù hợp.</td></tr>
              ) : (
                usersList.map((user: any) => {
                  const roleLabel = user.role === 'admin' ? 'Quản trị viên' 
                                  : user.role === 'trainer' ? 'Giảng viên'
                                  : 'Nhân viên';
                  const roleColor = user.role === 'admin' ? 'bg-red-100 text-red-800' 
                                  : user.role === 'trainer' ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800';
                  
                  // Backend Enum: 0 = Active, 1 = Banned, 2 = InActive
                  const isActive = user.status === 0;

                  return (
                    <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${!isActive ? 'opacity-80 bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold uppercase shrink-0">
                            {user.name?.charAt(0) || user.email?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.name || 'Người dùng Ẩn danh'}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleColor}`}>
                          {roleLabel}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {!isActive ? (
                           <span className="flex items-center text-red-600 text-xs font-bold"><UserX className="w-3 h-3 mr-1"/> Bị Khóa</span>
                        ) : (
                           <span className="flex items-center text-green-600 text-xs font-bold"><UserCheck className="w-3 h-3 mr-1"/> Hoạt động</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs font-medium">
                         {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-3 text-center">
                         <div className="flex items-center justify-center gap-2">
                           <span className={cn(
                             "text-[10px] font-bold uppercase tracking-tight",
                             !isActive ? "text-slate-400" : "text-green-600"
                           )}>
                             {isActive ? "Active" : "Inactive"}
                           </span>
                           <Switch 
                             checked={isActive}
                             onCheckedChange={() => toggleStatusMutation.mutate(user._id)}
                             disabled={toggleStatusMutation.isPending || user.role === 'admin'}
                           />
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
              onClick={() => setIsModalOpen(false)}
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black mb-1">Tạo Tài Khoản Mới</h2>
            <p className="text-xs text-gray-500 mb-6 border-b pb-4">Cấp phát tài khoản trực tiếp qua hệ thống Admin.</p>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-gray-500">Họ và Tên</Label>
                <Input 
                  value={name} onChange={e => setName(e.target.value)}
                  className="mt-1" placeholder="Nhập tên người dùng..."
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-gray-500">Email Truy Cập</Label>
                <Input 
                  value={email} onChange={e => setEmail(e.target.value)} type="email"
                  className="mt-1" placeholder="example@email.com"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-gray-500">Quyền hạn (Role)</Label>
                <select 
                  className="w-full mt-1 border-gray-200 rounded-lg text-sm bg-gray-50 px-3 py-2"
                  value={role} onChange={e => setRole(e.target.value)}
                >
                  <option value="employee">Nhân viên (Employee)</option>
                  <option value="trainer">Giảng viên (Trainer)</option>
                  <option value="admin">Quản trị (Admin)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button 
                  onClick={handleCreateUser} 
                  disabled={!email || createUserMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createUserMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Tạo Người Dùng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
