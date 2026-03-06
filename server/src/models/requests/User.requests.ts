import { token_type, UserVerifyStatus } from "~/constants/enums"
import { ParamsDictionary } from "express-serve-static-core"

export interface VerifyEmailReqBody {
  email_verify_token: string
}
export interface LogoutReqBody {
  refresh_token: string
}
export interface RefreshTokenReqBody {
  refresh_token: string
}
export interface GetProfileReqParams extends ParamsDictionary {
  username: string
}
export interface TokenPayload {
  user_id: string
  token_type: number
  verify: number
  iat?: number
  exp?: number
}

export interface OAuthResult {
  access_token: string
  refresh_token: string
  newUser: number
  verify: string 
}