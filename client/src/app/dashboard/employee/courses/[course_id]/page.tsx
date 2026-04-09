'use client';
// Refreshed code after removing ScrollArea

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseService } from '@/services/course';
import { progressService } from '@/services/progress';
import { quizService } from '@/services/quiz';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CourseChat } from '@/components/chat/CourseChat';
import { toast } from 'sonner';
import { 
  Loader2, 
  ChevronLeft, 
  PlayCircle, 
  FileText, 
  CheckCircle, 
  Lock,
  ChevronRight,
  Menu,
  X,
  HelpCircle,
  Award,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const LearningPage = () => {
  const { course_id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Quiz states
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // mutation đánh bài học là hoàn thành
  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: string) => 
      progressService.completeLesson({ 
        course_id: course_id as string, 
        lesson_id: lessonId 
      }),
    onSuccess: (data) => {
      toast.success('Ghi nhận hoàn thành bài học thành công!');
      // Invalidate course detail để có thể cập nhật icon checkmark (nếu sau này có field completed)
      queryClient.invalidateQueries({ queryKey: ['courseDetail', course_id] });
      
      if (data.result?.isEligibleForCertificate) {
        toast.success(`Chúc mừng! Bạn đã hoàn thành 100% và đủ điều kiện nhận chứng chỉ! Mã: ${data.result.certCode}`, {
          duration: 10000,
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật tiến độ.');
    }
  });
  const quiz = selectedLesson?.quiz;

  const submitQuizMutation = useMutation({
    mutationFn: (answers: any) => quizService.submitQuiz(selectedLesson.quiz_id, answers),
    onSuccess: (data) => {
      setQuizResult(data.result);
      setIsQuizSubmitted(true);
      toast.success(`Nộp bài thành công! Điểm của bạn: ${Math.round(data.result.result.score)}%`);
      
      if (data.result.result.score >= (quiz?.passing_score || 80)) {
        toast.success("Chúc mừng! Bạn đã vượt qua bài trắc nghiệm này.");
      } else {
        toast.error("Rất tiếc, bạn chưa đạt điểm đỗ. Vui lòng thử lại!");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Lỗi khi nộp bài');
    }
  });

  const handleQuizOptionSelect = (questionId: string, optionIndex: number) => {
     if (isQuizSubmitted) return;
     setUserAnswers(prev => ({
       ...prev,
       [questionId]: optionIndex
     }));
  };

  const handleQuizSubmit = () => {
    if (!quiz) return;
    const answersArray = quiz.questions.map((q: any, idx: number) => {
      const questionKey = q._id || `q-${idx}`;
      return {
        question_id: questionKey, // Dùng ID hoặc key dự phòng (q-index)
        selected_option: userAnswers[questionKey] ?? -1
      };
    });
    
    if (answersArray.some((a: any) => a.selected_option === -1)) {
      toast.warning("Vui lòng trả lời hết tất cả các câu hỏi!");
      return;
    }

    submitQuizMutation.mutate(answersArray);
  };

  const isQuizPassed = quizResult ? quizResult.result.score >= (quiz?.passing_score || 80) : false;
  const canMarkComplete = selectedLesson?.quiz_id ? isQuizPassed : true;

  // Reset quiz state when lesson changes
  useEffect(() => {
    setUserAnswers({});
    setQuizResult(null);
    setIsQuizSubmitted(false);
  }, [selectedLesson?._id]);

  // 1. Fetch chi tiết khóa học bao gồm Sections và Lessons
  const { data: courseData, isLoading } = useQuery({
    queryKey: ['courseDetail', course_id],
    queryFn: () => courseService.getCourseDetail(course_id as string),
    enabled: !!course_id,
  });

  const course = courseData?.result || courseData;

  // 2. Mặc định chọn bài học đầu tiên OR đồng bộ dữ liệu mới nhất
  useEffect(() => {
    if (course?.sections?.length > 0) {
      // Nếu chưa chọn bài nào -> Chọn bài đầu tiên
      if (!selectedLesson) {
        const firstSection = course.sections[0];
        if (firstSection.lessons?.length > 0) {
          setSelectedLesson(firstSection.lessons[0]);
        }
      } else {
        // Nếu đã chọn bài -> Tìm lại bài đó trong dữ liệu mới để đồng bộ (cập nhật quiz_id mới chẳng hạn)
        let found = false;
        for (const section of course.sections) {
          const freshLesson = section.lessons.find((l: any) => l._id === selectedLesson._id);
          if (freshLesson) {
            // Chỉ cập nhật nếu có sự thay đổi (nhánh này giúp tránh render vòng lặp vô tận)
            if (JSON.stringify(freshLesson) !== JSON.stringify(selectedLesson)) {
              setSelectedLesson(freshLesson);
            }
            found = true;
            break;
          }
        }
        // Nếu bài cũ bị xóa hoặc không tìm thấy nữa -> Reset về bài đầu tiên
        if (!found) {
          const firstSection = course.sections[0];
          if (firstSection.lessons?.length > 0) {
            setSelectedLesson(firstSection.lessons[0]);
          }
        }
      }
    }
  }, [course, selectedLesson?._id]); // Phụ thuộc vào ID bài học đang chọn

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Đang chuẩn bị bài học cho bạn...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Không tìm thấy thông tin khóa học.</p>
      </div>
    );
  }

  const sections = course.sections || [];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar - Danh sách bài học */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-slate-50 border-l border-slate-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200 bg-white">
            <h2 className="font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{course.title}</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">NỘI DUNG KHÓA HỌC</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-2 space-y-4">
              {sections.map((section: any, sIdx: number) => (
                <div key={section._id || `section-${sIdx}`} className="space-y-1">
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      Chương {sIdx + 1}: {section.title}
                    </h3>
                  </div>
                  <div className="space-y-0.5">
                    {section.lessons?.map((lesson: any, lIdx: number) => {
                      const isActive = selectedLesson?._id === lesson._id;
                      return (
                        <button
                          key={lesson._id || `lesson-${lIdx}`}
                          onClick={() => {
                            setSelectedLesson(lesson);
                            if (window.innerWidth < 1024) setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${
                            isActive 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                              : 'text-slate-600 hover:bg-white hover:text-blue-600'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
                            {lesson.lesson_type === 0 ? (
                              <PlayCircle className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                            ) : (
                              <FileText className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate leading-none mb-1">{lesson.title}</p>
                            <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                              {lesson.lesson_type === 0 ? 'Video bài giảng' : 'Tài liệu hướng dẫn'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header điều hướng */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <Link href="/dashboard/employee/courses" className="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Quay lại danh sách</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full border-slate-200 text-slate-600 font-bold hidden md:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? 'Ẩn danh sách' : 'Hiện danh sách'}
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Lesson Viewer */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-6 md:p-12">
            {selectedLesson ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Media Section */}
                {selectedLesson.media_url && (
                  <div className="mb-8 animate-in fade-in zoom-in duration-700">
                    {/* 1. Kiểm tra nếu là YouTube/Vimeo (Nhúng Iframe) */}
                    {(selectedLesson.media_url.includes('youtube.com') || selectedLesson.media_url.includes('youtu.be')) ? (
                      <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50">
                        <iframe
                          src={selectedLesson.media_url.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                          title={selectedLesson.title}
                        />
                      </div>
                    ) : (selectedLesson.media_url.match(/\.(mp4|webm|ogg)$/i) || selectedLesson.media_url.includes('video')) ? (
                      /* 2. Nếu là Video tải lên (Direct Link) */
                      <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50">
                        <video 
                          src={selectedLesson.media_url} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (selectedLesson.media_url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || selectedLesson.media_url.includes('image')) ? (
                      /* 3. Nếu là Hình ảnh */
                      <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-50 bg-white">
                        <img 
                          src={selectedLesson.media_url} 
                          alt={selectedLesson.title} 
                          className="w-full max-h-[500px] object-contain mx-auto"
                        />
                      </div>
                    ) : (
                      /* 4. Các loại tệp khác */
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
                        <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Tài liệu đính kèm</h4>
                        <p className="text-slate-500 text-sm mb-4">Bài học này có chứa tệp tài liệu bổ trợ.</p>
                        <a 
                          href={selectedLesson.media_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Xem tài liệu ngay
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {selectedLesson.lesson_type === 0 ? 'VIDEO BÀI GIẢNG' : 'BÀI VIẾT'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 text-xs font-medium">Bắt đầu học ngay nào!</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight">
                    {selectedLesson.title}
                  </h1>
                </div>

                {/* Content Section */}
                <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-800">
                  <div dangerouslySetInnerHTML={{ __html: selectedLesson.content || '<p class="text-slate-400 italic">Nội dung bài học này đang được cập nhật...</p>' }} />
                </div>

                {/* Quiz Section */}
                {selectedLesson.quiz_id && (
                  <div className="mt-16 bg-slate-50 border-2 border-blue-100 rounded-[40px] p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="bg-blue-600 p-2 rounded-2xl text-white shadow-lg shadow-blue-200">
                          <HelpCircle className="w-6 h-6" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-slate-800 leading-none">Bài tập kiểm tra</h2>
                          <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Kiểm tra kiến thức đã học</p>
                       </div>
                    </div>

                    {submitQuizMutation.isPending ? (
                      <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                      </div>
                    ) : quiz ? (
                      <div className="space-y-10">
                        {quiz.questions.map((q: any, idx: number) => {
                          const questionKey = q._id || `q-${idx}`;
                          const isCorrect = isQuizSubmitted && quizResult?.review[idx]?.correct_answer === userAnswers[questionKey];
                          return (
                            <div key={questionKey} className="space-y-4">
                              <p className="font-bold text-slate-700 flex gap-3">
                                <span className="text-blue-500">Q{idx + 1}.</span> {q.question_text}
                              </p>
                              <div className="grid grid-cols-1 gap-3">
                                {q.options.map((opt: string, optIdx: number) => {
                                  const isSelected = userAnswers[questionKey] === optIdx;
                                  const showCorrect = isQuizSubmitted && quizResult?.review[idx]?.correct_answer === optIdx;
                                  const showWrong = isQuizSubmitted && isSelected && !isCorrect;

                                  return (
                                    <button
                                      key={`${questionKey}-opt-${optIdx}`}
                                      onClick={() => handleQuizOptionSelect(questionKey, optIdx)}
                                      disabled={isQuizSubmitted}
                                      className={`text-left p-4 rounded-2xl border-2 transition-all font-medium flex items-center justify-between group ${
                                        showCorrect ? 'bg-green-50 border-green-500 text-green-700' :
                                        showWrong ? 'bg-red-50 border-red-500 text-red-700' :
                                        isSelected ? 'bg-blue-50 border-blue-500 text-blue-700' :
                                        'bg-white border-slate-100 hover:border-blue-200 text-slate-600'
                                      }`}
                                    >
                                      <span>{opt}</span>
                                      {showCorrect && <CheckCircle className="w-5 h-5" />}
                                      {showWrong && <AlertCircle className="w-5 h-5" />}
                                    </button>
                                  );
                                })}
                              </div>
                              {isQuizSubmitted && quizResult?.review[idx]?.explanation && (
                                <div className="p-4 bg-blue-50/50 rounded-2xl text-xs text-blue-600 italic border border-blue-100">
                                  <strong>Giải thích:</strong> {quizResult.review[idx].explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {!isQuizSubmitted ? (
                          <Button 
                            className="w-full h-14 rounded-full font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100"
                            onClick={handleQuizSubmit}
                            disabled={submitQuizMutation.isPending}
                          >
                            {submitQuizMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'NỘP BÀI KIỂM TRA'}
                          </Button>
                        ) : (
                          <div className={`p-6 rounded-[2rem] text-center border-2 ${isQuizPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                             <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isQuizPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {isQuizPassed ? <Award /> : <AlertCircle />}
                             </div>
                             <h4 className="text-xl font-black text-slate-800">Kết quả: {Math.round(quizResult.result.score)}%</h4>
                             <p className={`text-sm font-medium mt-1 ${isQuizPassed ? 'text-green-600' : 'text-red-600'}`}>
                                {isQuizPassed ? 'BẠN ĐÃ VƯỢT QUA! Giờ bạn có thể hoàn thành bài học này.' : 'BẠN CẦN ĐẠT ĐIỂM CAO HƠN ĐỂ ĐỖ. Hãy thử lại nhé!'}
                             </p>
                             {!isQuizPassed && (
                               <Button 
                                variant="outline" 
                                className="mt-4 rounded-full font-bold border-red-200 text-red-600 hover:bg-red-100"
                                onClick={() => {
                                  setIsQuizSubmitted(false);
                                  setQuizResult(null);
                                  setUserAnswers({});
                                }}
                               >
                                 Thử lại ngay
                               </Button>
                             )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-slate-400 py-8">Không thể tải nội dung trắc nghiệm.</p>
                    )}
                  </div>
                )}

                {/* Navigation / Completion Section */}
                <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-6 md:-mx-12 px-6 md:px-12 py-10 rounded-b-3xl">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-green-600 font-bold">
                        <CheckCircle className="w-5 h-5" />
                        <span>Sẵn sàng để kết thúc bài này?</span>
                      </div>
                      <p className="text-xs text-slate-500">Hệ thống sẽ ghi nhận tiến độ sau khi bạn nhấn nút.</p>
                      {!canMarkComplete && (
                        <p className="text-[10px] text-red-500 font-black flex items-center gap-1 mt-1">
                          <Lock className="w-3 h-3" /> BẠN CẦN HOÀN THÀNH BÀI TRẮC NGHIỆM TRƯỚC
                        </p>
                      )}
                   </div>
                   
                   <Button 
                    size="lg"
                    className={`rounded-full font-black px-8 transition-all hover:scale-105 active:scale-95 shadow-xl ${
                      canMarkComplete 
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-100' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                    onClick={() => canMarkComplete && completeLessonMutation.mutate(selectedLesson._id)}
                    disabled={completeLessonMutation.isPending || !canMarkComplete}
                   >
                    {completeLessonMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Hoàn thành bài học'
                    )}
                   </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <PlayCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Sẵn sàng để bắt đầu chưa?</h2>
                <p className="text-slate-500">Chọn một bài học từ danh sách bên phải để bắt đầu hành trình của bạn.</p>
              </div>
            )}
          </div>
          </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <CourseChat courseId={course_id as string} />
    </div>
  );
};

export default LearningPage;
