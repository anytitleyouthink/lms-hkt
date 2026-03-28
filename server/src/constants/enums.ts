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
}
export enum CourseStatus {
  Draft,     
  Published, 
  Archived   
}
export enum LessonType {
  Video,    
  Reading,  
  Quiz  
}