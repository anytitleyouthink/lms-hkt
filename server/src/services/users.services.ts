import { UpdateMeReqBody } from "~/validations/users.validation";
import { RegisterReqBody } from "~/validations/users.validation";
import { TokenPayload } from "~/models/requests/User.requests";
import databaseService from "./database.services";
import { hashPassword } from "~/utils/crypto";
import UserSchema from "~/models/schemas/User.schema";
import { signToken, verifyToken } from "~/utils/jwt";
import { token_type, UserVerifyStatus } from "~/constants/enums";
import RefreshToken from "~/models/schemas/RefreshToken.schema";
import { ObjectId } from "mongodb";
import { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { userMessages } from "~/constants/messages";
import { ErrorResponse } from "~/models/Errors";
import { StatusCodes } from "http-status-codes";
import Follower from "~/models/schemas/Follower.schema";
import axios from "axios";

class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    const options: SignOptions = {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue) || "15m"
    }

    return signToken(
      {
        user_id,
        token_type: token_type.AccessToken
        , verify

      },
      process.env.JWT_PRIVATE_ACCESS_TOKEN as string,
      options
    );
  }

  private signRefreshToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken(
      {
        user_id,
        token_type: token_type.RefreshToken
        , verify
      },
      process.env.JWT_PRIVATE_REFRESH_TOKEN as string,
      {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue) || "7d"
      }
    );
  }
  private signEmailVerifyToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken(
      {
        user_id,
        token_type: token_type.email_verify_token,
        verify
      },
      process.env.JWT_PRIVATE_EMAIL_VERIFY_TOKEN as string,
      {
        expiresIn: (process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue) || "30m"
      }
    );
  }
  private generateTokens({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify }),
    ]);
  }
  async register(payload: RegisterReqBody) {
    const user_id_obj = new ObjectId();
    const user_id = user_id_obj.toString();

    const [access_token, refresh_token, email_verify_token] = await Promise.all([
      this.signAccessToken({ user_id, verify: UserVerifyStatus.Unverified }),
      this.signRefreshToken({ user_id, verify: UserVerifyStatus.Unverified }),
      this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    ]);
    const [iat, exp] = await this.decodeRefreshToken(refresh_token).then(decoded => [decoded.iat, decoded.exp]);
    // 1. Kiểm tra xem có thằng Unverified nào đang chiếm chỗ không?
    const existingUser = await databaseService.users.findOne({ email: payload.email });
    
    if (existingUser) {
      if (existingUser.verify === UserVerifyStatus.Unverified) {
       
        await databaseService.users.deleteOne({ _id: existingUser._id });
      } else {
        throw new Error(userMessages.EMAIL_ALREADY_IN_USE);
      }
    }
    await databaseService.users.insertOne(
      new UserSchema({
        _id: user_id_obj,
        ...payload,
        username: `user${user_id.toString()}`,
        verify: UserVerifyStatus.Unverified,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password),
        email_verify_token: email_verify_token
      })
    );


    databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: user_id_obj,
        created_at: new Date(),
        iat: iat as number,
        exp: exp as number
      })
    );

    return {
      access_token,
      refresh_token
      
    };
  }
  async checkUserExists(email: string) {
    const user = await databaseService.users.findOne({ email });
    if (!user) return false;
    if (user.verify === UserVerifyStatus.Unverified) {
        return false; 
    }
    return true; 
  }

  async login(user_id: string) {
    await databaseService.refreshTokens.deleteMany({ user_id: new ObjectId(user_id) });
    const [access_token, refresh_token] = await this.generateTokens({ user_id, verify: UserVerifyStatus.Verified });
    const [iat, exp] = await this.decodeRefreshToken(refresh_token).then(decoded => [decoded.iat, decoded.exp]);
    databaseService.refreshTokens.insertOne(new RefreshToken({
      token: refresh_token,
      user_id: new ObjectId(user_id),
      created_at: new Date(),
      iat: iat as number,
      exp: exp as number
    }));
    return {
      access_token,
      refresh_token,
    };
  }

  async logout(userId: string) {
  if (!ObjectId.isValid(userId)) {
    throw new ErrorResponse("Invalid User ID format", StatusCodes.BAD_REQUEST);
  }
  const result = await databaseService.refreshTokens.deleteOne({
    user_id: new ObjectId(userId)
  });
  if (result.deletedCount === 0) {
    throw new ErrorResponse("Token not found or already revoked", StatusCodes.NOT_FOUND);
  }

  return result;
}
  async refreshToken(user_id: string, verify: UserVerifyStatus, refresh_token: string) {
    const [new_access_token, new_refresh_token] = await this.generateTokens({ user_id, verify });
    const [iat, exp] = await this.decodeRefreshToken(new_refresh_token).then(decoded => [decoded.iat, decoded.exp]);
    await databaseService.refreshTokens.deleteMany({
      token: refresh_token,
      user_id: new ObjectId(user_id),
    });

    await databaseService.refreshTokens.insertOne(new RefreshToken({
      token: new_refresh_token,
      user_id: new ObjectId(user_id),
      created_at: new Date(),
      iat: iat as number,
      exp: exp as number
    }));
    return {
      new_access_token,
      new_refresh_token,
    };
  }
  async decodeRefreshToken(refresh_token: string) {
    const decoded = await verifyToken(refresh_token, process.env.JWT_PRIVATE_REFRESH_TOKEN as string);
    return decoded as TokenPayload;
  }
  async verifyEmail(user_id: string) {
    const token = await this.generateTokens({ user_id, verify: UserVerifyStatus.Verified });
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: "",
          verify: UserVerifyStatus.Verified,

        },
        $currentDate: {
          updated_at: true,
        },
      }
    );
    const [access_token, refresh_token] = token;
    const [iat, exp] = await this.decodeRefreshToken(refresh_token).then(decoded => [decoded.iat, decoded.exp]);
    await databaseService.refreshTokens.insertOne(new RefreshToken({
      token: refresh_token,
      user_id: new ObjectId(user_id),
      created_at: new Date(),
      iat: iat as number,
      exp: exp as number,
    }));
    return {
      access_token,
      refresh_token,
    };


    return {
      message: userMessages.EMAIL_VERIFY_SUCCESS
    };
  }
  async resendVerifyEmail(user_id: string, email: string) {
    const email_verify_token = this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified });
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: email_verify_token,

        },
        $currentDate: {
          updated_at: true,
        },
      }
    );
    return {
      message: userMessages.RESEND_VERIFY_EMAIL_SUCCESS
    };
  }
  async forgotPassword({ user_id: objectId, verify, email }: { user_id: ObjectId, verify: UserVerifyStatus, email: string }) {
    // Tạo forgot_password_token
    const forgot_password_token = await signToken({
      user_id: objectId.toString(),
      token_type: token_type.forgot_password_token,
      verify
    },

      process.env.JWT_PRIVATE_FORGOT_PASSWORD_TOKEN as string,
      {
        expiresIn: (process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue)
      }
    );
    // Gửi email
    await databaseService.users.updateOne(
      { _id: objectId },
      {
        $set: {
          forgot_password_token: forgot_password_token
        },
        $currentDate: {
          updated_at: true,
        },
      }
    );
    return {
      message: userMessages.FORGOT_PASSWORD_EMAIL_SENT
    };
  }
  async resetPassword({ user_id, password }: { user_id: string, password: string }) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: ""
        },
        $currentDate: {
          updated_at: true,
        },
      }
    );
    return {
      message: userMessages.USER_UPDATED_SUCCESS
    };
  }
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    );
    return user;
  }
  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(payload as UpdateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true,
        },
      },
      {
        returnDocument: "after",
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    );
    return user;
  }
  async getProfile(username: string) {
    const user = await databaseService.users.findOne(
      {
        username: username
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    );
    if (!user) {
      throw new ErrorResponse(userMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return user;
  }
  async follow(user_id: string, followed_user_id: string) {
    const follower = await databaseService.Follower.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)

    })
    if (follower === null) {
      await databaseService.Follower.insertOne(
        new Follower({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id),
          created_at: new Date()

        })
      );
    }

    return {
      message: userMessages.FOLLOW_SUCCESS
    };
  }
  async unfollow(user_id: string, followed_user_id: string) {
    const follower = await databaseService.Follower.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)

    })
    if (follower === null) {
      return {
        message: userMessages.ALREADY_UNFOLLOWED
      }
    }
     await databaseService.Follower.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    }
    );
    return {
      message: userMessages.UNFOLLOW_SUCCESS
    };

  }
  async changePassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true,
        },

      });
    return {
      message: userMessages.USER_UPDATED_SUCCESS
    };
  }
  async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data

  }
  async getOauthGoogleUser(access_token: string, id_token: string) {
    const { data } = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string,
      email: string,
      verified_email: boolean,
      name: string,
      given_name: string,
      family_name: string,
      picture: string,
      locale: string
    }
  }
  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code);
    const googleUser = await this.getOauthGoogleUser(access_token, id_token);
    if (!googleUser.verified_email) {
      throw new ErrorResponse(userMessages.EMAIL_NOT_VERIFIED, StatusCodes.BAD_REQUEST);
    }
    const user = await databaseService.users.findOne({ email: googleUser.email });
    if (user) {
      const [access_token, refresh_token] = await this.generateTokens({ user_id: user._id.toString(), verify: UserVerifyStatus.Verified });
      const [iat, exp] = await this.decodeRefreshToken(refresh_token).then(decoded => [decoded.iat, decoded.exp]);
      await databaseService.refreshTokens.insertOne(new RefreshToken({
        token: refresh_token,
        user_id: user._id,
        created_at: new Date(),
        iat: iat as number,
        exp: exp as number
      }))
      return {
        access_token,
        refresh_token,
        newUser: false,
        verify: user.verify
      };
    } else {
         const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const data = this.register({
        email: googleUser.email,
        name: googleUser.name,
        date_of_birth: new Date().toISOString(),
        password,
        confirm_password: password,
      });
      return {
        ...data,
        newUser: true,
        verify: UserVerifyStatus.Verified
      };
    }
  }
}
const usersService = new UsersService();
export default usersService;

