'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { certificateService } from '@/services/certificate';
import { 
  Award, 
  Loader2, 
  Download, 
  Eye, 
  Calendar, 
  Search,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CertificatesPage = () => {
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: certsData, isLoading } = useQuery({
    queryKey: ['myCertificates'],
    queryFn: () => certificateService.getUserCertificates(),
  });

  const certificates = certsData?.result || [];

  const filteredCerts = certificates.filter((cert: any) => 
    cert.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.cert_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCertificate = (cert: any) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Đang tải danh sách chứng chỉ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">
              HỒ SƠ NĂNG LỰC
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Chứng chỉ của tôi</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Nơi lưu giữ những nỗ lực và thành quả của bạn trong quá trình học tập.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Tìm kiếm chứng chỉ..." 
            className="pl-10 h-12 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert: any) => (
            <Card key={cert._id} className="group overflow-hidden border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-50 rounded-3xl bg-white border-2">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-blue-50 transition-colors">
                      <Award className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                      Official
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight min-h-[56px] line-clamp-2">
                    {cert.course_name}
                  </h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Cấp ngày: {formatDate(cert.issued_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Search className="w-4 h-4" />
                      <span className="font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        Mã: {cert.cert_code}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 rounded-2xl font-black bg-slate-900 hover:bg-blue-600 text-white transition-all flex items-center justify-center gap-2 group-hover:translate-y-[-2px]"
                    onClick={() => openCertificate(cert)}
                  >
                    <Eye className="w-4 h-4" />
                    XEM CHỨNG CHỈ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Award className="w-10 h-10 text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Chưa có chứng chỉ nào</h2>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">
            Hãy hoàn thành các khóa học để nhận được những chứng chỉ danh giá đầu tiên của bạn!
          </p>
          <Button 
            className="mt-8 rounded-full font-bold px-8" 
            variant="outline"
            onClick={() => window.location.href = '/dashboard/employee/courses'}
          >
            Khám phá khóa học ngay
          </Button>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {isModalOpen && selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 leading-none">Bản xem trước chứng chỉ</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Hệ thống cấp bởi Victory TTT</p>
                </div>
              </div>
              <button 
                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 bg-slate-100 p-4 md:p-8 overflow-auto flex items-center justify-center">
              <div className="bg-white shadow-2xl rounded-sm overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                <iframe 
                  srcDoc={selectedCert.content_html}
                  className="w-[800px] h-[600px] border-none shadow-inner"
                  title="Certificate Content"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-center gap-4 shrink-0 bg-white">
               <p className="text-sm text-slate-500 italic flex items-center gap-2 font-medium">
                 Năng lực của bạn là tài sản quý giá nhất!
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
