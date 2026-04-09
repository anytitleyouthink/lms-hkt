'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { courseService } from '@/services/course';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Sparkles, Upload, ArrowLeft, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<number>(0); // 0: Draft
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [sections, setSections] = useState<any[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Mutations
  const uploadMediamutation = useMutation({
    mutationFn: courseService.uploadMedia,
  });

  const createCourseMutation = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: (data) => {
      const id = data?.result?.newCourse?._id || data?.result?._id;
      if(id) {
        setCourseId(id);
        setStep(2); // Go to sections/lessons step
      } else {
        console.error("No course ID returned", data);
      }
    }
  });

  const createSectionMutation = useMutation({
    mutationFn: courseService.createSection,
    onSuccess: (data) => {
      setSections([...sections, { ...data.result, lessons: [] }]);
      setNewSectionTitle('');
    }
  });

  const createLessonMutation = useMutation({
    mutationFn: ({ sectionId, lessonData }: { sectionId: string, lessonData: any }) => courseService.createLesson(lessonData),
    onSuccess: (data, variables) => {
      setSections(sections.map(sec => 
        sec._id === variables.sectionId 
          ? { ...sec, lessons: [...sec.lessons, data.result] }
          : sec
      ));
    }
  });

  const generateQuizMutation = useMutation({
    mutationFn: courseService.generateAIQuiz,
  });

  // Action Handlers
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    let thumbnailUrl = '';
    if (thumbnailFile) {
      const res = await uploadMediamutation.mutateAsync(thumbnailFile);
      thumbnailUrl = res.result.url;
    }

    createCourseMutation.mutate({
      title,
      description,
      status: Number(status),
      thumbnail: thumbnailUrl
    });
  };

  const handleAddSection = () => {
    if (!newSectionTitle || !courseId) return;
    createSectionMutation.mutate({
      course_id: courseId,
      title: newSectionTitle,
      order: sections.length + 1
    });
  };

  // Lesson form states
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonMediaFile, setLessonMediaFile] = useState<File | null>(null);

  const openLessonModal = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setLessonTitle('');
    setLessonContent('');
    setLessonMediaFile(null);
    setIsLessonModalOpen(true);
  };

  const handleAddLesson = async () => {
    if (!lessonTitle || !activeSectionId) return;

    let mediaUrl = '';
    if (lessonMediaFile) {
      const res = await uploadMediamutation.mutateAsync(lessonMediaFile);
      mediaUrl = res.result.url;
    }

    createLessonMutation.mutate({
      sectionId: activeSectionId,
      lessonData: {
        section_id: activeSectionId,
        course_id: courseId,
        title: lessonTitle,
        content: lessonContent,
        media_url: mediaUrl,
        type: 0,
        order: sections.find(s => s._id === activeSectionId)?.lessons?.length || 0 + 1
      }
    });

    setIsLessonModalOpen(false);
  };

  const handleGenerateQuiz = async (lesson_id: string) => {
    const quizTitle = prompt('Nhập tên Quiz đẻ AI tạo:');
    if (!quizTitle) return;

    try {
      await generateQuizMutation.mutateAsync({
        lesson_id,
        title: quizTitle
      });
      alert('Tạo Quiz tự động thành công!');
    } catch (err) {
      console.error(err);
      alert('Lỗi tạo quiz!');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <Link href="/dashboard/trainer">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Về Dashboard
        </Button>
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tạo Khóa Học Mới</h1>
        <p className="text-gray-500">Thiết kế lộ trình học tập, thêm bài giảng và sử dụng AI để tạo bài tập nhanh chóng.</p>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Cung cấp các thông tin chung cho khóa học của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên Khóa Học</Label>
                  <Input id="title" placeholder="VD: Khóa học Lập trình Web..." value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái khởi tạo</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={status}
                    onChange={(e) => setStatus(Number(e.target.value))}
                  >
                    <option value={0}>Nháp (Draft)</option>
                    <option value={1}>Công khai (Published)</option>
                    <option value={2}>Lưu trữ (Archived)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea id="description" rows={4} placeholder="Những điều học viên đạt được sau khóa học..." value={description} onChange={e => setDescription(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Ảnh Thumbnail (Tải lên)</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Bấm để chọn file</span> hoặc kéo thả</p>
                      <p className="text-xs text-gray-500">{thumbnailFile ? thumbnailFile.name : 'Chưa có file nào được chọn'}</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createCourseMutation.isPending || uploadMediamutation.isPending}>
                {(createCourseMutation.isPending || uploadMediamutation.isPending) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Lưu và Chuyển sang Bước 2 (Chương trình học)
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && courseId && (
        <Card>
          <CardHeader>
            <CardTitle>Chương trình học (Sections & Lessons)</CardTitle>
            <CardDescription>Thêm các chương học và bài giảng cho khóa học này.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section, idx) => (
              <div key={section._id || idx} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Chương {idx + 1}: {section.title}</h3>
                  <Button variant="outline" size="sm" onClick={() => openLessonModal(section._id)}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm Bài học
                  </Button>
                </div>
                
                <div className="space-y-3 pl-4 border-l-2 border-gray-200 ml-2">
                  {section.lessons?.map((lesson: any, lIdx: number) => (
                    <div key={lesson._id || lIdx} className="bg-white p-3 rounded-md shadow-sm border flex justify-between items-center">
                      <span className="font-medium text-sm">Bài {lIdx + 1}: {lesson.title}</span>
                      
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700"
                        onClick={() => handleGenerateQuiz(lesson._id)}
                      >
                        <Sparkles className="h-4 w-4 mr-2" /> Tạo Quiz AI
                      </Button>
                    </div>
                  ))}
                  {section.lessons?.length === 0 && <div className="text-sm text-gray-500 italic">Chưa có bài học nào.</div>}
                </div>
              </div>
            ))}

            <div className="flex space-x-2 pt-4">
              <Input 
                placeholder="Tên chương mới, ví dụ: Chương 1: Mở Đầu" 
                value={newSectionTitle} 
                onChange={(e) => setNewSectionTitle(e.target.value)} 
              />
              <Button onClick={handleAddSection} disabled={createSectionMutation.isPending || !newSectionTitle}>
                <Plus className="mr-2 h-4 w-4" /> Tạo Chương
              </Button>
            </div>

          </CardContent>
        </Card>
      )}

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsLessonModalOpen(false)}
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Tạo Bài Học Mới</h2>
            
            <div className="space-y-4">
              <div>
                <Label>Tên bài học</Label>
                <Input 
                  placeholder="VD: Giới thiệu khóa học..." 
                  value={lessonTitle}
                  onChange={e => setLessonTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Nội dung (Content)</Label>
                <Textarea 
                  rows={4}
                  placeholder="Mô tả nội dung bài học..."
                  value={lessonContent}
                  onChange={e => setLessonContent(e.target.value)}
                />
              </div>

              <div>
                <Label>Video/Tài liệu (Không bắt buộc)</Label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">{lessonMediaFile ? lessonMediaFile.name : 'Tải lên Media'}</p>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => setLessonMediaFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsLessonModalOpen(false)}>Hủy</Button>
                <Button 
                  onClick={handleAddLesson} 
                  disabled={!lessonTitle || createLessonMutation.isPending || uploadMediamutation.isPending}
                >
                  {(createLessonMutation.isPending || uploadMediamutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Lưu Bài Học
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
