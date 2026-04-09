import { CreateQuizReqBody } from '~/validations/quizzes.validation'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Quiz from '~/models/schemas/Quiz.schema'
import { QuizResultType } from '~/models/schemas/QuizResult.schema'

class QuizzesService {
  async createQuiz(payload: CreateQuizReqBody) {
    const lessonId = new ObjectId(payload.lesson_id);

    // 1. Xóa Quiz cũ của bài học này (nếu có) để tránh rác DB
    await databaseService.quizzes.deleteMany({ lesson_id: lessonId });
    // Tùy chọn: Xóa cả kết quả làm bài cũ để học viên làm lại từ đầu phiên bản mới
    await databaseService.quizResults.deleteMany({ quiz_id: { $exists: true } }); // Hoặc tìm quiz_id cũ để xóa chính xác hơn

    // 2. Tạo Quiz mới
    const newQuiz = new Quiz({
      ...payload,
      lesson_id: lessonId,
    })

    const result = await databaseService.quizzes.insertOne(newQuiz)
    
    // 3. Cập nhật Lesson để trỏ tới Quiz mới
    await databaseService.lessons.updateOne(
      { _id: lessonId },
      { $set: { quiz_id: result.insertedId } }
    )

    return {
      ...newQuiz,
      _id: result.insertedId
    }
  }
    async getQuizToPlay(quiz_id: string) {
    // Fetch quiz by ID, projecting out the correct_answer field
    const quiz = await databaseService.quizzes.findOne(
      { _id: new ObjectId(quiz_id) },
      { projection: { 'questions.correct_answer': 0 } } // Exclude correct_answer from all questions
    );
    if (!quiz) {
      throw new Error('Quiz not found'); // Best to use your custom ErrorResponse class
    }
    return quiz;
  }
   async submitQuizAnswers(user_id: string, quiz_id: string, user_answers: { question_id: string, selected_option: string }[]) {
    // Fetch the original quiz with answers
    const quiz = await databaseService.quizzes.findOne({ _id: new ObjectId(quiz_id) });
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    let total_correct = 0;
    const total_questions = quiz.questions.length;
    // Create a dictionary of correct answers for O(1) lookups
    const answerMap = new Map(
      quiz.questions.map((q: any, idx: number) => {
        const key = q._id ? q._id.toString() : `q-${idx}`;
        return [key, q.correct_answer];
      })
    );
    // Validate and score the answers
    for (const answer of user_answers) {
      const correctAnswer = answerMap.get(answer.question_id);
      
      // Fix: Dùng !== undefined để cho phép đáp án index 0
      // Ép kiểu cả 2 về Number để so sánh chính xác
      if (correctAnswer !== undefined && Number(correctAnswer) === Number(answer.selected_option)) {
        total_correct++;
      }
    }
    const score_percentage = total_questions > 0 ? (total_correct / total_questions) * 100 : 0;
    const quizResult: QuizResultType = {
      user_id: new ObjectId(user_id),
      quiz_id: new ObjectId(quiz_id),
      score: score_percentage,
      total_correct,
      created_at: new Date()
    };
    // Insert into the new quizResults collection
    await databaseService.quizResults.insertOne(quizResult);
    // Return the result and the original quiz questions (with answers) for review
    return {
      result: quizResult,
      review: quiz.questions
    };
  }
}

const quizzesService = new QuizzesService()
export default quizzesService