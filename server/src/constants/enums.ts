export enum token_type {
  AccessToken,
  RefreshToken,
  forgot_password_token,
  email_verify_token
}
export enum UserRole {
  Employee = 'employee',
  Trainer = 'trainer',
  Admin = 'admin'
}
export enum UserStatus {
  Active,  
  Banned,
  InActive
}
export enum CourseStatus {
  Draft,     
  Published, 
  Archived,
  Deleted
}
export enum LessonType {
  Video,    
  Reading,  
  Quiz  
}
export enum EnrollmentStatus {
  Pending,  
  Approved, 
  Rejected  
}