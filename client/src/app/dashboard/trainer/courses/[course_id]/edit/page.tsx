'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { courseService } from '@/services/course';
import { quizService } from '@/services/quiz';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Plus, Check, Trash2, Edit2, Loader2, 
  Video, FileText, Image as ImageIcon, Link as LinkIcon, 
  MoreVertical, Upload, Globe, Lock, Play, Save, HelpCircle,
  XCircle, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function EditCoursePage() {
  const { course_id } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['courseDetail', course_id],
    queryFn: () => courseService.getCourseDetail(course_id as string),
    enabled: !!course_id
  });

  const courseData = data?.result;

  // Local state for Course Edits
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<number>(0);
  
  // Local state for New Section
  const [newSectionTitle, setNewSectionTitle] = useState('');

  useEffect(() => {
    if (courseData) {
      setTitle(courseData.title || '');
      setDescription(courseData.description || '');
      setStatus(courseData.status ?? 0);
    }
  }, [courseData]);

  // Mutations
  const updateCourseMutation = useMutation({
    mutationFn: (payload: any) => courseService.updateCourse({ courseId: course_id as string, data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
      toast.success('Cập nhật thông tin khóa học thành công!');
    }
  });
  
  const createSectionMutation = useMutation({
    mutationFn: courseService.createSection,
    onSuccess: () => {
      setNewSectionTitle('');
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
    }
  });

  const deleteSectionMutation = useMutation({
    mutationFn: courseService.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
      toast.success('Đã xóa chương học thành công!');
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  });

  const createLessonMutation = useMutation({
    mutationFn: ({ sectionId, lessonData }: any) => courseService.createLesson(lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
      toast.success('Đã thêm bài học mới!');
    }
  });

  const deleteLessonMutation = useMutation({
    mutationFn: courseService.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
      toast.success('Đã xóa bài học thành công!');
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ sectionId, data }: any) => courseService.updateSection({ sectionId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
      toast.success('Đã cập nhật chương học!');
      setEditingSectionId(null);
    }
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ lessonId, data }: any) => courseService.updateLesson({ lessonId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
      toast.success('Đã cập nhật bài học!');
      setIsLessonModalOpen(false);
    }
  });

  const uploadMediamutation = useMutation({
    mutationFn: courseService.uploadMedia,
  });

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeLessonOrder, setActiveLessonOrder] = useState<number>(0);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonMediaFile, setLessonMediaFile] = useState<File | null>(null);
  const [lessonManualUrl, setLessonManualUrl] = useState('');
  const [lessonType, setLessonType] = useState<number>(0);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  const [quizDocFile, setQuizDocFile] = useState<File | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Đang chuẩn bị...');
  const [showQuizPreview, setShowQuizPreview] = useState(false);
  
  const loaderMessages = [
    "Đang tải tài liệu lên hệ thống...",
    "Đang phân tích cấu trúc bài học...",
    "Trích xuất nội dung từ tệp PDF...",
    "AI đang phân tích kiến thức trọng tâm...",
    "Đang biên soạn câu hỏi trắc nghiệm...",
    "Thiết kế các phương án trả lời...",
    "Tạo giải thích chi tiết cho từng câu...",
    "Đang kiểm tra tính chính xác...",
    "Đang hoàn tất bộ câu hỏi..."
  ];

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'section' | 'lesson' | null;
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: null,
    id: '',
    title: ''
  });

  useEffect(() => {
    let interval: any;
    if (isGeneratingQuiz) {
      let step = 0;
      setLoadingMessage(loaderMessages[0]);
      interval = setInterval(() => {
        step = (step + 1) % loaderMessages.length;
        setLoadingMessage(loaderMessages[step]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGeneratingQuiz]);

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" /></div>;
  if (!courseData) return <div className="p-8 text-center">Không tìm thấy khóa học</div>;

  const toggleLessonExpand = (id: string) => {
    setExpandedLessonId(expandedLessonId === id ? null : id);
  };

  const handleUpdateCourse = () => {
    updateCourseMutation.mutate({ title, description, status: Number(status) });
  };
  const openLessonModal = (sectionId: string, lessonToEdit?: any) => {
    setActiveSectionId(sectionId);
    if (lessonToEdit) {
      setEditingLesson(lessonToEdit);
      setLessonTitle(lessonToEdit.title);
      setLessonContent(lessonToEdit.content || '');
      setLessonManualUrl(lessonToEdit.media_url || '');
      setLessonType(lessonToEdit.type || 0);
      setActiveLessonOrder(lessonToEdit.order);
    } else {
      setEditingLesson(null);
      setLessonTitle('');
      setLessonContent('');
      setLessonManualUrl('');
      setLessonType(0);
      // Giả sử lấy order bài tiếp theo
      const section = courseData.sections.find((s: any) => s._id === sectionId);
      setActiveLessonOrder((section?.lessons?.length || 0) + 1);
    }
    setLessonMediaFile(null);
    setIsLessonModalOpen(true);
    setShowQuizPreview(false);
  };

  const handleAddLesson = async () => {
    if (!lessonTitle || !activeSectionId) return;

    setIsSavingLesson(true);
    setLoadingMessage("Đang khởi tạo...");
    
    try {
      // 1. Tải media lên trước nếu có
      let mediaUrl = lessonManualUrl;
      if (lessonMediaFile) {
        setLoadingMessage("Đang tải tệp tin của bạn lên bộ nhớ...");
        const res = await uploadMediamutation.mutateAsync(lessonMediaFile);
        mediaUrl = res.result.url;
      }

      // 2. Lưu hoặc Cập nhật bài học
      const lessonData = {
        section_id: activeSectionId,
        course_id: course_id as string,
        title: lessonTitle,
        content: lessonContent,
        media_url: mediaUrl,
        type: Number(lessonType),
        order: activeLessonOrder
      };

      let currentLessonId = editingLesson?._id;
      
      if (editingLesson) {
        setLoadingMessage("Đang cập nhật nội dung bài học...");
        await updateLessonMutation.mutateAsync({ lessonId: editingLesson._id, data: lessonData });
      } else {
        setLoadingMessage("Đang tạo bài học mới...");
        const res = await createLessonMutation.mutateAsync({ sectionId: activeSectionId, lessonData });
        currentLessonId = res.result._id;
      }

      // 3. Nếu có file đính kèm làm Quiz -> Gọi AI tự động
      if (quizDocFile && currentLessonId) {
        setLoadingMessage("Tối ưu nội dung: Bắt đầu tạo bài trắc nghiệm AI...");
        setIsGeneratingQuiz(true); // Để kích hoạt hiệu ứng loading premium
        
        const formData = new FormData();
        formData.append('file', quizDocFile);
        formData.append('lesson_id', currentLessonId);
        formData.append('title', `Trắc nghiệm: ${lessonTitle}`);

        await quizService.generateQuizFromDoc(formData);
        toast.success("Hệ thống đã lưu bài học và tạo Quiz AI thành công!");
      } else {
        toast.success(editingLesson ? "Cập nhật bài học thành công!" : "Đã thêm bài học mới!");
      }

      // 4. Kết thúc
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
      setIsLessonModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi lưu bài học");
    } finally {
      setIsSavingLesson(false);
      setIsGeneratingQuiz(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizDocFile || !editingLesson?._id) {
       toast.error("Vui lòng lưu bài học và chọn file PDF trước!");
       return;
    }

    setIsGeneratingQuiz(true);
    try {
      const formData = new FormData();
      formData.append('file', quizDocFile);
      formData.append('lesson_id', editingLesson._id);
      formData.append('title', `Trắc nghiệm: ${lessonTitle}`);

      await quizService.generateQuizFromDoc(formData);
      toast.success("AI đã tạo bộ câu hỏi thành công!");
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tạo Quiz");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa: {courseData.title}</h1>
          <p className="text-gray-500">Quản lý nội dung, upload bài giảng và giao bài tập.</p>
        </div>
      </div>

      <Tabs defaultValue="sections">
        <TabsList className="mb-4">
          <TabsTrigger value="sections">Chương trình học</TabsTrigger>
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
        </TabsList>
        
        {/* TAB TỔNG QUAN */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cập nhật Thông tin Cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên Khóa Học</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái hiển thị</Label>
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
                <Label>Mô tả</Label>
                <Textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <Button 
                onClick={handleUpdateCourse} 
                disabled={updateCourseMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateCourseMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu Thay Đổi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CHƯƠNG TRÌNH */}
        <TabsContent value="sections">
          <Card className="mb-6">
             <CardHeader className="pb-3">
              <CardTitle>Chương trình học</CardTitle>
              <CardDescription>Cấu trúc các chương (Sections) và bài học (Lessons).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {courseData.sections?.map((section: any, sIdx: number) => (
                <div key={section._id} className="border border-gray-200 rounded-xl bg-gray-50/50 p-5">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    {editingSectionId === section._id ? (
                      <div className="flex items-center gap-2 flex-1 mr-4">
                        <Input 
                          value={editingSectionTitle} 
                          onChange={e => setEditingSectionTitle(e.target.value)}
                          className="font-bold h-9"
                        />
                        <Button size="sm" onClick={() => updateSectionMutation.mutate({ sectionId: section._id, data: { title: editingSectionTitle } })}>
                          Lưu
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingSectionId(null)}>Hủy</Button>
                      </div>
                    ) : (
                      <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                        Chương {sIdx + 1}: {section.title}
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-600" onClick={() => {
                          setEditingSectionId(section._id);
                          setEditingSectionTitle(section.title);
                        }}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </h3>
                    )}
                    <div className="flex space-x-2">
                       <Button variant="outline" size="sm" onClick={() => openLessonModal(section._id)}>
                        <Plus className="h-4 w-4 mr-1" /> Thêm Bài
                      </Button>
                      <Button variant="destructive" size="icon" className="h-9 w-9" onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          type: 'section',
                          id: section._id,
                          title: section.title
                        });
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 pl-4">
                    {section.lessons?.map((lesson: any, lIdx: number) => {
                      const isExpanded = expandedLessonId === lesson._id;
                      const isVideo = lesson.media_url?.match(/\.(mp4|webm|ogg)$/i) || lesson.media_url?.includes('video');
                      const isImage = lesson.media_url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

                      return (
                        <div key={lesson._id} className="flex flex-col bg-white rounded shadow-sm border border-gray-100 transition-all overflow-hidden">
                          <div className="flex justify-between items-center p-3 hover:bg-gray-50 cursor-pointer group" onClick={() => toggleLessonExpand(lesson._id)}>
                            <div className="font-medium text-sm text-gray-700 flex items-center gap-2">
                              {isExpanded ? <Check className="w-4 h-4 text-green-500" /> : <Edit2 className="w-3 h-3 text-gray-400" />}
                              {lesson.order}. {lesson.title}
                            </div>
                            <div className="flex items-center space-x-1 opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={(e) => {
                                e.stopPropagation();
                                openLessonModal(section._id, lesson);
                              }}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => {
                                e.stopPropagation();
                                setConfirmModal({
                                  isOpen: true,
                                  type: 'lesson',
                                  id: lesson._id,
                                  title: lesson.title
                                });
                              }}>
                                <Trash2 className="h-4 w-4"/>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                              <div className="space-y-4">
                                {lesson.media_url && (
                                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-black">
                                    {isVideo ? (
                                      <video src={lesson.media_url} controls className="w-full max-h-80 mx-auto" />
                                    ) : isImage ? (
                                      <img src={lesson.media_url} alt={lesson.title} className="w-full max-h-80 object-contain mx-auto" />
                                    ) : (
                                      <div className="p-4 text-center bg-slate-800 text-white text-xs">
                                        <Link href={lesson.media_url} target="_blank" className="underline">Xem tài liệu đính kèm</Link>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {lesson.content && (
                                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-slate-100">
                                    {lesson.content}
                                  </div>
                                )}

                                {/* Quiz Preview for Trainer */}
                                {lesson.quiz && (
                                  <div className="bg-amber-50/50 rounded-xl border border-amber-100 p-4 space-y-3">
                                    <h5 className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-2">
                                      <HelpCircle className="w-4 h-4" /> BÀI TẬP TRẮC NGHIỆM
                                    </h5>
                                    <div className="space-y-4">
                                      {lesson.quiz.questions?.map((q: any, qIdx: number) => (
                                        <div key={q._id || qIdx} className="bg-white p-3 rounded-lg border border-amber-50 shadow-sm">
                                          <p className="text-sm font-bold text-slate-800 mb-2">
                                            {qIdx + 1}. {q.question_text}
                                          </p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {q.options?.map((opt: string, oIdx: number) => (
                                              <div 
                                                key={oIdx} 
                                                className={`text-xs p-2 rounded border ${
                                                  q.correct_answer === oIdx 
                                                  ? 'bg-green-50 border-green-200 text-green-700 font-bold' 
                                                  : 'bg-slate-50 border-slate-100 text-slate-500'
                                                }`}
                                              >
                                                {String.fromCharCode(65 + oIdx)}. {opt}
                                              </div>
                                            ))}
                                          </div>
                                          {q.explanation && (
                                            <p className="mt-2 text-[10px] text-slate-400 italic">
                                              Giải thích: {q.explanation}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {!lesson.media_url && !lesson.content && !lesson.quiz && (
                                  <div className="text-xs text-slate-400 italic text-center py-2">
                                    Bài học này chưa có nội dung.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {(!section.lessons || section.lessons.length === 0) && (
                      <div className="text-sm italic text-gray-500 py-2">Chưa có bài học nào trong chương này.</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-center space-x-3 pt-4 border-t">
                <Input 
                  placeholder="Nhập tên chương mới (VD: Phần 1: Mở đầu)..." 
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="max-w-sm"
                />
                <Button 
                  onClick={() => createSectionMutation.mutate({ course_id: course_id as string, title: newSectionTitle, order: (courseData.sections?.length || 0) + 1 })}
                  disabled={!newSectionTitle || createSectionMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" /> Tạo Chương
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-0 relative max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1 hover:bg-slate-100 rounded-full transition-colors"
              onClick={() => setIsLessonModalOpen(false)}
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 leading-tight">
                {editingLesson ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Điền thông tin chi tiết cho bài học của bạn</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div>
                <Label className="text-slate-700 font-bold">Tên bài học</Label>
                <Input 
                  placeholder="VD: Giới thiệu khóa học..." 
                  value={lessonTitle}
                  onChange={e => setLessonTitle(e.target.value)}
                  className="mt-1.5 rounded-xl border-slate-200 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <Label className="text-slate-700 font-bold">Nội dung bài viết (Tùy chọn)</Label>
                <Textarea 
                  rows={4}
                  placeholder="Nhập nội dung kiến thức hoặc mô tả bài học..."
                  value={lessonContent}
                  onChange={e => setLessonContent(e.target.value)}
                  className="mt-1.5 rounded-xl border-slate-200 focus:ring-blue-500 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 font-bold">Loại bài học</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1.5 transition-all"
                    value={lessonType}
                    onChange={(e) => setLessonType(Number(e.target.value))}
                  >
                    <option value={0}>Video bài giảng</option>
                    <option value={1}>Tài liệu / Bài viết</option>
                  </select>
                </div>
                <div>
                  <Label className="text-slate-700 font-bold">Thứ tự bài</Label>
                   <Input 
                    type="number"
                    value={activeLessonOrder}
                    onChange={e => setActiveLessonOrder(Number(e.target.value))}
                    className="mt-1.5 rounded-xl border-slate-200 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-700 font-bold">Video ngoài (YouTube / Vimeo)</Label>
                <Input 
                  placeholder="Dán link Video vào đây..." 
                  value={lessonManualUrl}
                  onChange={e => setLessonManualUrl(e.target.value)}
                  className="mt-1.5 rounded-xl border-slate-200 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label className="text-slate-700 font-bold">Hoặc tải lên tệp tin</Label>
                <div className="mt-1.5 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
                        {lessonMediaFile ? lessonMediaFile.name : 'Chọn video hoặc ảnh'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Dung lượng tối đa 100MB</p>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => setLessonMediaFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>

              {/* AI Quiz Section */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Bài tập trắc nghiệm AI</h3>
                </div>
                
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 overflow-hidden relative">
                  {isGeneratingQuiz && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
                       <div className="w-16 h-16 relative mb-4">
                          <div className="absolute inset-0 rounded-full bg-amber-200 animate-ping opacity-25"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                          <div className="absolute inset-2 rounded-full bg-amber-500 flex items-center justify-center">
                             <Sparkles className="w-6 h-6 text-white" />
                          </div>
                       </div>
                       <p className="text-amber-800 font-black text-sm text-center animate-pulse">{loadingMessage}</p>
                       <div className="w-48 h-1 bg-amber-100 rounded-full mt-4 overflow-hidden">
                          <div className="h-full bg-amber-500 animate-[loading-progress_15s_ease-in-out_infinite]"></div>
                       </div>
                       <p className="text-[10px] text-amber-500 font-bold mt-2 uppercase tracking-widest">AI đang làm việc nhiệt tình...</p>
                    </div>
                  )}

                  <Label className="text-amber-800 font-bold text-xs">Tải lên tài liệu PDF để AI tự động tạo câu hỏi</Label>
                  <div className="mt-3 flex gap-3">
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept=".pdf"
                        className="hidden" 
                        id="quiz-upload"
                        onChange={(e) => setQuizDocFile(e.target.files?.[0] || null)} 
                      />
                      <label 
                        htmlFor="quiz-upload"
                        className="flex items-center gap-2 px-4 h-10 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-700 cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        {quizDocFile ? quizDocFile.name : 'Chọn file PDF nội dung'}
                      </label>
                    </div>
                    <Button 
                      type="button"
                      size="sm"
                      onClick={handleGenerateQuiz}
                      disabled={!quizDocFile || isGeneratingQuiz || !editingLesson}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl px-4 shrink-0 shadow-lg shadow-amber-200"
                    >
                      Tạo Quiz
                    </Button>
                  </div>

                  {editingLesson?.quiz_id && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Bài học này đã có bộ câu hỏi trắc nghiệm
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowQuizPreview(!showQuizPreview)}
                          className="h-7 text-[10px] font-black text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded-lg px-2"
                        >
                          {showQuizPreview ? 'ỨN XEM TRƯỚC' : 'XEM NỘI DUNG TRẮC NGHIỆM'}
                        </Button>
                      </div>

                      {showQuizPreview && editingLesson.quiz && (
                        <div className="bg-white rounded-xl border border-amber-100 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                           {editingLesson.quiz.questions?.map((q: any, idx: number) => (
                             <div key={idx} className="space-y-2">
                                <p className="text-[11px] font-bold text-slate-700 leading-snug">
                                   <span className="text-amber-500">Câu {idx + 1}:</span> {q.question_text}
                                </p>
                                <div className="grid grid-cols-1 gap-2 pl-4">
                                   {q.options?.map((opt: string, oIdx: number) => (
                                     <div 
                                       key={oIdx} 
                                       className={`text-[10px] p-2 rounded-lg border flex items-center gap-2 ${
                                         q.correct_answer === oIdx 
                                         ? 'bg-green-50 border-green-200 text-green-700 font-bold' 
                                         : 'bg-slate-50 border-slate-100 text-slate-500'
                                       }`}
                                     >
                                        <div className={`w-1.5 h-1.5 rounded-full ${q.correct_answer === oIdx ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                        {String.fromCharCode(65 + oIdx)}. {opt}
                                     </div>
                                   ))}
                                </div>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <Button 
                variant="outline" 
                className="rounded-full font-bold px-6 border-slate-200" 
                onClick={() => setIsLessonModalOpen(false)}
                disabled={isSavingLesson}
              >
                Hủy
              </Button>
              <Button 
                onClick={handleAddLesson} 
                disabled={!lessonTitle || isSavingLesson}
                className="rounded-full font-bold px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                {isSavingLesson && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isSavingLesson ? 'Đang xử lý...' : 'Lưu Bài Học'}
              </Button>
            </div>

            {/* Premium Loader Overlay for sequential process */}
            {isGeneratingQuiz && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-10 animate-in fade-in duration-500 rounded-3xl">
                 <div className="w-24 h-24 relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-25"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-4 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                       <Sparkles className="w-10 h-10 text-white" />
                    </div>
                 </div>
                 <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Đang hoàn thiện nội dung</h3>
                 <p className="text-blue-600 font-bold text-sm text-center animate-pulse h-6">{loadingMessage}</p>
                 <div className="w-64 h-2 bg-slate-100 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-blue-600 animate-[loading-progress_20s_ease-in-out_infinite]"></div>
                 </div>
                 <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    An toàn và Bảo mật bằng AI
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmModal.type === 'section') deleteSectionMutation.mutate(confirmModal.id);
          else if (confirmModal.type === 'lesson') deleteLessonMutation.mutate(confirmModal.id);
        }}
        isLoading={deleteSectionMutation.isPending || deleteLessonMutation.isPending}
        title={confirmModal.type === 'section' ? "Xóa chương học" : "Xóa bài học"}
        description={
          confirmModal.type === 'section' 
            ? `Bạn có chắc chắn muốn xóa chương "${confirmModal.title}" và tất cả bài học bên trong?` 
            : `Bạn có chắc chắn muốn xóa bài học "${confirmModal.title}"?`
        }
      />
    </div>
  );
}
