import { Request, Response } from 'express';
import { UserType } from './models/schemas/User.schema';
import { TokenPayload } from './models/requests/User.requests';
import Post from './models/schemas/Post.schema';
declare module 'express'
{
    export interface Request {
        user?: UserType;
        decoded_access_token?: TokenPayload;
        decoded_refresh_token?: TokenPayload
        decoded_forgot_password_token?: TokenPayload;
        post?: Post;
    
    }
}