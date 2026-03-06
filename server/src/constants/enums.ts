export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}
export enum token_type {
  AccessToken,
  RefreshToken,
  forgot_password_token,
  email_verify_token
}
export enum MediaType {
  Image,
  Video,
  VideoHls
}
export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}
export enum EncodingStatus {
  Pending,
  Processing,
  Success,
  Failed
}
export enum PostType {
  Post,
  RePost,
  Comment,
  QuotePost
}

export enum PostAudience {
  Everyone, // 0
  PostCircle, // 1
  Friends,  // 2
}
export enum PeopleFollow {
  Anyone = '0',
  Following = '1'
}

