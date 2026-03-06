import { PostsRequestBody } from "~/validations/posts.schema";
import databaseService from "./database.services";
import Post from "~/models/schemas/Post.schema";
import { ObjectId } from "mongodb";
import Hashtag from "~/models/schemas/Hashtag.schema";
import { WithId } from "mongodb";
import { result } from "lodash";
import { PostType } from "~/constants/enums";
import { skip } from "node:test";

class PostsService {
  async checkAndCreateHashtags(hashtags: string[]) {
    if (!hashtags || hashtags.length === 0) {
      return [];
    }
    const uniqueHashtags = [...new Set(hashtags.map(t => t.trim().toLowerCase()))];
    const bulkOps = uniqueHashtags.map((hashtag) => ({
      updateOne: {
        filter: { name: hashtag },
        update: { $setOnInsert: new Hashtag({ name: hashtag }) },
        upsert: true,
      },
    }));
    if (bulkOps.length > 0) {
      await databaseService.hashtags.bulkWrite(bulkOps);
    }
    const resultDocuments = await databaseService.hashtags
      .find({ name: { $in: uniqueHashtags } })
      .toArray();

    return resultDocuments;
  }
  async createPost(user_id: string, payload: PostsRequestBody) {
    const hashtags = await this.checkAndCreateHashtags(payload.hashtags);
    const post = await databaseService.posts.insertOne(
      new Post({
        user_id: new ObjectId(user_id),
        type: payload.type,
        audience: payload.audience,
        content: payload.content,
        hashtags: hashtags.map(hashtag => hashtag._id.toString()),
        mentions: payload.mentions,
        medias: payload.medias,
        parent_id: payload.parent_id,
      })
    );
    const result = await databaseService.posts.findOne({ _id: post.insertedId });
    return result as WithId<Post>;
  }
  async increseView(post_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 };
    const result = await databaseService.posts.findOneAndUpdate(
      { _id: new ObjectId(post_id) },
      { $inc: inc },
      {
        returnDocument: 'after',
        projection: { user_views: 1, guest_views: 1,update_at:1, }
      }
    );

    return result as WithId<{ user_views: number; guest_views: number, updated_at:Date }>;
  }
  async getPostChildren({ post_id, post_type, limit, page }: { post_id: string; post_type?: PostType; limit: number; page: number; }) {
     const result = await databaseService.posts.aggregate(
      [
        {
          '$match': {
            'parent_id': new ObjectId(post_id)
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
        }, {
          '$skip': (page - 1) * limit
        }, {
          '$limit': limit
        }
      ]
    ).toArray();
    const total = await databaseService.posts.countDocuments({ parent_id: new ObjectId(post_id) });
    return { result, total };

  }
}
const postsService = new PostsService();
export default postsService;
