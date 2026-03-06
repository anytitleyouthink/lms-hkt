import { z } from "zod";
import { ObjectId } from "mongodb";
import { MediaType, PostAudience, PostType } from "~/constants/enums";
import { postMessages } from "~/constants/messages";
import { numberEnumToArray } from "~/utils/other";

// --- HELPER SCHEMAS ---

const objectIdSchema = z.string()
  .trim()
  .refine((val) => ObjectId.isValid(val), postMessages.INVALID_POST_ID);

const mediaSchema = z.object({
  type: z.number().refine(
    (value) => numberEnumToArray(MediaType).includes(value),
    { message: postMessages.MEDIA_TYPE_INVALID || "Media type invalid" }
  ),
  url: z.string().trim().min(1)
});

// --- CREATE POST SCHEMA ---
export const createPostSchema = z.object({
  body: z.object({
    type: z.number().refine(
      (value) => numberEnumToArray(PostType).includes(value),
      { message: postMessages.POST_TYPE_INVALID }
    ),
    audience: z.number().refine(
      (value) => numberEnumToArray(PostAudience).includes(value),
      { message: postMessages.POST_AUDIENCE_INVALID }
    ),
    
    parent_id: z.string().optional().nullable()
      .refine((val) => !val || ObjectId.isValid(val), postMessages.PARENT_ID_MUST_BE_A_VALID_POST_ID),
      
    content: z.string().default(''),
    hashtags: z.array(z.string().trim()).default([]),
    mentions: z.array(objectIdSchema).default([]),
    medias: z.array(mediaSchema).default([])
  })
}).superRefine((data, ctx) => {
  const { type, parent_id, content, hashtags, mentions, medias } = data.body;

  // 1. Logic check Parent ID
  const childTypes = [PostType.RePost, PostType.Comment, PostType.QuotePost];
  
  if (childTypes.includes(type) && !parent_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: postMessages.PARENT_ID_MUST_BE_A_VALID_POST_ID,
      path: ["body", "parent_id"]
    });
  }
  
  if (type === PostType.Post && parent_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: postMessages.PARENT_ID_MUST_BE_EMPTY_STRING,
      path: ["body", "parent_id"]
    });
  }

  // 2. Logic check Content
  if (type === PostType.RePost && content.trim() !== '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: postMessages.CONTENT_MUST_BE_EMPTY_STRING,
      path: ["body", "content"]
    });
  }

  if (type !== PostType.RePost) {
    const isContentEmpty = content.trim() === '';
    const isNoHashtags = hashtags.length === 0;
    const isNoMentions = mentions.length === 0;
    const isNoMedias = medias.length === 0;

    if (isContentEmpty && isNoHashtags && isNoMentions && isNoMedias) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: postMessages.POST_CONTENT_REQUIRED,
        path: ["body", "content"]
      });
    }
  }
});

// --- POST ID PARAM SCHEMA ---
export const postIdParamSchema = z.object({
  params: z.object({
    post_id: objectIdSchema
  })
});
export type PostsRequestBody = z.infer<typeof createPostSchema>['body'];

export const getPostChildrenSchema = z.object({
  query: z.object({
    type: z.coerce.number().refine(
      (value) => numberEnumToArray(PostType).includes(value),
      { message: postMessages.POST_TYPE_INVALID }
    )
  })
});

// 2. Validator cho Pagination (Query Params: limit, page)
export const paginationSchema = z.object({
  query: z.object({
    limit: z.coerce.number()
      .int()
      .min(1, { message: '1 <= limit <= 100' })
      .max(100, { message: '1 <= limit <= 100' })
      .default(10), 
      
    page: z.coerce.number()
      .int()
      .min(1, { message: 'page >= 1' })
      .default(1) 
  })
});