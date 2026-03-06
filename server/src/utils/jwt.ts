import { StatusCodes } from "http-status-codes";
import jwt, { SignOptions } from "jsonwebtoken";
import { userMessages } from "~/constants/messages";
import { ErrorResponse } from "~/models/Errors";
import { TokenPayload } from "~/models/requests/User.requests";

export const signToken = (
  payload: TokenPayload,
  privateKey: string,
  options: SignOptions = {
    algorithm: "HS256",
   
  }
): string => {
  try {
    if (!privateKey) {
      throw new Error("JWT_PRIVATE_KEY_MISSING");
    }

    return jwt.sign(payload, privateKey, options);
  } catch (error) {
    console.error("JWT_SIGN_ERROR:", error);
    throw new Error("JWT_SIGN_FAILED");
  }
};

export const verifyToken = (token: string, privateKey: string): TokenPayload => {
  if (!privateKey) {
    throw new ErrorResponse(
      "JWT_PRIVATE_KEY_MISSING",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  try {
    return jwt.verify(token, privateKey) as TokenPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new ErrorResponse(
        userMessages.ACCESS_TOKEN_EXPIRED,
        StatusCodes.UNAUTHORIZED
      );
    }

    throw new ErrorResponse(
      userMessages.INVALID_TOKEN,
      StatusCodes.UNAUTHORIZED
    );
  }
};

