import Like from '~/models/schemas/Like.schema';
import databaseService from '~/services/database.services'
import { ObjectId, WithId } from 'mongodb';
class LikeService{
    async likePost(user_id: string, post_id: string) {
       const result = await databaseService.likes.findOneAndUpdate(
        {
          user_id: new ObjectId(user_id),
          post_id: new ObjectId(post_id)
        },
        {
          $setOnInsert: new Like({
                user_id: new ObjectId(user_id),
                post_id: new ObjectId(post_id)
          })},
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
        return result as WithId<Like>

    }
    async UnlikePost(user_id: string, post_id: string) {
      const result = await databaseService.likes.findOneAndDelete({
        user_id: new ObjectId(user_id),
        post_id: new ObjectId(post_id)
      })
      return result as WithId<Like>
    }
}
const likeService = new LikeService();
export default likeService;