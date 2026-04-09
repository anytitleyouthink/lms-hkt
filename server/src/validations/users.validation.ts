import { z } from "zod";
import { ObjectId } from "mongodb";
import { userMessages } from "~/constants/messages";
import { REGEX_PASSWORD, REGEX_PHONE, REGEX_USERNAME } from "~/constants/regex";
import { p } from "@faker-js/faker/dist/airline-Dz1uGqgJ";
import { UserRole } from "~/constants/enums";

// --- HELPER SCHEMAS ---
const passwordSchema = z.string()
  .min(6, userMessages.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50)
  .max(50, userMessages.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50)
  .regex(REGEX_PASSWORD, userMessages.PASSWORD_WEAK);

const confirmPasswordSchema = z.string()
  .min(6, userMessages.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50);

const nameSchema = z.string()
  .min(1, userMessages.NAME_REQUIRED)
  .max(100, userMessages.NAME_INVALID)
  .trim()
  .regex(/^[\p{L}\s]+$/u, userMessages.NAME_ONLY_LETTERS);

const dateOfBirthSchema = z.string().optional()
  .refine((date) => !isNaN(Date.parse(date as string)), userMessages.DATE_OF_BIRTH_INVALID);

const imageSchema = z.string()
  .max(400, userMessages.IMAGE_URL_LENGTH)
  .trim()
  .optional();
const phoneSchema = z.string().regex(REGEX_PHONE, userMessages.PHONE_INVALID).optional();
// Chỉ check format ObjectId, không check DB
const objectIdSchema = z.string()
  .refine((val) => ObjectId.isValid(val), userMessages.INVALID_USER_ID);

// --- LOGIN SCHEMA (Format Only) ---
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(userMessages.EMAIL_INVALID).min(1, userMessages.EMAIL_REQUIRED),
    password: z.string().min(1, userMessages.PASSWORD_REQUIRED)
  })
});
export type LoginReqBody = z.infer<typeof loginSchema>['body'];

// --- FirstLogin  SCHEMA (Format Only) ---

export const firstLoginSchema = z.object({
  body: z.object({
    name: nameSchema,
    phone: phoneSchema,
    dateOfBirth: dateOfBirthSchema,
    newPassword: z.string()
      .min(6, userMessages.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50)
      .max(50, userMessages.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50),
    confirmPassword: z.string()
      .min(1, userMessages.CONFIRM_PASSWORD_REQUIRED)
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: userMessages.CONFIRM_PASSWORD_NOT_MATCH,
    path: ["confirmPassword"]
  })
});
export type FirstLoginReqBody = z.infer<typeof firstLoginSchema>['body'];


// --- UPDATE ME SCHEMA (Format Only) ---
export const updateMeSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    date_of_birth: dateOfBirthSchema.optional(),
    bio: z.string().max(200, userMessages.BIO_LENGTH).trim().optional(),
    location: z.string().max(200, userMessages.LOCATION_LENGTH).trim().optional(),
    website: z.string().max(200, userMessages.WEBSITE_LENGTH).trim().optional(),
    username: z.string().regex(REGEX_USERNAME, userMessages.USERNAME_INVALID).trim().optional(),
    avatar: imageSchema,
    cover_photo: imageSchema,
    phone: phoneSchema.optional(),
  })
});
export type UpdateMeReqBody = z.infer<typeof updateMeSchema>['body'];

// --- CHANGE PASSWORD SCHEMA ---
export const changePasswordSchema = z.object({
  body: z.object({
    old_password: z.string().min(1, userMessages.PASSWORD_REQUIRED),
    password: passwordSchema,
    confirm_password: confirmPasswordSchema
  })
}).refine((data) => data.body.password === data.body.confirm_password, {
  message: userMessages.CONFIRM_PASSWORD_NOT_MATCH,
  path: ["body", "confirm_password"]
});
export type ChangePasswordReqBody = z.infer<typeof changePasswordSchema>['body'];
// --- FORGOT PASSWORD SCHEMA ---
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(userMessages.EMAIL_INVALID)
  })
});
export type ForgotPasswordReqBody = z.infer<typeof forgotPasswordSchema>['body'];

// --- RESET PASSWORD SCHEMA ---
export const resetPasswordSchema = z.object({
  body: z.object({
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    forgot_password_token: z.string().min(1, userMessages.FORGOT_PASSWORD_TOKEN_IS_REQUIRED)
  })
}).refine((data) => data.body.password === data.body.confirm_password, {
  message: userMessages.CONFIRM_PASSWORD_NOT_MATCH,
  path: ["body", "confirm_password"]
});
export type ResetPasswordReqBody = z.infer<typeof resetPasswordSchema>['body'];

// --- createUserByAdminSchema ---
export const createUserByAdminSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3, userMessages.NAME_LENGTH_MUST_BE_FROM_3_TO_100).max(100, userMessages.NAME_LENGTH_MUST_BE_FROM_3_TO_100),
    email: z.string().trim().email(userMessages.EMAIL_INVALID),
    role: z.nativeEnum(UserRole, {
      message: userMessages.ROLE_INVALID
    })
  })
})
export type CreateUserByAdminReqBody = z.infer<typeof createUserByAdminSchema>['body'];
export const createMultipleUsersSchema = z.object({
  body: z.array(
    z.object({
      name: z.string().trim().min(2, 'Tên quá ngắn'),
      email: z.string().trim().email('Email sai định dạng'),
      role: z.nativeEnum(UserRole, {
        message: userMessages.ROLE_INVALID
      })
    })
  ).min(1, userMessages.CREATE_MULTIPLE_USERS_MIN)
})
export type CreateMultipleUsersReqBody = z.infer<typeof createMultipleUsersSchema>['body'];