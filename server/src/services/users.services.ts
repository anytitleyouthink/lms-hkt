import { UpdateMeReqBody } from "~/validations/users.validation";
import { TokenPayload } from "~/models/requests/User.requests";
import databaseService from "./database.services";
import { hashPassword } from "~/utils/crypto";
import UserSchema from "~/models/schemas/User.schema";
import { signToken, verifyToken } from "~/utils/jwt";
import { token_type, UserRole, UserStatus } from "~/constants/enums";
import RefreshToken from "~/models/schemas/RefreshToken.schema";
import { ObjectId } from "mongodb";
import { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { userMessages } from "~/constants/messages";
import { ErrorResponse } from "~/models/Errors";
import { StatusCodes } from "http-status-codes";

import axios from "axios";

class UsersService {
  private signAccessToken({ user_id, isFirstLogin, role }: { user_id: string, isFirstLogin: boolean, role: UserRole }) {
    const options: SignOptions = {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue) || "5m"
    }

    return signToken(
      {
        user_id,
        token_type: token_type.AccessToken,
        role,
        isFirstLogin

      },
      process.env.JWT_PRIVATE_ACCESS_TOKEN as string,
      options
    );
  }

  private signRefreshToken({ user_id, isFirstLogin, role }: { user_id: string, isFirstLogin: boolean, role: UserRole }) {
    return signToken(
      {
        user_id,
        token_type: token_type.RefreshToken
        , isFirstLogin,
        role
      },
      process.env.JWT_PRIVATE_REFRESH_TOKEN as string,
      {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue) || "7d"
      }
    );
  }
  private signEmailVerifyToken({ user_id, isFirstLogin, role }: { user_id: string, isFirstLogin: boolean, role: UserRole }) {
    return signToken(
      {
        user_id,
        token_type: token_type.email_verify_token,
        isFirstLogin,
        role
      },
      process.env.JWT_PRIVATE_EMAIL_VERIFY_TOKEN as string,
      {
        expiresIn: (process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue) || "30m"
      }
    );
  }
  private generateTokens({ user_id, isFirstLogin, role }: { user_id: string, isFirstLogin: boolean, role: UserRole }) {
    return Promise.all([
      this.signAccessToken({ user_id, isFirstLogin, role }),
      this.signRefreshToken({ user_id, isFirstLogin, role }),
    ]);
  }
  async checkUserExists(email: string) {
    const user = await databaseService.users.findOne({ email });
    if (!user) return false;
    return true;
  }

  async login(user_id: string, isFirstLogin: boolean, role: UserRole) {
    await databaseService.refreshTokens.deleteMany({ user_id: new ObjectId(user_id) });
    const [access_token, refresh_token] = await this.generateTokens({ user_id, isFirstLogin, role });
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
  async refreshToken(user_id: string, isFirstLogin: boolean, refresh_token: string, role: UserRole) {
    const [new_access_token, new_refresh_token] = await this.generateTokens({ user_id, isFirstLogin, role });
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

  async forgotPassword({ user_id: objectId, isFirstLogin, role, email }: { user_id: ObjectId, isFirstLogin: boolean, role: UserRole, email: string }) {
    // Tạo forgot_password_token
    const forgot_password_token = await signToken({
      user_id: objectId.toString(),
      token_type: token_type.forgot_password_token,
      isFirstLogin,
      role

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
          ...(payload as UpdateMeReqBody & { date_of_birth?: Date }), isFirstLogin: false,
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
  async createUserByAdmin({ name, email, role, password }: { name: string, email: string, role: UserRole, password: string }) {
    const user_id = new ObjectId().toString();
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, isFirstLogin: true, role }),
      this.signRefreshToken({ user_id, isFirstLogin: true, role }),
    ]);
    const [iat, exp] = await this.decodeRefreshToken(refresh_token).then(decoded => [decoded.iat, decoded.exp]);


    const hashedPassword = hashPassword(password);
    const user = new UserSchema({
      name,
      email,
      role,
      password: hashedPassword,
      isFirstLogin: true,
      username: "user" + Math.floor(Math.random() * 10000),
      created_at: new Date(),
      updated_at: new Date(),
      status: UserStatus.Active

    });

    await databaseService.users.insertOne(user);
    databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        created_at: new Date(),
        iat: iat as number,
        exp: exp as number
      })
    );

    return {
      refresh_token,
      access_token,

    }
  };
  async getUsers(searchWord?: string) {
    const pipeline: any[] = [];

    if (searchWord) {
      pipeline.push({
        $match: {
          $or: [
            { email: { $regex: searchWord, $options: 'i' } },
            { name: { $regex: searchWord, $options: 'i' } }
          ]
        }
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'user_id',
          as: 'enrollments'
        }
      },
      {
        $addFields: {
          enrolled_courses_count: { $size: "$enrollments" }
        }
      },
      {
        $project: {
          password: 0,
          forgot_password_token: 0,
          email_verify_token: 0,
          enrollments: 0 // We just need the count, not the array
        }
      }
    );

    const users = await databaseService.users.aggregate(pipeline).toArray();
    return users;
  }
  async toggleStatus(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
    if (!user) {
      throw new ErrorResponse(userMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const newStatus = user.status === UserStatus.InActive ? UserStatus.Active : UserStatus.InActive;

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { status: newStatus },
        $currentDate: { updated_at: true }
      }
    );

    return { ...user, status: newStatus };
  }
}
const usersService = new UsersService();
export default usersService;

