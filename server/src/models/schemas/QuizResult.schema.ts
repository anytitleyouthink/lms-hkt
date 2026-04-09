
import { ObjectId } from 'mongodb';

export interface QuizResultType {
  _id?: ObjectId;
  user_id: ObjectId;
  quiz_id: ObjectId;
  score: number;
  total_correct: number;
  created_at: Date;
}
