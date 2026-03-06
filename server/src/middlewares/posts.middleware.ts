import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { validate } from '~/utils/validation'; 
import { createPostSchema, getPostChildrenSchema, paginationSchema, postIdParamSchema } from '~/validations/posts.schema';
import databaseService from '~/services/database.services';
import { ErrorResponse } from '~/models/Errors';
import { StatusCodes } from 'http-status-codes';
import { postMessages, userMessages } from '~/constants/messages';
import { PostAudience, PostType, UserVerifyStatus } from '~/constants/enums';
import { TokenPayload } from "~/models/requests/User.requests";
import Post from "~/models/schemas/Post.schema"; 

// 1. Validator cho Create Post (Chỉ check format & logic chéo)
export const createPostsValidator = validate(createPostSchema);
export const getPostChildrenValidator = validate(getPostChildrenSchema);
export const paginationValidator = validate(paginationSchema);

// 2. Middleware check Post ID và lấy dữ liệu Post (Aggregation)
const checkPostIdLogic = async (req: Request, res: Response, next: NextFunction, idLocation: 'params' | 'body') => {
  const postId = idLocation === 'params' ? req.params.post_id : req.body.post_id;
  const [post] = await databaseService.posts.aggregate<Post>(
    [
            {
              '$match': {
                '_id': new ObjectId(postId)
              }
            }, {
              '$lookup': {
                'from': 'hashtags',
                'localField': 'hashtags',
                'foreignField': '_id',
                'as': 'hashtags'
              }
            }, {
              '$lookup': {
                'from': 'users',
                'localField': 'mentions',
                'foreignField': '_id',
                'as': 'mentions'
              }
            }, {
              '$addFields': {
                'mentions': {
                  '$map': {
                    'input': '$mentions',
                    'as': 'm',
                    'in': {
                      '_id': '$$m._id',
                      'name': '$$m.name',
                      'username': '$$m.username'
                    }
                  }
                }
              }
            }, {
              '$lookup': {
                'from': 'bookmarks',
                'localField': '_id',
                'foreignField': 'post_id',
                'as': 'bookmarks'
              }
            }, {
              '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'post_id',
                'as': 'likes'
              }
            }, {
              '$lookup': {
                'from': 'posts',
                'localField': '_id',
                'foreignField': 'parent_id',
                'as': 'post_children'
              }
            }, {
              '$addFields': {
                'bookmarks': {
                  '$size': '$bookmarks'
                },
                'likes': {
                  '$size': '$likes'
                },
                'repost': {
                  '$size': {
                    '$filter': {
                      'input': '$post_children',
                      'as': 'item',
                      'cond': {
                        '$eq': [
                          '$$item.type', PostType.RePost
                        ]
                      }
                    }
                  }
                },
                'commentpost': {
                  '$size': {
                    '$filter': {
                      'input': '$post_children',
                      'as': 'item',
                      'cond': {
                        '$eq': [
                          '$$item.type', PostType.Comment
                        ]
                      }
                    }
                  }
                },
                'quotepost': {
                  '$size': {
                    '$filter': {
                      'input': '$post_children',
                      'as': 'item',
                      'cond': {
                        '$eq': [
                          '$$item.type', PostType.QuotePost
                        ]
                      }
                    }
                  }
                },
                'views': {
                  '$add': [
                    '$guest_views', '$user_views'
                  ]
                }
              }
            }, {
              '$project': {
                'post_children': 0
              }
            }
          ]
  ).toArray();
  if (!post) {
    return next(new ErrorResponse(postMessages.POST_NOT_FOUND, StatusCodes.NOT_FOUND));
  }
  (req as Request).post = post;
  next();
};

// Validator kết hợp: Check format ID + Chạy Aggregation
export const postIdValidator = [
  validate(postIdParamSchema), 
  (req: Request, res: Response, next: NextFunction) => checkPostIdLogic(req, res, next, 'params')
];

// 3. Middleware check Audience (Quyền xem bài viết)
export const audienceValidator = async (req: Request, res: Response, next: NextFunction) => {
  const post = (req as Request).post as Post;

  // Nếu middleware trước chưa tìm thấy post thì bỏ qua (hoặc return lỗi tuỳ logic)
  if (!post) {
    return next(new ErrorResponse(postMessages.POST_NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  // Check Token
  if (!req.decoded_access_token) {
    return next(new ErrorResponse(userMessages.ACCESS_TOKEN_REQUIRED, StatusCodes.UNAUTHORIZED));
  }

  const { user_id } = req.decoded_access_token as TokenPayload;

  // Check tác giả bài viết
  const author = await databaseService.users.findOne({
    _id: new ObjectId(post.user_id)
  });

  if (!author || author.verify === UserVerifyStatus.Banned) {
    return next(new ErrorResponse(userMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  // Check Post Circle
  // Sửa logic: Nếu audience là Circle thì mới cần check, public thì thôi
  if (post.audience === PostAudience.PostCircle) {
      if (!author.PostCircle) {
         // Trường hợp tác giả chưa set Circle mà lại post Circle 
         // Có thể coi là người xem không có trong circle
         if (!author._id.equals(user_id)) {
            return next(new ErrorResponse(postMessages.POST_IS_NOT_PUBLIC, StatusCodes.FORBIDDEN));
         }
      } else {
        const isInPostCircle = author.PostCircle.some((id) => id.toString() === user_id);
        
        // Nếu không nằm trong Circle VÀ không phải là tác giả -> Cấm
        if (!isInPostCircle && !author._id.equals(user_id)) {
          return next(new ErrorResponse(postMessages.POST_IS_NOT_PUBLIC, StatusCodes.FORBIDDEN));
        }
      }
  }

  next();
};