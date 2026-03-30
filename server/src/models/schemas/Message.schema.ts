import { ObjectId } from "mongodb";

export interface MessageType {
  _id?: ObjectId;
  course_id: ObjectId;
  sender_id: ObjectId;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}

export default class Message {
  _id: ObjectId;
  course_id: ObjectId;
  sender_id: ObjectId;
  content: string;
  created_at: Date;
  updated_at: Date;

  constructor(message: MessageType) {
    this._id = message._id || new ObjectId();
    this.course_id = message.course_id;
    this.sender_id = message.sender_id;
    this.content = message.content;
    this.created_at = message.created_at || new Date();
    this.updated_at = message.updated_at || new Date();
  }
}
