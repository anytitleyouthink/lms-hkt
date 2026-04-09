import { ObjectId } from 'mongodb';

export interface NotificationType {
  _id?: ObjectId;
  user_id: ObjectId;
  title: string;
  message: string;
  is_read?: boolean;
  link?: string;
  created_at?: Date;
}

export default class Notification {
  _id: ObjectId;
  user_id: ObjectId;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: Date;

  constructor(notification: NotificationType) {
    this._id = notification._id || new ObjectId();
    this.user_id = notification.user_id;
    this.title = notification.title;
    this.message = notification.message;
    this.is_read = notification.is_read || false;
    this.link = notification.link;
    this.created_at = notification.created_at || new Date();
  }
}
