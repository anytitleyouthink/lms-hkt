import { th, tr } from "@faker-js/faker/.";
import { ObjectId } from "mongodb";
import {UserRole, UserStatus} from "~/constants/enums";


export interface UserType {
  _id?: ObjectId
  name?: string
  email: string
  date_of_birth?: Date
  password: string,
  role: UserRole;
  isFirstLogin?: boolean;
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  status: UserStatus
  forgot_password_token?: string
  bio?: string
  phone?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export default class UserSchema {
  _id: ObjectId
  name: string
  email: string
  date_of_birth: Date
  phone?: string
  password: string
  created_at: Date
  updated_at: Date
  role: UserRole
  isFirstLogin?: boolean
  forgot_password_token: string
  status: UserStatus
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id ?? new ObjectId()
    this.status = user.status?? UserStatus.Active
    this.name = user.name ?? ''
    this.email = user.email
    this.phone = user.phone ?? ''
    this.date_of_birth = user.date_of_birth ?? new Date()
    this.role = user.role ?? UserRole.Employee
    this.isFirstLogin = user.isFirstLogin ?? true
    this.password = user.password
    this.created_at = user.created_at ?? date
    this.updated_at = user.updated_at ?? date
    this.forgot_password_token = user.forgot_password_token ?? ''
    this.bio = user.bio
    this.location = user.location
    this.website = user.website
    this.username = user.username
    this.avatar = user.avatar ?? 'https://res.cloudinary.com/drmlhwutz/image/upload/v1774888646/lms/images/ea6ac8e4-6470-4cb9-bedf-9ce58f65838a-anhdaidienmacdinh.jpg'
    this.cover_photo = user.cover_photo
  }
}
